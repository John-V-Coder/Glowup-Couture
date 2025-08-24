const { imageUploadUtil } = require("../../helpers/cloudinary");
const mongoose = require("mongoose");
const Product = require("../../models/Product");
const { 
  notifyAdminOfLowStock, 
  notifyAdminOfOutOfStock, 
  notifyAdminOfStockUpdate,
} = require("../../utils/emailLowOrderAdminHelpers");

// Set your low stock threshold
const LOW_STOCK_THRESHOLD = process.env.LOW_STOCK_THRESHOLD || 3;

const handleImageUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded. Please select an image to upload.",
    });
  }

  try {
    // You could add an image processing step here (e.g., resizing, compression)
    // before sending the file to Cloudinary to make the upload faster.
    // For example: const optimizedBuffer = await optimizeImage(req.file.buffer);

    const result = await imageUploadUtil(req.file.buffer);

    // Provide a more detailed success message with the public URL
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully!",
      result: {
        url: result.secure_url,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Provide specific user-friendly error messages based on the error type
    let userMessage = "Image upload failed. Please try again.";
    if (error.message.includes("exceeds file size limit")) {
      userMessage = "The uploaded file is too large. Please upload a smaller image.";
    } else if (error.message.includes("Invalid file type")) {
      userMessage = "Invalid file type. Only images (e.g., JPEG, PNG) are allowed.";
    }

    // Return a 500 status code for server errors
    res.status(500).json({
      success: false,
      message: userMessage,
    });
  }
};

// Function to check and notify for low stock
// Function to check and notify for low stock
const checkLowStock = async (productId, quantityReduced = 0) => {
  try {
    // 1. Validate the input first to fail fast
    if (!productId) {
      console.error('Error: A productId is required to check stock.');
      return;
    }

    // 2. Find the product
    const product = await Product.findById(productId);

    // 3. Handle a not-found product gracefully
    if (!product) {
      console.warn(`Warning: Product with ID ${productId} not found.`);
      return;
    }

    // 4. Calculate the new stock level
    const currentStock = product.totalStock - quantityReduced;

    // 5. Check if stock is at or below the low stock threshold
    if (currentStock <= LOW_STOCK_THRESHOLD) {
      const productData = {
        productId: product._id,
        title: product.title,
        currentStock: currentStock,
        category: product.category,
        brand: product.brand || 'N/A'
      };

      // 6. Differentiate between low stock and out-of-stock
      if (currentStock <= 0) {
        await notifyAdminOfOutOfStock(productData);
        console.log(`Out of stock alert sent for product: ${product.title}`);
      } else {
        await notifyAdminOfLowStock(productData);
        console.log(`Low stock alert sent for product: ${product.title}`);
      }
    }
  } catch (error) {
    // 7. Provide a more detailed error log
    console.error(`An unexpected error occurred while checking stock for product ${productId}:`, error);
  }
};

// add a new product
const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      brand,
      totalStock,
      image,
      images,
      size, // from initialFormData
      sizes, // in case it's sent as an array
      colors,
      tags,
      material,
      salePrice,
      featured, // from initialFormData
      isFeatured, // from filtering logic
      status, // from initialFormData
    } = req.body;

    // Basic validation
    if (!title || !description || !price || !category || !totalStock || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields: title, description, price, category, totalStock, and a main image.",
      });
    }

    // Prepare sizes array from either 'size' (string) or 'sizes' (array)
    let finalSizes = [];
    if (Array.isArray(sizes) && sizes.length > 0) {
      finalSizes = sizes;
    } else if (typeof size === 'string' && size.trim() !== '') {
      finalSizes = size.split(',').map(s => s.trim()).filter(Boolean);
    }

    const productData = {
      title,
      description,
      price: parseFloat(price),
      category: category.toLowerCase(),
      brand,
      totalStock: parseInt(totalStock, 10),
      image,
      images: Array.isArray(images) ? images : [],
      sizes: finalSizes,
      colors: Array.isArray(colors) ? colors : [],
      tags: Array.isArray(tags) ? tags.map(t => t.trim().toLowerCase()) : [],
      material,
      salePrice: salePrice ? parseFloat(salePrice) : 0,
      isFeatured: !!(featured || isFeatured),
      isOnSale: !!(salePrice && parseFloat(salePrice) > 0),
      isActive: status === 'active',
    };

    const newlyCreatedProduct = await Product.create(productData);

    // checkLowStock can run in the background without blocking the response
    checkLowStock(newlyCreatedProduct._id, 0);

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.error("Error adding product:", e);
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the product.",
    });
  }
};

//fetch all products with optional filtering and pagination
// fetch all products with optional filtering and pagination
const fetchAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      order = 'desc',
      category,
      brand,
      isActive,
      isFeatured,
      lowStock,
      search
    } = req.query;

    const LOW_STOCK_THRESHOLD = process.env.LOW_STOCK_THRESHOLD || 3;

    let filters = {};
    let sortObj = {};
    
    // Apply filters
    if (category) filters.category = category.toLowerCase();
    if (brand) filters.brand = brand;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
    if (lowStock === 'true') filters.totalStock = { $lte: LOW_STOCK_THRESHOLD };

    // Use text search if a search query is provided
    if (search) {
      filters.$text = { $search: search };
      sortObj.score = { $meta: 'textScore' }; // Sort by relevance
    }
    
    // Add other sorting parameters if text search isn't used
    if (!sortObj.score) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortObj[sortBy] = sortOrder;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Use a single aggregation pipeline with $facet
    const [results] = await Product.aggregate([
      { $match: filters },
      {
        $facet: {
          totalProducts: [
            { $count: 'count' }
          ],
          listOfProducts: [
            { $sort: sortObj },
            { $skip: skip },
            { $limit: parseInt(limit) }
          ]
        }
      }
    ]);

    const totalProducts = results.totalProducts[0]?.count || 0;
    const listOfProducts = results.listOfProducts;
    
    res.status(200).json({
      success: true,
      data: listOfProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / parseInt(limit)),
        totalProducts,
        hasNextPage: parseInt(page) < Math.ceil(totalProducts / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (e) {
    console.error('Error fetching products:', e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentProduct = await Product.findById(id).session(session);
    if (!currentProduct) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Apply updates from the request body
    Object.assign(currentProduct, updateData);

    // Save the product (this will trigger the pre-save hook)
    const updatedProduct = await currentProduct.save({ session });
    
    // Commit the transaction to finalize the changes
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
    
    // Now perform background tasks without waiting for them
    // Check for low stock asynchronously
    if (updateData.totalStock !== undefined) {
      checkLowStock(updatedProduct._id, 0);
      
      const stockDifference = Math.abs(updatedProduct.totalStock - currentProduct.totalStock);
      const percentageChange = currentProduct.totalStock > 0 ? stockDifference / currentProduct.totalStock : 1;
      
      if (stockDifference > 5 || percentageChange > 0.2) {
        const updateNotificationData = {
          productId: updatedProduct._id,
          productTitle: updatedProduct.title,
          oldStock: currentProduct.totalStock,
          newStock: updatedProduct.totalStock,
          operation: 'manual update'
        };
        // This is a background task
        notifyAdminOfStockUpdate(updateNotificationData);
      }
    }

  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error editing product:', e);

    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while editing the product.",
    });
  }
};


// Update product stock specifically (separate function for stock management)
const updateProductStock = async (req, res) => {
  const { id } = req.params;
  const { totalStock, operation = 'set', reason } = req.body;

  // Use a session to start the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate the input first
    if (totalStock === undefined || isNaN(totalStock)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Valid totalStock number is required" });
    }

    // 2. Find the product within the transaction session
    const product = await Product.findById(id).session(session);

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    // Capture the old stock value for logging and notifications
    const oldStock = product.totalStock;
    let newStock;

    // 3. Perform the calculation locally
    switch (operation) {
      case 'add':
        newStock = oldStock + parseInt(totalStock);
        break;
      case 'subtract':
        newStock = Math.max(0, oldStock - parseInt(totalStock));
        break;
      case 'set':
      default:
        newStock = parseInt(totalStock);
        break;
    }

    // 4. Update the document within the session
    product.totalStock = newStock;
    const updatedProduct = await product.save({ session });

    // 5. Commit the transaction to save changes to the database
    await session.commitTransaction();
    session.endSession();

    // 6. Respond to the client immediately
    res.status(200).json({
      success: true,
      message: "Product stock updated successfully!",
      data: {
        productId: id,
        productTitle: updatedProduct.title,
        oldStock,
        newStock,
        operation,
        reason: reason || null
      }
    });

    // 7. Run background tasks asynchronously (without 'await')
    // This won't block the user's response
    checkLowStock(id, 0);

    const updateData = {
      productId: updatedProduct._id,
      productTitle: updatedProduct.title,
      oldStock,
      newStock,
      operation,
      reason: reason || null
    };

    notifyAdminOfStockUpdate(updateData);
    console.log(`Stock updated for ${updatedProduct.title}: ${oldStock} -> ${newStock} (${operation}) ${reason ? `- Reason: ${reason}` : ''}`);

  } catch (e) {
    // 8. Abort the transaction and handle errors
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating product stock:', e);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product stock.",
    });
  }
};

// Get low stock products
// Get low stock products
const getLowStockProducts = async (req, res) => {
  // Set your low stock threshold here (can also come from .env)
  const LOW_STOCK_THRESHOLD = 3;

  try {
    // 1. Fetch products below the threshold
    const lowStockProducts = await Product.find({ totalStock: { $lt: LOW_STOCK_THRESHOLD } });

    // 2. If none found, return a friendly message
    if (!lowStockProducts.length) {
      return res.status(200).json({
        success: true,
        message: "No low stock products found.",
        data: [],
      });
    }

    // 3. Return products to the client
    res.status(200).json({
      success: true,
      message: "Low stock products fetched successfully!",
      data: lowStockProducts,
    });

    // 4. Background task: Optionally notify admin
    notifyAdminOfLowStock(lowStockProducts);

  } catch (e) {
    console.error("Error fetching low stock products:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching low stock products.",
    });
  }
};


// Toggle product active status
const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Use aggregation pipeline for update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            isActive: { $not: "$isActive" }
          }
        }
      ],
      { new: true } // Return the updated document
    );

    // Check if the product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedProduct,
    });
  } catch (e) {
    console.error('Error toggling product status:', e);
    res.status(500).json({
      success: false,
      message: "An error occurred while toggling the product status.",
      error: e.message // Include error message for debugging
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: { deletedProduct: { id: product._id, title: product.title } }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};


// Get product analytics/statistics
const getProductStats = async (req, res) => {
  try {
    const LOW_STOCK_THRESHOLD = process.env.LOW_STOCK_THRESHOLD || 3;

    const [stats] = await Product.aggregate([
      {
        $facet: {
          // Pipeline 1: Overview stats
          overview: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
                featuredProducts: { $sum: { $cond: ['$isFeatured', 1, 0] } },
                lowStockProducts: {
                  $sum: {
                    $cond: [{ $lte: ['$totalStock', LOW_STOCK_THRESHOLD] }, 1, 0],
                  },
                },
                outOfStockProducts: {
                  $sum: { $cond: [{ $lte: ['$totalStock', 0] }, 1, 0] },
                },
                totalStockValue: { $sum: { $multiply: ['$totalStock', '$price'] } },
                averagePrice: { $avg: '$price' },
              },
            },
            { $project: { _id: 0 } },
          ],

          // Pipeline 2: Category stats
          categories: [
            { $match: { isActive: true } },
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
                totalStock: { $sum: '$totalStock' },
                averagePrice: { $avg: '$price' },
              },
            },
            { $sort: { count: -1 } },
          ],

          // Pipeline 3: Top brands stats
          topBrands: [
            { $match: { isActive: true, brand: { $ne: null, $ne: '' } } },
            {
              $group: {
                _id: '$brand',
                count: { $sum: 1 },
                totalStock: { $sum: '$totalStock' },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
        },
      },
    ]);

    // Send the response
    res.status(200).json({
      success: true,
      data: {
        overview: stats.overview[0] || {},
        categories: stats.categories,
        topBrands: stats.topBrands,
        threshold: LOW_STOCK_THRESHOLD,
      },
    });
  } catch (e) {
    console.error('Error fetching product stats:', e);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching product statistics.",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  updateProductStock,
  toggleProductStatus,
  deleteProduct,
  getProductStats,
  checkLowStock,
  getLowStockProducts, 
};