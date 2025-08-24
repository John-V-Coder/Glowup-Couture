const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      index: true,
    },
    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Product Variants & Filtering
    sizes: {
      type: [String], // ['XS', 'S', 'M', 'L', 'XL', 'XXL'] or ['6', '8', '10', '12']
      default: [],
      index: true,
    },
    colors: {
      type: [String], // ['Red', 'Blue', 'Black', 'White']
      default: [],
      index: true,
    },
    material: {
      type: String,
      trim: true,
    },
    // Price Range Filtering (computed field)
    priceRange: {
      type: String,
      enum: ["0-1000", "1000-2500", "2500-5000", "5000-10000", "10000+"],
      index: true,
    },
    // Discount calculation (computed field)
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      index: true,
    },
    // Stock and Review
    totalStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    averageReview: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    // Additional filtering fields
    tags: {
      type: [String], // ['summer', 'casual', 'formal', 'trendy']
      default: [],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isOnSale: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// --- Middleware & Indexing ---

// Add a pre-save hook to automate computed fields
ProductSchema.pre("save", function (next) {
  // 1. Automatically determine if the product is on sale
  this.isOnSale = this.salePrice > 0 && this.salePrice < this.price;

  // 2. Calculate the discount percentage
  if (this.isOnSale) {
    this.discountPercentage =
      ((this.price - this.salePrice) / this.price) * 100;
  } else {
    this.discountPercentage = 0;
  }

  // 3. Assign the product to a price range for easy filtering
  if (this.price <= 1000) {
    this.priceRange = "0-1000";
  } else if (this.price <= 2500) {
    this.priceRange = "1000-2500";
  } else if (this.price <= 5000) {
    this.priceRange = "2500-5000";
  } else if (this.price <= 10000) {
    this.priceRange = "5000-10000";
  } else {
    this.priceRange = "10000+";
  }

  next();
});

// Create a compound text index for fast text searches
ProductSchema.index({
  title: "text",
  description: "text",
  brand: "text",
  tags: "text",
});

module.exports = mongoose.model("Product", ProductSchema);