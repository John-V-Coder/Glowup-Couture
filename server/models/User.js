const mongoose = require("mongoose");
const crypto = require("crypto");

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
  passwordResetToken: passwordResetTokenSchema, // Embeds the reset token as a subdocument
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate and save a password reset token
UserSchema.methods.getAndSavePasswordResetToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Set the token and expiration time on the user document
  this.passwordResetToken = {
    token: crypto.createHash("sha256").update(resetToken).digest("hex"), // Hash the token for storage
    expiresAt: Date.now() + 3600000, // 1 hour
  };

  return resetToken; // Return the unhashed token to be sent via email
};

// Method to check if a provided token matches the stored token
UserSchema.methods.isPasswordResetTokenValid = function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return (
    this.passwordResetToken &&
    this.passwordResetToken.token === hashedToken &&
    this.passwordResetToken.expiresAt > Date.now()
  );
};

const User = mongoose.model("User", UserSchema);
module.exports = User;