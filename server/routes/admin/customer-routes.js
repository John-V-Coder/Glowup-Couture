const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { authMiddleware } = require("../../controllers/auth/auth-controller"); // adjust path if needed

// GET all customers (admin only)
router.get("/customers", authMiddleware, async (req, res) => {
  try {
    // Only allow admins to fetch customer list
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const customers = await User.find().sort({ createdAt: -1 }).select("-password"); // exclude passwords
    res.json({ success: true, customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
});

module.exports = router;
