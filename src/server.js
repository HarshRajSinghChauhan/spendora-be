import "dotenv/config";

import app from "./app.js";
import dbConnect from "./config/db.js";


const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {

    await dbConnect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {

    console.error("Failed to start server:", err);

    process.exit(1);
  }
};

startServer();