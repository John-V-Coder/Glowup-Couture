const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String, // Main image for product tiles and listings
    images: [String], // Additional images for product details gallery
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
