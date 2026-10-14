import "dotenv/config";

import app from "./app.js";
import dbConnect from "./config/db.js";
import budgetService from "./modules/budgets/budgets.service.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {

    await dbConnect();

    // Check and process recurring budgets on server startup
    await budgetService.processRecurringBudgets().catch((err) => {
      console.error("Initial recurring budgets check failed:", err.message);
    });

    // Periodically process recurring budgets every hour
    const ONE_HOUR_MS = 60 * 60 * 1000;
    setInterval(async () => {
      try {
        await budgetService.processRecurringBudgets();
      } catch (err) {
        console.error("Periodic recurring budgets check failed:", err.message);
      }
    }, ONE_HOUR_MS);

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