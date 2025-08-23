import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { verifyResetCode, requestPasswordReset, clearError, clearMessage } from '@/store/auth-slice';

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
    if (resetToken && message && message.includes('verified')) {
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

    dispatch(verifyResetCode({ email, code: verificationCode }));
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    
    dispatch(requestPasswordReset(email));
    setResendCooldown(60); // 60 second cooldown
    setCode(['', '', '', '', '', '']); // Clear current code
    inputRefs.current[0]?.focus(); // Focus first input
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Verify Code
      </h2>

      <p className="text-gray-600 text-center mb-6">
        We've sent a 6-digit verification code to{' '}
        <span className="font-medium text-gray-800">{email}</span>
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
          {resetToken && message.includes('verified') && (
            <p className="mt-2 text-sm">Redirecting to reset password form...</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !isCodeComplete}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? 'Verifying Code...' : 'Verify Code'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <div>
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:text-gray-400 disabled:hover:no-underline"
          >
            {resendCooldown > 0 
              ? `Resend code in ${resendCooldown}s` 
              : 'Resend verification code'
            }
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Want to use a different email?{' '}
          <Link
            to="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Go back
          </Link>
        </div>

        <div className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;