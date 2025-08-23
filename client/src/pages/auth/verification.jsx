import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetCode, requestPasswordReset, clearError, clearMessage } from '@/store/auth-slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

const VerifyCode = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, message, resetToken } = useSelector((state) => state.auth);
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Get email from location state or query params
  const email = location.state?.email || '';

  useEffect(() => {
    // Clear any existing messages when component mounts
    dispatch(clearError());
    dispatch(clearMessage());
    
    // Redirect if no email is provided
    if (!email) {
      navigate('/auth/forgot-password');
    }
  }, [dispatch, email, navigate]);

  // Auto-advance to reset password form when code is verified
  useEffect(() => {
    if (resetToken && message) {
      const timer = setTimeout(() => {
        navigate('/auth/reset-password', { 
          state: { email, resetToken } 
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [resetToken, message, navigate, email]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // Only digits
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus(); // Focus last input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      return;
    }

    if (!email) {
      return;
    }

    // Dispatch the verifyResetCode async thunk
    dispatch(verifyResetCode({ email, code: verificationCode }));
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    
    // Dispatch requestPasswordReset to send a new code
    dispatch(requestPasswordReset(email));
    setResendCooldown(60); // 60 second cooldown
    setCode(['', '', '', '', '', '']); // Clear current code
    inputRefs.current[0]?.focus(); // Focus first input
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent a 6-digit verification code to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {message}
                {resetToken && message && (
                  <p className="mt-2 text-sm">Redirecting to reset password form...</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold"
                  autoComplete="off"
                />
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isCodeComplete}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Verifying Code...' : 'Verify Code'}
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div>
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className="text-sm"
              >
                {resendCooldown > 0 
                  ? `Resend code in ${resendCooldown}s` 
                  : 'Resend verification code'
                }
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                Want to use a different email?{' '}
                <button
                  onClick={() => navigate('/auth/forgot-password')}
                  className="text-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
                >
                  Go back
                </button>
              </div>

              <div>
                Remember your password?{' '}
                <button
                  onClick={() => navigate('/auth/login')}
                  className="text-primary hover:underline font-medium bg-transparent border-none cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyCode;