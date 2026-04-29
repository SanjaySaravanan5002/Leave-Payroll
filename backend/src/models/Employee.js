const mongoose = require("mongoose");
const { ROLES } = require("../utils/constants");

const leaveBalanceSchema = new mongoose.Schema(
  {
    Casual: { type: Number, default: 12, min: 0 },
    Sick: { type: Number, default: 10, min: 0 },
    Paid: { type: Number, default: 18, min: 0 }
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    salary: {
      type: Number,
      required: true,
      min: 0
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0
    },
    joiningDate: {
      type: Date,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.EMPLOYEE
    },
    leaveBalance: {
      type: leaveBalanceSchema,
      default: () => ({})
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
