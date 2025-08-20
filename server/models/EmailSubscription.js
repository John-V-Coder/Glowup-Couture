const mongoose = require("mongoose");

const EmailSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  preferences: {
    marketing: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    newProducts: { type: Boolean, default: true },
    sales: { type: Boolean, default: true },
  },
  source: {
    type: String,
    enum: ['website', 'checkout', 'manual', 'import'],
    default: 'website',
  },
  unsubscribeToken: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true
});

// Generate unsubscribe token before saving
EmailSubscriptionSchema.pre('save', function(next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model("EmailSubscription", EmailSubscriptionSchema);