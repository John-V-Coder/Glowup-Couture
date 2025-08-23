import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, clearError, clearMessage } from '@/store/auth-slice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, message } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    dispatch(requestPasswordReset(email));
  };

  // Check if reset code was sent successfully
  useEffect(() => {
    if (message && message.includes('verification code')) {
      // Auto-redirect to verify code form after successful email submission
      const timer = setTimeout(() => {
        navigate('/auth/verify-code', { state: { email } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, email, navigate]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Reset Password
      </h2>

      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
          {message.includes('verification code') && (
            <p className="mt-2 text-sm">Redirecting to verification code form...</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? 'Sending Code...' : 'Send Verification Code'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <div className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Sign in here
          </Link>
        </div>

        <div className="text-sm text-gray-600">
          Already have a verification code?{' '}
          <Link
            to="/auth/verify-code"
            state={{ email }}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            Enter code
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;