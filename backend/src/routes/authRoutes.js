const express = require("express");
const { login, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { loginRules } = require("../validators/authValidators");

const router = express.Router();

router.post("/login", loginRules, validate, login);
router.get("/me", protect, me);

module.exports = router;
