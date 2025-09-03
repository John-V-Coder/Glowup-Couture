const Coupon = require("../../models/Coupon");
const User = require("../../models/User");
const Order = require("../../models/Order");
const EmailSubscription = require("../../models/EmailSubscription");

// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      type,
      value,
      customerType,
      usageLimit,
      perUserLimit,
      minimumOrderAmount,
      validFrom,
      validUntil,
      autoAssign,
      autoAssignRules,
      applicableCategories,
      excludedCategories
    } = req.body;

    // Validate required fields
    if (!code || !name || !type || !value || !customerType || !validUntil) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: code, name, type, value, customerType, validUntil"
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists"
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      name,
      description,
      type,
      value,
      customerType,
      usageLimit,
      perUserLimit: perUserLimit || 1,
      minimumOrderAmount: minimumOrderAmount || 0,
      validFrom: validFrom || new Date(),
      validUntil: new Date(validUntil),
      autoAssign: autoAssign || false,
      autoAssignRules: autoAssignRules || {},
      applicableCategories: applicableCategories || [],
      excludedCategories: excludedCategories || [],
      createdBy: req.user?.id
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });

  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create coupon"
    });
  }
};

// Get all coupons with filtering
const getAllCoupons = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      isActive,
      customerType,
      type,
      search
    } = req.query;

    let filters = {};
    
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (customerType) filters.customerType = customerType;
    if (type) filters.type = type;
    if (search) {
      filters.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [coupons, totalCoupons] = await Promise.all([
      Coupon.find(filters)
        .populate('createdBy', 'userName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Coupon.countDocuments(filters)
    ]);

    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCoupons / parseInt(limit)),
        totalCoupons,
        hasNextPage: parseInt(page) < Math.ceil(totalCoupons / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons"
    });
  }
};

// Update coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Don't allow changing the code after creation
    delete updateData.code;
    delete updateData.usedCount;
    delete updateData.usedBy;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon
    });

  } catch (error) {
    console.error("Update coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update coupon"
    });
  }
};

// Delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully"
    });

  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon"
    });
  }
};

// Auto-assign coupons to eligible customers
const autoAssignCoupons = async (req, res) => {
  try {
    const results = {
      topBuyer: 0,
      subscribers: 0,
      newCustomers: 0,
      errors: []
    };

    // 1. Find top buyer (customer with most orders)
    const topBuyerData = await Order.aggregate([
      { $match: { 'billing.paymentStatus': 'Success' } },
      { $group: { _id: '$userId', orderCount: { $sum: 1 }, totalSpent: { $sum: '$billing.totalAmount' } } },
      { $sort: { orderCount: -1, totalSpent: -1 } },
      { $limit: 1 }
    ]);

    if (topBuyerData.length > 0) {
      const topBuyerId = topBuyerData[0]._id;
      
      // Create or update 30% coupon for top buyer
      const topBuyerCoupon = await Coupon.findOneAndUpdate(
        { customerType: 'top_buyer', isActive: true },
        {
          code: 'TOPBUYER30',
          name: '30% Off for Top Customer',
          description: 'Exclusive 30% discount for our most valued customer',
          type: 'percentage',
          value: 30,
          customerType: 'top_buyer',
          usageLimit: 1,
          perUserLimit: 1,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          autoAssign: true,
          autoAssignRules: { minOrderCount: topBuyerData[0].orderCount }
        },
        { upsert: true, new: true }
      );

      // Assign to top buyer if not already used
      if (!topBuyerCoupon.usedBy.some(usage => usage.userId?.toString() === topBuyerId.toString())) {
        results.topBuyer = 1;
      }
    }

    // 2. Create 20% coupon for subscribers
    const subscriberCoupon = await Coupon.findOneAndUpdate(
      { customerType: 'subscriber', isActive: true },
      {
        code: 'SUBSCRIBER20',
        name: '20% Off for Newsletter Subscribers',
        description: 'Special 20% discount for our newsletter subscribers',
        type: 'percentage',
        value: 20,
        customerType: 'subscriber',
        usageLimit: null, // Unlimited for all subscribers
        perUserLimit: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        autoAssign: true,
        autoAssignRules: { isSubscriber: true }
      },
      { upsert: true, new: true }
    );

    const subscriberCount = await EmailSubscription.countDocuments({ isActive: true });
    results.subscribers = subscriberCount;

    // 3. Create 10% coupon for new customers
    const newCustomerCoupon = await Coupon.findOneAndUpdate(
      { customerType: 'new_customer', isActive: true },
      {
        code: 'WELCOME10',
        name: '10% Off for New Customers',
        description: 'Welcome discount for first-time customers',
        type: 'percentage',
        value: 10,
        customerType: 'new_customer',
        usageLimit: null,
        perUserLimit: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        autoAssign: true,
        autoAssignRules: { isNewCustomer: true }
      },
      { upsert: true, new: true }
    );

    // Count potential new customers (users with no orders)
    const usersWithOrders = await Order.distinct('userId');
    const totalUsers = await User.countDocuments();
    const potentialNewCustomers = totalUsers - usersWithOrders.length;
    results.newCustomers = potentialNewCustomers;

    res.status(200).json({
      success: true,
      message: "Coupons auto-assigned successfully",
      data: {
        results,
        coupons: {
          topBuyer: topBuyerData.length > 0 ? {
            code: 'TOPBUYER30',
            eligibleCustomer: topBuyerData[0]._id,
            orderCount: topBuyerData[0].orderCount,
            totalSpent: topBuyerData[0].totalSpent
          } : null,
          subscriber: {
            code: 'SUBSCRIBER20',
            eligibleCount: subscriberCount
          },
          newCustomer: {
            code: 'WELCOME10',
            eligibleCount: potentialNewCustomers
          }
        }
      }
    });

  } catch (error) {
    console.error("Auto-assign coupons error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to auto-assign coupons"
    });
  }
};

// Get coupon statistics
const getCouponStats = async (req, res) => {
  try {
    const stats = await Coupon.aggregate([
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalCoupons: { $sum: 1 },
                activeCoupons: { $sum: { $cond: ['$isActive', 1, 0] } },
                expiredCoupons: { 
                  $sum: { 
                    $cond: [{ $lt: ['$validUntil', new Date()] }, 1, 0] 
                  } 
                },
                totalUsage: { $sum: '$usedCount' },
                averageDiscount: { $avg: '$value' }
              }
            }
          ],
          byCustomerType: [
            {
              $group: {
                _id: '$customerType',
                count: { $sum: 1 },
                totalUsage: { $sum: '$usedCount' },
                averageValue: { $avg: '$value' }
              }
            },
            { $sort: { count: -1 } }
          ],
          byType: [
            {
              $group: {
                _id: '$type',
                count: { $sum: 1 },
                totalUsage: { $sum: '$usedCount' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0].overview[0] || {},
        byCustomerType: stats[0].byCustomerType,
        byType: stats[0].byType
      }
    });

  } catch (error) {
    console.error("Get coupon stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon statistics"
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  autoAssignCoupons,
  getCouponStats
};