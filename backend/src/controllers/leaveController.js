const dayjs = require("dayjs");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const asyncHandler = require("../utils/asyncHandler");
const { ROLES } = require("../utils/constants");
const { getLeaveDays } = require("../utils/date");
const { logAudit } = require("../services/auditService");
const { sendEmail } = require("../services/emailService");

const getLeaves = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role === ROLES.EMPLOYEE) {
    query.employee = req.user.employee?._id;
  }

  const leaves = await Leave.find(query)
    .populate("employee", "name email department leaveBalance")
    .populate("reviewedBy", "email role")
    .sort({ createdAt: -1 });

  res.json(leaves);
});

const applyLeave = asyncHandler(async (req, res) => {
  if (!req.user.employee) {
    res.status(400);
    throw new Error("No employee profile linked to this user");
  }

  const { fromDate, toDate, type, reason } = req.body;
  const days = getLeaveDays(fromDate, toDate);

  if (days < 1 || dayjs(toDate).isBefore(dayjs(fromDate))) {
    res.status(422);
    throw new Error("Invalid leave date range");
  }

  const employee = await Employee.findById(req.user.employee._id);
  if (!employee || employee.leaveBalance[type] < days) {
    res.status(422);
    throw new Error(`Insufficient ${type} leave balance`);
  }

  const leave = await Leave.create({
    employee: employee._id,
    fromDate,
    toDate,
    type,
    reason,
    days,
    status: "Pending"
  });

  await logAudit({
    action: "LEAVE_APPLIED",
    entity: "Leave",
    entityId: leave._id,
    performedBy: req.user._id,
    metadata: { type, days }
  });

  res.status(201).json(leave);
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason = "" } = req.body;
  const leave = await Leave.findById(req.params.id).populate("employee");

  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  if (leave.status !== "Pending") {
    res.status(409);
    throw new Error("Only pending leave requests can be reviewed");
  }

  leave.status = status;
  leave.reviewedBy = req.user._id;
  leave.reviewedAt = new Date();
  leave.rejectionReason = status === "Rejected" ? rejectionReason : undefined;

  if (status === "Approved") {
    const employee = await Employee.findById(leave.employee._id);
    employee.leaveBalance[leave.type] = Math.max(0, employee.leaveBalance[leave.type] - leave.days);
    await employee.save();
  }

  await leave.save();

  await sendEmail({
    to: leave.employee.email,
    subject: `Leave ${status}`,
    html: `<p>Hello ${leave.employee.name},</p><p>Your ${leave.type} leave request has been <strong>${status}</strong>.</p>`
  });

  await logAudit({
    action: `LEAVE_${status.toUpperCase()}`,
    entity: "Leave",
    entityId: leave._id,
    performedBy: req.user._id,
    metadata: { status }
  });

  res.json(leave);
});

module.exports = { getLeaves, applyLeave, updateLeaveStatus };
