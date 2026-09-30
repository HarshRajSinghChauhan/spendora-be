import prisma from "../../config/prisma.js";

const isValidUUID = (uuid) => {
    return typeof uuid === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};

const validateTransaction = async ({ type, categoryId, userId }) => {
    if (!isValidUUID(categoryId)) {
        return null;
    }

    const where = {
        id: categoryId,
        isDisabled: false,
        OR: [
            { isGlobal: true },
            { createdById: userId }
        ]
    };

    if (type) {
        where.type = type;
    }

    const category = await prisma.category.findFirst({
        where
    });

    return category;
};

const findTransactionById = async ({ id, userId }) => {
    if (!isValidUUID(id)) {
        return null;
    }

    return await prisma.transaction.findFirst({
        where: {
            id,
            userId
        }
    });
};

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
            transactionDate: transactionDate ? new Date(transactionDate) : undefined
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

const getAllTransactions = async ({ userId, type, from, to, page = 1, limit = 10 }) => {
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

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [transactions, totalRecords] = await Promise.all([
        prisma.transaction.findMany({
            where,
            skip,
            take: limitNum,
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
};

const deleteTransaction = async ({ id }) => {
    return await prisma.transaction.delete({
        where: {
            id
        }
    });
};

const updateTransaction = async ({
    id,
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
        updateData.transactionDate = new Date(transactionDate);
    }

    return await prisma.transaction.update({
        where: {
            id
        },
        data: updateData
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