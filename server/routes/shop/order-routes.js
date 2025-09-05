const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  handlePaystackWebhook,
} = require("../../controllers/shop/order-controller");
const { sendOrderNotification } = require("../../controllers/email/emailController");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.post("/paystack-webhook", handlePaystackWebhook);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
// Order notification routes
router.post("/order-notification", sendOrderNotification);

module.exports = router;
