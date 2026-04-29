const express = require("express");
const { getSummary } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/summary", protect, authorize(ROLES.ADMIN, ROLES.HR), getSummary);

module.exports = router;
