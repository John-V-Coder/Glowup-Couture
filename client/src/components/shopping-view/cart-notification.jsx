import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CartNotification({ productName, onClose }) {
  const navigate = useNavigate();

  const handleViewCart = () => {
    navigate("/shop/checkout");
    if (onClose) onClose();
  };

  const handleContinueShopping = () => {
    if (onClose) onClose();
  };

  return (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-lg border border-green-200">
      <div className="flex-shrink-0">
        <CheckCircle className="h-6 w-6 text-green-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          Added to cart!
        </p>
        <p className="text-sm text-gray-500 truncate">
          {productName}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleContinueShopping}
          className="text-xs"
        >
          Continue Shopping
        </Button>
        <Button
          size="sm"
          onClick={handleViewCart}
          className="text-xs bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          View Cart
        </Button>
      </div>
    </div>
  );
}

export default CartNotification;
