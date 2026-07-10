import prisma from "../../config/prisma.js";

const validateTransaction = async ({ type, categoryId, userId }) => {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
            type,
        }
    });

    return category;
};

const findTransactionById = async ({ id, userId }) => {
    return await prisma.transaction.findFirst({
        where: {
            id,
            userId
        }
    })
}
const createTransaction = async ({
    amount,
    type,
    notes,
    categoryId,
    userId,
    title,
    transactionDate
}) => {

    return await prisma.transaction.create({
        data: {
            amount,
            type,
            notes,
            categoryId,
            userId,
            title,
            transactionDate
        },

        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });

};

const getAllTransactions = async ({ userId, type, from, to, page, limit }) => {
    const where = {
        userId
    };

    if (type) {
        where.type = type;
    }

    if (from || to) {
        where.transactionDate = {};
    }

    if (from) {
        where.transactionDate.gte = new Date(from);
    }

    if (to) {
        where.transactionDate.lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const [transactions, totalRecords] = await Promise.all([
        prisma.transaction.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                transactionDate: "desc"
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

        prisma.transaction.count({
            where
        })
    ]);

    return {
        transactions,
        totalRecords,
    };
}

const deleteTransaction = async ({ id, userId }) => {
    return await prisma.transaction.delete({
        where: {
            id,
            userId
        }
    })
}

const updateTransaction = async ({
    id,
    userId,
    amount,
    type,
    notes,
    categoryId,
    title,
    transactionDate,
}) => {

    return prisma.transaction.update({
        where: {
            id,
            userId,
        },
        data: {
            amount,
            type,
            notes,
            categoryId,
            title,
            transactionDate
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

};


export default {
    createTransaction,
    validateTransaction,
    getAllTransactions,
    deleteTransaction,
    updateTransaction,
    findTransactionById
};