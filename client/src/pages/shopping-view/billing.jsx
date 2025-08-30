import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Smartphone, ArrowRight } from "lucide-react";
import PageWrapper from "@/components/common/page-wrapper";

function ShoppingBilling() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkoutData } = location.state || {}; // Data passed from checkout
  const { toast } = useToast();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paystack");
  const [mpesaPhone, setMpesaPhone] = useState("");

  // Redirect back if required data is missing
  useState(() => {
    if (!checkoutData) {
      navigate('/shop/checkout', { replace: true });
    }
  }, [checkoutData, navigate]);

  function validatePaymentData() {
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

  const handleProcessPayment = () => {
    if (!validatePaymentData()) return;

    // Process payment logic here
    // For now, navigate to order confirmation
    navigate('/shop/order-confirmation', {
      state: {
        ...checkoutData,
        selectedPaymentMethod,
        mpesaPhone
      }
    });
  };

  return (
    <PageWrapper message="Processing payment...">
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src="https://via.placeholder.com/1500x200"
            alt="Secure payment banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">Payment</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
              
              <div className="grid grid-cols-1 gap-4">
                {/* PayStack Option */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "paystack"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod("paystack")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod === "paystack"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPaymentMethod === "paystack" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">PayStack</p>
                        <p className="text-sm text-gray-600">Pay securely with PayStack</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center">MC</div>
                      <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center">VISA</div>
                      <div className="w-8 h-5 bg-green-500 rounded text-white text-xs flex items-center justify-center">MP</div>
                    </div>
                  </div>
                  
                  {selectedPaymentMethod === "paystack" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-center">
                          <div className="w-16 h-12 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-gray-500" />
                          </div>
                          <p className="text-sm text-gray-600">
                            After clicking "Pay now", you will be redirected to PayStack to complete your purchase securely.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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

            {/* Order Summary */}
            {checkoutData && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items Total:</span>
                    <span>KES {cartItems.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>KES {checkoutData.shippingFee || 0}.00</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>KES {(cartItems.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0) + (checkoutData.shippingFee || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleProcessPayment}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Complete Payment <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ShoppingBilling;