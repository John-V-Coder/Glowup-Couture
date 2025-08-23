const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  checkAuth, 
  requestPasswordReset,
  verifyResetCode,
  resetPassword, 
} = require("../../controllers/auth/auth-controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware,checkAuth);
// Password reset routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;
