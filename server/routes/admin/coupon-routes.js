const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getEligibleUsersForCoupons,
  sendCouponsToUsers,
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

// User and statistics
router.get("/eligible-users", getEligibleUsersForCoupons);
router.post("/send", sendCouponsToUsers);
router.get("/stats", getCouponStats);

module.exports = router;
