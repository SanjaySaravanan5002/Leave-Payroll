const AuditLog = require("../models/AuditLog");

const logAudit = async ({ action, entity, entityId, performedBy, metadata = {} }) => {
  try {
    await AuditLog.create({ action, entity, entityId, performedBy, metadata });
  } catch (error) {
    console.error("Audit log failed", error.message);
  }
};

module.exports = { logAudit };
