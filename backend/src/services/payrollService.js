const dayjs = require("dayjs");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");
const { monthRange } = require("../utils/date");
const { sendEmail } = require("./emailService");

const calculateEmployeePayroll = async ({ employee, month, processedBy }) => {
  const { start, end, daysInMonth } = monthRange(month);
  const approvedLeaves = await Leave.find({
    employee: employee._id,
    status: "Approved",
    fromDate: { $lte: end },
    toDate: { $gte: start }
  });

  const leaveDays = approvedLeaves.reduce((total, leave) => total + leave.days, 0);
  const perDaySalary = employee.salary / daysInMonth;
  const deductions = Number((leaveDays * perDaySalary).toFixed(2));
  const netSalary = Math.max(0, Number((employee.salary + employee.allowances - deductions).toFixed(2)));

  const payroll = await Payroll.findOneAndUpdate(
    { employee: employee._id, month },
    {
      employee: employee._id,
      month,
      basicSalary: employee.salary,
      allowances: employee.allowances,
      leaveDays,
      deductions,
      netSalary,
      processedBy,
      processedAt: new Date()
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await sendEmail({
    to: employee.email,
    subject: `Payslip processed for ${month}`,
    html: `<p>Hello ${employee.name},</p><p>Your salary for ${month} has been processed.</p><p><strong>Net Salary:</strong> ${netSalary}</p>`
  });

  return payroll;
};

const processMonthlyPayroll = async ({ month = dayjs().format("YYYY-MM"), processedBy = null } = {}) => {
  const employees = await Employee.find({ isActive: true });
  const results = [];

  for (const employee of employees) {
    const payroll = await calculateEmployeePayroll({ employee, month, processedBy });
    results.push(payroll);
  }

  return results;
};

module.exports = { calculateEmployeePayroll, processMonthlyPayroll };
