const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 🔥 MIDDLEWARE ORDER (IMPORTANT)
// CORS Configuration with dynamic origin checking
const allowedOrigins = [
  "http://localhost:5173",
  "https://grand-oasis.vercel.app",
  "https://grand-oasis.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } 
    // Check if origin is a Netlify subdomain
    else if (origin.endsWith('.netlify.app')) {
      callback(null, true);
    }
    // Check if origin is a Vercel subdomain
    else if (origin.endsWith('.vercel.app')) {
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"]
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