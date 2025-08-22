require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const emailRouter = require("./routes/email/email-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const customerRoutes = require("./routes/admin/customer-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const { verifyTransporter } = require("./config/email");
const { seedEmailTemplates } = require("./utils/seedEmailTemplates");


const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected");
    
    // Verify email configuration
    await verifyTransporter();
    
    // Seed email templates
    await seedEmailTemplates();
  })
  .catch((error) => console.error("MongoDB connection error:", error));

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin", customerRoutes);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);


app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/email", emailRouter);

// Test route
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
