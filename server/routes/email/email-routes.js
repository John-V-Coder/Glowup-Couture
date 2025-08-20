const express = require("express");
const {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  requestPasswordReset,
  resetPassword,
  sendSupportEmail,
  sendMarketingCampaign,
  getEmailTemplates,
  saveEmailTemplate,
  sendOrderNotification,
  getNewsletterSubscribers
} = require("../../controllers/email/emailController");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Newsletter routes
router.post("/subscribe", subscribeToNewsletter);
router.get("/unsubscribe", unsubscribeFromNewsletter);

// Password reset routes
router.post("/password-reset-request", requestPasswordReset);
router.post("/password-reset", resetPassword);

// Support routes
router.post("/support", sendSupportEmail);

// Order notification routes
router.post("/order-notification", sendOrderNotification);

// Marketing routes (admin only - you may want to add auth middleware)
router.post("/marketing-campaign", authMiddleware, sendMarketingCampaign);

// Template management routes (admin only)
router.get("/templates", authMiddleware, getEmailTemplates);
router.post("/templates", authMiddleware, saveEmailTemplate);

// Newsletter management routes (admin only)
router.get("/subscribers", authMiddleware, getNewsletterSubscribers);

module.exports = router;