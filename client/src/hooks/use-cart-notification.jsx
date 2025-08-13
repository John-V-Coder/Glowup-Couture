import { useToast } from "@/components/ui/use-toast";
import CartNotification from "@/components/shopping-view/cart-notification";

export function useCartNotification() {
  const { toast, dismiss } = useToast();

  const showCartNotification = (productName) => {
    const { id } = toast({
      duration: 5000, // Show for 5 seconds
      className: "border-green-200 bg-green-50",
      description: (
        <CartNotification 
          productName={productName}
          onClose={() => dismiss()}
        />
      ),
    });
  };

  return { showCartNotification };
}
