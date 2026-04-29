const Payroll = require("../models/Payroll");
const asyncHandler = require("../utils/asyncHandler");
const { ROLES } = require("../utils/constants");
const { processMonthlyPayroll } = require("../services/payrollService");
const { logAudit } = require("../services/auditService");

const getPayrollByEmployee = asyncHandler(async (req, res) => {
  const requestedEmployeeId = req.params.employeeId;

  if (req.user.role === ROLES.EMPLOYEE && String(req.user.employee?._id) !== requestedEmployeeId) {
    res.status(403);
    throw new Error("Employees can only view their own payroll");
  }

  const payroll = await Payroll.find({ employee: requestedEmployeeId })
    .populate("employee", "name email department")
    .sort({ month: -1 });

  res.json(payroll);
});

const processPayroll = asyncHandler(async (req, res) => {
  const { month } = req.body;
  const records = await processMonthlyPayroll({ month, processedBy: req.user._id });

  await logAudit({
    action: "PAYROLL_PROCESSED",
    entity: "Payroll",
    performedBy: req.user._id,
    metadata: { month, count: records.length }
  });

  res.status(201).json({ message: "Payroll processed successfully", count: records.length, records });
});

module.exports = { getPayrollByEmployee, processPayroll };
