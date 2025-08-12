import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Allow unauthenticated users to access shopping pages (except checkout)
  if (
    !isAuthenticated &&
    location.pathname.includes("/shop") &&
    !location.pathname.includes("/checkout") &&
    !location.pathname.includes("/account")
  ) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users to login for checkout and account pages
  if (
    !isAuthenticated &&
    (location.pathname.includes("/checkout") ||
      location.pathname.includes("/account"))
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect unauthenticated users to login for admin pages
  if (
    !isAuthenticated &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users away from login/register pages
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Protect admin routes from non-admin users
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Redirect admin users away from shop pages
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
