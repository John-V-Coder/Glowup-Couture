const Order = require("../../models/Order");
const User = require("../../models/User");
const emailService = require("../../services/emailService");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

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
    console.log(e);
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

    let order = await Order.findById(id);  // use let instead of const

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // update and get the updated document
    order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }  // ensures updated doc is returned
    );

    // Send order status update email
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
          console.log(`✅ Order status email sent for order ${id}`);
        }
      } catch (error) {
        console.error(`❌ Failed to send order status email:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
