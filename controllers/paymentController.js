const Razorpay = require("razorpay");
const crypto = require("crypto");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const User = require("../models/User");
const sendBookingEmail = require("../utils/sendBookingEmail");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in INR

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys not configured" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("RAZORPAY ORDER ERROR:", error);
    return res.status(500).json({ message: "Failed to create payment order" });
  }
};

// Verify payment signature and create booking + send email
exports.verifyPaymentAndCreateBooking = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingData
    ) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const { hotelId, roomType, checkIn, checkOut } = bookingData;

    if (!hotelId || !roomType || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Booking data incomplete" });
    }

    // Reuse booking logic (similar to createBooking)
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (!hotel.rooms || hotel.rooms.length === 0) {
      return res.status(400).json({ message: "No rooms in this hotel" });
    }

    const room = hotel.rooms.find((r) => r.type === roomType);
    if (!room || room.availableRooms <= 0) {
      return res.status(400).json({ message: "Room not available" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    const totalPrice = days * room.price;

    // Decrease room availability
    room.availableRooms -= 1;
    await hotel.save();

    const booking = await Booking.create({
      userId: req.userId,
      hotelId,
      roomType,
      checkIn: start,
      checkOut: end,
      days,
      totalPrice,
      status: "Booked",
    });

    // Determine image to show in email (prefer room image, fallback to main hotel image)
    const hotelImage =
      (Array.isArray(room.images) && room.images.length > 0
        ? room.images[0]
        : null) || hotel.image;

    // Send confirmation email (non-blocking - don't wait for it)
    // Response immediately, email will send in background
    const user = await User.findById(req.userId);
    if (user) {
      // Fire and forget - don't await, send response immediately
      sendBookingEmail({
        to: user.email,
        userName: user.name,
        hotelName: hotel.name,
        city: hotel.city,
        checkIn: start,
        checkOut: end,
        days,
        totalPrice,
        bookingId: booking._id.toString(),
        hotelImage,
      }).catch((mailErr) => {
        console.error("BOOKING EMAIL ERROR (non-blocking):", mailErr);
      });
    }

    // Return response immediately - don't wait for email
    return res.json({
      success: true,
      message: "Payment verified & booking created",
      booking,
    });
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};


