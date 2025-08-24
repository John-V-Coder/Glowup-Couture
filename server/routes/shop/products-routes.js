const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getFilterOptions,
  getRelatedProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

// Get filtered products with pagination and sorting
// Query params: category, brand, priceRange, colors, sizes, tags, isOnSale, isFeatured, 
//               minPrice, maxPrice, sortBy, limit, page, search
router.get("/get", getFilteredProducts);

// Get product details by ID
router.get("/get/:id", getProductDetails);

// Get related products based on category, brand, and tags
// Query params: limit (default: 8)
router.get("/get/:id/related", getRelatedProducts);

// Get available filter options for frontend (categories, brands, colors, etc.)
router.get("/filter-options", getFilterOptions);

module.exports = router;