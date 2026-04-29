const cron = require("node-cron");
const dayjs = require("dayjs");
const { processMonthlyPayroll } = require("../services/payrollService");

const startPayrollCron = () => {
  const schedule = process.env.PAYROLL_CRON || "0 2 1 * *";

  if (!cron.validate(schedule)) {
    console.warn(`Invalid PAYROLL_CRON "${schedule}". Payroll cron disabled.`);
    return;
  }

  cron.schedule(schedule, async () => {
    const previousMonth = dayjs().subtract(1, "month").format("YYYY-MM");
    try {
      const records = await processMonthlyPayroll({ month: previousMonth });
      console.log(`Payroll cron processed ${records.length} records for ${previousMonth}`);
    } catch (error) {
      console.error("Payroll cron failed", error);
    }
  });
};

module.exports = { startPayrollCron };
