import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { capturePayment } from "@/store/shop/order-slice";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import PageWrapper from "@/components/common/page-wrapper";

function PaymentReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');
  
  const params = new URLSearchParams(location.search);
  const reference = params.get("reference");
  const trxref = params.get("trxref");

  useEffect(() => {
    const paymentReference = reference || trxref;
    
    if (paymentReference) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      
      dispatch(capturePayment({ reference: paymentReference, orderId })).then((data) => {
        if (data?.payload?.success) {
          setPaymentStatus('success');
          sessionStorage.removeItem("currentOrderId");
          sessionStorage.removeItem("currentOrderReference");
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            window.location.href = "/shop/payment-success";
          }, 2000);
        } else {
          setPaymentStatus('failed');
          setErrorMessage(data?.payload?.message || 'Payment verification failed');
        }
      }).catch((error) => {
        setPaymentStatus('failed');
        setErrorMessage('An error occurred while processing your payment');
        console.error("Payment capture error:", error);
      });
    } else {
      setPaymentStatus('failed');
      setErrorMessage('No payment reference found');
    }
  }, [reference, trxref, dispatch]);

  return (
    <PageWrapper message="Processing payment...">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {paymentStatus === 'processing' && <Loader2 className="w-6 h-6 animate-spin text-blue-500" />}
              {paymentStatus === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
              {paymentStatus === 'failed' && <XCircle className="w-6 h-6 text-red-500" />}
              
              {paymentStatus === 'processing' && "Processing Payment"}
              {paymentStatus === 'success' && "Payment Successful"}
              {paymentStatus === 'failed' && "Payment Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {paymentStatus === 'processing' && (
              <p className="text-gray-600">
                Please wait while we verify your payment with Paystack...
              </p>
            )}
            
            {paymentStatus === 'success' && (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">
                  Your payment has been confirmed successfully!
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting you to the confirmation page...
                </p>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  {errorMessage}
                </p>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => window.location.href = "/shop/checkout"}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = "/shop/home"}
                    className="w-full"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default PaymentReturnPage;