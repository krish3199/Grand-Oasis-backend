const mongoose = require("mongoose");

// 🔹 Room schema
const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  availableRooms: {
    type: Number,
    required: true,
  },

  // ✅ NEW: Room images
  images: {
    type: [String], // room photos
    default: [],
  },

  // ✅ NEW: Room facilities
  facilities: {
    type: [String], // ["AC", "TV", "WiFi"]
    default: [],
  },
});

// 🔹 Hotel schema
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // ✅ Main hotel image (for cards)
    image: {
      type: String,
      required: true,
    },

    // ✅ NEW: Hotel gallery images
    images: {
      type: [String],
      default: [],
    },

    // ✅ Hotel facilities (WiFi, Pool, Parking)
    amenities: {
      type: [String],
      required: true,
    },

    // ✅ Hotel rating
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },

    // ✅ Rooms with full info
    rooms: {
      type: [roomSchema],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
