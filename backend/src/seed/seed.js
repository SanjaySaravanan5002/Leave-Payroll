require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");
const AuditLog = require("../models/AuditLog");
const { ROLES } = require("../utils/constants");

const users = [
  {
    name: "System Admin",
    email: "admin@company.com",
    password: "Admin@123",
    role: ROLES.ADMIN,
    department: "Administration",
    salary: 120000,
    allowances: 20000
  },
  {
    name: "Priya HR",
    email: "hr@company.com",
    password: "Hr@12345",
    role: ROLES.HR,
    department: "Human Resources",
    salary: 85000,
    allowances: 12000
  },
  {
    name: "Arun Employee",
    email: "employee@company.com",
    password: "Employee@123",
    role: ROLES.EMPLOYEE,
    department: "Engineering",
    salary: 65000,
    allowances: 8000
  }
];

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Employee.deleteMany(), Leave.deleteMany(), Payroll.deleteMany(), AuditLog.deleteMany()]);

  for (const item of users) {
    const user = await User.create({
      email: item.email,
      password: item.password,
      role: item.role
    });

    const employee = await Employee.create({
      user: user._id,
      name: item.name,
      email: item.email,
      department: item.department,
      salary: item.salary,
      allowances: item.allowances,
      joiningDate: new Date("2024-01-15"),
      role: item.role
    });

    user.employee = employee._id;
    await user.save();
  }

  console.log("Seed completed");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
