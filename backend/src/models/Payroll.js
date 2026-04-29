const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/
    },
    basicSalary: {
      type: Number,
      required: true,
      min: 0
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0
    },
    leaveDays: {
      type: Number,
      default: 0,
      min: 0
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    processedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

payrollSchema.index({ employee: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Payroll", payrollSchema);
