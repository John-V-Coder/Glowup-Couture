const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const emailService = require("../../services/emailService");
const { applyCouponToOrder } = require("./coupon-controller");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      shipmentMethod, // <-- NEW: Include shipmentMethod from the request body
      paymentMethod,
      totalAmount,
      cartId,
      couponCode, // <-- NEW: Include coupon code
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: Number(item.price).toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: Number(totalAmount).toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          shipmentMethod, // <-- NEW: Save the shipmentMethod
          orderStatus: 'Pending', // <-- UPDATED: Default order status
          billing: { // <-- NEW: Nested billing object
            paymentMethod,
            paymentStatus: 'Pending', // <-- UPDATED: Default payment status
            totalAmount,
            paystackReference: paymentInfo.id, // <-- UPDATED: Use a meaningful name and save the PayPal ID
            couponCode: couponCode || null,
            discountAmount: 0
          },
          orderDate: new Date(), // <-- UPDATED: Use a new Date object
          orderUpdateDate: new Date(), // <-- UPDATED: Use a new Date object
        });

        // Apply coupon if provided
        if (couponCode) {
          try {
            const couponResult = await applyCouponToOrder(couponCode, userId, newlyCreatedOrder._id, totalAmount);
            newlyCreatedOrder.billing.couponCode = couponCode;
            newlyCreatedOrder.billing.discountAmount = couponResult.discountAmount;
            newlyCreatedOrder.billing.totalAmount = totalAmount - couponResult.discountAmount;
          } catch (couponError) {
            console.error("Coupon application failed:", couponError.message);
            // Continue with order creation even if coupon fails
          }
        }
        await newlyCreatedOrder.save();
        // Send order confirmation email asynchronously
        if (userId) {
          User.findById(userId)
            .then(user => {
              if (user && user.email) {
                const orderData = {
                  userName: user.userName,
                  orderId: newlyCreatedOrder._id,
                  total: totalAmount,
                  shippingAddress: `${addressInfo?.address}, ${addressInfo?.city}, ${addressInfo?.pincode}`,
                  estimatedDelivery: 'Within 3-5 business days'
                };
                
                return emailService.sendOrderConfirmationEmail(user.email, orderData);
              }
            })
            .then(() => {
              console.log(`Order confirmation email sent for order ${newlyCreatedOrder._id}`);
            })
            .catch((error) => {
              console.error(`Failed to send order confirmation email:`, error.message);
            });
        }

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // You should use a webhook to verify the payment, not the client-provided paymentId and payerId.
    // For this example, we'll simulate a successful payment verification.
    const isPaymentVerified = true; // In a real app, this would be a call to a payment gateway API.

    if (isPaymentVerified) {
      order.orderStatus = "Processing"; // Set a more specific status
      order.billing.paymentStatus = "Success"; // <-- UPDATED: Access the nested field
      order.billing.paystackReference = req.body.paymentId; // <-- UPDATED: Access the nested field

      // Note: The payerId is not always a direct concept in some payment gateways
      // but can be stored if the gateway provides it. For this example, it's optional.

      // Update totalStock for each product
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
        }

        // Check if there is enough stock
        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product: ${product.title}`,
          });
        }

        product.totalStock -= item.quantity;
        await product.save();
      }

      // Delete the cart
      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId);

      // Save the updated order
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order and payment confirmed successfully",
        data: order,
      });
    } else {
      // Handle the case where the payment verification failed
      order.orderStatus = "Failed";
      order.billing.paymentStatus = "Failed";
      await order.save();
      res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "An error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

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

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
