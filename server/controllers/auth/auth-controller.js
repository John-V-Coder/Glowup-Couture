const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const emailService = require("../../services/emailService");
const crypto = require('crypto');

// Generate random 6-digit code for login
const generateLoginCode = () => {
    // Generate a secure random number and format it as a 6-digit string
    const code = crypto.randomInt(100000, 999999).toString();
    return code;
};

// Step 1: Request Login - Send Code to Email
const requestLoginCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        let user = await User.findOne({ email });

        // If user does not exist, create a new user account
        if (!user) {
            // You might want to get a default username or prompt the user for one
            // For simplicity, we'll use a derived username (e.g., from email)
            const userName = email.split('@')[0]; // Simple derivation, adjust as needed

            user = new User({
                email,
                userName, // Assign the derived username
                // If you have other required fields, ensure they are set here,
                // or ensure your User model handles default values.
                // For a passwordless flow, no password field is needed initially.
            });
            await user.save();
            console.log(`New user created: ${user.email}`);
        }

        // Generate a new 6-digit login code
        const loginCode = generateLoginCode();

        // Save the login code with an expiration (e.g., 5 minutes)
        user.verificationCode = {
            code: loginCode,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
            isUsed: false,
            attempts: 0
        };
        await user.save();

        // Send the login code to the user's email
        emailService
            .sendLoginCode(user.email, user.userName, loginCode)
            .then(() => {
                console.log(`Login code sent to ${user.email}`);
            })
            .catch((error) => {
                console.error(`Failed to send login code to ${user.email}:`, error.message);
                // Optionally, if email sending fails, you might want to remove the code
                // or mark the request as failed to prevent the user from being stuck.
            });

        res.status(200).json({
            success: true,
            message: "A login code has been sent to your email. Please check your inbox.",
        });
    } catch (error) {
        console.error("Request login code error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred. Please try again.",
            error: error.message,
        });
    }
};

// Step 2: Verify Login Code and Authenticate
const verifyLoginCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "Email and login code are required.",
            });
        }

        const user = await User.findOne({ email });

        // If user or code doesn't exist, handle gracefully
        if (!user || !user.verificationCode) {
            return res.status(400).json({
                success: false,
                message: "No pending login request found for this email or email does not exist.",
            });
        }

        const verificationCode = user.verificationCode;

        // Check if code has expired
        if (verificationCode.expiresAt < Date.now()) {
            // Clear the expired code
            user.verificationCode = undefined;
            await user.save();
            return res.status(400).json({
                success: false,
                message: "Login code has expired. Please request a new one.",
            });
        }

        // Check if code has been used
        if (verificationCode.isUsed) {
            return res.status(400).json({
                success: false,
                message: "This login code has already been used.",
            });
        }

        // Check for too many failed attempts
        if (verificationCode.attempts >= 5) { // Assuming 5 attempts maximum
            // Lock out or clear code after too many attempts
            user.verificationCode = undefined; // Clear the code
            await user.save();
            return res.status(400).json({
                success: false,
                message: "Too many failed attempts. Please request a new login code.",
            });
        }

        // Validate the provided code
        if (verificationCode.code !== code) {
            user.verificationCode.attempts += 1;
            await user.save();
            return res.status(400).json({
                success: false,
                message: `Invalid code. ${5 - user.verificationCode.attempts} attempts remaining.`,
            });
        }

        // ✅ Code is valid - generate JWT token
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

        // Mark the code as used after successful login
        user.verificationCode.isUsed = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Verify login code error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during verification. Please try again.",
            error: error.message,
        });
    }
};

// Auth Middleware (remains the same as it checks the token, not the login method)
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
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User associated with token not found.",
            });
        }

        req.user = decoded;
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

// Check Authentication Status (remains the same)
const checkAuth = async (req, res) => {
    try {
        const user = req.user;
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

// New exports for the passwordless flow
module.exports = {
    requestLoginCode,
    verifyLoginCode,
    authMiddleware,
    checkAuth,
};
