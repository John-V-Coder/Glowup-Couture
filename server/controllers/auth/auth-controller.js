const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User"); 
const emailService = require("../../services/emailService"); 

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

    // Hash password before saving
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
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

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

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
  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Generate random 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates 6-digit code
};

// Request Password Reset - Send Code to Email
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
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset code has been sent.',
      });
    }

    // Generate 6-digit reset code
    const resetCode = generateResetCode();

    // Save the reset code with expiration (15 minutes)
    user.passwordResetCode = {
      token: resetCode,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      attempts: 0,
      isUsed: false
    };
    
    await user.save();

    // Send password reset email with the code
    await emailService.sendPasswordResetEmail(user.email, user.userName, resetCode);

    res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email. Please check your inbox.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset code. Please try again.',
      error: error.message,
    });
  }
};

// Verify Reset Code
const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required.',
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.passwordResetCode) {
      return res.status(400).json({
        success: false,
        message: 'No password reset request found for this email.',
      });
    }

    const resetCode = user.passwordResetCode;

    // Check if code has expired
    if (resetCode.expiresAt < Date.now()) {
      user.passwordResetCode = undefined;
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'Reset code has expired. Please request a new one.',
      });
    }

    // Check if code has been used
    if (resetCode.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'This reset code has already been used.',
      });
    }

    // Check if too many attempts
    if (resetCode.attempts >= 5) {
      user.passwordResetCode = undefined;
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new reset code.',
      });
    }

    // Check if code matches
    if (resetCode.token !== code) {
      user.passwordResetCode.attempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${5 - user.passwordResetCode.attempts} attempts remaining.`,
      });
    }

    // ✅ Code is valid - generate temporary token
    const resetToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        purpose: 'password_reset'
      },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.status(200).json({
      success: true,
      message: 'Code verified successfully. You can now reset your password.',
      resetToken
    });

  } catch (error) {
    console.error('Code verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code. Please try again.',
      error: error.message,
    });
  }
};

// Reset Password with New Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required.',
      });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    // Check if token is for password reset
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token.',
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Check if reset code is still valid and not used
    if (!user.passwordResetCode || user.passwordResetCode.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'Reset session is invalid or has expired.',
      });
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password and mark code as used
    user.password = hashedPassword;
    user.passwordResetCode.isUsed = true; // Mark as used but don't delete yet for audit trail
    await user.save();

    // Clear the reset code after successful password change (optional)
    setTimeout(async () => {
      try {
        await User.findByIdAndUpdate(user._id, { 
          $unset: { passwordResetCode: 1 } 
        });
      } catch (err) {
        console.error('Error clearing reset code:', err);
      }
    }, 5000); // Clear after 5 seconds

    res.status(200).json({
      success: true,
      message: 'Your password has been reset successfully. You can now log in with your new password.',
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
  verifyResetCode,
  resetPassword,
  authMiddleware,
  checkAuth,
};