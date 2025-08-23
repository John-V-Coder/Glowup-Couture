const mongoose = require("mongoose");

// Define a schema for the password reset tokens, as a subdocument
const passwordResetTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  // New fields to match the auth controller's logic
  attempts: {
    type: Number,
    default: 0,
  },
  isUsed: {
    type: Boolean,
    default: false,
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
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  // The passwordResetCode subdocument now includes attempts and isUsed fields
  passwordResetCode: passwordResetTokenSchema,
});

// Add timestamps for created and updated dates
UserSchema.set('timestamps', true);

const User = mongoose.model("User", UserSchema);
module.exports = User;