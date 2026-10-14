import budgetsRepository from "./budgets.repository.js";

const getDefaultPeriodRange = (budgetType, referenceDate = new Date()) => {
  const ref = new Date(referenceDate);

  if (budgetType === "WEEKLY") {
    // Sunday (0) to Saturday (6)
    const day = ref.getDay();
    const start = new Date(ref);
    start.setDate(ref.getDate() - day);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  // MONTHLY: 1st day of current month to last day of current month
  const start = new Date(ref.getFullYear(), ref.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

const calculateNextPeriodRange = (budget) => {
  const prevStart = new Date(budget.startDate);
  const prevEnd = new Date(budget.endDate);

  if (budget.budgetType === "WEEKLY") {
    // Next week: Sunday to Saturday (+7 days)
    const start = new Date(prevStart);
    start.setDate(start.getDate() + 7);
    const end = new Date(prevEnd);
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // MONTHLY: Next month
  if (prevStart.getDate() === 1) {
    const start = new Date(prevStart.getFullYear(), prevStart.getMonth() + 1, 1, 0, 0, 0, 0);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }

  const start = new Date(prevStart);
  start.setMonth(start.getMonth() + 1);
  const end = new Date(prevEnd);
  end.setMonth(end.getMonth() + 1);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const normalizeDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    end.getUTCHours() === 0 &&
    end.getUTCMinutes() === 0 &&
    end.getUTCSeconds() === 0 &&
    end.getUTCMilliseconds() === 0
  ) {
    end.setUTCHours(23, 59, 59, 999);
  }

  return { start, end };
};

const formatBudgetWithProgress = (budget, spentAmount = 0) => {
  const limit = Number(budget.limitAmount);
  const spent = Number(Number(spentAmount).toFixed(2));
  const remaining = Number((limit - spent).toFixed(2));
  const spentPercentage = limit > 0 ? Number(((spent / limit) * 100).toFixed(2)) : 0;
  const isExceeded = spent > limit;

  return {
    id: budget.id,
    userId: budget.userId,
    categoryId: budget.categoryId,
    category: budget.category
      ? {
          id: budget.category.id,
          name: budget.category.name,
          type: budget.category.type
        }
      : null,
    limitAmount: limit,
    budgetType: budget.budgetType,
    isRecurring: Boolean(budget.isRecurring),
    startDate: budget.startDate,
    endDate: budget.endDate,
    spentAmount: spent,
    remainingAmount: remaining,
    spentPercentage,
    isExceeded,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt
  };
};

const processRecurringBudgets = async ({ userId } = {}) => {
  const expiredBudgets = await budgetsRepository.findExpiredRecurringBudgets({ userId });
  const now = new Date();

  for (const budget of expiredBudgets) {
    let currentBudget = budget;

    while (new Date(currentBudget.endDate) < now) {
      const { start, end } = calculateNextPeriodRange(currentBudget);

      const existingNext = await budgetsRepository.findOverlappingBudget({
        userId: currentBudget.userId,
        categoryId: currentBudget.categoryId,
        budgetType: currentBudget.budgetType,
        startDate: start,
        endDate: end
      });

      if (existingNext) {
        await budgetsRepository.updateBudget({
          id: currentBudget.id,
          data: { isRecurring: false }
        });
        currentBudget = existingNext;
        break;
      }

      const nextBudget = await budgetsRepository.createBudget({
        userId: currentBudget.userId,
        categoryId: currentBudget.categoryId,
        limitAmount: currentBudget.limitAmount,
        budgetType: currentBudget.budgetType,
        startDate: start,
        endDate: end,
        isRecurring: true
      });

      await budgetsRepository.updateBudget({
        id: currentBudget.id,
        data: { isRecurring: false }
      });

      currentBudget = nextBudget;
    }
  }
};

const createBudget = async (data) => {
  const { userId, categoryId, limitAmount, budgetType, isRecurring, startDate, endDate } = data;

  if (categoryId) {
    const category = await budgetsRepository.validateCategory({ categoryId, userId });
    if (!category) {
      throw new Error("Invalid category or category not found");
    }
    if (category.type !== "EXPENSE") {
      throw new Error("Budgets can only be set for EXPENSE categories");
    }
  }

  let start;
  let end;

  if (startDate && endDate) {
    const normalized = normalizeDateRange(startDate, endDate);
    start = normalized.start;
    end = normalized.end;
  } else {
    // If dates are omitted by the user, automatically compute default current week or month
    const defaultRange = getDefaultPeriodRange(budgetType);
    start = defaultRange.start;
    end = defaultRange.end;
  }

  if (start > end) {
    throw new Error('"endDate" must be greater than or equal to "startDate"');
  }

  const overlappingBudget = await budgetsRepository.findOverlappingBudget({
    userId,
    categoryId: categoryId || null,
    budgetType,
    startDate: start,
    endDate: end
  });

  if (overlappingBudget) {
    throw new Error("A budget already exists for this category and time period");
  }

  const budget = await budgetsRepository.createBudget({
    userId,
    categoryId: categoryId || null,
    limitAmount,
    budgetType,
    startDate: start,
    endDate: end,
    isRecurring: Boolean(isRecurring)
  });

  const spentAmount = await budgetsRepository.calculateSpentAmount({
    userId,
    categoryId: budget.categoryId,
    startDate: budget.startDate,
    endDate: budget.endDate
  });

  return formatBudgetWithProgress(budget, spentAmount);
};

const getAllBudgets = async (data) => {
  // Automatically rollover any recurring budgets whose period has finished
  await processRecurringBudgets({ userId: data.userId });

  const page = Number(data.page || 1);
  const limit = Number(data.limit || 10);

  const { budgets, totalRecords } = await budgetsRepository.getAllBudgets({
    ...data,
    page,
    limit
  });

  const formattedBudgets = await Promise.all(
    budgets.map(async (budget) => {
      const spentAmount = await budgetsRepository.calculateSpentAmount({
        userId: budget.userId,
        categoryId: budget.categoryId,
        startDate: budget.startDate,
        endDate: budget.endDate
      });
      return formatBudgetWithProgress(budget, spentAmount);
    })
  );

  let totalBudgeted = 0;
  let totalSpent = 0;
  formattedBudgets.forEach((b) => {
    totalBudgeted += b.limitAmount;
    totalSpent += b.spentAmount;
  });

  totalBudgeted = Number(totalBudgeted.toFixed(2));
  totalSpent = Number(totalSpent.toFixed(2));
  const totalRemaining = Number((totalBudgeted - totalSpent).toFixed(2));

  return {
    budgets: formattedBudgets,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit) || 1
    },
    summary: {
      totalBudgeted,
      totalSpent,
      totalRemaining
    }
  };
};

const getBudgetById = async ({ id, userId }) => {
  await processRecurringBudgets({ userId });

  const budget = await budgetsRepository.findBudgetById({ id, userId });
  if (!budget) {
    throw new Error("Budget not found");
  }

  const spentAmount = await budgetsRepository.calculateSpentAmount({
    userId,
    categoryId: budget.categoryId,
    startDate: budget.startDate,
    endDate: budget.endDate
  });

  return formatBudgetWithProgress(budget, spentAmount);
};

const updateBudget = async (data) => {
  const { id, userId } = data;

  const existingBudget = await budgetsRepository.findBudgetById({ id, userId });
  if (!existingBudget) {
    throw new Error("Budget not found");
  }

  const effectiveCategoryId =
    data.categoryId !== undefined ? data.categoryId : existingBudget.categoryId;

  if (data.categoryId) {
    const category = await budgetsRepository.validateCategory({
      categoryId: data.categoryId,
      userId
    });
    if (!category) {
      throw new Error("Invalid category or category not found");
    }
    if (category.type !== "EXPENSE") {
      throw new Error("Budgets can only be set for EXPENSE categories");
    }
  }

  const effectiveBudgetType = data.budgetType || existingBudget.budgetType;

  let effectiveStartDate = existingBudget.startDate;
  let effectiveEndDate = existingBudget.endDate;

  if (data.startDate || data.endDate) {
    const startInput = data.startDate || existingBudget.startDate;
    const endInput = data.endDate || existingBudget.endDate;
    const { start, end } = normalizeDateRange(startInput, endInput);
    effectiveStartDate = start;
    effectiveEndDate = end;

    if (effectiveStartDate > effectiveEndDate) {
      throw new Error('"endDate" must be greater than or equal to "startDate"');
    }
  }

  if (
    data.categoryId !== undefined ||
    data.budgetType !== undefined ||
    data.startDate !== undefined ||
    data.endDate !== undefined
  ) {
    const overlappingBudget = await budgetsRepository.findOverlappingBudget({
      userId,
      categoryId: effectiveCategoryId || null,
      budgetType: effectiveBudgetType,
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
      excludeBudgetId: id
    });

    if (overlappingBudget) {
      throw new Error("A budget already exists for this category and time period");
    }
  }

  const updateData = {};
  if (data.limitAmount !== undefined) updateData.limitAmount = data.limitAmount;
  if (data.budgetType !== undefined) updateData.budgetType = data.budgetType;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.isRecurring !== undefined) updateData.isRecurring = Boolean(data.isRecurring);
  if (data.startDate !== undefined) updateData.startDate = effectiveStartDate;
  if (data.endDate !== undefined) updateData.endDate = effectiveEndDate;

  const updatedBudget = await budgetsRepository.updateBudget({
    id,
    data: updateData
  });

  const spentAmount = await budgetsRepository.calculateSpentAmount({
    userId,
    categoryId: updatedBudget.categoryId,
    startDate: updatedBudget.startDate,
    endDate: updatedBudget.endDate
  });

  return formatBudgetWithProgress(updatedBudget, spentAmount);
};

const deleteBudget = async ({ id, userId }) => {
  const existingBudget = await budgetsRepository.findBudgetById({ id, userId });
  if (!existingBudget) {
    throw new Error("Budget not found");
  }

  return await budgetsRepository.deleteBudget({ id });
};

export default {
  getDefaultPeriodRange,
  calculateNextPeriodRange,
  processRecurringBudgets,
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
};
