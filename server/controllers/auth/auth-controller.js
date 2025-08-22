const jwt = require("jsonwebtoken");
const User = require("../../models/User"); 
const emailService = require("../../services/emailService"); 

// Helper to hash password before saving if not handled by pre-save hook, though our model handles it.
// We keep bcrypt import as the model uses it, and for clarity if direct hashing is needed.

// Register User
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email! Please try again.",
      });
    }

    // The User model's pre-save hook will handle password hashing.
    const newUser = new User({
      userName,
      email,
      password, // Plain password will be hashed by the User model's pre('save') hook
    });

    await newUser.save();

    // Send welcome email asynchronously without blocking the response
    emailService
      .sendWelcomeEmail(email, userName)
      .then(() => {
        console.log(`Welcome email sent to ${email}`);
      })
      .catch((error) => {
        console.error(`Failed to send welcome email to ${email}:`, error.message);
      });

    res.status(201).json({
      success: true,
      message: "Registration successful. Welcome email sent!",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Select the password explicitly since it has `select: false`
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    // Use the User model's method to compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again.",
      error: error.message,
    });
  }
};

// Logout User
const logoutUser = (req, res) => {
  // If using cookies, clear them. If only sending JWT in response, client handles removal.
  // Assuming client-side token management for this example, but adding cookie clearing as an option.
  // res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for password reset.',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal if the email exists or not.
      // Just tell the user an email has been sent if the user *might* exist.
      // This prevents enumeration attacks.
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset email has been sent.',
      });
    }

    // Generate reset token using the User model method
    const resetToken = user.getAndSavePasswordResetToken(); // This returns the plain token
    await user.save(); // Save the user with the hashed token and expiry

    // Send password reset email using the plain token
    await emailService.sendPasswordResetEmail(user.email, user.userName, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully. Please check your inbox.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email. Please try again.',
      error: error.message,
    });
  }
};
// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body; // 'token' here is the plain token from the email link

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.',
      });
    }

    // Find the user by the hashed version of the token and check validity
    const user = await User.findOne({
      'passwordResetToken.token': require('crypto').createHash('sha256').update(token).digest('hex'),
      'passwordResetToken.expiresAt': { $gt: Date.now() }
    }).select('+password'); // Select password explicitly to update it

    if (!user || !user.isPasswordResetTokenValid(token)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    // Update user's password using the model's pre-save hook for hashing
    user.password = password; // The pre-save hook will hash this new password
    user.passwordResetToken = undefined; // Clear the token after successful reset
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password. Please try again.',
      error: error.message,
    });
  }
};

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch the user to ensure they still exist and are active
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User associated with token not found.",
      });
    }

    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token.",
    });
  }
};

// Check Authentication Status
const checkAuth = async (req, res) => {
  try {
    const user = req.user; // User information already attached by authMiddleware
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Check Auth error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while checking authentication status.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  authMiddleware,
  checkAuth,
};