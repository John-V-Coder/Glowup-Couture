const express = require("express");
const { upload } = require("../../helpers/cloudinary");

const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  updateProductStock,
  toggleProductStatus,
  toggleFeaturedStatus,
  deleteProduct,
  checkAllProductsLowStock,
  getLowStockProducts,
  bulkUpdateStock,
  getProductStats,
} = require("../../controllers/admin/products-controller");

const router = express.Router();

// Image upload
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

// Product CRUD operations
router.post("/add", addProduct);

// Get all products with optional filtering and pagination
// Query params: page, limit, sortBy, order, category, brand, isActive, isFeatured, lowStock, search
router.get("/get", fetchAllProducts);

router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

// Product status management
router.patch("/toggle-status/:id", toggleProductStatus);

// Stock management
router.put("/stock/:id", updateProductStock);

// Low stock management
router.get("/low-stock", getLowStockProducts);

// Analytics
router.get("/stats", getProductStats);

module.exports = router;