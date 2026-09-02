import prisma from "../../config/prisma.js";

const validateTransaction = async ({ type, categoryId, userId }) => {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            createdById: userId,
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
        const fromDate = new Date(from);
        fromDate.setUTCHours(0, 0, 0, 0);
        where.transactionDate.gte = fromDate;
    }
    if (to) {
        const toDate = new Date(to);
        toDate.setUTCHours(23, 59, 59, 999);
        where.transactionDate.lte = toDate;
    }

    page = Number(page);
    limit = Number(limit);

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

    const updateData = {};

    if (amount !== undefined) updateData.amount = amount;
    if (type !== undefined) updateData.type = type;
    if (notes !== undefined) updateData.notes = notes;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (title !== undefined) updateData.title = title;
    if (transactionDate !== undefined) {
        updateData.transactionDate = transactionDate;
    }

    return prisma.transaction.update({
        where: {
            id
        },
        data: updateData
    });

    return prisma.transaction.update({
        where: {
            id,
            userId,
        },
        data: updateData,
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