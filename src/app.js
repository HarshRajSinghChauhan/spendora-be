import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);

export default app;