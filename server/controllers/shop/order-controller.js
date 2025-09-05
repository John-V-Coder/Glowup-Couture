const paystackService = require("../../helpers/paystack");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const emailService = require("../../services/emailService");
const { applyCouponToOrder } = require("./coupon-controller");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      shipmentMethod,
      paymentMethod,
      totalAmount,
      cartId,
      couponCode,
      customerEmail,
      customerName,
    } = req.body;

    // Generate unique reference for Paystack
    const reference = `GC_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // Create order first
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      shipmentMethod,
      orderStatus: 'Pending',
      billing: {
        paymentMethod,
        paymentStatus: 'Pending',
        totalAmount,
        paystackReference: reference,
        couponCode: couponCode || null,
        discountAmount: 0
      },
      orderDate: new Date(),
      orderUpdateDate: new Date(),
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
      }
    }

    await newlyCreatedOrder.save();

    // Initialize Paystack transaction
    try {
      const paystackData = {
        reference: reference,
        amount: Math.round(newlyCreatedOrder.billing.totalAmount * 100), // Convert to kobo
        email: customerEmail || (userId ? (await User.findById(userId))?.email : ''),
        currency: 'KES',
        callback_url: `${process.env.CLIENT_URL}/shop/payment-success`,
        metadata: {
          orderId: newlyCreatedOrder._id.toString(),
          userId: userId || 'guest',
          customerName: customerName || 'Guest Customer',
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: newlyCreatedOrder._id.toString()
            }
          ]
        }
      };

      console.log("Paystack Data being sent:", paystackData);
      const paystackResponse = await paystackService.initializeTransaction(paystackData);
      console.log("Paystack Response:", paystackResponse);

      if (paystackResponse.status) {
        // Send order confirmation email asynchronously
        if (userId) {
          User.findById(userId)
            .then(user => {
              if (user && user.email) {
                const orderData = {
                  userName: user.userName,
                  orderId: newlyCreatedOrder._id,
                  total: newlyCreatedOrder.billing.totalAmount,
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

        res.status(201).json({
          success: true,
          approvalURL: paystackResponse.data.authorization_url,
          orderId: newlyCreatedOrder._id,
          reference: reference,
          accessCode: paystackResponse.data.access_code,
        });
      } else {
        throw new Error(paystackResponse.message || 'Failed to initialize payment');
      }
    } catch (paystackError) {
      console.error('Paystack initialization error:', paystackError);
      
      // Update order status to failed
      newlyCreatedOrder.orderStatus = 'Failed';
      newlyCreatedOrder.billing.paymentStatus = 'Failed';
      await newlyCreatedOrder.save();
      
      return res.status(500).json({
        success: false,
        message: "Error while creating payment session",
        error: paystackError.message
      });
    }
  } catch (e) {
    console.error('Create order error:', e);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the order",
      error: e.message
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { orderId, reference } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify payment with Paystack
    try {
      const verificationResponse = await paystackService.verifyTransaction(reference);
      
      if (!verificationResponse.status || !verificationResponse.data) {
        throw new Error('Payment verification failed');
      }
      
      const paymentData = verificationResponse.data;
      const isPaymentVerified = paymentData.status === 'success' && 
                               paymentData.amount === Math.round(order.billing.totalAmount * 100);

      if (isPaymentVerified) {
        order.orderStatus = "Processing";
        order.billing.paymentStatus = "Success";
        order.billing.paystackReference = reference;
        order.billing.authorizationCode = paymentData.authorization?.authorization_code;

        // Update totalStock for each product
        for (let item of order.cartItems) {
          let product = await Product.findById(item.productId);

          if (!product) {
            return res.status(404).json({
              success: false,
              message: `Product with ID ${item.productId} not found`,
            });
          }

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

        await order.save();

        res.status(200).json({
          success: true,
          message: "Order and payment confirmed successfully",
          data: order,
        });
      } else {
        order.orderStatus = "Failed";
        order.billing.paymentStatus = "Failed";
        await order.save();
        
        res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });
      }
    } catch (verificationError) {
      console.error('Payment verification error:', verificationError);
      
      order.orderStatus = "Failed";
      order.billing.paymentStatus = "Failed";
      await order.save();

      res.status(200).json({
        success: false,
        message: "Payment verification failed",
        error: verificationError.message
      });
    }
  } catch (e) {
    console.error('Capture payment error:', e);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing payment",
      error: e.message
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

// New webhook endpoint for Paystack
const handlePaystackWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    
    if (!paystackService.verifyWebhookSignature(req.body, signature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    const event = req.body;
    
    if (event.event === 'charge.success') {
      const { reference, status, amount } = event.data;
      
      // Find order by reference
      const order = await Order.findOne({ 'billing.paystackReference': reference });
      
      if (order && status === 'success') {
        order.orderStatus = "Processing";
        order.billing.paymentStatus = "Success";
        order.billing.authorizationCode = event.data.authorization?.authorization_code;
        
        // Update product stock
        for (let item of order.cartItems) {
          let product = await Product.findById(item.productId);
          if (product && product.totalStock >= item.quantity) {
            product.totalStock -= item.quantity;
            await product.save();
          }
        }
        
        // Delete cart
        await Cart.findByIdAndDelete(order.cartId);
        await order.save();
        
        console.log(`Payment confirmed for order ${order._id}`);
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  handlePaystackWebhook,
};