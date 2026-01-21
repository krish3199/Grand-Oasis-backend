const express = require("express");
const { isAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", isAuth, (req, res) => {
  res.json({ success: true, userId: req.userId });
});

module.exports = router;
