import express from "express";
import auth from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import budgetsController from "./budgets.controller.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
  getBudgetsQuerySchema
} from "./budgets.validate.js";

const router = express.Router();

router.post("/", auth, validate(createBudgetSchema), budgetsController.createBudget);
router.get("/", auth, validate(getBudgetsQuerySchema, "query"), budgetsController.getAllBudgets);
router.get("/:id", auth, budgetsController.getBudgetById);
router.patch("/:id", auth, validate(updateBudgetSchema), budgetsController.updateBudget);
router.delete("/:id", auth, budgetsController.deleteBudget);

export default router;