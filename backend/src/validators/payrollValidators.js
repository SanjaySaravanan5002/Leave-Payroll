const { body } = require("express-validator");

const payrollProcessRules = [
  body("month").matches(/^\d{4}-\d{2}$/).withMessage("Month must be in YYYY-MM format")
];

module.exports = { payrollProcessRules };
