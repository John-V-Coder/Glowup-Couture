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
import { useSelector, useDispatch  } from 'react-redux';
import { useEffect, useState } from 'react';
import CheckAuth from './components/common/check-auth';
import Preloader from './components/common/preloader';
import RoutePreloader from './components/common/route-preloader.jsx';
import { checkAuth, setLoadingFalse } from './store/auth-slice';
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


function App() {

  const { user,isAuthenticated,isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("App useEffect - Starting auth check");
      let token = null;
      
      try {
        // Try sessionStorage first, then localStorage as fallback
        const sessionToken = sessionStorage.getItem("token");
        const localToken = localStorage.getItem("token");
        const storedToken = sessionToken || localToken;
        
        console.log("Stored token:", storedToken);
        
        if (storedToken && storedToken !== "null" && storedToken !== "undefined") {
          token = JSON.parse(storedToken);
          console.log("Parsed token:", token);
          
          // If token was in localStorage but not sessionStorage, sync it
          if (localToken && !sessionToken) {
            sessionStorage.setItem("token", localToken);
          }
        }
      } catch (error) {
        console.error("Invalid token in storage", error);
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
      }

      if (token) {
        console.log("Token found, checking auth...");
        dispatch(checkAuth(token));
      } else {
        console.log("No token found, setting loading false and loading guest cart");
        dispatch(setLoadingFalse());
        dispatch(loadGuestCart());
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isLoading) return <Preloader message="Authenticating..." />;

  console.log(isLoading, JSON, user);

  return (
    <RoutePreloader>
        <div className="flex flex-col min-h-screen">
           <div className="sticky top-0 z-50">
         
        </div>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={<ShoppingLayout />}
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="listing?category/sale" element={<SalePage />} />
          <Route path="gallery" element={<ShoppingGallery />} />
          <Route path="about" element={<ShoppingAbout />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="return-refund-exchange" element={<ReturnRefundExchangePolicy/>} />
          <Route path="/shop/paypal-cancel" element={<PaypalCancelPage />} />
          <Route path="delivery-mechanism" element={<DeliveryPolicy/>} />
          <Route path="terms-and-conditions" element={<TermsAndConditions/>} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </div>
    </RoutePreloader>
    
  );
}

export default App;
