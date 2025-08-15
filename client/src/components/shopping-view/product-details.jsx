import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { useCartNotification } from "@/hooks/use-cart-notification";
import ProductImageGallery from "./product-image-gallery";
import { Skeleton } from "../ui/skeleton";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { cartItems } = useSelector((state) => state.shopCart || {});
  const { reviews } = useSelector((state) => state.shopReview || {});
  const { toast } = useToast();
  const { showCartNotification } = useCartNotification();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    setIsLoading(true);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
    }

    const productDetailsForCart = {
      title: productDetails?.title,
      image: productDetails?.image,
      price: productDetails?.price,
      salePrice: productDetails?.salePrice,
      category: productDetails?.category
    };

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        productDetails: productDetailsForCart,
      })
    ).then((data) => {
      setIsLoading(false);
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        showCartNotification(productDetails?.title || "Product");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (!user?.id) {
      toast({
        title: "Please login to add a review",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className={`
        flex flex-col gap-4 p-4 
        w-[95vw] max-w-[480px]  // Mobile-first: full width with max-width
        md:w-[80vw] md:max-w-[600px]  // Tablet: slightly larger
        lg:w-[60vw] lg:max-w-[800px]  // Desktop: even larger
        xl:max-w-[900px]  // Extra large screens
        max-h-[90vh] overflow-auto
      `}>
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <DialogDescription className="sr-only">
          {productDetails?.title} details and reviews
        </DialogDescription>

        {/* Image Gallery - Smaller on desktop */}
        <div className="w-full">
          {productDetails ? (
            <ProductImageGallery
              mainImage={productDetails?.image}
              additionalImages={productDetails?.images || []}
              productTitle={productDetails?.title}
              className="w-full aspect-square"
            />
          ) : (
            <Skeleton className="aspect-square w-full" />
          )}
        </div>

        {/* Product Details - Adjusted spacing */}
        <div className="space-y-4 w-full">
          {productDetails ? (
            <>
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-extrabold">  {/* Smaller font */}
                  {productDetails?.title}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">  {/* Adjusted text size */}
                  {productDetails?.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">  {/* Reduced gap */}
                  <p className={`text-xl font-bold text-primary ${  // Smaller text
                    productDetails?.salePrice > 0 ? "line-through" : ""
                  }`}>
                    ${productDetails?.price}
                  </p>
                  {productDetails?.salePrice > 0 && (
                    <p className="text-xl font-bold text-muted-foreground">  {/* Smaller text */}
                      ${productDetails?.salePrice}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">  {/* Reduced gap */}
                  <StarRatingComponent rating={averageReview} size={16} />  {/* Smaller stars */}
                  <span className="text-xs text-muted-foreground">  {/* Smaller text */}
                    ({averageReview.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Add to Cart - More compact */}
              <div className="py-2">
                {productDetails?.totalStock === 0 ? (
                  <Button className="w-full" size="sm" disabled>
                    Out of Stock
                  </Button>
                ) : (
                  <Button
                    className="w-full py-4 text-base"  // Smaller padding and text
                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add to Cart"}
                  </Button>
                )}
              </div>

              <Separator className="my-2" />  {/* Smaller margin */}

              {/* Reviews Section - More compact */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Customer Reviews</h2>  {/* Smaller heading */}
                
                {reviews?.length > 0 ? (
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">  {/* Scrollable area */}
                    {reviews.map((reviewItem) => (
                      <div key={reviewItem._id} className="flex gap-3">  {/* Reduced gap */}
                        <Avatar className="w-8 h-8 border">  {/* Smaller avatar */}
                          <AvatarFallback>
                            {reviewItem?.userName?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5 flex-1">  {/* Reduced gap */}
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{reviewItem?.userName}</h3>  {/* Smaller text */}
                            <StarRatingComponent 
                              rating={reviewItem?.reviewValue} 
                              size={12}  // Smaller stars
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">  {/* Smaller text */}
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p> 
                )}
                <div className="space-y-3 pt-3 border-t">
                  <Label className="text-sm">Write a Review</Label>  
                  <div className="flex gap-1 mb-1">
                    <StarRatingComponentComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                      size={16}  // Smaller stars
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Share your thoughts..."
                    className="py-2 text-sm"  // Smaller input
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === "" || !user?.id}
                    className="w-full py-3 text-sm"  // More compact button
                  >
                    {user?.id ? "Submit Review" : "Login to Review"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <div className="flex gap-3 mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;//}