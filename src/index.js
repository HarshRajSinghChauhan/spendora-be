import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();

const port = process.env.PORT;

console.log("The port:", process.env.PORT);

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  
const startServer = async () => {
  try {
    await dbConnect();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.log("Failed to start server", err);
  }
};

startServer(); 