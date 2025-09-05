import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
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
import PaymentReturnPage from './pages/shopping-view/paystack-return';
import PaymentSuccessPage from './pages/shopping-view/payment-success';
import UnauthPage from './pages/unauth-page';
import NotFound from './pages/not-found';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import CheckAuth from './components/common/check-auth';
import Preloader from './components/common/preloader';
import RoutePreloader from './components/common/route-preloader.jsx';
import { loadGuestCart } from './store/shop/cart-slice';
import PaymentCancelPage from './pages/shopping-view/PaystackCancelPage';
import AdminGallery from './pages/admin-view/gallery';
import AdminAbout from './pages/admin-view/about';
import ShoppingGallery from './pages/shopping-view/gallery';
import ShoppingAbout from './pages/shopping-view/about';
import ProductDetailsPage from './pages/shopping-view/product-details';
import TermsAndConditions from './pages/shopping-view/terms-and-conditions';
import ReturnRefundExchangePolicy from './pages/shopping-view/refund-refund-exchange';
import DeliveryPolicy from './pages/shopping-view/delivery-mechanism';
import SalePage from './pages/shopping-view/sale';
import SupportPage from './pages/shopping-view/customer-support';
import AdminCustomersPage from './pages/admin-view/customer-page';
import ProductStatsAdmin from './pages/admin-view/analysis';
import VerifyLoginCode from './pages/auth/verification';
import { checkAuth } from './store/auth-slice'; 
import ShoppingBilling from './pages/shopping-view/billing';
import OrderSummaryPage from './pages/shopping-view/order-summary';
import SendCampaignForm from './components/admin-view/send-campaign-form';
import EmailTemplatesManager from './components/admin-view/email-template';
import NewsletterSubscribers from './pages/admin-view/newsletter-subs';
import AdminCoupons from './pages/admin-view/coupons';

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch checkAuth on component mount to verify stored token
    dispatch(checkAuth());
    
    // Load guest cart if not authenticated
    if (!isAuthenticated) {
      dispatch(loadGuestCart());
    }
  }, [dispatch, isAuthenticated]); 

  if (isLoading) return <Preloader message="Authenticating..." />;

  return (
    <RoutePreloader>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50"></div>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Navigate to="/shop/home" replace />} />
          <Route path="/auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout /></CheckAuth>}>
            <Route path="login" element={<AuthLogin />} /> 
            <Route path="verify-code" element={<VerifyLoginCode />} />
          </Route>
          {/* Admin */}
          <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminLayout /></CheckAuth>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="customers" element={<AdminCustomersPage/>}/>
            <Route path="email/campaigns" element={<SendCampaignForm />} />
            <Route path="email/templates" element={<EmailTemplatesManager />} />
            <Route path="email/subscribers" element={<NewsletterSubscribers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="analysis" element={<ProductStatsAdmin />} />
            <Route path="coupons" element={<AdminCoupons />} />
          </Route>

          {/* Shopping and Public Routes */}
          <Route element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout /></CheckAuth>}>
            <Route path="/shop/home" element={<ShoppingHome />} />
            <Route path="/shop/listing" element={<ShoppingListing />} />
            <Route path="/shop/sale" element={<SalePage />} />
            <Route path="/shop/gallery" element={<ShoppingGallery />} />
            <Route path="/shop/product/:id" element={<ProductDetailsPage />} />
            <Route path="/shop/checkout" element={<ShoppingCheckout />} />
            <Route path="/shop/account" element={<ShoppingAccount />} />
            <Route path="/shop/billing" element={<ShoppingBilling/>} />
            <Route path="/shop/order-summary" element={<OrderSummaryPage />} />
            <Route path="/shop/payment-return" element={<PaymentReturnPage />} />
            <Route path="/shop/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/shop/payment-cancel" element={<PaymentCancelPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/delivery" element={<DeliveryPolicy />} />
            <Route path="/returns" element={<ReturnRefundExchangePolicy />} />
            <Route path="/about" element={<ShoppingAbout />} />
            <Route path="/search" element={<SearchProducts />} />
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