import budgetService from "./budgets.service.js";

const createBudget = async (req, res) => {
  try {
    const result = await budgetService.createBudget({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const getAllBudgets = async (req, res) => {
  try {
    const result = await budgetService.getAllBudgets({
      ...req.query,
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: "Budgets fetched successfully",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const result = await budgetService.getBudgetById({
      id: req.params.id,
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: "Budget fetched successfully",
      data: result
    });
  } catch (err) {
    const statusCode = err.message.toLowerCase().includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const result = await budgetService.updateBudget({
      id: req.params.id,
      ...req.body,
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      data: result
    });
  } catch (err) {
    const statusCode = err.message.toLowerCase().includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const result = await budgetService.deleteBudget({
      id: req.params.id,
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
      data: result
    });
  } catch (err) {
    const statusCode = err.message.toLowerCase().includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
};

export default {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
};