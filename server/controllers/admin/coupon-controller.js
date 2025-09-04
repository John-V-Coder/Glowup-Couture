const Coupon = require("../../models/Coupon");
const User = require("../../models/User");
const Order = require("../../models/Order");
const EmailSubscription = require("../../models/EmailSubscription");
const emailService = require("../../services/emailService");

// Helper: compute active status
const computeIsActive = (validFrom, validUntil) => {
  const now = new Date();
  return (!validFrom || now >= new Date(validFrom)) && now <= new Date(validUntil);
};

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

    if (!code || !name || !type || !value || !customerType || !validUntil) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: code, name, type, value, customerType, validUntil"
      });
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists"
      });
    }

    const now = new Date();
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
      validFrom: validFrom ? new Date(validFrom) : now,
      validUntil: new Date(validUntil),
      isActive: computeIsActive(validFrom || now, validUntil),
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
    res.status(500).json({ success: false, message: "Failed to create coupon" });
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
    const now = new Date();

    const [coupons, totalCoupons] = await Promise.all([
      Coupon.find(filters)
        .populate('createdBy', 'userName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Coupon.countDocuments(filters)
    ]);

    // Add real-time active status
    coupons.forEach(c => {
      c.isActive = computeIsActive(c.validFrom, c.validUntil);
    });

    // Apply isActive filter if requested
    let filteredCoupons = coupons;
    if (isActive !== undefined) {
      const activeBool = isActive === 'true';
      filteredCoupons = coupons.filter(c => c.isActive === activeBool);
    }

    res.status(200).json({
      success: true,
      data: filteredCoupons,
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
    res.status(500).json({ success: false, message: "Failed to fetch coupons" });
  }
};

// Update coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.code;
    delete updateData.usedCount;
    delete updateData.usedBy;

    if (updateData.validFrom || updateData.validUntil) {
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Coupon not found" });
      }
      const validFrom = updateData.validFrom || coupon.validFrom;
      const validUntil = updateData.validUntil || coupon.validUntil;
      updateData.isActive = computeIsActive(validFrom, validUntil);
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon updated successfully", data: updatedCoupon });

  } catch (error) {
    console.error("Update coupon error:", error);
    res.status(500).json({ success: false, message: "Failed to update coupon" });
  }
};

// Delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    res.status(200).json({ success: true, message: "Coupon deleted successfully" });

  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({ success: false, message: "Failed to delete coupon" });
  }
};

// Get eligible users for coupons
const findEligibleUsers = async () => {
  const [topBuyerData, subscribers, newCustomers] = await Promise.all([
    Order.aggregate([
      { $match: { "billing.paymentStatus": "Success" } },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$billing.totalAmount" }
        }
      },
      { $sort: { orderCount: -1, totalSpent: -1 } },
      { $limit: 1 }
    ]),
    EmailSubscription.find({ isActive: true }).select("email"),
    User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders"
        }
      },
      { $match: { orders: { $eq: [] } } }
    ])
  ]);

  const topBuyer = topBuyerData.length > 0
    ? await User.findById(topBuyerData[0]._id).select("userName email")
    : null;

  return { topBuyer, subscribers, newCustomers };
};

const getEligibleUsersForCoupons = async (req, res) => {
  try {
    const { topBuyer, subscribers, newCustomers } = await findEligibleUsers();

    const userMap = new Map();

    const addUser = (user, type) => {
      if (!user || !user._id) return;
      const userId = user._id.toString();
      // Add user if not already present, giving precedence to earlier additions.
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          _id: user._id,
          name: user.userName, // Match frontend expectation
          email: user.email,
          customerType: type,
        });
      }
    };

    // Precedence: Top Buyer > Subscriber > New Customer
    if (topBuyer) {
      addUser(topBuyer, 'top_buyer');
    }

    if (subscribers && subscribers.length > 0) {
        const subscriberEmails = subscribers.map(s => s.email);
        const subscriberUsers = await User.find({ email: { $in: subscriberEmails } }).select("userName email");
        subscriberUsers.forEach(user => addUser(user, 'subscriber'));
    }
    
    if (newCustomers && newCustomers.length > 0) {
        newCustomers.forEach(user => addUser(user, 'new_customer'));
    }
    
    const eligibleUsers = Array.from(userMap.values());

    res.status(200).json({ success: true, message: "Eligible users fetched successfully", data: eligibleUsers });
  } catch (error) {
    console.error("Get eligible users error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch eligible users", error: error.message });
  }
};

// Send coupons to users
const sendCouponsToUsers = async (req, res) => {
  try {
    const { couponCode, userIds } = req.body;
    if (!couponCode || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "Coupon code and at least one user ID are required" });
    }

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const sentEmails = [];
    const failedEmails = [];
    const users = await User.find({ _id: { $in: userIds } }).select('userName email');

    for (const user of users) {
      try {
        await emailService.sendCouponEmail(user.email, user.userName, couponCode);
        sentEmails.push({ userId: user._id, email: user.email });
      } catch (error) {
        failedEmails.push({ userId: user._id, email: user.email, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: "Coupon emails sent with a summary of results",
      data: { sent: sentEmails, failed: failedEmails }
    });

  } catch (error) {
    console.error("Send coupon to users error:", error);
    res.status(500).json({ success: false, message: "Failed to send coupons" });
  }
};

// Get coupon statistics
const getCouponStats = async (req, res) => {
  try {
    const now = new Date();
    const stats = await Coupon.aggregate([
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalCoupons: { $sum: 1 },
                activeCoupons: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $lte: ["$validFrom", now] },
                          { $gte: ["$validUntil", now] }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                },
                expiredCoupons: {
                  $sum: {
                    $cond: [{ $lt: ["$validUntil", now] }, 1, 0]
                  }
                },
                totalUsage: { $sum: "$usedCount" },
                averageDiscount: { $avg: "$value" }
              }
            }
          ],
          byCustomerType: [
            {
              $group: {
                _id: "$customerType",
                count: { $sum: 1 },
                totalUsage: { $sum: "$usedCount" },
                averageValue: { $avg: "$value" }
              }
            },
            { $sort: { count: -1 } }
          ],
          byType: [
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
                totalUsage: { $sum: "$usedCount" }
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
    res.status(500).json({ success: false, message: "Failed to fetch coupon statistics" });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getEligibleUsersForCoupons,
  sendCouponsToUsers,
  getCouponStats
};
