const mongoose = require("mongoose");

// Schema for storing the email verification code
const verificationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    default: "user",
  },
  // The verification code subdocument replaces the password field
  verificationCode: verificationCodeSchema,
});

// Add timestamps for created and updated dates
UserSchema.set('timestamps', true);

const User = mongoose.model("User", UserSchema);
module.exports = User;