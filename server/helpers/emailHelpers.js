const emailService = require('../services/emailService');

// Helper function to send notification emails to admins
const notifyAdminOfNewOrder = async (orderData) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    if (adminEmails.length === 0) {
      console.log('No admin emails configured for order notifications');
      return;
    }

    const emailContent = `
      <h2>🛍️ New Order Received!</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Customer:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Total Amount:</strong> KES ${orderData.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleString()}</p>
      </div>
      
      <h3>Items Ordered:</h3>
      <ul>
        ${orderData.items.map(item => `
          <li>${item.title} - Qty: ${item.quantity} - KES ${item.price}</li>
        `).join('')}
      </ul>
      
      <h3>Shipping Address:</h3>
      <p>${orderData.shippingAddress}</p>
      
      <p><em>Please process this order promptly.</em></p>
    `;

    // Send to all admin emails
    for (const adminEmail of adminEmails) {
      await emailService.sendCustomEmail({
        to: adminEmail.trim(),
        subject: `New Order #${orderData.orderId} - Glowup Couture`,
        html: emailContent,
        text: `New order received: ${orderData.orderId} from ${orderData.customerName} (${orderData.customerEmail}) - Total: KES ${orderData.totalAmount}`
      });
    }

    console.log(`Admin notification emails sent for order ${orderData.orderId}`);
  } catch (error) {
    console.error('Failed to send admin notification emails:', error.message);
  }
};

// Helper function to send low stock alerts
const notifyAdminOfLowStock = async (productData) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    if (adminEmails.length === 0) return;

    const emailContent = `
      <h2>Low Stock Alert!</h2>
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p><strong>Product:</strong> ${productData.title}</p>
        <p><strong>Current Stock:</strong> ${productData.currentStock} units</p>
        <p><strong>Product ID:</strong> ${productData.productId}</p>
        <p><strong>Category:</strong> ${productData.category}</p>
      </div>
      
      <p>Please consider restocking this item to avoid stockouts.</p>
    `;

    for (const adminEmail of adminEmails) {
      await emailService.sendCustomEmail({
        to: adminEmail.trim(),
        subject: `Low Stock Alert: ${productData.title} - Glowup Couture`,
        html: emailContent,
        text: `Low stock alert: ${productData.title} has only ${productData.currentStock} units left.`
      });
    }

    console.log(`Low stock alert sent for product ${productData.title}`);
  } catch (error) {
    console.error('Failed to send low stock alert:', error.message);
  }
};

// Helper function to send customer service follow-up emails
const sendCustomerFollowUp = async (customerData) => {
  try {
    const emailContent = `
      <h2>How was your Glowup Couture experience? 💫</h2>
      <p>Dear ${customerData.userName},</p>
      
      <p>We hope you're loving your recent purchase from Glowup Couture!</p>
      
      <p>We'd love to hear about your experience. Your feedback helps us improve and serve you better.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.CLIENT_URL}/shop/product/${customerData.productId}" style="background: linear-gradient(135deg, #DAA520, #B8860B); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Leave a Review
        </a>
      </div>
      
      <p>Thank you for choosing Glowup Couture!</p>
      
      <p>Best regards,<br>The Glowup Couture Team</p>
    `;

    await emailService.sendCustomEmail({
      to: customerData.email,
      subject: 'How was your Glowup Couture experience? ⭐',
      html: emailContent,
      text: `Dear ${customerData.userName}, we hope you're loving your recent purchase! Please consider leaving a review at ${process.env.CLIENT_URL}/shop/product/${customerData.productId}`
    });

    console.log(`Follow-up email sent to ${customerData.email}`);
  } catch (error) {
    console.error('Failed to send follow-up email:', error.message);
  }
};

module.exports = {
  notifyAdminOfNewOrder,
  notifyAdminOfLowStock,
  sendCustomerFollowUp
};