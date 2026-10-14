import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import categoriesRoutes from "./modules/categories/categories.routes.js";
import transactionsRoutes from "./modules/transactions/transactions.routes.js";
import budgetsRoutes from "./modules/budgets/budgets.routes.js";
import swaggerRoutes from "./docs/swaggerRoutes.js";

const app = express();

// Trust reverse proxy headers (Render, Heroku, etc.)
app.set("trust proxy", 1);

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Swagger Documentation
app.use(swaggerRoutes);

// Health Check Endpoint
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/budgets", budgetsRoutes);

export default app;