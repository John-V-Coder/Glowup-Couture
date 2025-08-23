import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetPassword, clearError, clearMessage } from '@/store/auth-slice';

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

  // Get resetToken and email from location state
  const { resetToken: locationResetToken, email } = location.state || {};

  useEffect(() => {
    // Clear any existing messages when component mounts
    dispatch(clearError());
    dispatch(clearMessage());
    
    // Redirect if no reset token is available
    if (!resetToken && !locationResetToken) {
      navigate('/auth/forgot-password');
    }
  }, [dispatch, resetToken, locationResetToken, navigate]);

  // Redirect to login after successful password reset
  useEffect(() => {
    if (message && message.includes('successfully')) {
      const timer = setTimeout(() => {
        navigate('/auth/login');
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
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
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

    dispatch(resetPassword({ 
      resetToken: currentResetToken, 
      newPassword: formData.newPassword 
    }));
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Reset Password
      </h2>

      <p className="text-gray-600 text-center mb-6">
        Enter your new password below
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
          {message.includes('successfully') && (
            <p className="mt-2 text-sm">Redirecting to login...</p>
          )}
        </div>
      )}

      {formErrors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formErrors.general}
          <div className="mt-2">
            <Link
              to="/auth/verify-code"
              state={{ email }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Verify your code again
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                formErrors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPasswords ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {formErrors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
          )}
          
          {/* Password strength indicator */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded transition-all duration-300 ${getStrengthColor(getPasswordStrength(formData.newPassword))}`}
                    style={{ width: `${(getPasswordStrength(formData.newPassword) / 5) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${
                  getPasswordStrength(formData.newPassword) < 2 ? 'text-red-600' :
                  getPasswordStrength(formData.newPassword) < 4 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getStrengthText(getPasswordStrength(formData.newPassword))}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Use 6+ characters with uppercase, lowercase, numbers, and symbols
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type={showPasswords ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm new password"
          />
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || (!resetToken && !locationResetToken)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

        {(!resetToken && !locationResetToken) && (
          <div className="text-sm text-gray-600">
            Need to verify your code?{' '}
            <Link
              to="/auth/verify-code"
              state={{ email }}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Enter verification code
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;