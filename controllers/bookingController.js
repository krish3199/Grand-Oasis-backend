const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const User = require("../models/User");
const sendCancellationEmail = require("../utils/sendCancellationEmail");

// =======================
// CREATE BOOKING
// =======================
exports.createBooking = async (req, res) => {
  try {
    const { hotelId, roomType, checkIn, checkOut } = req.body;

    // 1️⃣ Validation
    if (!hotelId || !roomType || !checkIn || !checkOut) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2️⃣ Find hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // 3️⃣ Check rooms
    if (!hotel.rooms || hotel.rooms.length === 0) {
      return res.status(400).json({ message: "No rooms in this hotel" });
    }

    // 4️⃣ Find room
    const room = hotel.rooms.find(r => r.type === roomType);
    if (!room || room.availableRooms <= 0) {
      return res.status(400).json({ message: "Room not available" });
    }

    // 5️⃣ Date calculation
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const days = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    // 6️⃣ Price calculation
    const totalPrice = days * room.price;

    // 7️⃣ Update room count
    room.availableRooms -= 1;
    await hotel.save();

    // 8️⃣ Create booking
    const booking = await Booking.create({
      userId: req.userId,
      hotelId,
      roomType,
      checkIn: start,
      checkOut: end,
      days,
      totalPrice,
      status: "Booked"
    });

    res.status(201).json({ success: true, booking });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// MY BOOKINGS
// =======================
exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate("hotelId");

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// CANCEL BOOKING
// =======================
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // 1️⃣ Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 2️⃣ Only booking owner can cancel (unless admin)
    if (booking.userId.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 3️⃣ Already cancelled
    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // 4️⃣ Check 24 hour cancellation policy (only for non-admin)
    if (!req.isAdmin) {
      const bookingTime = new Date(booking.createdAt);
      const now = new Date();
      const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        return res.status(400).json({ 
          message: "Cancellation window expired. Bookings can only be cancelled within 24 hours." 
        });
      }
    }

    // 5️⃣ Find hotel
    const hotel = await Hotel.findById(booking.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // 6️⃣ Increase room availability
    const room = hotel.rooms.find(r => r.type === booking.roomType);
    if (room) {
      room.availableRooms += 1;
      await hotel.save();
    }

    // 7️⃣ Update booking status
    booking.status = "Cancelled";
    await booking.save();

    // 8️⃣ Send cancellation email (non-blocking - fire and forget)
    const user = await User.findById(booking.userId);
    if (user) {
      const hotelImage =
        (Array.isArray(room.images) && room.images.length > 0
          ? room.images[0]
          : null) || hotel.image;

      // Don't await - send response immediately
      sendCancellationEmail({
        to: user.email,
        userName: user.name,
        hotelName: hotel.name,
        city: hotel.city,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        days: booking.days,
        totalPrice: booking.totalPrice,
        bookingId: booking._id.toString(),
        hotelImage,
      }).catch((mailErr) => {
        console.error("CANCELLATION EMAIL ERROR (non-blocking):", mailErr);
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });

  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
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
