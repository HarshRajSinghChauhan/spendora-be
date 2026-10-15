import analyticsRepository from "./analytics.repository.js";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Aesthetic shades of emerald/green matching the mockup donut chart
const DONUT_COLORS = [
  "#064e3b", // Deep forest green (darkest)
  "#047857", // Deep emerald
  "#059669", // Medium emerald
  "#10b981", // Bright green
  "#34d399", // Mint / seafoam
  "#6ee7b7", // Soft light green
  "#a7f3d0", // Very light pastel green
  "#bbf7d0", // Lightest
];

/**
 * Format category name with Title Case
 */
const formatCategoryName = (name = "") => {
  if (!name) return "Uncategorized";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("&", "&");
};

/**
 * Calculate Monthly Income vs Expenses
 * Supports range: 'fiscal_year' (Apr to Mar) or '12_months' (rolling past 12 months)
 */
const getIncomeVsExpenses = async ({ userId, months = 12, range = "fiscal_year" }) => {
  const now = new Date();
  let startDate;
  let endDate;
  const monthBuckets = [];
  const bucketKeyMap = new Map();

  if (range === "fiscal_year") {
    // Standard April to March fiscal year
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed: 0 = Jan, 3 = Apr, 9 = Oct
    // If month is before April (Jan-Mar), FY started in previous year
    const fyStartYear = currentMonth >= 3 ? currentYear : currentYear - 1;

    startDate = new Date(fyStartYear, 3, 1, 0, 0, 0, 0); // Apr 1
    endDate = new Date(fyStartYear + 1, 3, 0, 23, 59, 59, 999); // Mar 31

    for (let i = 0; i < 12; i++) {
      const d = new Date(fyStartYear, 3 + i, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const monthName = MONTH_NAMES[monthIndex];
      const key = `${year}-${monthIndex}`;

      const bucket = {
        key,
        year,
        month: monthIndex + 1,
        monthName,
        label: monthName,
        fullLabel: `${monthName} ${year}`,
        income: 0,
        expenses: 0,
        net: 0,
      };

      monthBuckets.push(bucket);
      bucketKeyMap.set(key, bucket);
    }
  } else {
    // Rolling N months
    const monthsCount = Math.min(Math.max(Number(months) || 12, 1), 24);
    startDate = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1), 1, 0, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    for (let i = 0; i < monthsCount; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const monthName = MONTH_NAMES[monthIndex];
      const key = `${year}-${monthIndex}`;

      const bucket = {
        key,
        year,
        month: monthIndex + 1,
        monthName,
        label: monthName,
        fullLabel: `${monthName} ${year}`,
        income: 0,
        expenses: 0,
        net: 0,
      };

      monthBuckets.push(bucket);
      bucketKeyMap.set(key, bucket);
    }
  }

  // Fetch transactions in date window
  const transactions = await analyticsRepository.getTransactionsForDateRange({
    userId,
    startDate,
    endDate,
  });

  // Aggregate into buckets
  for (const tx of transactions) {
    const txDate = new Date(tx.transactionDate);
    const key = `${txDate.getFullYear()}-${txDate.getMonth()}`;
    const bucket = bucketKeyMap.get(key);
    if (bucket) {
      const amount = Number(tx.amount) || 0;
      if (tx.type === "INCOME") {
        bucket.income += amount;
      } else if (tx.type === "EXPENSE") {
        bucket.expenses += amount;
      }
    }
  }

  // Round amounts and compute net
  const result = monthBuckets.map((b) => {
    const income = Number(b.income.toFixed(2));
    const expenses = Number(b.expenses.toFixed(2));
    return {
      year: b.year,
      month: b.month,
      monthName: b.monthName,
      label: b.label,
      fullLabel: b.fullLabel,
      income,
      expenses,
      net: Number((income - expenses).toFixed(2)),
    };
  });

  return result;
};

/**
 * Calculate Expenses by Category with percentage breakdown and donut colors
 */
const getExpensesByCategory = async ({ userId, period = "this_month", startDate, endDate }) => {
  const now = new Date();
  let start = null;
  let end = null;

  switch (period) {
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case "custom":
      if (startDate) start = new Date(startDate);
      if (endDate) {
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
      }
      break;
    case "all_time":
    default:
      start = null;
      end = null;
      break;
  }

  const { grouped, categories } = await analyticsRepository.getExpensesByCategory({
    userId,
    startDate: start,
    endDate: end,
  });

  const categoryMap = new Map();
  for (const c of categories) {
    categoryMap.set(c.id, c);
  }

  let totalExpenses = 0;
  const items = [];

  for (const group of grouped) {
    const amount = Number(group._sum.amount || 0);
    totalExpenses += amount;
    const cat = categoryMap.get(group.categoryId);
    const name = cat ? formatCategoryName(cat.name) : "Other";

    items.push({
      categoryId: group.categoryId,
      name,
      amount: Number(amount.toFixed(2)),
      count: group._count.id || 0,
    });
  }

  totalExpenses = Number(totalExpenses.toFixed(2));

  // If there are more than 5 categories, consolidate into Top 5 + "Others"
  let displayCategories = [];
  if (items.length > 5) {
    const top5 = items.slice(0, 5);
    const rest = items.slice(5);

    let othersAmount = 0;
    let othersCount = 0;
    for (const r of rest) {
      othersAmount += r.amount;
      othersCount += r.count;
    }

    displayCategories = [...top5];
    if (othersAmount > 0) {
      displayCategories.push({
        categoryId: "others",
        name: "Others",
        amount: Number(othersAmount.toFixed(2)),
        count: othersCount,
      });
    }
  } else {
    displayCategories = items;
  }

  // Calculate percentages and assign colors
  const formattedCategories = displayCategories.map((item, index) => {
    const percentage = totalExpenses > 0
      ? Number(((item.amount / totalExpenses) * 100).toFixed(0))
      : 0;

    return {
      ...item,
      percentage,
      color: DONUT_COLORS[index % DONUT_COLORS.length],
    };
  });

  return {
    period,
    totalExpenses,
    categories: formattedCategories,
  };
};

/**
 * Get high-level dashboard summary metrics
 */
const getDashboardSummary = async ({ userId }) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const { allTimeStats, currentMonthStats } = await analyticsRepository.getOverallStats({
    userId,
    currentMonthStart,
    currentMonthEnd,
  });

  let allTimeIncome = 0;
  let allTimeExpense = 0;
  for (const s of allTimeStats) {
    const sum = Number(s._sum.amount || 0);
    if (s.type === "INCOME") allTimeIncome = sum;
    if (s.type === "EXPENSE") allTimeExpense = sum;
  }

  let incomeThisMonth = 0;
  let expensesThisMonth = 0;
  for (const s of currentMonthStats) {
    const sum = Number(s._sum.amount || 0);
    if (s.type === "INCOME") incomeThisMonth = sum;
    if (s.type === "EXPENSE") expensesThisMonth = sum;
  }

  const totalBalance = Number((allTimeIncome - allTimeExpense).toFixed(2));
  incomeThisMonth = Number(incomeThisMonth.toFixed(2));
  expensesThisMonth = Number(expensesThisMonth.toFixed(2));
  const netThisMonth = Number((incomeThisMonth - expensesThisMonth).toFixed(2));

  return {
    totalBalance,
    allTimeIncome: Number(allTimeIncome.toFixed(2)),
    allTimeExpense: Number(allTimeExpense.toFixed(2)),
    incomeThisMonth,
    expensesThisMonth,
    netThisMonth,
  };
};

export default {
  getIncomeVsExpenses,
  getExpensesByCategory,
  getDashboardSummary,
};
