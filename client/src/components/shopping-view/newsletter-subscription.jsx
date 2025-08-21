import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToNewsletter, clearEmailStatus } from '@/store/email-slice';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { isLoading, successMessage, error } = useSelector(state => state.email);

  /** Activity Tracking States */
  const [startTime] = useState(Date.now());
  const [shoppingActivity, setShoppingActivity] = useState(0); // Minutes of shopping activity

  /** Track user shopping activity */
  useEffect(() => {
    const trackShoppingActivity = () => {
      // Track clicks on shopping-related elements
      const shoppingElements = document.querySelectorAll(
        '[data-shopping="true"], .product-card, .add-to-cart, .product-link, .category-link, .shop-now, .product-item, .cart-btn, .buy-now'
      );
      
      const handleShoppingClick = () => {
        setShoppingActivity(prev => prev + 0.5); // Add 30 seconds per shopping interaction
      };

      shoppingElements.forEach(element => {
        element.addEventListener('click', handleShoppingClick);
      });

      // Cleanup function
      return () => {
        shoppingElements.forEach(element => {
          element.removeEventListener('click', handleShoppingClick);
        });
      };
    };

    const cleanup = trackShoppingActivity();
    
    // Re-track when DOM changes (for dynamic content)
    const observer = new MutationObserver(trackShoppingActivity);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cleanup && cleanup();
      observer.disconnect();
    };
  }, []);

  /** Show popup based on user type and activity */
  useEffect(() => {
    if (hasShown || user?.isSubscribed) return;

    let timer;

    const checkDisplayConditions = () => {
      const currentTime = Date.now();
      const timeOnSite = (currentTime - startTime) / (1000 * 60); // Minutes on site
      
      let shouldShow = false;
      let displayTime = 0;

      if (!isAuthenticated) {
        // Show after 10 minutes for unauthenticated users
        shouldShow = timeOnSite >= 10;
        displayTime = 10 * 60 * 1000; // 10 minutes in milliseconds
      } else {
        // Show after 30 minutes of shopping activity for authenticated users
        shouldShow = shoppingActivity >= 30;
        displayTime = 30 * 60 * 1000; // 30 minutes in milliseconds
      }

      if (shouldShow && !showPopup) {
        setShowPopup(true);
        setIsVisible(true);
        setHasShown(true);
        
        // Auto-hide after 5 minutes of being displayed
        timer = setTimeout(() => {
          handleClose();
        }, 5 * 60 * 1000); // 5 minutes visible
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkDisplayConditions, 30000);
    
    return () => {
      clearInterval(interval);
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, shoppingActivity, startTime, hasShown, showPopup, user?.isSubscribed]);

  /** Prefill email if authenticated */
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  /** Handle subscription success/error */
  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        handleClose();
        dispatch(clearEmailStatus());
      }, 2000);
    }
  }, [successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(subscribeToNewsletter({ email, preferences: ['updates'] }));
    if (!isAuthenticated) setEmail('');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowPopup(false), 300); // Wait for fade-out animation
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  if (!showPopup) return null;

  return (
    <>
      {/* Non-intrusive backdrop */}
      <div className={`fixed inset-0 bg-black pointer-events-none z-40 transition-opacity duration-300 ${
        isVisible && !isMinimized ? 'bg-opacity-10' : 'bg-opacity-0'
      }`} />
      
      {/* Modal Container - slides from bottom */}
      <div className={`fixed bottom-0 right-4 z-50 transition-all duration-500 ease-out ${
        isMinimized 
          ? 'transform translate-y-0 w-80' 
          : 'transform translate-y-0 w-96 max-w-[90vw]'
      } ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        
        {/* Minimized State */}
        {isMinimized && (
          <div 
            className="bg-blue-600 text-white p-3 rounded-t-lg shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={handleRestore}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Newsletter Subscription</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="text-white hover:text-gray-200 ml-2"
                aria-label="Close newsletter popup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Full Modal */}
        {!isMinimized && (
          <div className="relative bg-white rounded-t-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header with minimize/close buttons */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-bold">Stay Updated</h3>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={handleMinimize}
                  className="text-white hover:text-gray-200 p-1 rounded transition-colors"
                  aria-label="Minimize newsletter popup"
                  title="Minimize"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button 
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 p-1 rounded transition-colors"
                  aria-label="Close newsletter popup"
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-center">Subscribe to our newsletter for the latest updates and exclusive content.</p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading || isAuthenticated}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </>
                    ) : 'Subscribe'}
                  </button>
                </div>
              </form>

              {/* Messages */}
              {successMessage && (
                <div className="p-3 mb-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
                  {successMessage}
                </div>
              )}
              
              {error && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                  {error}
                </div>
              )}
              
              {/* Footer note */}
              <p className="text-xs text-gray-500 text-center">You can unsubscribe at any time</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}