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
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if origin is a Netlify subdomain
    if (origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    
    // Check if origin is a Vercel subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Log for debugging
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
// NOTE: Express v5 + path-to-regexp is strict about wildcard routes.
// CORS middleware already handles preflight (OPTIONS) when `preflightContinue` is false.

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