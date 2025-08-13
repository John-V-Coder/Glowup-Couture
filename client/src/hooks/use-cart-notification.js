import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import CartNotification from "@/components/shopping-view/cart-notification";

export function useCartNotification() {
  const { toast } = useToast();

  const showCartNotification = (productName) => {
    toast({
      duration: 5000,
      className: "border-green-200 bg-green-50",
      description: React.createElement(CartNotification, {
        productName: productName,
        onClose: () => {
          // Toast will auto-close after duration
        }
      }),
    });
  };

  return { showCartNotification };
}