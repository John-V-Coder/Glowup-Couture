// src/components/shopping-view/ShoppingCheckout.jsx

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-item-content";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewOrder } from "@/store/shop/order-slice";
import { ArrowDown, Smartphone, CreditCard, MapPin, User } from "lucide-react";
import Login from "@/pages/auth/login"; // Import the new unified Login component
import PageWrapper from "@/components/common/page-wrapper";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paypal");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);
  // Removed: authMode state is no longer needed

  const [billingInfo, setBillingInfo] = useState({
    firstName: user?.userName || "",
    email: user?.email || "",
  });

  const dispatch = useDispatch();
  const { toast } = useToast();
  const checkoutSectionRef = useRef(null);
  const navigate = useNavigate();

  // Fix: Redirect admin users to the dashboard after successful login.
  // This prioritizes the admin user flow over the standard checkout redirect.
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);


  // Initialize billing info when user data is available
  useEffect(() => {
    if (user) {
      setBillingInfo({
        firstName: user?.userName || "",
        email: user?.email || "",
      });
    }
  }, [user]);

  // Handle redirection for PayPal approval URL
  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  const totalCartAmount =
    cartItems?.items && cartItems.items.length > 0
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

  const finalTotal = totalCartAmount;

  function validateCheckoutData() {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to proceed with checkout",
        variant: "destructive",
      });
      return false;
    }
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to proceed with checkout",
        variant: "destructive",
      });
      return false;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address to proceed",
        variant: "destructive",
      });
      return false;
    }
    const name = (billingInfo.firstName || "").trim();
    const email = (billingInfo.email || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || name.length < 2 || !emailOk) {
      toast({
        title: "Billing Information Required",
        description: !emailOk ? "Enter a valid email address" : "Enter your full name (min 2 characters)",
        variant: "destructive",
      });
      return false;
    }
    if (selectedPaymentMethod === "mpesa" && (!mpesaPhone || mpesaPhone.length < 10)) {
      toast({
        title: "Invalid M-Pesa Number",
        description: "Please enter a valid M-Pesa phone number",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  function handleInitiatePaypalPayment() {
    if (!validateCheckoutData()) return;
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        name: singleCartItem?.title,
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
      billingInfo: { name: billingInfo.firstName?.trim(), firstName: billingInfo.firstName?.trim(), email: billingInfo.email?.trim() },
      orderStatus: "pending",
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((action) => {
      const ok =
        action?.meta?.requestStatus === "fulfilled" &&
        (action?.payload?.approvalURL || action?.payload?.orderId);
      if (ok) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Order Creation Failed",
          description: action?.payload?.message || "Please try again or contact support",
          variant: "destructive",
        });
      }
    });
  }

  function handleMpesaPayment() {
    if (!validateCheckoutData()) return;
    setIsProcessingMpesa(true);

    // Simulate M-Pesa payment processing
    setTimeout(() => {
      const orderData = {
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map((singleCartItem) => ({
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          name: singleCartItem?.title,
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
        billingInfo: { name: billingInfo.firstName?.trim(), firstName: billingInfo.firstName?.trim(), email: billingInfo.email?.trim() },
        orderStatus: "confirmed",
        paymentMethod: "mpesa",
        paymentStatus: "paid",
        totalAmount: totalCartAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymentId: `MPESA-${Date.now()}`,
        payerId: mpesaPhone,
      };

      dispatch(createNewOrder(orderData)).then((action) => {
        setIsProcessingMpesa(false);
        const ok = action?.meta?.requestStatus === "fulfilled" && action?.payload?.orderId;
        if (ok) {
          toast({
            title: "M-Pesa Payment Successful!",
            description: `Payment of ${totalCartAmount.toFixed(2)} completed via ${mpesaPhone}`,
          });
          navigate('/shop/payment-success');
        } else {
          toast({
            title: "Payment Failed",
            description: action?.payload?.message || "Please try again or contact support",
            variant: "destructive",
          });
        }
      });
    }, 3000);
  }

  const scrollToCheckout = () => {
    checkoutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBillingInfoChange = (field, value) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageWrapper message="Loading checkout...">
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src="https://via.placeholder.com/1500x200"
            alt="Secure checkout banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Billing & Shipping */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing or Auth Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">{isAuthenticated ? 'Billing Information' : 'Billing Account Here!'}</h2>
                </div>

                {!isAuthenticated ? (
                  <div className="max-w-md mx-auto">
                    {/* Render the unified Login component here */}
                    <Login />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={billingInfo.firstName}
                        onChange={(e) => handleBillingInfoChange("firstName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={billingInfo.email}
                        onChange={(e) => handleBillingInfoChange("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {/* PayPal Option */}
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === "paypal"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPaymentMethod("paypal")}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod === "paypal"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPaymentMethod === "paypal" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
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
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPaymentMethod("mpesa")}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod === "mpesa"
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPaymentMethod === "mpesa" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
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
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      M-Pesa Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="254712345678"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {/* Cart Items */}
                <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
                  {cartItems?.items && cartItems.items.length > 0 ? (
                    cartItems.items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">
                          KES - {((item.salePrice > 0 ? item.salePrice : item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                  )}
                </div>
                {/* Order Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>KES - {totalCartAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>KES - {totalCartAmount.toFixed(2)}</span>
                  </div>
                </div>
                {/* Checkout Button */}
                <div className="mt-6">
                  {selectedPaymentMethod === "paypal" ? (
                    <Button
                      onClick={handleInitiatePaypalPayment}
                      className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                      disabled={!isAuthenticated || isPaymentStart}
                    >
                      {!isAuthenticated ? "Sign in to continue" : (isPaymentStart ? "Processing PayPal Payment..." : "Pay with PayPal")}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleMpesaPayment}
                      className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 transition-colors"
                      disabled={!isAuthenticated || isProcessingMpesa}
                    >
                      {!isAuthenticated
                        ? "Sign in to continue"
                        : (isProcessingMpesa
                          ? "Processing M-Pesa Payment..."
                          : `Pay ${totalCartAmount.toFixed(2)} with M-Pesa`)}
                    </Button>
                  )}
                </div>
                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Floating navigation for mobile */}
        {cartItems?.items?.length > 3 && (
          <div className="fixed bottom-20 right-5 z-10 md:hidden">
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
        <div ref={checkoutSectionRef}></div>

      </div>
    </PageWrapper>
  );
}

export default ShoppingCheckout;