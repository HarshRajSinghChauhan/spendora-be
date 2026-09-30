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

    const { transactions, totalRecords } = await transactionRepository.getAllTransactions({
        ...data,
        page,
        limit,
    });

    return {
        transactions,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
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