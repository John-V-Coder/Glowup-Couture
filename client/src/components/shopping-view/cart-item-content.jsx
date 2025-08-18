
import { Plus, Trash, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart || {});
  const { productList } = useSelector((state) => state.shopProducts || {});
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Build images robustly: prefer cart item, fallback to store, deduplicate
  const productFromStore = (productList || []).find((p) => p._id === cartItem?.productId) || {};
  const storeImages = (productFromStore.images || []).filter((img) => img && String(img).trim() !== "");
  const mainCandidate = cartItem?.image || productFromStore?.image;
  const combined = [
    mainCandidate,
    ...(Array.isArray(cartItem?.images) ? cartItem.images : []),
    ...storeImages
  ]
    .map((img) => (img ? String(img) : ""))
    .map((img) => img.trim())
    .filter((img) => !!img);
  const dedupImages = combined.filter((img, idx, arr) => arr.indexOf(img) === idx);
  const primaryImage = dedupImages[0] || productFromStore?.image || '/placeholder-image.jpg';
  const hoverImage = dedupImages.find((img) => img !== primaryImage) || primaryImage;
  const hasHoverAlt = hoverImage !== primaryImage;
  const [showHover, setShowHover] = useState(false);

  
  
  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-6 bg-white hover:bg-gray-50 transition-all duration-300 rounded-2xl shadow-sm">
      {/* Image */}
      <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
        <div className="relative overflow-hidden rounded-2xl group"
             onMouseEnter={() => hasHoverAlt && setShowHover(true)}
             onMouseLeave={() => setShowHover(false)}
        >
          <img
            src={primaryImage}
            alt={cartItem?.title}
            className={`w-20 h-20 md:w-24 md:h-24 object-cover transition-opacity duration-300 ${showHover && hasHoverAlt ? 'opacity-0' : 'opacity-100'}`}
            onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
          />
          {hasHoverAlt && (
            <img
              src={hoverImage}
              alt={cartItem?.title}
              className={`absolute inset-0 w-20 h-20 md:w-24 md:h-24 object-cover transition-opacity duration-300 ${showHover ? 'opacity-100' : 'opacity-0'}`}
              onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
            />
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        <div>
          <h3 className="font-semibold text-base md:text-lg text-gray-900 line-clamp-1">{cartItem?.title}</h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {cartItem?.category || "General Product"}
          </p>
        </div>

        {/* Quantity & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-4 h-4 text-gray-600" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="font-semibold w-8 text-center text-gray-900">
              {cartItem?.quantity}
            </span>
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-4 h-4 text-gray-600" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>

          {/* Price & Delete */}
          <div className="flex justify-between md:ml-auto items-center w-full md:w-auto">
            <p className="font-bold text-lg text-gray-900">
              $
              {(
                (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
                cartItem?.quantity
              ).toFixed(2)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCartItemDelete(cartItem)}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 ml-4 rounded-full transition-all duration-200"
            >
              <Trash className="w-5 h-5" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
