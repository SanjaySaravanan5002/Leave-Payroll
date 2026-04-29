const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    entity: String,
    entityId: mongoose.Schema.Types.ObjectId,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
