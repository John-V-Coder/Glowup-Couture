import { useNavigate } from "react-router-dom";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-item-content";
import { ArrowUp, ArrowDown, ShoppingCart } from "lucide-react";
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
    <SheetContent className="sm:max-w-md flex flex-col">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Cart ({cartItems.length})
        </SheetTitle>
      </SheetHeader>
      
      {/* Cart items with scrollable area */}
      <div 
        ref={cartItemsRef}
        className="flex-1 overflow-y-auto py-4 space-y-4"
        onScroll={(e) => setIsScrolled(e.target.scrollTop > 0)}
      >
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <UserCartItemsContent 
              key={item.id || item._id || index} 
              cartItem={item} 
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-8">
            <ShoppingCart className="h-12 w-12 mb-4 text-gray-300" />
            <p>Your cart is empty</p>
            <p className="text-sm mt-2">Add some items to get started</p>
          </div>
        )}
      </div>

      {/* Scroll buttons (only show when needed) */}
      {showScrollButtons && (
        <div className="flex justify-center gap-4 py-2 border-t">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleScroll('up')}
            disabled={!isScrolled}
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Scroll Up
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleScroll('down')}
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Scroll Down
          </Button>
        </div>
      )}

      {/* Sticky footer with total and checkout */}
      <div className="sticky bottom-0 bg-background pt-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-bold">Subtotal</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
        
        <Button
          onClick={handleCheckout}
          className="w-full"
          disabled={cartItems.length === 0}
          size="lg"
        >
          {cartItems.length > 0 ? "Proceed to Checkout" : "Cart is Empty"}
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;