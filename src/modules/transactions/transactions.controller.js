import transactionsServices from "./transactions.service.js"

const createTransaction = async (req, res) => {
    try {
        const result = await transactionsServices.createTransaction({ ...req.body, userId: req.user.id });
        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: result
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}
const getAllTransactions = async (req, res) => {
    try {

        const result = await transactionsServices.getAllTransactions({ ...req.query, userId: req.user.id })
        res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            data: result
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        })
    }
}
const deleteTransaction = async (req, res) => {
    try {
        const result = await transactionsServices.deleteTransaction({ id: req.params.id, userId: req.user.id });
        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
            data: result
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message,
        })
    }
}
const updateTransaction = async (req, res) => {
    try {
        const result = await transactionsServices.updateTransaction({ id: req.params.id,...req.body, userId: req.user.id })
        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: result
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        })
    }
}
export default {
    createTransaction,
    getAllTransactions,
    deleteTransaction,
    updateTransaction
};