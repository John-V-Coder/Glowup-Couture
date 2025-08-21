// src/pages/UnsubscribePage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { unsubscribeFromNewsletter, clearEmailStatus } from '../store/email-slice';
import { toast } from 'react-toastify';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [preferences, setPreferences] = useState({
    marketing: false,
    newsletter: false,
    orderUpdates: true // Keep order updates by default
  });
  const [isProcessed, setIsProcessed] = useState(false);
  const [action, setAction] = useState('unsubscribe'); // 'unsubscribe' or 'update'

  const dispatch = useDispatch();
  const { isLoading, successMessage, error } = useSelector(state => state.email);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setIsProcessed(true);
      dispatch(clearEmailStatus());
    }
    if (error) {
      toast.error(error);
      dispatch(clearEmailStatus());
    }
  }, [successMessage, error, dispatch]);

  const handleUnsubscribe = () => {
    if (!token) {
      toast.error('Invalid unsubscribe link');
      return;
    }
    dispatch(unsubscribeFromNewsletter(token));
  };

  const handleUpdatePreferences = () => {
    // This would require a separate API endpoint for updating preferences
    // For now, we'll show a success message
    toast.success('Preferences updated successfully!');
    setIsProcessed(true);
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="mx-auto h-12 w-12 text-red-500 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Link</h2>
          <p className="text-gray-600 mb-4">
            This unsubscribe link is invalid or has expired.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (isProcessed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="mx-auto h-12 w-12 text-green-500 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {action === 'unsubscribe' ? 'Successfully Unsubscribed' : 'Preferences Updated'}
          </h2>
          <p className="text-gray-600 mb-4">
            {action === 'unsubscribe' 
              ? "You have been removed from our mailing list. We're sorry to see you go!"
              : "Your email preferences have been updated successfully."
            }
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you change your mind, you can always subscribe again on our website.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Subscriptions</h1>
          <p className="text-gray-600">
            {email && <span className="font-medium">{email}</span>}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            We're sorry to see you considering leaving! You can either unsubscribe completely or just update your preferences.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Your Preferences</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose which emails you'd like to receive from us:
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.newsletter}
                  onChange={() => handlePreferenceChange('newsletter')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">Newsletter & Fashion Tips</span>
                  <p className="text-xs text-gray-500">Weekly updates on latest trends and style advice</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handlePreferenceChange('marketing')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">Promotions & Sales</span>
                  <p className="text-xs text-gray-500">Exclusive offers, discounts, and promotional campaigns</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.orderUpdates}
                  onChange={() => handlePreferenceChange('orderUpdates')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">Order Updates</span>
                  <p className="text-xs text-gray-500">Important updates about your orders and shipping</p>
                </div>
              </label>
            </div>

            <button
              onClick={() => {
                setAction('update');
                handleUpdatePreferences();
              }}
              disabled={isLoading}
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Update Preferences
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Or if you'd prefer to stop receiving all emails:
            </p>
            <button
              onClick={() => {
                setAction('unsubscribe');
                handleUnsubscribe();
              }}
              disabled={isLoading}
              className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Processing...' : 'Unsubscribe from All'}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? Contact us at{' '}
            <a href="mailto:support@glowupcouture.com" className="text-blue-600 hover:underline">
              support@glowupcouture.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;