const express = require("express");
const {
  requestLoginCode,
  verifyLoginCode,
  authMiddleware,
  checkAuth,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Route to request a login code via email
router.post("/request-login-code", requestLoginCode);

// Route to verify the login code and get a token
router.post("/verify-login-code", verifyLoginCode);

// Protected route to check authentication status
router.get("/check-auth", authMiddleware, checkAuth);

module.exports = router;