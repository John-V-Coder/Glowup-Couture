import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeToNewsletter,
  clearEmailStatus,
} from "../../store/email-slice";
import { toast } from "react-toastify";

const NewsletterSubscription = ({ className = "" }) => {
  const dispatch = useDispatch();

  /** Redux States */
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const {
    isLoading,
    subscriptionStatus,
    successMessage,
    error,
  } = useSelector((state) => state.email);

  /** Local States */
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    marketing: true,
    orderUpdates: true,
    newsletter: true,
  });
  const [showPreferences, setShowPreferences] = useState(false);

  /** Prefill email if logged in */
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  /** Handle subscription result */
  useEffect(() => {
    if (subscriptionStatus === "success") {
      toast.success(successMessage || "Successfully subscribed!");
      if (!isAuthenticated) setEmail("");
      setShowPreferences(false);
      dispatch(clearEmailStatus());
    }
    if (subscriptionStatus === "failed") {
      toast.error(error || "Subscription failed");
      dispatch(clearEmailStatus());
    }
  }, [
    subscriptionStatus,
    successMessage,
    error,
    dispatch,
    isAuthenticated,
  ]);

  /** Auto-subscribe logged-in users if not subscribed */
  useEffect(() => {
    if (
      isAuthenticated &&
      user?.email &&
      !user?.isSubscribed
    ) {
      dispatch(subscribeToNewsletter({ email: user.email, preferences }));
    }
  }, [isAuthenticated, user, preferences, dispatch]);

  /** Submit form handler */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    dispatch(subscribeToNewsletter({ email, preferences }));
  };

  /** Toggle preference */
  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md ${className}`}
    >
      {/* Heading */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Stay Updated with GlowUp Couture
        </h3>
        <p className="text-sm text-gray-600">
          Subscribe for exclusive offers, fashion tips & latest arrivals
        </p>
      </div>

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          disabled={isLoading || isAuthenticated}
        />

        {/* Preferences Toggle */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            {showPreferences ? "Hide" : "Customize"} Preferences
          </button>
        </div>

        {/* Preferences List */}
        {showPreferences && (
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              Email Preferences:
            </p>

            {[
              {
                key: "newsletter",
                label: "Weekly newsletter & fashion tips",
              },
              {
                key: "marketing",
                label: "Exclusive offers & promotions",
              },
              {
                key: "orderUpdates",
                label: "Order updates & shipping notifications",
              },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center space-x-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={() => handlePreferenceChange(key)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors 
          ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 
                     0 0 5.373 0 12h4zm2 5.291A7.962 
                     7.962 0 014 12H0c0 3.042 1.135 
                     5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            "Subscribe Now"
          )}
        </button>
      </form>

      {/* Footer Note */}
      <p className="text-xs text-gray-500 text-center mt-3">
        By subscribing, you agree to our privacy policy. You can
        unsubscribe anytime.
      </p>
    </div>
  );
};

export default NewsletterSubscription;
