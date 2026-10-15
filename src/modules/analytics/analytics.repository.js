import prisma from "../../config/prisma.js";

/**
 * Fetch all transactions for a user within a date window for monthly trend calculation
 */
const getTransactionsForDateRange = async ({ userId, startDate, endDate }) => {
  return await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      amount: true,
      type: true,
      transactionDate: true,
    },
    orderBy: {
      transactionDate: "asc",
    },
  });
};

/**
 * Fetch expenses grouped by category within a date window
 */
const getExpensesByCategory = async ({ userId, startDate, endDate }) => {
  const where = {
    userId,
    type: "EXPENSE",
  };

  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) where.transactionDate.gte = startDate;
    if (endDate) where.transactionDate.lte = endDate;
  }

  const [grouped, categories] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    }),
    prisma.category.findMany({
      where: {
        isDisabled: false,
        OR: [{ isGlobal: true }, { createdById: userId }],
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    }),
  ]);

  return { grouped, categories };
};

/**
 * Fetch overall summary stats for user (all-time & current month)
 */
const getOverallStats = async ({ userId, currentMonthStart, currentMonthEnd }) => {
  const [allTimeStats, currentMonthStats] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        transactionDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: { amount: true },
      _count: { id: true },
    }),
  ]);

  return { allTimeStats, currentMonthStats };
};

export default {
  getTransactionsForDateRange,
  getExpensesByCategory,
  getOverallStats,
};
