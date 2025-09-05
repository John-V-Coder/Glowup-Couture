const Coupon = require("../../models/Coupon");
const User = require("../../models/User");
const Order = require("../../models/Order");
const EmailSubscription = require("../../models/EmailSubscription");

// Validate and apply coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, userId, orderAmount, cartItems = [] } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required"
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code"
      });
    }

    // Check if coupon is expired
    if (coupon.isExpired) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired"
      });
    }

    // Check if coupon has reached usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon has reached its usage limit"
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of KSH ${coupon.minimumOrderAmount} required`
      });
    }

    // Check user eligibility if userId provided
    if (userId) {
      // Check if user can use this coupon
      if (!coupon.canUserUse(userId)) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon"
        });
      }

      // Check customer type eligibility
      const isEligible = await checkCustomerEligibility(userId, coupon.customerType);
      if (!isEligible) {
        return res.status(400).json({
          success: false,
          message: "You are not eligible for this coupon"
        });
      }
    }

    // Check product/category restrictions
    if (coupon.applicableCategories.length > 0 || coupon.excludedCategories.length > 0) {
      const cartCategories = [...new Set(cartItems.map(item => item.category?.toLowerCase()).filter(Boolean))];
      
      if (coupon.applicableCategories.length > 0) {
        const hasApplicableCategory = cartCategories.some(cat => 
          coupon.applicableCategories.includes(cat)
        );
        if (!hasApplicableCategory) {
          return res.status(400).json({
            success: false,
            message: "This coupon is not applicable to items in your cart"
          });
        }
      }

      if (coupon.excludedCategories.length > 0) {
        const hasExcludedCategory = cartCategories.some(cat => 
          coupon.excludedCategories.includes(cat)
        );
        if (hasExcludedCategory) {
          return res.status(400).json({
            success: false,
            message: "This coupon cannot be applied to some items in your cart"
          });
        }
      }
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(orderAmount);
    const finalAmount = orderAmount - discountAmount;

    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: {
        coupon: {
          id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value,
          description: coupon.description
        },
        discount: {
          amount: discountAmount,
          percentage: coupon.type === 'percentage' ? coupon.value : (discountAmount / orderAmount) * 100,
          originalAmount: orderAmount,
          finalAmount: finalAmount
        }
      }
    });

  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate coupon"
    });
  }
};

// Apply coupon to order (called during order creation)
const applyCouponToOrder = async (couponCode, userId, orderId, orderAmount) => {
  try {
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true 
    });

    if (!coupon || !coupon.isValid) {
      throw new Error("Invalid or expired coupon");
    }

    if (userId && !coupon.canUserUse(userId)) {
      throw new Error("Coupon already used by this user");
    }

    const discountAmount = coupon.calculateDiscount(orderAmount);

    // Record usage
    coupon.usedCount += 1;
    coupon.usedBy.push({
      userId: userId || null,
      orderId,
      discountAmount,
      usedAt: new Date()
    });

    await coupon.save();

    return {
      discountAmount,
      couponDetails: {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value
      }
    };

  } catch (error) {
    console.error("Apply coupon error:", error);
    throw error;
  }
};

// Get available coupons for a user
const getAvailableCoupons = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Get user's order history and subscription status
    const [userOrders, isSubscriber] = await Promise.all([
      Order.find({ userId, 'billing.paymentStatus': 'Success' }),
      EmailSubscription.findOne({ email: { $exists: true } }) // You might need to adjust this query
    ]);

    const orderCount = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.billing?.totalAmount || 0), 0);
    const isNewCustomer = orderCount === 0;

    // Find applicable coupons
    const now = new Date();
    let availableCoupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
      ]
    });

    // Filter coupons based on user eligibility
    availableCoupons = availableCoupons.filter(coupon => {
      // Check if user can still use this coupon
      if (!coupon.canUserUse(userId)) return false;

      // Check customer type eligibility
      switch (coupon.customerType) {
        case 'top_buyer':
          // Check if this user is the current top buyer
          return checkIfTopBuyer(userId, orderCount, totalSpent);
        case 'subscriber':
          return !!isSubscriber;
        case 'new_customer':
          return isNewCustomer;
        case 'general':
          return true;
        default:
          return false;
      }
    });

    res.status(200).json({
      success: true,
      data: availableCoupons.map(coupon => ({
        id: coupon._id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minimumOrderAmount: coupon.minimumOrderAmount,
        validUntil: coupon.validUntil,
        customerType: coupon.customerType
      }))
    });

  } catch (error) {
    console.error("Get available coupons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available coupons"
    });
  }
};

// Helper function to check customer eligibility
const checkCustomerEligibility = async (userId, customerType) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    switch (customerType) {
      case 'top_buyer':
        return await checkIfTopBuyer(userId);
      case 'subscriber':
        const subscription = await EmailSubscription.findOne({ 
          email: user.email,
          isActive: true 
        });
        return !!subscription;
      case 'new_customer':
        const orderCount = await Order.countDocuments({ 
          userId,
          'billing.paymentStatus': 'Success' 
        });
        return orderCount === 0;
      case 'general':
        return true;
      default:
        return false;
    }
  } catch (error) {
    console.error("Check customer eligibility error:", error);
    return false;
  }
};

// Helper function to check if user is top buyer
const checkIfTopBuyer = async (userId, userOrderCount = null, userTotalSpent = null) => {
  try {
    // Get user's stats if not provided
    if (userOrderCount === null || userTotalSpent === null) {
      const userStats = await Order.aggregate([
        { $match: { userId: userId, 'billing.paymentStatus': 'Success' } },
        { $group: { _id: null, orderCount: { $sum: 1 }, totalSpent: { $sum: '$billing.totalAmount' } } }
      ]);
      
      if (userStats.length === 0) return false;
      userOrderCount = userStats[0].orderCount;
      userTotalSpent = userStats[0].totalSpent;
    }

    // Get top buyer stats
    const topBuyerStats = await Order.aggregate([
      { $match: { 'billing.paymentStatus': 'Success' } },
      { $group: { _id: '$userId', orderCount: { $sum: 1 }, totalSpent: { $sum: '$billing.totalAmount' } } },
      { $sort: { orderCount: -1, totalSpent: -1 } },
      { $limit: 1 }
    ]);

    if (topBuyerStats.length === 0) return false;

    const topBuyer = topBuyerStats[0];
    return topBuyer._id.toString() === userId.toString();

  } catch (error) {
    console.error("Check top buyer error:", error);
    return false;
  }
};

module.exports = {
  validateCoupon,
  applyCouponToOrder,
  getAvailableCoupons,
  checkCustomerEligibility
};