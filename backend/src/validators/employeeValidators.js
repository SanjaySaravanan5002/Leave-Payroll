const { body } = require("express-validator");
const { ROLES } = require("../utils/constants");

const employeeRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("salary").isFloat({ min: 0 }).withMessage("Salary must be a positive number"),
  body("allowances").optional().isFloat({ min: 0 }).withMessage("Allowances must be a positive number"),
  body("joiningDate").isISO8601().withMessage("Joining date must be a valid date"),
  body("role").optional().isIn(Object.values(ROLES)).withMessage("Invalid role"),
  body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

module.exports = { employeeRules };
