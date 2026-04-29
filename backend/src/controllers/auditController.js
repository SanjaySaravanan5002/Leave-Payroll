const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../utils/asyncHandler");

const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("performedBy", "email role")
    .sort({ timestamp: -1 })
    .limit(100);

  res.json(logs);
});

module.exports = { getAuditLogs };
