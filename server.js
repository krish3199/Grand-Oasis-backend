const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 🔥 MIDDLEWARE ORDER (IMPORTANT)
app.use(cors({
  origin: ["http://localhost:5173", "https://grand-oasis.vercel.app/home"],
  methods : ["GET","POST","PUT","DELETE"],
  credentials : true
}));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/hotels", require("./routes/hotelRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes")); // 👈 ADD THIS LINE
app.use("/api/payment", require("./routes/paymentRoutes"));

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// mongodb+srv://krishvadodara999_db_user:H9oHRDwMJ3UrSgrZ@grandoasis.yd9ahjs.mongodb.net/hotel_booking?appName=GrandOasis