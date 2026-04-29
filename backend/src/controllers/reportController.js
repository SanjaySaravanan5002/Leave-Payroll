const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");
const asyncHandler = require("../utils/asyncHandler");

const getSummary = asyncHandler(async (req, res) => {
  const [employees, pendingLeaves, approvedLeaves, rejectedLeaves, latestPayroll] = await Promise.all([
    Employee.countDocuments({ isActive: true }),
    Leave.countDocuments({ status: "Pending" }),
    Leave.countDocuments({ status: "Approved" }),
    Leave.countDocuments({ status: "Rejected" }),
    Payroll.find().sort({ processedAt: -1 }).limit(10).populate("employee", "name department")
  ]);

  const payrollTotal = latestPayroll.reduce((total, item) => total + item.netSalary, 0);

  res.json({
    employees,
    leaves: {
      pending: pendingLeaves,
      approved: approvedLeaves,
      rejected: rejectedLeaves
    },
    payroll: {
      recentCount: latestPayroll.length,
      recentNetTotal: payrollTotal,
      latest: latestPayroll
    }
  });
});

module.exports = { getSummary };
