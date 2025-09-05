// utils/emailHelpers.js
const emailService = require('../services/emailService'); // Assuming emailService is in ../services/emailService.js

/**
 * @function notifyAdminOfNewOrder
 * @description Sends an email notification to the administrator about a new order.
 * @param {Object} order - The order object containing details like customer info, total, and order ID.
 * @returns {Promise<void>}
 */
const notifyAdminOfNewOrder = async (order) => {
  try {
    // Ensure essential order details are present
    if (!order || !order._id || !order.customerEmail || !order.totalAmount) {
      console.error('Admin notification failed: Missing essential order details.');
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com'; // Fallback admin email
    const customerName = order.customerName || 'Valued Customer';
    const customerEmail = order.customerEmail;
    const orderId = order._id.toString(); // Convert ObjectId to string
    const totalAmount = order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A';
    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A';

    // Construct the email content for the admin
    const emailSubject = `New Order Received! Order ID: ${orderId}`;
    const emailHtml = `
      <h2>New Order Alert!</h2>
      <p>A new order has been placed on your website.</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Customer Name:</strong> ${customerName}</li>
        <li><strong>Customer Email:</strong> ${customerEmail}</li>
        <li><strong>Total Amount:</strong> KSH ${totalAmount}</li>
        <li><strong>Order Date:</strong> ${orderDate}</li>
      </ul>
      <p>Please log in to the admin panel to view full order details.</p>
      <p><a href="${process.env.ADMIN_URL}/orders/${orderId}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Order Details</a></p>
      <hr>
      <p><em>This is an automated notification from Glowup Couture.</em></p>
    `;

    const emailText = `New Order Alert!\n\nA new order has been placed on your website.\nOrder ID: ${orderId}\nCustomer Name: ${customerName}\nCustomer Email: ${customerEmail}\nTotal Amount: KSH ${totalAmount}\nOrder Date: ${orderDate}\n\nView Order Details: ${process.env.ADMIN_URL}/orders/${orderId}\n\nThis is an automated notification from Glowup Couture.`;

    // Send the email using the email service
    await emailService.sendCustomEmail({
      to: adminEmail,
      subject: emailSubject,
      html: emailHtml,
      text: emailText
    });

    console.log(`Admin notified of new order: ${orderId}`);
  } catch (error) {
    console.error(`Error notifying admin of new order ${order ? order._id : 'N/A'}:`, error);
  }
};

module.exports = {
  notifyAdminOfNewOrder,
};