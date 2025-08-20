const emailService = require('../services/emailService');

// Middleware to automatically send welcome email after user registration
const sendWelcomeEmailMiddleware = async (req, res, next) => {
  // Store original res.json to intercept successful registration
  const originalJson = res.json;
  
  res.json = function(data) {
    // Check if this is a successful registration response
    if (data.success && req.route.path === '/register' && req.body.email && req.body.userName) {
      // Send welcome email asynchronously (don't block the response)
      emailService.sendWelcomeEmail(req.body.email, req.body.userName)
        .then(() => {
          console.log(`✅ Welcome email sent to ${req.body.email}`);
        })
        .catch((error) => {
          console.error(`❌ Failed to send welcome email to ${req.body.email}:`, error.message);
        });
    }
    
    // Call original res.json with the data
    return originalJson.call(this, data);
  };
  
  next();
};

// Middleware to send order confirmation emails
const sendOrderEmailMiddleware = async (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Check if this is a successful order creation
    if (data.success && req.route.path === '/create' && req.body.userId) {
      // Get user email and send order confirmation
      const User = require('../models/User');
      User.findById(req.body.userId)
        .then(user => {
          if (user && user.email) {
            const orderData = {
              userName: user.userName,
              orderId: data.orderId || 'N/A',
              total: req.body.totalAmount || 0,
              shippingAddress: `${req.body.addressInfo?.address}, ${req.body.addressInfo?.city}`,
              estimatedDelivery: 'Within 3-5 business days'
            };
            
            return emailService.sendOrderConfirmationEmail(user.email, orderData);
          }
        })
        .then(() => {
          console.log(`✅ Order confirmation email sent`);
        })
        .catch((error) => {
          console.error(`❌ Failed to send order confirmation email:`, error.message);
        });
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = {
  sendWelcomeEmailMiddleware,
  sendOrderEmailMiddleware
};