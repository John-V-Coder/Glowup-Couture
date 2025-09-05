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
        <p><strong>Total Amount:</strong> KSH ${orderData.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleString()}</p>
      </div>
      
      <h3>Items Ordered:</h3>
      <ul>
        ${orderData.items.map(item => `
          <li>${item.title} - Qty: ${item.quantity} - KSH ${item.price}</li>
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
        text: `New order received: ${orderData.orderId} from ${orderData.customerName} (${orderData.customerEmail}) - Total: KSH ${orderData.totalAmount}`
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
      <h2>⚠️ Low Stock Alert!</h2>
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p><strong>Product:</strong> ${productData.title}</p>
        <p><strong>Current Stock:</strong> <span style="color: #856404; font-weight: bold;">${productData.currentStock} units</span></p>
        <p><strong>Product ID:</strong> ${productData.productId}</p>
        <p><strong>Category:</strong> ${productData.category}</p>
        <p><strong>Brand:</strong> ${productData.brand || 'N/A'}</p>
        <p><strong>Threshold:</strong> ${process.env.LOW_STOCK_THRESHOLD || 5} units</p>
      </div>
      
      <p><strong>Action Required:</strong> Please consider restocking this item to avoid stockouts.</p>
      <p>This product is running low and may need immediate attention to prevent lost sales.</p>
    `;

    for (const adminEmail of adminEmails) {
      await emailService.sendCustomEmail({
        to: adminEmail.trim(),
        subject: `⚠️ Low Stock Alert: ${productData.title} - Glowup Couture`,
        html: emailContent,
        text: `Low stock alert: ${productData.title} has only ${productData.currentStock} units left. Product ID: ${productData.productId}`
      });
    }

    console.log(`Low stock alert sent for product ${productData.title}`);
  } catch (error) {
    console.error('Failed to send low stock alert:', error.message);
  }
};

// Helper function to send out of stock alerts
const notifyAdminOfOutOfStock = async (productData) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    if (adminEmails.length === 0) return;

    const emailContent = `
      <h2>🚨 Out of Stock Alert!</h2>
      <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
        <p><strong>Product:</strong> ${productData.title}</p>
        <p><strong>Current Stock:</strong> <span style="color: #f44336; font-weight: bold;">0 units</span></p>
        <p><strong>Product ID:</strong> ${productData.productId}</p>
        <p><strong>Category:</strong> ${productData.category}</p>
        <p><strong>Brand:</strong> ${productData.brand || 'N/A'}</p>
        <p><strong>Status:</strong> <span style="color: #f44336;">OUT OF STOCK</span></p>
      </div>
      
      <p><strong>⚠️ URGENT:</strong> This item is completely out of stock and needs immediate restocking!</p>
      <p>Consider marking this item as unavailable until restocked to prevent customer disappointment.</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Recommended Actions:</strong></p>
        <ul>
          <li>Contact suppliers for immediate restocking</li>
          <li>Update product availability on website</li>
          <li>Notify customers on waitlist (if applicable)</li>
        </ul>
      </div>
    `;

    for (const adminEmail of adminEmails) {
      await emailService.sendCustomEmail({
        to: adminEmail.trim(),
        subject: `🚨 OUT OF STOCK: ${productData.title} - Glowup Couture`,
        html: emailContent,
        text: `URGENT: ${productData.title} is OUT OF STOCK! Product ID: ${productData.productId}. Immediate restocking required.`
      });
    }

    console.log(`Out of stock alert sent for product ${productData.title}`);
  } catch (error) {
    console.error('Failed to send out of stock alert:', error.message);
  }
};

// Helper function to send stock update notifications (for significant changes)
const notifyAdminOfStockUpdate = async (updateData) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    if (adminEmails.length === 0) return;

    const isIncrease = updateData.newStock > updateData.oldStock;
    const changeAmount = Math.abs(updateData.newStock - updateData.oldStock);
    const changeIcon = isIncrease ? '📈' : '📉';
    const changeColor = isIncrease ? '#28a745' : '#ffc107';

    const emailContent = `
      <h2>${changeIcon} Stock Update Notification</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Product:</strong> ${updateData.productTitle}</p>
        <p><strong>Product ID:</strong> ${updateData.productId}</p>
        <p><strong>Previous Stock:</strong> ${updateData.oldStock} units</p>
        <p><strong>New Stock:</strong> <span style="color: ${changeColor}; font-weight: bold;">${updateData.newStock} units</span></p>
        <p><strong>Change:</strong> <span style="color: ${changeColor};">${isIncrease ? '+' : '-'}${changeAmount} units</span></p>
        <p><strong>Operation:</strong> ${updateData.operation}</p>
        ${updateData.reason ? `<p><strong>Reason:</strong> ${updateData.reason}</p>` : ''}
        <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <p><em>Stock levels have been updated in the system.</em></p>
    `;

    for (const adminEmail of adminEmails) {
      await emailService.sendCustomEmail({
        to: adminEmail.trim(),
        subject: `${changeIcon} Stock Update: ${updateData.productTitle} - Glowup Couture`,
        html: emailContent,
        text: `Stock update: ${updateData.productTitle} changed from ${updateData.oldStock} to ${updateData.newStock} units (${updateData.operation})`
      });
    }

    console.log(`Stock update notification sent for product ${updateData.productTitle}`);
  } catch (error) {
    console.error('Failed to send stock update notification:', error.message);
  }
};

// Helper function to send bulk stock update summary
const notifyAdminOfBulkStockUpdate = async (bulkData) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    if (adminEmails.length === 0) return;

    const { results, summary } = bulkData;
    const successfulUpdates = results.filter(r => r.success);
    const failedUpdates = results.filter(r => !r.success);

    const emailContent = `
      <h2>📊 Bulk Stock Update Summary</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Total Products Processed:</strong> ${results.length}</p>
        <p><strong>Successful Updates:</strong> <span style="color: #28a745;">${successfulUpdates.length}</span></p>
        <p><strong>Failed Updates:</strong> <span style="color: #dc3545;">${failedUpdates.length}</span></p>
        <p><strong>Update Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      ${successfulUpdates.length > 0 ? `
        <h3>✅ Successful Updates:</h3>
        <ul>
          ${successfulUpdates.map(update => `
            <li><strong>${update.productTitle}</strong> - ${update.oldStock} → ${update.newStock} units (${update.operation})</li>
          `).join('')}
        </ul>
      ` : ''}
      
      ${failedUpdates.length > 0 ? `
        <h3>❌ Failed Updates:</h3>
        <ul>
          ${failedUpdates.map(update => `
            <li><strong>Product ID:</strong> ${update.productId} - <em>${update.message}</em></li>
          `).join('')}
        </ul>
      ` : ''}
      
      <p><em>Bulk stock update operation completed.</em></p>
    `;

    for (const adminEmail of adminEmails) {
      await emailService.sendCustomEmail({
        to: adminEmail.trim(),
        subject: `📊 Bulk Stock Update Summary - ${successfulUpdates.length}/${results.length} Updated - Glowup Couture`,
        html: emailContent,
        text: `Bulk stock update completed: ${successfulUpdates.length} successful, ${failedUpdates.length} failed out of ${results.length} total products.`
      });
    }

    console.log(`Bulk stock update summary sent to admins`);
  } catch (error) {
    console.error('Failed to send bulk stock update summary:', error.message);
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
  notifyAdminOfOutOfStock,
  notifyAdminOfStockUpdate,
  notifyAdminOfBulkStockUpdate,
  sendCustomerFollowUp
};