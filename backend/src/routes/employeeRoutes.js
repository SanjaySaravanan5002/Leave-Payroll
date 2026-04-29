const express = require("express");
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { employeeRules } = require("../validators/employeeValidators");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(protect);
router.get("/", authorize(ROLES.ADMIN, ROLES.HR), getEmployees);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.HR), getEmployeeById);
router.post("/", authorize(ROLES.ADMIN, ROLES.HR), employeeRules, validate, createEmployee);
router.put("/:id", authorize(ROLES.ADMIN, ROLES.HR), updateEmployee);
router.delete("/:id", authorize(ROLES.ADMIN), deleteEmployee);

module.exports = router;
