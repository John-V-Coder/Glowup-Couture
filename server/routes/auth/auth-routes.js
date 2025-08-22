const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  checkAuth, 
  requestPasswordReset,
  resetPassword, 
} = require("../../controllers/auth/auth-controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware,checkAuth);
// Password reset routes
router.post("/password-reset-request", requestPasswordReset);
router.post("/password-reset", resetPassword);

module.exports = router;
