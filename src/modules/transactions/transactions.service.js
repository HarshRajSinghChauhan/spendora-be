import transactionRepository from "./transaction.repository.js";

const createTransaction = async (data) => {
    const validCategory = await transactionRepository.validateTransaction(data);
    if (!validCategory) {
        throw new Error("Invalid transaction data");
    }

    return await transactionRepository.createTransaction(data);
};

const getAllTransactions = async (data) => {
    const page = Number(data.page || 1);
    const limit = Number(data.limit || 10);

    const { transactions, totalRecords, summaryStats } = await transactionRepository.getAllTransactions({
        ...data,
        page,
        limit,
    });

    let total_income = 0;
    let total_expense = 0;

    (summaryStats || []).forEach((item) => {
        const sum = Number(item._sum.amount || 0);
        if (item.type === "INCOME") total_income = sum;
        if (item.type === "EXPENSE") total_expense = sum;
    });

    const total_remain = Number((total_income - total_expense).toFixed(2));

    return {
        transactions,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        summary: {
            total_remain,
            total_income,
            total_expense,
        },
    };
};

const deleteTransaction = async (data) => {
    const transaction = await transactionRepository.findTransactionById(data);

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    return await transactionRepository.deleteTransaction({ id: data.id });
};

const updateTransaction = async (data) => {
    const transaction = await transactionRepository.findTransactionById({
        id: data.id,
        userId: data.userId,
    });

    if (!transaction) {
        throw new Error("Transaction does not exists!");
    }

    if (data.categoryId || data.type) {
        const categoryId = data.categoryId || transaction.categoryId;
        const type = data.type || transaction.type;

        const validCategory = await transactionRepository.validateTransaction({
            categoryId,
            type,
            userId: data.userId,
        });

        if (!validCategory) {
            throw new Error("Invalid transaction data");
        }
    }

    return await transactionRepository.updateTransaction(data);
};

export default {
    createTransaction,
    getAllTransactions,
    deleteTransaction,
    updateTransaction
};