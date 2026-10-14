import prisma from "../../config/prisma.js";

const isValidUUID = (uuid) => {
  return typeof uuid === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};

const validateCategory = async ({ categoryId, userId }) => {
  if (!isValidUUID(categoryId)) {
    return null;
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDisabled: false,
      OR: [
        { isGlobal: true },
        { createdById: userId }
      ]
    }
  });

  return category;
};

const findBudgetById = async ({ id, userId }) => {
  if (!isValidUUID(id)) {
    return null;
  }

  return await prisma.budget.findFirst({
    where: {
      id,
      userId
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true
        }
      }
    }
  });
};

const findOverlappingBudget = async ({
  userId,
  categoryId = null,
  budgetType,
  startDate,
  endDate,
  excludeBudgetId = null
}) => {
  const where = {
    userId,
    budgetType,
    categoryId: categoryId || null,
    startDate: { lte: new Date(endDate) },
    endDate: { gte: new Date(startDate) }
  };

  if (excludeBudgetId && isValidUUID(excludeBudgetId)) {
    where.id = { not: excludeBudgetId };
  }

  return await prisma.budget.findFirst({
    where
  });
};

const findExpiredRecurringBudgets = async ({ userId } = {}) => {
  const where = {
    isRecurring: true,
    endDate: {
      lt: new Date()
    }
  };

  if (userId) {
    where.userId = userId;
  }

  return await prisma.budget.findMany({
    where,
    orderBy: {
      endDate: "asc"
    }
  });
};

const createBudget = async ({
  userId,
  categoryId = null,
  limitAmount,
  budgetType,
  startDate,
  endDate,
  isRecurring = false
}) => {
  return await prisma.budget.create({
    data: {
      userId,
      categoryId: categoryId || null,
      limitAmount,
      budgetType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isRecurring: Boolean(isRecurring)
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true
        }
      }
    }
  });
};

const getAllBudgets = async ({
  userId,
  budgetType,
  categoryId,
  active,
  isRecurring,
  page = 1,
  limit = 10
}) => {
  const where = {
    userId
  };

  if (budgetType) {
    where.budgetType = budgetType;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (isRecurring !== undefined) {
    where.isRecurring = isRecurring;
  }

  const now = new Date();
  if (active === true) {
    where.startDate = { lte: now };
    where.endDate = { gte: now };
  } else if (active === false) {
    where.OR = [
      { startDate: { gt: now } },
      { endDate: { lt: now } }
    ];
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [budgets, totalRecords] = await Promise.all([
    prisma.budget.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        startDate: "desc"
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    }),

    prisma.budget.count({
      where
    })
  ]);

  return {
    budgets,
    totalRecords
  };
};

const updateBudget = async ({ id, data }) => {
  return await prisma.budget.update({
    where: {
      id
    },
    data,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true
        }
      }
    }
  });
};

const deleteBudget = async ({ id }) => {
  return await prisma.budget.delete({
    where: {
      id
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true
        }
      }
    }
  });
};

const calculateSpentAmount = async ({ userId, categoryId = null, startDate, endDate }) => {
  const where = {
    userId,
    type: "EXPENSE",
    transactionDate: {
      gte: new Date(startDate),
      lte: new Date(endDate)
    }
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const aggregate = await prisma.transaction.aggregate({
    where,
    _sum: {
      amount: true
    }
  });

  return Number(aggregate._sum.amount || 0);
};

export default {
  isValidUUID,
  validateCategory,
  findBudgetById,
  findOverlappingBudget,
  findExpiredRecurringBudgets,
  createBudget,
  getAllBudgets,
  updateBudget,
  deleteBudget,
  calculateSpentAmount
};
