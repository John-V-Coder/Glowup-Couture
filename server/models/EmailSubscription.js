const mongoose = require("mongoose");
const crypto = require("crypto");

const EmailSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true // Set a default value so new subscriptions are active
  },
  preferences: {
    marketing: {
      type: Boolean,
      default: true // Set a default value for marketing preference
    },
    // Add other preference types as needed
  },
  unsubscribeToken: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate unsubscribe token before saving
EmailSubscriptionSchema.pre('save', function (next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model("EmailSubscription", EmailSubscriptionSchema);