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
import { useEffect } from 'react';
import CheckAuth from './components/common/check-auth';
import { Skeleton } from './components/ui/skeleton';
import { checkAuth } from './store/auth-slice';
import { loadGuestCart } from './store/shop/cart-slice';
import PaypalCancelPage from './pages/shopping-view/PaypalCancelPage';

function App() {

  const { user,isAuthenticated,isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
     let token = null;
  try {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      token = JSON.parse(storedToken);
    }
  } catch (error) {
    console.error("Invalid token in sessionStorage", error);
  }

  dispatch(checkAuth(token));

  if (!token) {
    dispatch(loadGuestCart());
  }
}, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, JSON, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">

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
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="/shop/paypal-cancel" element={<PaypalCancelPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
