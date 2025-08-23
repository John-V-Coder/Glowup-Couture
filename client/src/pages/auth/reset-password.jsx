import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetPassword, clearError, clearMessage } from '@/store/auth-slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Lock, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, message, resetToken } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Get resetToken and email from location state (from verify-code page)
  const { resetToken: locationResetToken, email } = location.state || {};

  useEffect(() => {
    // Clear any existing messages when component mounts
    dispatch(clearError());
    dispatch(clearMessage());
    
    // Redirect if no reset token is available
    if (!resetToken && !locationResetToken) {
      navigate('/forgot-password');
    }
  }, [dispatch, resetToken, locationResetToken, navigate]);

  // Redirect to login after successful password reset
  useEffect(() => {
    if (message && (message.includes('successfully') || message.includes('reset successfully'))) {
      const timer = setTimeout(() => {
        navigate('/login', { 
          state: { 
            successMessage: 'Password reset successfully! You can now log in with your new password.' 
          }
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Clear general error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, lowercase letter, number, and special character';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Use resetToken from Redux store or location state
    const currentResetToken = resetToken || locationResetToken;
    
    if (!currentResetToken) {
      setFormErrors({ general: 'No valid reset token found. Please verify your code again.' });
      return;
    }

    try {
      const result = await dispatch(resetPassword({ 
        resetToken: currentResetToken, 
        newPassword: formData.newPassword 
      }));
      
      // Handle successful reset
      if (resetPassword.fulfilled.match(result)) {
        // Success is handled by the useEffect above
        console.log('Password reset successful');
      }
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 3) return 'bg-orange-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Very Weak';
    if (strength < 3) return 'Weak';
    if (strength < 4) return 'Fair';
    if (strength < 5) return 'Good';
    return 'Strong';
  };

  const getStrengthWidth = (strength) => {
    return `${(strength / 5) * 100}%`;
  };

  const passwordRequirements = [
    { test: (pwd) => pwd.length >= 8, text: 'At least 8 characters' },
    { test: (pwd) => /[a-z]/.test(pwd), text: 'One lowercase letter' },
    { test: (pwd) => /[A-Z]/.test(pwd), text: 'One uppercase letter' },
    { test: (pwd) => /\d/.test(pwd), text: 'One number' },
    { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), text: 'One special character' },
  ];

  const handleBackToVerification = () => {
    navigate('/verify-code', { 
      state: { email, fromPasswordReset: true }
    });
  };

  const isSuccess = message && (message.includes('successfully') || message.includes('reset successfully'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to verification button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToVerification}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Verification
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create New Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter a strong password to secure your account.
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

            {/* General Form Error */}
            {formErrors.general && (
              <Alert variant="destructive" className="border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  <div className="space-y-2">
                    <p>{formErrors.general}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBackToVerification}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Verify Code Again
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {isSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-2">
                    <p className="font-medium">{message}</p>
                    <p className="text-sm">Redirecting to login page...</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPasswords ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      onFocus={() => setPasswordFocused(true)}
                      className={`pr-10 ${formErrors.newPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your new password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {formErrors.newPassword && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.newPassword}
                    </p>
                  )}
                  
                  {/* Password strength indicator */}
                  {formData.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getStrengthColor(getPasswordStrength(formData.newPassword))}`}
                            style={{ width: getStrengthWidth(getPasswordStrength(formData.newPassword)) }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          getPasswordStrength(formData.newPassword) < 2 ? 'text-red-600' :
                          getPasswordStrength(formData.newPassword) < 3 ? 'text-orange-600' :
                          getPasswordStrength(formData.newPassword) < 4 ? 'text-yellow-600' :
                          getPasswordStrength(formData.newPassword) < 5 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {getStrengthText(getPasswordStrength(formData.newPassword))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Password requirements */}
                  {(passwordFocused || formData.newPassword) && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              req.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <span className={`text-xs ${
                              req.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    type={showPasswords ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={formErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.confirmPassword}
                    </p>
                  )}
                  
                  {/* Password match indicator */}
                  {formData.confirmPassword && formData.newPassword && (
                    <div className="flex items-center space-x-2">
                      {formData.newPassword === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || (!resetToken && !locationResetToken)}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Additional Links */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Sign in here
                </Link>
              </div>

              {(!resetToken && !locationResetToken) && (
                <div className="text-center text-sm text-gray-600">
                  Need to verify your code?{' '}
                  <button
                    onClick={handleBackToVerification}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium bg-transparent border-none cursor-pointer"
                  >
                    Enter verification code
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 bg-gray-100 p-3 rounded-md">
          <p className="flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1" />
            Your new password will be securely encrypted and stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;