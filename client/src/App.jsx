import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import AdminLayout from './components/admin-view/layout';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminProducts from './pages/admin-view/products';
import AdminOrders from './pages/admin-view/orders';
import AdminFeatures from './pages/admin-view/features';
import ShoppingLayout from './components/shopping-view/layout';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import SearchProducts from './pages/shopping-view/search';
import PaypalReturnPage from './pages/shopping-view/paypal-return';
import PaymentSuccessPage from './pages/shopping-view/payment-success';
import UnauthPage from './pages/unauth-page';
import NotFound from './pages/not-found';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import CheckAuth from './components/common/check-auth';
import Preloader from './components/common/preloader';
import RoutePreloader from './components/common/route-preloader.jsx';
import { checkAuth } from './store/auth-slice'; // Removed setLoadingFalse import
import { loadGuestCart } from './store/shop/cart-slice';
import PaypalCancelPage from './pages/shopping-view/PaypalCancelPage';
import AdminGallery from './pages/admin-view/gallery';
import AdminAbout from './pages/admin-view/about';
import ShoppingGallery from './pages/shopping-view/gallery';
import ShoppingAbout from './pages/shopping-view/about';
import ProductDetailsPage from './pages/shopping-view/product-details';
import TermsAndConditions from './pages/shopping-view/terms-and-conditions';
import ReturnRefundExchangePolicy from './pages/shopping-view/refund-refund-exchange';
import DeliveryPolicy from './pages/shopping-view/delivery-mechanism';
import SalePage from './pages/shopping-view/sale';
import ResetPassword from './pages/auth/reset-password';
import EmailTemplates from './components/common/email-templates';
import MarketingCampaigns from './pages/admin-view/marketing-campaign';
import SupportPage from './pages/shopping-view/customer-support';
import AdminNewsletterPage from './pages/admin-view/newsletter-page';
import AdminCustomersPage from './pages/admin-view/customer-page';
import VerifyCode from './pages/auth/verification';
import RequestPasswordReset from './pages/auth/request-reset-password';

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      let token = null;
      try {
        const sessionToken = sessionStorage.getItem("token");
        const localToken = localStorage.getItem("token");
        const storedToken = sessionToken || localToken;
        if (storedToken && storedToken !== "null" && storedToken !== "undefined") {
          token = JSON.parse(storedToken);
          if (localToken && !sessionToken) {
            sessionStorage.setItem("token", localToken);
          }
        }
      } catch (error) {
        console.error("Token parsing error:", error);
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
      }
      
      if (token) {
        // checkAuth will handle setting loading to false in its fulfilled/rejected cases
        dispatch(checkAuth());
      } else {
        // Load guest cart when no token is found
        // The auth slice will set isLoading to false in checkAuth.rejected
        dispatch(loadGuestCart());
      }
    };
    initializeAuth();
  }, [dispatch]);

  if (isLoading) return <Preloader message="Authenticating..." />;

  return (
    <RoutePreloader>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50"></div>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />} />
          <Route path="/auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout /></CheckAuth>}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
            <Route path="request-reset-password" element={<RequestPasswordReset/>} />
            <Route path="verify-code" element={<VerifyCode />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminLayout /></CheckAuth>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="customers" element={<AdminCustomersPage/>}/>
            <Route path="email-templates" element={<EmailTemplates />} />
            <Route path="marketing-campaign" element={<MarketingCampaigns />} />
            <Route path="newsletter" element={<AdminNewsletterPage/>} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
          </Route>

          {/* Shopping */}
          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="listing?category/sale" element={<SalePage />} />
            <Route path="gallery" element={<ShoppingGallery />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="paypal-cancel" element={<PaypalCancelPage />} />
          </Route>

          {/* Standalone Pages (direct routes) */}
          <Route path="/support" element={<ShoppingLayout />}>
            <Route index element={<SupportPage />} />
          </Route>
          <Route path="/terms" element={<ShoppingLayout />}>
            <Route index element={<TermsAndConditions />} />
          </Route>
          <Route path="/delivery" element={<ShoppingLayout />}>
            <Route index element={<DeliveryPolicy />} />
          </Route>
          <Route path="/returns" element={<ShoppingLayout />}>
            <Route index element={<ReturnRefundExchangePolicy />} />
          </Route>
          <Route path="/about" element={<ShoppingLayout />}>
            <Route index element={<ShoppingAbout />} />
          </Route>
          <Route path="/search" element={<ShoppingLayout />}>
            <Route index element={<SearchProducts />} />
          </Route>

          {/* Others */}
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </RoutePreloader>
  );
}

export default App;