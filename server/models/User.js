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
    select: false, // Prevents the password from being returned in queries by default
  },
  role: {
    type: String,
    default: "user",
  },
  passwordResetCode: passwordResetTokenSchema, // Embeds the reset token as a subdocument
});

// Add timestamps for created and updated dates
UserSchema.set('timestamps', true);

const User = mongoose.model("User", UserSchema);
module.exports = User;