"use client";
import React from "react";
import { Button } from "@/components/ui/button";
// Tabs removed in favor of collapsible sections
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails, setProductDetails, fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useCartNotification } from "@/hooks/use-cart-notification";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
// Import components
import { ProductInfo } from "@/pages/shopping-view/ProductInfo";
import { QuantitySelector } from "@/components/common/quality-selector";
import { ProductFeatures } from "@/components/shopping-view/productfeatures";
import { ProductCard } from "@/components/shopping-view/product-card";
import { ProductSpecifications } from "@/components/shopping-view/product-specification";
import { ProductQA } from "@/components/shopping-view/productQA";
import ProductImageGallery from "@/components/shopping-view/product-image-gallery";
import AIProductRecommendations from "@/components/shopping-view/AIProductRecommendations";
import ProductReviews from "@/pages/shopping-view/product-reviews-page";
import WhatsAppButton from "@/components/common/whatsApp";

// Get related products from the same category
const getRelatedProducts = (productDetails, productList) => {
  if (!productDetails || !productList || productList.length === 0) return [];

  return productList
    .filter(product =>
      product._id !== productDetails._id &&
      product.category === productDetails.category
    )
    .slice(0, 3); // Show max 3 related products
};

function ProductDetailsPage() {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showQA, setShowQA] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth || {});
  const { cartItems } = useSelector((state) => state.shopCart || {});
  const { reviews = [], isLoading: reviewsLoadingState } = useSelector((state) => state.shopReview || {});
  const { productDetails, isLoading, productList } = useSelector((state) => state.shopProducts || {});

  const { toast } = useToast();
  const { showCartNotification } = useCartNotification();

  const averageReview =
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + (review.reviewValue || 0), 0) / reviews.length
      : 0;

  const handleAddToCart = async (productId, totalStock) => {
    const cartItem = cartItems.items?.find(item => item.productId === productId);
    if (cartItem && (cartItem.quantity + quantity) > totalStock) {
      toast({
        title: `Only ${totalStock - cartItem.quantity} more can be added`,
        variant: "destructive",
      });
      return;
    }

    try {
      const action = await dispatch(addToCart({
        userId: user?.id,
        productId,
        quantity,
        productDetails: {
          title: productDetails.title,
          image: productDetails.image,
          images: productDetails.images || [],
          price: productDetails.price,
          salePrice: productDetails.salePrice,
          category: productDetails.category
        }
      }));

      if (action.payload?.success) {
        await dispatch(fetchCartItems(user?.id));
        showCartNotification(productDetails.title);
        toast({
          title: `Added ${quantity} item(s) to cart!`,
          description: !user?.id ? "Sign in to sync your cart across devices" : ""
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
    const product = productList.find(p => p._id === productId);
    if (!product) return;

    try {
      const action = await dispatch(addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
        productDetails: {
          title: product.title,
          image: product.image,
          images: product.images || [],
          price: product.price,
          salePrice: product.salePrice,
          category: product.category
        }
      }));

      if (action.payload?.success) {
        await dispatch(fetchCartItems(user?.id));
        showCartNotification(product.title);
        toast({
          title: "Added to cart!",
          description: !user?.id ? "Sign in to sync your cart across devices" : ""
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

    await dispatch(addReview({
      productId: productDetails._id,
      userId: user?.id || "guest",
      userName: user?.userName || "Guest User",
      reviewMessage: reviewMsg,
      reviewValue: rating,
      isVerified: !!user?.id,
    }));

    await dispatch(getReviews(productDetails._id));

    setRating(0);
    setReviewMsg("");
    toast({
      title: "Review submitted!",
      description: user?.id ? "" : "Thank you for your feedback!"
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
    // Fetch product list for related products
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    
    return () => {
      dispatch(setProductDetails());
    };
  }, [dispatch, id]);

  // Fetch reviews + update recently viewed (store IDs in localStorage)
  useEffect(() => {
    if (!productDetails?._id) return;

    setReviewsLoading(true);
    dispatch(getReviews(productDetails._id))
      .finally(() => setReviewsLoading(false));

    try {
      const raw = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const prevIds = Array.isArray(raw)
        ? raw.map((v) => (typeof v === "string" ? v : v?._id)).filter(Boolean)
        : [];
      const ids = [productDetails._id, ...prevIds.filter((id) => id !== productDetails._id)].slice(0, 12);
      localStorage.setItem("recentlyViewed", JSON.stringify(ids));

      const objects = ids
        .map((id) => (id === productDetails._id ? productDetails : productList?.find((p) => p._id === id)))
        .filter(Boolean)
        .slice(0, 4);
      setRecentlyViewed(objects);
    } catch {}

    // collapse sections when product changes
    setShowReviews(false);
    setShowQA(false);
  }, [productDetails?._id, productList, dispatch]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate("/shop/listing/")}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ProductImageGallery
          additionalImages={productDetails.images}
          mainImage={productDetails.image}
          productTitle={productDetails.title}
        />

        <div className="space-y-6">
          <ProductInfo
            product={productDetails}
            averageReview={averageReview}
            reviewCount={reviews?.length || 0}
          />

          <div className="flex flex-col gap-4">
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
              onClick={() => handleAddToCart(productDetails._id, productDetails.totalStock)}
              disabled={productDetails.totalStock === 0}
            >
              {productDetails.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          <ProductFeatures features={productDetails.features} />
        </div>
      </div>

  <div className="mb-8 space-y-4">
    <div className="border rounded-lg">
      <button
        type="button"
        onClick={() => setShowReviews((v) => !v)}
        aria-expanded={showReviews}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-semibold">Reviews</span>
        <span className="text-sm text-gray-500">{reviews?.length || 0}</span>
      </button>
      {showReviews && (
        <div className="p-4 border-t space-y-6">
          <ProductReviews productId={productDetails._id} currentUser={user} />
        </div>
      )}
    </div>

    <div className="border rounded-lg">
      <button
        type="button"
        onClick={() => setShowQA((v) => !v)}
        aria-expanded={showQA}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-semibold">Q&A</span>
        <span className="text-sm text-gray-500">{(productDetails.questions || []).length || 0}</span>
      </button>
      {showQA && (
        <div className="p-4 border-t space-y-6">
          <ProductQA questions={productDetails.questions || []} />
        </div>
      )}
    </div>
  </div>

{getRelatedProducts(productDetails, productList).length > 0 && (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Related Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {getRelatedProducts(productDetails, productList).map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onClick={() => navigate(`/shop/product/${product._id}`)}
          handleAddToCart={() => handleRelatedAddToCart(product._id)}
        />
      ))}
    </div>
  </div>
)}

{recentlyViewed.length > 0 && (
  <div className="space-y-6 mt-8">
    <h2 className="text-2xl font-bold flex items-center gap-2">
      <Eye className="w-6 h-6" />
      Recently Viewed
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {recentlyViewed.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onClick={() => navigate(`/shop/product/${product._id}`)}
          handleAddToCart={() => handleRelatedAddToCart(product._id)}
        />
      ))}
    </div>
  </div>
)}
<WhatsAppButton/>
    </div>
  );
}

export default ProductDetailsPage;