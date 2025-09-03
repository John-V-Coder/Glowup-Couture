const express = require("express");
const {
  validateCoupon,
  getAvailableCoupons
} = require("../../controllers/shop/coupon-controller");

const router = express.Router();

// Validate coupon code
router.post("/validate", validateCoupon);

// Get available coupons for a user
router.get("/available/:userId", getAvailableCoupons);

module.exports = router;