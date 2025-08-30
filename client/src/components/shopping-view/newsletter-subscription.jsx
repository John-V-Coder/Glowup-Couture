import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToNewsletter, clearEmailStatus } from '@/store/email-slice';
import { toast } from 'react-toastify';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { isLoading, subscriptionStatus, successMessage, error } = useSelector(
    (state) => state.email
  );

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Email state on submit:', email);
    if (email) {
      dispatch(subscribeToNewsletter(email)); // now sending just the email
    }
  };

  useEffect(() => {
    if (subscriptionStatus === 'success') {
      toast.success(successMessage);
      setEmail(''); // clear the form after success
    } else if (subscriptionStatus === 'failed') {
      toast.error(error);
    }
    // NOTE: We are not clearing the status automatically anymore.
    // This allows the user to see the success or error message.
  }, [subscriptionStatus, successMessage, error, dispatch]);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Newsletter Subscription</h2>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row flex-wrap gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 w-full p-2 border rounded-md"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex-shrink-0 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-4 text-sm text-gray-500">
        To unsubscribe, please use the link provided in your email confirmation.
      </p>
    </div>
  );
};

export default NewsletterForm;
