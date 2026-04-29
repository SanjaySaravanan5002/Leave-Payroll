const express = require("express");
const { getPayrollByEmployee, processPayroll } = require("../controllers/payrollController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { payrollProcessRules } = require("../validators/payrollValidators");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(protect);
router.get("/:employeeId", getPayrollByEmployee);
router.post("/process", authorize(ROLES.ADMIN, ROLES.HR), payrollProcessRules, validate, processPayroll);

module.exports = router;
