const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomType: String,
  checkIn: Date,
  checkOut: Date,
  days: Number,
  totalPrice: Number,
  status: {
    type: String,
    enum: ["Booked", "Cancelled"],
    default: "Booked"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
