const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { logAudit } = require("../services/auditService");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password").populate("employee");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is inactive");
  }

  user.lastLoginAt = new Date();
  await user.save();
  await logAudit({ action: "AUTH_LOGIN", entity: "User", entityId: user._id, performedBy: user._id });

  res.json({
    token: signToken(user),
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      employee: user.employee
    }
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    employee: req.user.employee
  });
});

module.exports = { login, me };
