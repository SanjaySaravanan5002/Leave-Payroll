const express = require("express");
const { getAuditLogs } = require("../controllers/auditController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/", protect, authorize(ROLES.ADMIN), getAuditLogs);

module.exports = router;
