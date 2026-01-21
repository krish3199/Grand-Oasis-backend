const express = require("express");

const {
  createBooking,
  myBookings,
  cancelBooking,
  getAllBookings
} = require("../controllers/bookingController");

const { isAuth, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// USER
router.post("/create", isAuth, createBooking);
router.get("/my", isAuth, myBookings);
router.post("/cancel/:id", isAuth, cancelBooking);

// ADMIN
router.get("/all", isAuth, isAdmin, getAllBookings);
router.put("/admin-cancel/:id", isAuth, isAdmin, cancelBooking);

module.exports = router;
