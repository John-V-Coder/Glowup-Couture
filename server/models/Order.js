const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      size: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  shipmentMethod: {
    type: String,
    enum: ["Standard", "Express", "Next-Day", "In-Store Pickup"],
    required: true,
  },
  billing: {
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Abandoned"],
      default: "Pending",
    },
    totalAmount: Number,
    paypalReference: String, 
    authorizationCode: String, 
  },
  orderStatus: String,
  orderDate: Date,
  orderUpdateDate: Date,
});

module.exports = mongoose.model("Order", OrderSchema);