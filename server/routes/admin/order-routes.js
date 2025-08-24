const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  sendAdminOrderNotification,
  getOrderStatistics
} = require("../../controllers/admin/order-controller");

const router = express.Router();

// Get all orders
router.get("/get", getAllOrdersOfAllUsers);

// Get specific order details
router.get("/details/:id", getOrderDetailsForAdmin);

// Update order status
router.put("/update/:id", updateOrderStatus);

// Send manual admin notification for a specific order
router.post("/notify-admin/:id", sendAdminOrderNotification);

// Get order statistics for admin dashboard
router.get("/statistics", getOrderStatistics);

module.exports = router;
