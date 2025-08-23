import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset, clearError, clearMessage } from '@/store/auth-slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Mail, ArrowLeft, Clock } from 'lucide-react';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { isLoading, error, message } = useSelector((state) => state.auth);
  
  // Local state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showSuccessState, setShowSuccessState] = useState(false);

  useEffect(() => {
    // Clear any existing messages when component mounts
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
    // Clear any previous error messages when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    try {
      const result = await dispatch(requestPasswordReset(email.trim()));
      
      // Check if the request was successful
      if (requestPasswordReset.fulfilled.match(result)) {
        setShowSuccessState(true);
        
        // Auto-redirect after 3 seconds, but allow manual navigation
        setTimeout(() => {
          navigate('/auth/verify-code', { 
            state: { email: email.trim(), fromPasswordReset: true }
          });
        }, 3000);
      }
    } catch (err) {
      // Error handling is managed by Redux
      console.error('Password reset request failed:', err);
    }
  };

  const handleManualContinue = () => {
    navigate('/auth/verify-code', { 
      state: { email: email.trim(), fromPasswordReset: true }
    });
  };

  const handleBackToLogin = () => {
    navigate('/auth//login');
  };

  const handleGoToVerification = () => {
    navigate('/auth//verify-code');
  };

  // Check if we have a success message
  const isSuccess = message && !error && !isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to login button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email address and we'll send you a verification code to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert with Auto-redirect */}
            {isSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-3">
                    <p className="font-medium">{message}</p>
                    <div className="flex items-center space-x-2 text-sm text-green-700">
                      <Clock className="w-4 h-4" />
                      <span>Redirecting to verification in 3 seconds...</span>
                    </div>
                    <Button 
                      onClick={handleManualContinue}
                      variant="outline" 
                      size="sm"
                      className="w-full border-green-300 text-green-700 hover:bg-green-100"
                    >
                      Continue to Verification →
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            {!showSuccessState && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`${emailError ? 'border-red-300 focus:border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                    autoFocus
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {emailError}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Sending Verification Code...
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            )}

            {/* Additional Links */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  onClick={handleBackToLogin}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium bg-transparent border-none cursor-pointer"
                >
                  Sign in here
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                Already have a verification code?{' '}
                <button
                  onClick={handleGoToVerification}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium bg-transparent border-none cursor-pointer"
                >
                  Enter code
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>Having trouble? The verification code will be sent to your email address.</p>
          <p className="mt-1">Check your spam folder if you don't see it in your inbox.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;