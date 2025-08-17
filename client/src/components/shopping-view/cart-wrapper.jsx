
import { useNavigate } from "react-router-dom";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-item-content";
import { ArrowUp, ArrowDown, ShoppingCart, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function UserCartWrapper({ cartItems = [], setOpenCartSheet }) {
  const navigate = useNavigate();
  const cartItemsRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Calculate total amount
  const totalCartAmount = cartItems.reduce((sum, currentItem) => {
    const itemPrice = currentItem?.salePrice > 0 
      ? currentItem?.salePrice 
      : currentItem?.price || 0;
    return sum + (itemPrice * (currentItem?.quantity || 0));
  }, 0);

  // Check if we need scroll buttons
  useEffect(() => {
    const checkScroll = () => {
      if (cartItemsRef.current) {
        const needsScroll = cartItemsRef.current.scrollHeight > cartItemsRef.current.clientHeight;
        setShowScrollButtons(needsScroll);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [cartItems]);

  const handleScroll = (direction) => {
    if (cartItemsRef.current) {
      const scrollAmount = direction === 'down' ? 200 : -200;
      cartItemsRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    navigate("/shop/checkout");
    setOpenCartSheet(false);
  };

  return (
    <SheetContent className="sm:max-w-md flex flex-col bg-gradient-to-b from-white to-gray-50">
      <SheetHeader className="pb-6">
        <SheetTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full">
            <ShoppingCart className="h-5 w-5 text-amber-700" />
          </div>
          Your Cart ({cartItems.length})
        </SheetTitle>
      </SheetHeader>
      
      {/* Cart items with scrollable area */}
      <div 
        ref={cartItemsRef}
        className="flex-1 overflow-y-auto py-2 space-y-3 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
        onScroll={(e) => setIsScrolled(e.target.scrollTop > 0)}
      >
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <UserCartItemsContent 
              key={item.productId || item.id || item._id || index} 
              cartItem={item} 
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm">Discover amazing products and add them to your cart</p>
          </div>
        )}
      </div>

      {/* Sticky footer with total and checkout */}
      <div className="mt-auto p-4 space-y-3 bg-white border-t border-gray-200">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-medium text-gray-600">Subtotal</span>
          <span className="text-xl font-bold text-gray-900">${totalCartAmount.toFixed(2)}</span>
        </div>
        
        <Button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-xl text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={cartItems.length === 0}
          size="lg"
        >
          {cartItems.length > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Proceed to Checkout</span>
            </div>
          ) : (
            "Cart is Empty"
          )}
        </Button>

        {/* Scroll buttons (only show when needed) */}
        {showScrollButtons && (
          <div className="flex justify-center gap-2 pt-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleScroll('up')}
              disabled={!isScrolled}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full px-3 py-1"
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              Up
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleScroll('down')}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full px-3 py-1"
            >
              <ArrowDown className="h-3 w-3 mr-1" />
              Down
            </Button>
          </div>
        )}
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
