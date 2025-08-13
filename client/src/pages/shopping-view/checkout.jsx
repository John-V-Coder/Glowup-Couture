import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-item-content";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import img from "../../assets/account.jpg";
import { createNewOrder } from "@/store/shop/order-slice";
import { ArrowUp, ArrowDown, Smartphone, CreditCard } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paypal");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const checkoutSectionRef = useRef(null);
  const navigate = useNavigate();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Please login or register to continue with checkout",
        description: "You need to be logged in to complete your purchase",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }
  }, [isAuthenticated, navigate, toast]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  function handleMpesaPayment() {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      toast({
        title: "Please enter a valid M-Pesa phone number",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingMpesa(true);
    
    // Simulate M-Pesa payment processing
    setTimeout(() => {
      const orderData = {
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map((singleCartItem) => ({
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          price:
            singleCartItem?.salePrice > 0
              ? singleCartItem?.salePrice
              : singleCartItem?.price,
          quantity: singleCartItem?.quantity,
        })),
        addressInfo: {
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          pincode: currentSelectedAddress?.pincode,
          phone: currentSelectedAddress?.phone,
          notes: currentSelectedAddress?.notes,
        },
        orderStatus: "confirmed",
        paymentMethod: "mpesa",
        paymentStatus: "paid",
        totalAmount: totalCartAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId: `MP${Date.now()}`,
        payerId: mpesaPhone,
      };

      dispatch(createNewOrder(orderData)).then((data) => {
        setIsProcessingMpesa(false);
        if (data?.payload?.success) {
          toast({
            title: "M-Pesa Payment Successful!",
            description: `Payment of $${totalCartAmount.toFixed(2)} completed via ${mpesaPhone}`,
          });
          navigate('/shop/payment-success');
        } else {
          toast({
            title: "Payment Failed",
            description: "Please try again or contact support",
            variant: "destructive",
          });
        }
      });
    }, 3000); // Simulate 3 second processing time
  }

  const scrollToCheckout = () => {
    checkoutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        
        <div className="flex flex-col gap-4">
          {/* Floating navigation button for long cart lists */}
          {cartItems?.items?.length > 3 && (
            <div className="fixed bottom-20 right-5 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg"
                onClick={scrollToCheckout}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Cart items section with max height and scroll */}
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items.map((item) => (
                  <UserCartItemsContent key={item.productId} cartItem={item} />
                ))
              : <p className="text-center text-gray-500">Your cart is empty</p>}
          </div>

          {/* Checkout section with ref for navigation */}
          <div ref={checkoutSectionRef} className="mt-8 space-y-4 sticky bottom-0 bg-white pt-4 pb-6 border-t">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Subtotal</span>
              <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            
            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Select Payment Method</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {/* PayPal Option */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "paypal" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("paypal")}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-600">Pay securely with PayPal</p>
                    </div>
                  </div>
                </div>

                {/* M-Pesa Option */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "mpesa" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("mpesa")}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">M-Pesa</p>
                      <p className="text-sm text-gray-600">Pay with M-Pesa mobile money</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* M-Pesa Phone Input */}
              {selectedPaymentMethod === "mpesa" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="254712345678"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">
                    Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 w-full">
              {selectedPaymentMethod === "paypal" ? (
                <Button 
                  onClick={handleInitiatePaypalPayment} 
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                  disabled={isPaymentStart}
                >
                  {isPaymentStart
                    ? "Processing PayPal Payment..."
                    : "Pay with PayPal"}
                </Button>
              ) : (
                <Button 
                  onClick={handleMpesaPayment} 
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                  disabled={isProcessingMpesa}
                >
                  {isProcessingMpesa
                    ? "Processing M-Pesa Payment..."
                    : `Pay $${totalCartAmount.toFixed(2)} with M-Pesa`}
                </Button>
              )}
            </div>

            {cartItems?.items?.length > 3 && (
              <div className="text-center mt-2">
                <Button
                  variant="link"
                  className="text-gray-600"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <ArrowUp className="h-4 w-4 mr-1" />
                  Back to top
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;