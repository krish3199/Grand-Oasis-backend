const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe // 🔥 THIS WAS MISSING
} = require("../controllers/authController");

const { isAuth } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset", resetPassword);

// 🔥 CURRENT USER ROUTE
router.get("/me", isAuth, getMe);

module.exports = router;
