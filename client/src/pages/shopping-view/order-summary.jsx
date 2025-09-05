import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { createNewOrder } from '@/store/shop/order-slice';
import { 
  MapPin, 
  CreditCard, 
  Package, 
  ArrowLeft, 
  CheckCircle,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import PageWrapper from '@/components/common/page-wrapper';

function OrderSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.shopOrder);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutData = location.state;

  // Redirect if no checkout data
  useEffect(() => {
    if (!checkoutData) {
      navigate('/shop/checkout', { replace: true });
    }
  }, [checkoutData, navigate]);

  const actualCartItems = cartItems?.items || cartItems || [];
  
  // Calculate totals
  const subtotal = actualCartItems.reduce((total, item) => 
    total + (item.salePrice || item.price) * item.quantity, 0);
  const shippingFee = checkoutData?.shippingFee || 0;
  const couponDiscount = checkoutData?.couponDiscount || 0;
  const total = subtotal + shippingFee - couponDiscount;

  const handlePlaceOrder = async () => {
    if (!checkoutData || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user?.id,
        cartItems: actualCartItems,
        addressInfo: checkoutData.address,
        shipmentMethod: `${checkoutData.selectedCity} - ${checkoutData.selectedSubLocation}`,
        paymentMethod: "paystack",
        totalAmount: total,
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
      console.error('Order creation error:', error);
      toast({
        title: "Order Error",
        description: error.message || "Failed to create order. Please try again.",
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
    <PageWrapper message="Loading order summary...">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/shop/checkout')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Checkout
              </Button>
              <h1 className="text-3xl font-bold">Order Summary</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold">{checkoutData.address?.userName}</p>
                      <p>{checkoutData.address?.address}</p>
                      <p>{checkoutData.address?.city}, {checkoutData.address?.pincode}</p>
                      <p>Phone: {checkoutData.address?.phone}</p>
                      {checkoutData.address?.notes && (
                        <p className="text-sm text-gray-600">Notes: {checkoutData.address.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 w-5 text-orange-600" />
                      Shipping Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Delivery to {checkoutData.selectedCity} - {checkoutData.selectedSubLocation}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estimated delivery: 1-5 business days
                        </p>
                      </div>
                      <p className="font-semibold">KES {shippingFee.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Paystack</p>
                          <p className="text-sm text-gray-600">Secure payment gateway</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Secure</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                      Order Items ({actualCartItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {actualCartItems.map((item, index) => (
                        <div key={`${item.productId}-${item.size || index}`} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.image || "/placeholder-image.jpg"}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">
                              {item.category} • Size: {item.size || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              KES {((item.salePrice || item.price) * item.quantity).toFixed(2)}
                            </p>
                            {item.salePrice > 0 && (
                              <p className="text-xs text-gray-500 line-through">
                                KES {(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Total Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Order Total</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>KES {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span>KES {shippingFee.toFixed(2)}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Coupon Discount</span>
                          <span>-KES {couponDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>KES {total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 py-3"
                    >
                      {isProcessing || isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>

                    <div className="text-center text-xs text-gray-500 space-y-1">
                      <p>🔒 Secured by Paystack</p>
                      <p>Your payment information is encrypted and secure</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default OrderSummaryPage;