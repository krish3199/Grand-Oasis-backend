const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllHotelsAdmin,
  deleteHotel,
  getAllBookings,
  adminCancelBooking
} = require("../controllers/adminController");

const { isAuth, isAdmin } = require("../middleware/authMiddleware");

// USERS
router.get("/users", isAuth, isAdmin, getAllUsers);

// HOTELS
router.get("/hotels", isAuth, isAdmin, getAllHotelsAdmin);
router.delete("/hotels/:id", isAuth, isAdmin, deleteHotel); // 👈 THIS LINE

// BOOKINGS
router.get("/bookings", isAuth, isAdmin, getAllBookings);
router.post("/bookings/cancel/:id", isAuth, isAdmin, adminCancelBooking);

module.exports = router;
