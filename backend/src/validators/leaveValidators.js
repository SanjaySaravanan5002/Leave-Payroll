const { body } = require("express-validator");
const { LEAVE_TYPES, LEAVE_STATUS } = require("../utils/constants");

const leaveCreateRules = [
  body("fromDate").isISO8601().withMessage("From date must be valid"),
  body("toDate").isISO8601().withMessage("To date must be valid"),
  body("type").isIn(LEAVE_TYPES).withMessage("Invalid leave type"),
  body("reason").trim().isLength({ min: 3, max: 500 }).withMessage("Reason must be 3-500 characters")
];

const leaveUpdateRules = [
  body("status").isIn(LEAVE_STATUS.filter((status) => status !== "Pending")).withMessage("Status must be Approved or Rejected"),
  body("rejectionReason").optional().trim().isLength({ max: 300 }).withMessage("Rejection reason is too long")
];

module.exports = { leaveCreateRules, leaveUpdateRules };
