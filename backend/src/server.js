require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { startPayrollCron } = require("./jobs/payrollCron");

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  startPayrollCron();

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
