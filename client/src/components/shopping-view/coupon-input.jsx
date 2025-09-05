import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Percent, DollarSign, X, Tag, Gift, Sparkles } from "lucide-react";
import { validateCoupon, getAvailableCoupons, clearAppliedCoupon, clearErrors } from "@/store/shop/coupon-slice";

function CouponInput({ orderAmount, cartItems, userId, onCouponApplied }) {
  const [couponCode, setCouponCode] = useState("");
  const [showAvailable, setShowAvailable] = useState(false);
  
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const {
    availableCoupons,
    appliedCoupon,
    discountAmount,
    validatingCoupon,
    isLoading,
    validationError
  } = useSelector((state) => state.shopCoupons);

  useEffect(() => {
    if (userId) {
      dispatch(getAvailableCoupons(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (validationError) {
      toast({
        title: "Invalid Coupon",
        description: validationError,
        variant: "destructive"
      });
      dispatch(clearErrors());
    }
  }, [validationError, toast, dispatch]);

  useEffect(() => {
    if (appliedCoupon && discountAmount > 0) {
      onCouponApplied?.({
        coupon: appliedCoupon,
        discountAmount,
        finalAmount: orderAmount - discountAmount
      });
    }
  }, [appliedCoupon, discountAmount, orderAmount, onCouponApplied]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter Coupon Code",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    try {
      await dispatch(validateCoupon({
        code: couponCode.trim(),
        userId,
        orderAmount,
        cartItems
      })).unwrap();
      
      toast({
        title: "Coupon Applied!",
        description: `You saved KSH ${discountAmount.toFixed(2)}`,
        className: "border-green-200 bg-green-50"
      });
      setCouponCode("");
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearAppliedCoupon());
    onCouponApplied?.(null);
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order"
    });
  };

  const handleSelectAvailableCoupon = async (coupon) => {
    setCouponCode(coupon.code);
    setShowAvailable(false);
    
    try {
      await dispatch(validateCoupon({
        code: coupon.code,
        userId,
        orderAmount,
        cartItems
      })).unwrap();
      
      toast({
        title: "Coupon Applied!",
        description: `You saved KSH ${discountAmount.toFixed(2)}`,
        className: "border-green-200 bg-green-50"
      });
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const getDiscountDisplay = (coupon) => {
    if (coupon.type === 'percentage') {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <Percent className="w-4 h-4" />
          <span className="font-bold">{coupon.value}% OFF</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-bold">KSH {coupon.value} OFF</span>
        </div>
      );
    }
  };

  const getCustomerTypeBadge = (type) => {
    const badges = {
      top_buyer: <Badge className="bg-purple-100 text-purple-800">Top Buyer</Badge>,
      subscriber: <Badge className="bg-blue-100 text-blue-800">Subscriber</Badge>,
      new_customer: <Badge className="bg-green-100 text-green-800">New Customer</Badge>,
      general: <Badge variant="outline">General</Badge>
    };
    return badges[type] || <Badge variant="outline">Unknown</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Tag className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">{appliedCoupon.name}</p>
                  <p className="text-sm text-green-600">
                    Code: {appliedCoupon.code} • Saved: KSH {discountAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coupon Input */}
      {!appliedCoupon && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={validatingCoupon || !couponCode.trim()}
              className="px-6"
            >
              {validatingCoupon ? "Applying..." : "Apply"}
            </Button>
          </div>

          {/* Available Coupons */}
          {availableCoupons.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAvailable(!showAvailable)}
                className="text-blue-600 hover:text-blue-800 p-0 h-auto"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {showAvailable ? "Hide" : "Show"} available coupons ({availableCoupons.length})
              </Button>

              {showAvailable && (
                <div className="mt-3 space-y-2">
                  {availableCoupons.map((coupon) => (
                    <Card 
                      key={coupon.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-blue-100"
                      onClick={() => handleSelectAvailableCoupon(coupon)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Gift className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{coupon.name}</p>
                                {getCustomerTypeBadge(coupon.customerType)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Code: {coupon.code}
                                {coupon.minimumOrderAmount > 0 && (
                                  <span> • Min order: KSH {coupon.minimumOrderAmount}</span>
                                )}
                              </p>
                              {coupon.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {coupon.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {getDiscountDisplay(coupon)}
                            <p className="text-xs text-muted-foreground">
                              Expires: {new Date(coupon.validUntil).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CouponInput;