const Hotel = require("../models/Hotel");

// ADD HOTEL (ADMIN)
exports.addHotel = async (req, res) => {
  const hotel = await Hotel.create(req.body);
  res.json({ success: true, hotel });
};

// GET ALL HOTELS
exports.getHotels = async (req, res) => {
  const hotels = await Hotel.find();
  res.json(hotels);
};

// GET SINGLE HOTEL
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }
    
    res.json({ hotel });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE HOTEL (PUT API – ADMIN)
// ===============================
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      success: true,
      hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
