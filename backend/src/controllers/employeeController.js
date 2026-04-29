const User = require("../models/User");
const Employee = require("../models/Employee");
const asyncHandler = require("../utils/asyncHandler");
const { ROLES } = require("../utils/constants");
const { logAudit } = require("../services/auditService");

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 }).populate("user", "email role isActive");
  res.json(employees);
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("user", "email role isActive");
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.json(employee);
});

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, department, salary, allowances = 0, joiningDate, role = ROLES.EMPLOYEE, password = "Employee@123" } = req.body;

  const user = await User.create({ email, password, role });
  const employee = await Employee.create({
    user: user._id,
    name,
    email,
    department,
    salary,
    allowances,
    joiningDate,
    role
  });

  user.employee = employee._id;
  await user.save();

  await logAudit({
    action: "EMPLOYEE_CREATED",
    entity: "Employee",
    entityId: employee._id,
    performedBy: req.user._id,
    metadata: { email, role }
  });

  res.status(201).json(employee);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const allowed = ["name", "department", "salary", "allowances", "joiningDate", "role", "isActive", "leaveBalance"];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) employee[field] = req.body[field];
  });

  await employee.save();

  if (employee.user) {
    await User.findByIdAndUpdate(employee.user, {
      role: employee.role,
      isActive: employee.isActive
    });
  }

  await logAudit({
    action: "EMPLOYEE_UPDATED",
    entity: "Employee",
    entityId: employee._id,
    performedBy: req.user._id
  });

  res.json(employee);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.isActive = false;
  await employee.save();
  if (employee.user) await User.findByIdAndUpdate(employee.user, { isActive: false });

  await logAudit({
    action: "EMPLOYEE_DEACTIVATED",
    entity: "Employee",
    entityId: employee._id,
    performedBy: req.user._id
  });

  res.json({ message: "Employee deactivated successfully" });
});

module.exports = { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
