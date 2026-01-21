const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =======================
// AUTH CHECK (LOGIN REQUIRED)
// =======================
exports.isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

// =======================
// ADMIN CHECK
// =======================
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Admin access denied" });
  }
};
