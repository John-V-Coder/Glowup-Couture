const mongoose = require("mongoose");

const EmailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  htmlContent: {
    type: String,
    required: true,
  },
  textContent: {
    type: String,
    required: true,
  },
  variables: [{
    name: String,
    description: String,
    required: { type: Boolean, default: false }
  }],
  category: {
    type: String,
    enum: ['auth', 'order', 'marketing', 'support', 'notification'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("EmailTemplate", EmailTemplateSchema);