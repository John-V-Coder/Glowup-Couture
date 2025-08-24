const Product = require("../../models/Product");
const mongoose = require("mongoose");

const getFilteredProducts = async (req, res) => {
  try {
    const { 
      category = [], 
      brand = [], 
      priceRange = [],
      colors = [],
      sizes = [],
      tags = [],
      isOnSale,
      isFeatured,
      minPrice,
      maxPrice,
      sortBy = "price-lowtohigh",
      limit = 20,
      page = 1,
      search
    } = req.query;

    // Input validation
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20)); // Cap at 100

    let filters = {
      isActive: true // Only show active products by default
    };

    // Category filter - case insensitive
    if (category && category.length) {
      const categoryArray = Array.isArray(category) ? category : category.split(",");
      filters.category = { $in: categoryArray.map(c => c.toLowerCase().trim()) };
    }

    // Brand filter - case insensitive
    if (brand && brand.length) {
      const brandArray = Array.isArray(brand) ? brand : brand.split(",");
      filters.brand = { $in: brandArray.map(b => b.trim()) };
    }

    // Price range filter
    if (priceRange && priceRange.length) {
      const priceRangeArray = Array.isArray(priceRange) ? priceRange : priceRange.split(",");
      filters.priceRange = { $in: priceRangeArray };
    }

    // Custom price range filter - improved logic
    if (minPrice || maxPrice) {
      const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;
      
      if (isNaN(minPriceNum) || isNaN(maxPriceNum) || minPriceNum < 0 || maxPriceNum < minPriceNum) {
        return res.status(400).json({
          success: false,
          message: "Invalid price range values"
        });
      }

      filters.$or = [
        // Check regular price (when no sale price or sale price is 0)
        {
          $and: [
            { $or: [{ salePrice: { $exists: false } }, { salePrice: { $lte: 0 } }] },
            { price: { $gte: minPriceNum, $lte: maxPriceNum } }
          ]
        },
        // Check sale price when available and greater than 0
        {
          $and: [
            { salePrice: { $gt: 0 } },
            { salePrice: { $gte: minPriceNum, $lte: maxPriceNum } }
          ]
        }
      ];
    }

    // Colors filter
    if (colors && colors.length) {
      const colorsArray = Array.isArray(colors) ? colors : colors.split(",");
      filters.colors = { $in: colorsArray.map(c => c.trim()) };
    }

    // Sizes filter
    if (sizes && sizes.length) {
      const sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",");
      filters.sizes = { $in: sizesArray.map(s => s.trim()) };
    }

    // Tags filter
    if (tags && tags.length) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
      filters.tags = { $in: tagsArray.map(t => t.trim().toLowerCase()) };
    }

    // Sale filter
    if (isOnSale === 'true') {
      filters.isOnSale = true;
    } else if (isOnSale === 'false') {
      filters.isOnSale = false;
    }

    // Featured filter
    if (isFeatured === 'true') {
      filters.isFeatured = true;
    } else if (isFeatured === 'false') {
      filters.isFeatured = false;
    }

    // Search filter - with better text search
    if (search && search.trim()) {
      const searchTerm = search.trim();
      filters.$text = { 
        $search: searchTerm,
        $caseSensitive: false
      };
    }

    // Sorting logic
    let sort = {};
    let useAggregation = false;
    let aggregationPipeline = [];

    switch (sortBy) {
      case "price-lowtohigh":
        useAggregation = true;
        aggregationPipeline = [
          { 
            $addFields: { 
              effectivePrice: {
                $cond: [
                  { $and: [{ $gt: ["$salePrice", 0] }, { $lt: ["$salePrice", "$price"] }] },
                  "$salePrice",
                  "$price"
                ]
              }
            }
          },
          { $sort: { effectivePrice: 1, _id: 1 } } // Add _id for consistent sorting
        ];
        break;
        
      case "price-hightolow":
        useAggregation = true;
        aggregationPipeline = [
          { 
            $addFields: { 
              effectivePrice: {
                $cond: [
                  { $and: [{ $gt: ["$salePrice", 0] }, { $lt: ["$salePrice", "$price"] }] },
                  "$salePrice",
                  "$price"
                ]
              }
            }
          },
          { $sort: { effectivePrice: -1, _id: 1 } }
        ];
        break;
        
      case "title-atoz":
        sort = { title: 1, _id: 1 };
        break;

      case "title-ztoa":
        sort = { title: -1, _id: 1 };
        break;

      case "newest":
        sort = { createdAt: -1, _id: 1 };
        break;

      case "oldest":
        sort = { createdAt: 1, _id: 1 };
        break;

      case "discount":
        sort = { discountPercentage: -1, _id: 1 };
        break;

      case "rating":
        sort = { averageReview: -1, _id: 1 };
        break;

      case "featured":
        sort = { isFeatured: -1, createdAt: -1, _id: 1 };
        break;

      case "popularity": // New sort option
        sort = { totalStock: -1, averageReview: -1, _id: 1 };
        break;

      default:
        sort = { price: 1, _id: 1 };
        break;
    }

    let products;
    let totalProducts;

    if (useAggregation) {
      // Use aggregation pipeline for complex sorting
      const pipeline = [
        { $match: filters },
        ...aggregationPipeline,
        {
          $facet: {
            data: [
              { $skip: (pageNum - 1) * limitNum },
              { $limit: limitNum }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ];
      
      const result = await Product.aggregate(pipeline);
      products = result[0].data;
      totalProducts = result[0].totalCount[0]?.count || 0;
    } else {
      // Use regular find for simple sorting
      const query = Product.find(filters)
        .sort(sort)
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum)
        .lean(); // Use lean() for better performance

      // Add text search scoring if searching
      if (search && search.trim()) {
        query.select({ score: { $meta: "textScore" } });
        if (!sort.score) {
          query.sort({ score: { $meta: "textScore" }, ...sort });
        }
      }

      products = await query;
      totalProducts = await Product.countDocuments(filters);
    }

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        appliedFilters: {
          category: category || [],
          brand: brand || [],
          priceRange: priceRange || [],
          colors: colors || [],
          sizes: sizes || [],
          tags: tags || [],
          isOnSale,
          isFeatured,
          minPrice,
          maxPrice,
          search
        },
        sortBy
      }
    });

  } catch (error) {
    console.error('Error in getFilteredProducts:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only return active products (optional - remove if you want to show inactive products)
    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    // Add computed fields that might be useful
    const productWithComputedFields = {
      ...product,
      effectivePrice: product.salePrice > 0 && product.salePrice < product.price 
        ? product.salePrice 
        : product.price,
      isInStock: product.totalStock > 0,
      hasVariants: product.sizes.length > 0 || product.colors.length > 0
    };

    res.status(200).json({
      success: true,
      data: productWithComputedFields,
    });

  } catch (error) {
    console.error('Error in getProductDetails:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get filter options for frontend filtering UI
const getFilterOptions = async (req, res) => {
  try {
    // Use aggregation to get all filter options efficiently
    const pipeline = [
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          categories: { $addToSet: "$category" },
          brands: { $addToSet: "$brand" },
          priceRanges: { $addToSet: "$priceRange" },
          minPrice: { 
            $min: {
              $cond: [
                { $and: [{ $gt: ["$salePrice", 0] }, { $lt: ["$salePrice", "$price"] }] },
                "$salePrice",
                "$price"
              ]
            }
          },
          maxPrice: { 
            $max: {
              $cond: [
                { $and: [{ $gt: ["$salePrice", 0] }, { $lt: ["$salePrice", "$price"] }] },
                "$salePrice",
                "$price"
              ]
            }
          }
        }
      }
    ];

    const [aggregationResult] = await Product.aggregate(pipeline);

    // Get distinct values for array fields
    const [colors, sizes, tags] = await Promise.all([
      Product.distinct("colors", { isActive: true }),
      Product.distinct("sizes", { isActive: true }),
      Product.distinct("tags", { isActive: true })
    ]);

    const filterOptions = {
      categories: aggregationResult?.categories?.filter(Boolean).sort() || [],
      brands: aggregationResult?.brands?.filter(Boolean).sort() || [],
      colors: colors.filter(Boolean).sort(),
      sizes: sizes.filter(Boolean).sort(),
      tags: tags.filter(Boolean).sort(),
      priceRanges: aggregationResult?.priceRanges?.filter(Boolean).sort() || [],
      priceRange: {
        min: aggregationResult?.minPrice || 0,
        max: aggregationResult?.maxPrice || 0
      }
    };

    res.status(200).json({
      success: true,
      data: filterOptions
    });

  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filter options",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get related products based on category, brand, or tags
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 8 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await Product.findById(id).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find related products based on category, brand, and tags
    const relatedProducts = await Product.find({
      _id: { $ne: id }, // Exclude current product
      isActive: true,
      $or: [
        { category: product.category },
        { brand: product.brand },
        { tags: { $in: product.tags } }
      ]
    })
    .sort({ averageReview: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    res.status(200).json({
      success: true,
      data: relatedProducts,
    });

  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { 
  getFilteredProducts, 
  getProductDetails, 
  getFilterOptions,
  getRelatedProducts
};