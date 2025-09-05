import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewOrder } from '@/store/shop/order-slice';
import { useToast } from '@/components/ui/use-toast';

const PaystackPayment = ({ 
  orderData, 
  onSuccess, 
  onError, 
  onClose,
  disabled = false 
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isLoading } = useSelector(state => state.shopOrder);

  const initializePayment = async () => {
    if (disabled) return;
    
    try {
      const result = await dispatch(createNewOrder(orderData)).unwrap();
      
      if (result.success && result.approvalURL) {
        // Redirect to Paystack payment page
        window.location.href = result.approvalURL;
      } else {
        throw new Error(result.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
      
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="paystack-payment-container">
      <button
        onClick={initializePayment}
        disabled={disabled || isLoading}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
          disabled || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Pay with Paystack'
        )}
      </button>
      
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>🔒 Secured by Paystack</span>
          <span>•</span>
          <span>256-bit SSL encryption</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Supports Cards, Bank Transfer, M-Pesa, and other payment methods
        </p>
      </div>
    </div>
  );
};

export default PaystackPayment;