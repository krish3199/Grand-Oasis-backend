const express = require("express");
const { isAuth } = require("../middleware/authMiddleware");
const {
  createOrder,
  verifyPaymentAndCreateBooking,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Razorpay order
router.post("/order", isAuth, createOrder);

// Verify payment & create booking
router.post("/verify", isAuth, verifyPaymentAndCreateBooking);

module.exports = router;


