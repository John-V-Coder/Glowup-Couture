import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { createNewOrder } from "@/store/shop/order-slice";
import PageWrapper from "@/components/common/page-wrapper";

function ShoppingBilling() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { checkoutData } = location.state || {}; // Data passed from checkout
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect back if required data is missing
  useEffect(() => {
    if (!checkoutData) {
      navigate('/shop/checkout', { replace: true });
    }
  }, [checkoutData, navigate]);

  const handleProcessPayment = async () => {
    if (!checkoutData || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user?.id,
        cartItems: cartItems?.items || cartItems || [],
        addressInfo: checkoutData.address,
        shipmentMethod: `${checkoutData.selectedCity} - ${checkoutData.selectedSubLocation}`,
        paymentMethod: "paystack",
        totalAmount: (cartItems?.items || cartItems || []).reduce((total, item) => 
          total + (item.salePrice || item.price) * item.quantity, 0) + checkoutData.shippingFee,
        cartId: cartItems?._id,
        customerEmail: checkoutData.contactInfo?.email,
        customerName: checkoutData.address?.userName || user?.userName || 'Guest Customer',
        couponCode: checkoutData.couponCode || null,
      };

      const result = await dispatch(createNewOrder(orderData)).unwrap();
      
      if (result.success && result.approvalURL) {
        // Redirect to Paystack payment page
        window.location.href = result.approvalURL;
      } else {
        throw new Error(result.message || 'Failed to create payment session');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) {
    return (
      <PageWrapper message="Loading...">
        <div className="min-h-screen flex items-center justify-center">
          <p>Redirecting to checkout...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper message="Processing payment...">
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src="https://via.placeholder.com/1500x200"
            alt="Secure payment with Paystack"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">Secure Payment</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            
            {/* Payment Method Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Payment via Paystack</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You will be redirected to Paystack's secure payment page to complete your transaction.
              </p>
              
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Paystack Secure Payment</p>
                      <p className="text-sm text-gray-600">Multiple payment options available</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">M-PESA</div>
                    <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">BANK</div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">
                      Secure payment powered by Paystack
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports Cards, Bank Transfer, M-Pesa, and more
                    </p>
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
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Total:</span>
                  <span>KES {((cartItems?.items || cartItems || []).reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>KES {(checkoutData?.shippingFee || 0).toFixed(2)}</span>
                </div>
                {checkoutData?.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount:</span>
                    <span>-KES {checkoutData.couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>KES {(
                      (cartItems?.items || cartItems || []).reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0) + 
                      (checkoutData?.shippingFee || 0) - 
                      (checkoutData?.couponDiscount || 0)
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Complete Payment <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              🔒 Your payment information is protected by Paystack's industry-leading security
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ShoppingBilling;