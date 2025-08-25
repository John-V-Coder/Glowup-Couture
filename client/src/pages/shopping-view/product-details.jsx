// src/pages/ProductDetailsPage.jsx

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchProductDetails,
  setProductDetails,
  fetchFilteredProducts,
} from "@/store/shop/products-slice";
import { useCartNotification } from "@/hooks/use-cart-notification";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductInfo } from "@/components/shopping-view/ProductInfo";
import { QuantitySelector } from "@/components/common/quality-selector";
import { ProductFeatures } from "@/components/shopping-view/productfeatures";
import { ProductCard } from "@/components/shopping-view/product-card";
import { ProductQA } from "@/components/shopping-view/productQA";
import ProductImageGallery from "@/components/shopping-view/product-image-gallery";
import ProductReviews from "@/components/shopping-view/product-reviews-page";
import PageWrapper from "@/components/common/page-wrapper";
import ProductSizeSelector from "@/components/shopping-view/product-size"; // LABEL 1: Import the new component

// Get related products from the same category
const getRelatedProducts = (productDetails, productList) => {
  if (!productDetails || !productList || productList.length === 0) return [];

  return productList
    .filter(
      (product) =>
        product._id !== productDetails._id &&
        product.category === productDetails.category
    )
    .slice(0, 5); // Show max 5 related products
};

function ProductDetailsPage() {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null); // Existing state for size

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth || {});
  const { cartItems } = useSelector((state) => state.shopCart || {});
  const { reviews = [], isLoading: reviewsLoadingState } = useSelector(
    (state) => state.shopReview || {}
  );
  // Renamed the state property in product-slice.js from 'product' to 'productDetails'
  const { productDetails, isLoading, productList } = useSelector(
    (state) => state.shopProducts || {}
  );

  const { toast } = useToast();
  const { showCartNotification } = useCartNotification();

  // Animation variants (unchanged)
  const preloaderVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
  };
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const averageReview =
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + (review.reviewValue || 0), 0) / reviews.length
      : 0;

  const handleAddToCart = async (productId, totalStock) => {
    // LABEL 2: Add validation for size selection
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    const cartItem = cartItems.items?.find((item) => item.productId === productId);
    if (cartItem && cartItem.quantity + quantity > totalStock) {
      toast({
        title: `Only ${totalStock - cartItem.quantity} more can be added`,
        variant: "destructive",
      });
      return;
    }

    try {
      const action = await dispatch(
        addToCart({
          userId: user?.id,
          productId,
          quantity,
          size: selectedSize, // LABEL 2: Pass the selected size to the action
          productDetails: {
            title: productDetails.title,
            image: productDetails.image,
            images: productDetails.images || [],
            price: productDetails.price,
            salePrice: productDetails.salePrice,
            category: productDetails.category,
          },
        })
      );

      if (action.payload?.success) {
        await dispatch(fetchCartItems(user?.id));
        showCartNotification(productDetails.title);
        toast({
          title: `Added ${quantity} item(s) to cart!`,
          description: !user?.id ? "Sign in to sync your cart across devices" : "",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRelatedAddToCart = async (productId) => {
    const product = productList.find((p) => p._id === productId);
    if (!product) return;

    try {
      const action = await dispatch(
        addToCart({
          userId: user?.id,
          productId,
          quantity: 1,
          productDetails: {
            title: product.title,
            image: product.image,
            images: product.images || [],
            price: product.price,
            salePrice: product.salePrice,
            category: product.category,
          },
        })
      );

      if (action.payload?.success) {
        await dispatch(fetchCartItems(user?.id));
        showCartNotification(product.title);
        toast({
          title: "Added to cart!",
          description: !user?.id ? "Sign in to sync your cart across devices" : "",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleAddReview = async () => {
    // Basic validation - ensure rating and message are provided
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!reviewMsg.trim()) {
      toast({
        title: "Please write your review",
        variant: "destructive",
      });
      return;
    }

    try {
      setReviewsLoading(true);

      await dispatch(
        addReview({
          productId: productDetails._id,
          userId: user?.id || "guest",
          userName: user?.userName || "Guest User",
          reviewMessage: reviewMsg,
          reviewValue: rating,
          isVerified: !!user?.id,
        })
      );

      await dispatch(getReviews(productDetails._id));

      setRating(0);
      setReviewMsg("");
      toast({
        title: "Review submitted!",
        description: user?.id ? "" : "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch product details and product list
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    dispatch(
      fetchFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" })
    );

    return () => {
      dispatch(setProductDetails());
      setSelectedSize(null);
    };
  }, [dispatch, id]);



  // Fetch reviews + update recently viewed (store IDs in localStorage)
  useEffect(() => {
    if (!productDetails?._id) return;

    setReviewsLoading(true);
    dispatch(getReviews(productDetails._id)).finally(() =>
      setReviewsLoading(false)
    );

    try {
      const raw = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const prevIds = Array.isArray(raw)
        ? raw.map((v) => (typeof v === "string" ? v : v?._id)).filter(Boolean)
        : [];
      const ids = [
        productDetails._id,
        ...prevIds.filter((viewedId) => viewedId !== productDetails._id),
      ].slice(0, 12);
      localStorage.setItem("recentlyViewed", JSON.stringify(ids));

      const objects = ids
        .map((viewedId) =>
          viewedId === productDetails._id
            ? productDetails
            : productList?.find((p) => p._id === viewedId)
        )
        .filter(Boolean)
        .slice(0, 4);
      setRecentlyViewed(objects);
    } catch (e) {}

    setShowReviews(false);
    setShowQA(false);
  }, [productDetails?._id, productList, dispatch]);

  const galleryMainImage =
    productDetails?.image || (productDetails?.images?.[0] || "");
  const galleryAdditionalImages = Array.from(
    new Set(
      (productDetails?.images || []).filter(
        (img) => img && img !== galleryMainImage
      )
    )
  );

  const LoadingSkeleton = () => (
    <motion.div
      variants={preloaderVariants}
      initial="initial"
      exit="exit"
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        className="animate-pulse space-y-8"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-10 w-24 bg-gray-200 rounded"
          initial={{ opacity: 0.3, scale: 0.95 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-gray-200 aspect-square rounded-lg"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
            />
            <div className="flex gap-2">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="w-20 h-20 bg-gray-200 rounded"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.3 + index * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[...Array(2)].map((_, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="border rounded-lg p-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="h-8 bg-gray-200 rounded w-1/3"></motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <motion.div key={index} variants={fadeInUp} className="space-y-4">
                <div className="bg-gray-200 aspect-square rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  if (!productDetails && !isLoading) {
    return (
      <PageWrapper message="Loading product details...">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/shop/listing/")}>Back to Shop</Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper message="Loading product details...">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSkeleton key="skeleton" />
          ) : (
            <motion.div
              key="content"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="container mx-auto px-4 py-8"
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={fadeInUp}>
                  <ProductImageGallery
                    additionalImages={galleryAdditionalImages}
                    mainImage={galleryMainImage}
                    productTitle={productDetails.title}
                  />
                </motion.div>

                <motion.div className="space-y-6" variants={fadeInUp}>
                  <ProductInfo
                    product={productDetails}
                    averageReview={averageReview}
                    reviewCount={reviews?.length || 0}
                  />
                  <div className="flex flex-col gap-4">
                    {/* LABEL 3: Add the size selector component here */}
                    <ProductSizeSelector
                      onSizeSelect={setSelectedSize}
                      selectedSize={selectedSize}
                    />
                    
                    <QuantitySelector
                      quantity={quantity}
                      onQuantityChange={(change) => {
                        const newQty = quantity + change;
                        if (newQty > 0 && newQty <= productDetails.totalStock) {
                          setQuantity(newQty);
                        }
                      }}
                      maxStock={productDetails.totalStock}
                    />
                    <Button
                      className="w-full py-6 text-lg"
                      onClick={() =>
                        handleAddToCart(productDetails._id, productDetails.totalStock)
                      }
                      disabled={productDetails.totalStock === 0}
                    >
                      {productDetails.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>

                  <ProductFeatures features={productDetails.features} />
                </motion.div>
              </motion.div>

              <motion.div
                className="mb-8 space-y-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div className="border rounded-lg" variants={fadeInUp}>
                  <button
                    type="button"
                    onClick={() => setShowReviews((v) => !v)}
                    aria-expanded={showReviews}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold">Reviews</span>
                    <span className="text-sm text-gray-500">
                      {reviews?.length || 0}
                    </span>
                  </button>
                  {showReviews && (
                    <motion.div
                      className="p-4 border-t space-y-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductReviews
                        productId={productDetails._id}
                        currentUser={user}
                      />
                    </motion.div>
                  )}
                </motion.div>

                <motion.div className="border rounded-lg" variants={fadeInUp}>
                  <button
                    type="button"
                    onClick={() => setShowQA((v) => !v)}
                    aria-expanded={showQA}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold">Q&A</span>
                    <span className="text-sm text-gray-500">
                      {(productDetails.questions || []).length || 0}
                    </span>
                  </button>
                  {showQA && (
                    <motion.div
                      className="p-4 border-t space-y-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductQA questions={productDetails.questions || []} />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              {getRelatedProducts(productDetails, productList).length > 0 && (
                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <motion.h2 className="text-2xl font-bold" variants={fadeInUp}>
                    Related Products
                  </motion.h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {getRelatedProducts(productDetails, productList).map(
                      (product) => (
                        <motion.div key={product._id} variants={fadeInUp}>
                          <ProductCard
                            product={product}
                            onClick={() =>
                              navigate(`/shop/product/${product._id}`)
                            }
                            handleAddToCart={() =>
                              handleRelatedAddToCart(product._id)
                            }
                          />
                        </motion.div>
                      )
                    )}
                  </motion.div>
                </motion.div>
              )}

              {recentlyViewed.length > 0 && (
                <motion.div
                  className="space-y-6 mt-8"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <motion.h2
                    className="text-2xl font-bold flex items-center gap-2"
                    variants={fadeInUp}
                  >
                    <Eye className="w-6 h-6" />
                    Recently Viewed
                  </motion.h2>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {recentlyViewed.map((product) => (
                      <motion.div key={product._id} variants={fadeInUp}>
                        <ProductCard
                          product={product}
                          onClick={() =>
                            navigate(`/shop/product/${product._id}`)
                          }
                          handleAddToCart={() =>
                            handleRelatedAddToCart(product._id)
                          }
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}

export default ProductDetailsPage;