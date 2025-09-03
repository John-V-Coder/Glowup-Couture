const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  autoAssignCoupons,
  getCouponStats
} = require("../../controllers/admin/coupon-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware);

// CRUD operations
router.post("/create", createCoupon);
router.get("/get", getAllCoupons);
router.put("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);

// Auto-assignment and statistics
router.post("/auto-assign", autoAssignCoupons);
router.get("/stats", getCouponStats);

module.exports = router;