const mongoose = require("mongoose");
const { LEAVE_TYPES, LEAVE_STATUS } = require("../utils/constants");

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: LEAVE_TYPES,
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    days: {
      type: Number,
      required: true,
      min: 1
    },
    status: {
      type: String,
      enum: LEAVE_STATUS,
      default: "Pending"
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reviewedAt: Date,
    rejectionReason: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
