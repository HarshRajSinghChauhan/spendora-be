import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 4001;

console.log("The port:", process.env.PORT);

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