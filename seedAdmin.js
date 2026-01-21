const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// 🔹 MongoDB connect
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/hotelbooking")
  .then(async () => {
    console.log("MongoDB connected for admin seeding");

    const adminEmail = "admin@admin.com";
    const adminPassword = "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Update existing admin
      const hash = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hash;
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("✅ Admin account updated!");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      // Create new admin
      const hash = await bcrypt.hash(adminPassword, 10);
      const admin = await User.create({
        name: "Admin",
        email: adminEmail,
        password: hash,
        role: "admin"
      });
      console.log("✅ Admin account created!");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    }

    console.log("\n🚀 You can now login at: http://localhost:5173/admin/login");
    process.exit();
  })
  .catch((err) => {
    console.log("❌ Seeding Error:", err);
    process.exit(1);
  });


