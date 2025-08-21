import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeToNewsletter,
  clearEmailStatus,
} from "../../store/email-slice";
import { toast } from "react-toastify";

const NewsletterModal = ({ className = "" }) => {
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
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  /** Activity Tracking States */
  const [startTime] = useState(Date.now());
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [shoppingActivity, setShoppingActivity] = useState(0); // Minutes of shopping activity

  /** Track user activity for shopping time calculation */
  useEffect(() => {
    const trackActivity = () => {
      setLastActivity(Date.now());
    };

    const trackShoppingActivity = () => {
      // Track clicks on shopping-related elements
      const shoppingElements = document.querySelectorAll(
        '[data-shopping="true"], .product-card, .add-to-cart, .product-link, .category-link, .shop-now'
      );
      
      shoppingElements.forEach(element => {
        element.addEventListener('click', () => {
          setShoppingActivity(prev => prev + 0.5); // Add 30 seconds of shopping activity per interaction
        });
      });
    };

    // General activity tracking
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, trackActivity);
    });

    // Shopping-specific activity tracking
    trackShoppingActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
    };
  }, []);

  /** Check if modal should appear based on user type and activity */
  useEffect(() => {
    if (hasShown || user?.isSubscribed) return;

    const checkDisplayConditions = () => {
      const currentTime = Date.now();
      const timeOnSite = (currentTime - startTime) / (1000 * 60); // Minutes on site
      
      let shouldShow = false;

      if (!isAuthenticated) {
        // Show after 10 minutes for unauthenticated users
        shouldShow = timeOnSite >= 10;
      } else {
        // Show after 30 minutes of shopping activity for authenticated users
        shouldShow = shoppingActivity >= 30;
      }

      if (shouldShow && !isVisible) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    const interval = setInterval(checkDisplayConditions, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, shoppingActivity, startTime, hasShown, isVisible, user?.isSubscribed]);

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
      setIsVisible(false);
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

  /** Close modal */
  const handleClose = () => {
    setIsVisible(false);
  };

  /** Minimize modal */
  const handleMinimize = () => {
    setIsMinimized(true);
  };

  /** Restore modal from minimized state */
  const handleRestore = () => {
    setIsMinimized(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop - non-intrusive, doesn't block interactions */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none z-40 ${
          isMinimized ? 'bg-opacity-0' : 'bg-opacity-20'
        }`}
      />
      
      {/* Modal Container */}
      <div className={`fixed bottom-0 right-0 z-50 transition-all duration-500 ease-out ${
        isMinimized 
          ? 'transform translate-y-0 w-80 h-16' 
          : 'transform translate-y-0 w-96 max-w-[90vw]'
      }`}>
        
        {/* Minimized State */}
        {isMinimized && (
          <div 
            className="bg-blue-600 text-white p-4 rounded-tl-lg shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={handleRestore}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">📧 Newsletter Subscription</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="text-white hover:text-gray-200 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Full Modal */}
        {!isMinimized && (
          <div className={`bg-white rounded-tl-lg shadow-2xl border border-gray-200 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📧</span>
                  <h3 className="font-semibold">Stay Updated!</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleMinimize}
                    className="text-white hover:text-gray-200 text-sm font-bold w-6 h-6 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                    title="Minimize"
                  >
                    −
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-white hover:text-gray-200 text-sm font-bold w-6 h-6 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="text-sm text-blue-100 mt-1">
                Get exclusive offers, fashion tips & latest arrivals from GlowUp Couture
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
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
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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
          </div>
        )}
      </div>
    </>
  );
};

export default NewsletterModal;