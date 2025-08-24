// routes/customer-analysis-routes.js
const express = require("express");
const router = express.Router();

const {
  getCustomerProductAnalysis,
  getCustomerOrderAnalysis,
  getAllCustomers
} = require("../../controllers/admin/customer-analysis-controller");

const {authMiddleware} = require("../../controllers/auth/auth-controller");

// 📊 Get customer product analytics
router.get("/products", authMiddleware, getCustomerProductAnalysis);

// 📊 Get customer order analytics
router.get("/orders", authMiddleware, getCustomerOrderAnalysis);

// 📋 Admin: Get all customers
router.get("/all", authMiddleware, getAllCustomers);

module.exports = router;
