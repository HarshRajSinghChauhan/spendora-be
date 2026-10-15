import express from "express";
import auth from "../../middlewares/auth.middleware.js";
import analyticsController from "./analytics.controller.js";

const router = express.Router();

// Monthly Income vs Expenses (Bar Chart)
router.get("/income-vs-expenses", auth, analyticsController.getIncomeVsExpenses);

// Expenses by Category Breakdown (Donut Chart & List)
router.get("/expenses-by-category", auth, analyticsController.getExpensesByCategory);

// Dashboard Summary Stats (Total Balance, This Month Income, This Month Expenses)
router.get("/dashboard-summary", auth, analyticsController.getDashboardSummary);

export default router;
