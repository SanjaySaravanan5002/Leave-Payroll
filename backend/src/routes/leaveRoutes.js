const express = require("express");
const { getLeaves, applyLeave, updateLeaveStatus } = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { leaveCreateRules, leaveUpdateRules } = require("../validators/leaveValidators");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(protect);
router.get("/", getLeaves);
router.post("/", authorize(ROLES.EMPLOYEE), leaveCreateRules, validate, applyLeave);
router.put("/:id", authorize(ROLES.ADMIN, ROLES.HR), leaveUpdateRules, validate, updateLeaveStatus);

module.exports = router;
