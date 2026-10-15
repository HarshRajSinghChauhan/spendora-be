import analyticsService from "./analytics.service.js";

const getIncomeVsExpenses = async (req, res) => {
  try {
    const result = await analyticsService.getIncomeVsExpenses({
      userId: req.user.id,
      months: req.query.months,
      range: req.query.range,
    });

    res.status(200).json({
      success: true,
      message: "Income vs expenses analytics fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getExpensesByCategory = async (req, res) => {
  try {
    const result = await analyticsService.getExpensesByCategory({
      userId: req.user.id,
      period: req.query.period,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });

    res.status(200).json({
      success: true,
      message: "Expenses by category fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const result = await analyticsService.getDashboardSummary({
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard summary stats fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getIncomeVsExpenses,
  getExpensesByCategory,
  getDashboardSummary,
};
