"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
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

const mockRelatedProducts = [
  {
    _id: "2",
    title: "Wireless Earbuds Pro",
    price: 149,
    salePrice: 99,
    image: "/wireless-earbuds.png",
    rating: 4.5,
    brand: "apple",
    category: "electronics",
    totalStock: 15,
  },
  {
    _id: "3",
    title: "Bluetooth Speaker",
    price: 79,
    salePrice: 59,
    image: "/bluetooth-speaker.png",
    rating: 4.2,
    brand: "sony",
    category: "electronics",
    totalStock: 8,
  }
];

function ProductDetailsPage() {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth || {});
  const { cartItems } = useSelector((state) => state.shopCart || {});
  const { reviews = [], isLoading: reviewsLoadingState } = useSelector((state) => state.shopReview || {});
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts || {});

  const { toast } = useToast();
  const { showCartNotification } = useCartNotification();

  const averageReview =
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + (review.reviewValue || 0), 0) / reviews.length
      : 0;

  const handleAddToCart = async (productId, totalStock) => {
    if (!user?.id) {
      toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

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
        userId: user.id,
        productId,
        quantity,
        productDetails: {
          title: productDetails.title,
          image: productDetails.image,
          price: productDetails.price,
          salePrice: productDetails.salePrice,
          category: productDetails.category
        }
      }));

      if (action.payload?.success) {
        await dispatch(fetchCartItems(user.id));
        showCartNotification(productDetails.title);
        toast({ title: `Added ${quantity} item(s) to cart!` });
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
    const product = mockRelatedProducts.find(p => p._id === productId);
    if (!product) return;

    try {
      const action = await dispatch(addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
        productDetails: {
          title: product.title,
          image: product.image,
          price: product.price,
          salePrice: product.salePrice,
          category: product.category
        }
      }));

      if (action.payload?.success) {
        await dispatch(fetchCartItems(user?.id));
        showCartNotification(product.title);
        toast({ title: "Added to cart!" });
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
      userId: user?.id || "guest", // Allow guest reviews
      userName: user?.userName || "Guest User", // Default name for guests
      reviewMessage: reviewMsg,
      reviewValue: rating,
      isVerified: !!user?.id, // Mark if review is from verified user
    }));

    await dispatch(getReviews(productDetails._id));

    setRating(0);
    setReviewMsg("");
    toast({ 
      title: "Review submitted!",
      description: user?.id ? "" : "Your review will be visible after moderation"
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
  // Fetch product details
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    return () => {
      dispatch(setProductDetails());
    };
  }, [dispatch, id]);

  // Fetch reviews + update recently viewed
  useEffect(() => {
    if (!productDetails?._id) return;

    setReviewsLoading(true);
    dispatch(getReviews(productDetails._id))
      .finally(() => setReviewsLoading(false));

    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const updated = [productDetails, ...viewed.filter(p => p._id !== productDetails._id)].slice(0, 3);
    setRecentlyViewed(updated);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));

  }, [productDetails?._id, dispatch]); // ✅ only runs when product ID changes

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
        <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
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
          images={productDetails.images} 
          mainImage={productDetails.image}
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

      <Tabs defaultValue="reviews" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
        </TabsList>

       <TabsContent value="reviews" className="space-y-6">
  <ProductReviews 
    productId={productDetails._id}
    currentUser={user}
  />
</TabsContent>

        <TabsContent value="specifications">
          <ProductSpecifications specifications={productDetails.specifications} />
        </TabsContent>

        <TabsContent value="qa">
          <ProductQA questions={productDetails.questions || []} />
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockRelatedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => navigate(`/products/${product._id}`)}
              handleAddToCart={() => handleRelatedAddToCart(product._id)}
            />
          ))}
        </div>
      </div>
      <AIProductRecommendations currentProduct={productDetails} />

      {recentlyViewed.length > 0 && (
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="w-6 h-6" />
            Recently Viewed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyViewed.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => navigate(`/products/${product._id}`)}
                handleAddToCart={() => handleRelatedAddToCart(product._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsPage;
