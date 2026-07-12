import transactionRepository from "./transaction.repository.js";

const createTransaction = async (data) => {
    const validTransaction = await transactionRepository.validateTransaction(data);
    if (!validTransaction) {
        throw new Error("Invalid transaction data");
    }

    return await transactionRepository.createTransaction(data);

}

const getAllTransactions = async (data) => {
    const { transactions, totalRecords } = await transactionRepository.getAllTransactions(data);

    const page = Number(data.page || 1);
    const limit = Number(data.limit || 10);

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

    return await transactionRepository.deleteTransaction(data);
}

const updateTransaction = async (data) => {
    const transaction = await transactionRepository.findTransactionById(data);
    if (!transaction) {
        throw new Error("Transaction does not exists!")
    }

    if (data.categoryId || data.type) {
        const validCategory =
            await transactionRepository.validateTransaction({
                categoryId,
                type,
                userId
            });

        if (!validCategory)
            throw new Error("Invalid category");
    }
    return await transactionRepository.updateTransaction(data);
}

export default {
    createTransaction,
    getAllTransactions,
    deleteTransaction,
    updateTransaction
};