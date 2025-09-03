const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage'
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  // Customer targeting
  customerType: {
    type: String,
    enum: ['top_buyer', 'subscriber', 'new_customer', 'general'],
    required: true,
    default: 'general'
  },
  // Usage limits
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1 // How many times one user can use this coupon
  },
  // Minimum order requirements
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  // Date restrictions
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  // Auto-assignment rules
  autoAssign: {
    type: Boolean,
    default: false
  },
  autoAssignRules: {
    minOrderCount: { type: Number, default: 0 },
    minTotalSpent: { type: Number, default: 0 },
    isSubscriber: { type: Boolean, default: false },
    isNewCustomer: { type: Boolean, default: false }
  },
  // Applicable categories/products
  applicableCategories: [{
    type: String,
    lowercase: true
  }],
  excludedCategories: [{
    type: String,
    lowercase: true
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // Usage tracking
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    discountAmount: Number
  }],
  // Creator info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
CouponSchema.index({ code: 1, isActive: 1 });
CouponSchema.index({ customerType: 1, isActive: 1 });
CouponSchema.index({ validFrom: 1, validUntil: 1 });

// Virtual for checking if coupon is expired
CouponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

// Virtual for checking if coupon is valid
CouponSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && 
         (this.usageLimit === null || this.usedCount < this.usageLimit);
});

// Method to check if user can use this coupon
CouponSchema.methods.canUserUse = function(userId) {
  if (!this.isValid) return false;
  
  const userUsage = this.usedBy.filter(usage => 
    usage.userId && usage.userId.toString() === userId.toString()
  );
  
  return userUsage.length < this.perUserLimit;
};

// Method to calculate discount amount
CouponSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.minimumOrderAmount) return 0;
  
  if (this.type === 'percentage') {
    return Math.min(orderAmount * (this.value / 100), orderAmount);
  } else {
    return Math.min(this.value, orderAmount);
  }
};

module.exports = mongoose.model("Coupon", CouponSchema);