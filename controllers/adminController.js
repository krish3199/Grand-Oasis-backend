const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// =======================
// GET ALL USERS
// =======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET ALL HOTELS
// =======================
exports.getAllHotelsAdmin = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// DELETE HOTEL
// =======================
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    await hotel.deleteOne();
    res.json({ success: true, message: "Hotel deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET ALL BOOKINGS
// =======================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("hotelId", "name city");

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// CANCEL ANY BOOKING (ADMIN)
// =======================
exports.adminCancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
