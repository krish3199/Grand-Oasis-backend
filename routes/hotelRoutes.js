const express = require("express");
const { addHotel, getHotels, getHotelById, updateHotel } = require("../controllers/hotelController");
const { isAuth, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", isAuth, isAdmin, addHotel);   // admin only
router.get("/", getHotels);  // public
router.get("/:id", getHotelById);  // public
router.put("/:id", isAuth, isAdmin, updateHotel);  // admin only

module.exports = router;
