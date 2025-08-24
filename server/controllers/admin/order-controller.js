const Order = require("../../models/Order");
const User = require("../../models/User");
const emailService = require("../../services/emailService");
const { notifyAdminOfNewOrder} = require("../../utils/emailNewOrderAdminHelpers");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'userName email');

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error('Error fetching all orders:', e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('userId', 'userName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error('Error fetching order details:', e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    let order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const previousStatus = order.orderStatus;

    // Update order status
    order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    // Send order status update email to customer
    if (order && order.userId) {
      try {
        const user = await User.findById(order.userId);

        if (user && user.email) {
          const orderData = {
            userName: user.userName,
            orderId: order._id,
            status: orderStatus,
            trackingNumber: order.trackingNumber || null,
          };

          await emailService.sendOrderStatusEmail(user.email, orderData);
          console.log(`Order status email sent to customer for order ${id}`);
        }
      } catch (error) {
        console.error(`Failed to send order status email to customer:`, error.message);
      }
    }

    // Notify admin of status change if it's a significant update
    if (shouldNotifyAdminOfStatusChange(previousStatus, orderStatus)) {
      try {
        await notifyAdminOfStatusChange(order, previousStatus, orderStatus);
      } catch (error) {
        console.error('Failed to notify admin of status change:', error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.error('Error updating order status:', e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// New function to handle manual admin order notifications
const sendAdminOrderNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('userId', 'userName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const user = await User.findById(order.userId);
    
    // Prepare order data for notification
    const orderData = {
      orderId: order._id,
      customerName: user ? user.userName : 'N/A',
      customerEmail: user ? user.email : order.customerEmail || 'N/A',
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod || 'N/A',
      orderDate: order.createdAt,
      items: order.cartItems.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: formatShippingAddress(order.addressInfo)
    };

    await notifyAdminOfNewOrder(orderData);

    res.status(200).json({
      success: true,
      message: "Admin notification sent successfully!",
    });
  } catch (e) {
    console.error('Error sending admin notification:', e);
    res.status(500).json({
      success: false,
      message: "Failed to send admin notification!",
    });
  }
};

// New function to get order statistics for admin dashboard
const getOrderStatistics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'inProcess' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'inShipping' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get recent orders (last 10)
    const recentOrders = await Order.find({})
      .populate('userId', 'userName email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalOrders,
          pendingOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          totalRevenue
        },
        recentOrders
      },
    });
  } catch (e) {
    console.error('Error fetching order statistics:', e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Helper function to determine if admin should be notified of status change
const shouldNotifyAdminOfStatusChange = (previousStatus, newStatus) => {
  const notificationTriggers = ['cancelled', 'returned', 'refunded'];
  return notificationTriggers.includes(newStatus) || 
         (previousStatus === 'delivered' && newStatus !== 'delivered');
};

// Helper function to notify admin of status changes
const notifyAdminOfStatusChange = async (order, previousStatus, newStatus) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    
    if (adminEmails.length === 0) return;

    const user = await User.findById(order.userId);
    const customerName = user ? user.userName : 'N/A';
    const customerEmail = user ? user.email : order.customerEmail || 'N/A';

    const emailContent = `
      <h2>🔄 Order Status Changed</h2>
      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Previous Status:</strong> <span style="color: #666;">${previousStatus}</span></p>
        <p><strong>New Status:</strong> <span style="color: #1976d2; font-weight: bold;">${newStatus}</span></p>
        <p><strong>Total Amount:</strong> KES ${order.totalAmount}</p>
        <p><strong>Date Changed:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      ${newStatus === 'cancelled' || newStatus === 'returned' ? 
        '<p style="color: #d32f2f;"><strong>⚠️ This order requires attention!</strong></p>' : ''}
      
      <p><em>Order status updated in the system.</em></p>
    `;

    for (const adminEmail of adminEmails) {
      await emailService.sendCustomEmail({
        to: adminEmail.trim(),
        subject: `Order Status Update: #${order._id} - ${newStatus.toUpperCase()}`,
        html: emailContent,
        text: `Order ${order._id} status changed from ${previousStatus} to ${newStatus} for customer ${customerName}`
      });
    }

    console.log(`Admin notified of status change for order ${order._id}`);
  } catch (error) {
    console.error('Error notifying admin of status change:', error);
  }
};

// Helper function to format shipping address
const formatShippingAddress = (addressInfo) => {
  if (!addressInfo) return 'N/A';
  
  return `${addressInfo.address || ''}, ${addressInfo.city || ''}, ${addressInfo.state || ''}, ${addressInfo.country || ''} - ${addressInfo.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '');
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  sendAdminOrderNotification,
  getOrderStatistics,
};