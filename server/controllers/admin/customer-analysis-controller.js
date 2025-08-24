// controllers/customer/customer-analysis-controller.js
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

const LOW_STOCK_THRESHOLD = process.env.LOW_STOCK_THRESHOLD || 5;

/**
 * 📊 Get product analytics for customer purchases
 */
const getCustomerProductAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId }).select("items");
    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No purchases found" });
    }

    const productIds = [
      ...new Set(
        orders.flatMap(order => order.items.map(item => item.productId))
      )
    ];

    const purchasedProducts = await Product.find({ _id: { $in: productIds } });

    const totalPurchasedProducts = purchasedProducts.length;
    const lowStockProducts = purchasedProducts.filter(p => p.totalStock <= LOW_STOCK_THRESHOLD && p.totalStock > 0);
    const outOfStockProducts = purchasedProducts.filter(p => p.totalStock <= 0);
    const activeProducts = purchasedProducts.filter(p => p.isActive).length;
    const featuredProducts = purchasedProducts.filter(p => p.isFeatured).length;
    const totalStockValue = purchasedProducts.reduce((sum, p) => sum + (p.totalStock * p.price), 0);
    const averagePrice = purchasedProducts.length > 0
      ? purchasedProducts.reduce((sum, p) => sum + p.price, 0) / purchasedProducts.length
      : 0;

    const categoryStats = purchasedProducts.reduce((acc, product) => {
      const cat = product.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = { count: 0, totalStock: 0, averagePrice: 0 };
      acc[cat].count++;
      acc[cat].totalStock += product.totalStock;
      acc[cat].averagePrice = acc[cat].averagePrice
        ? (acc[cat].averagePrice + product.price) / 2
        : product.price;
      return acc;
    }, {});

    const brandStats = purchasedProducts.reduce((acc, product) => {
      const brand = product.brand || "No Brand";
      if (!acc[brand]) acc[brand] = { count: 0, totalStock: 0 };
      acc[brand].count++;
      acc[brand].totalStock += product.totalStock;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalPurchasedProducts,
          activeProducts,
          featuredProducts,
          lowStockProducts: lowStockProducts.length,
          outOfStockProducts: outOfStockProducts.length,
          totalStockValue,
          averagePrice,
          threshold: LOW_STOCK_THRESHOLD
        },
        categories: categoryStats,
        brands: brandStats,
        lowStockProducts,
        outOfStockProducts
      }
    });
  } catch (err) {
    console.error("Error fetching customer product analysis:", err);
    res.status(500).json({ success: false, message: "Failed to fetch product analysis" });
  }
};

/**
 * 📊 Get customer's order analysis
 */
const getCustomerOrderAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;
    const processingOrders = orders.filter(o => o.orderStatus === "inProcess").length;
    const shippedOrders = orders.filter(o => o.orderStatus === "inShipping").length;
    const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;
    const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;
    const totalSpent = orders
      .filter(o => o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        statistics: {
          totalOrders,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          totalSpent
        },
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (err) {
    console.error("Error fetching customer order analysis:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order analysis" });
  }
};

/**
 * 📋 Get all customers (Admin only)
 */
const getAllCustomers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const customers = await User.find()
      .sort({ createdAt: -1 })
      .select("-password");

    res.json({ success: true, customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
};

module.exports = {
  getCustomerProductAnalysis,
  getCustomerOrderAnalysis,
  getAllCustomers,
};
