import { useLocation, Navigate } from "react-router-dom";


// Main authentication guard component
export function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const { pathname } = location;

  // For debugging purposes
  console.log(`Checking auth for: ${pathname}, isAuthenticated: ${isAuthenticated}`);

  // Rule 1: Handle authenticated users on auth pages
  if (isAuthenticated && pathname.startsWith("/auth/")) {
    // Redirect based on role
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  // Rule 2: Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" replace />;
    }
  }

  // Rule 3: Redirect admins away from shop pages
  if (isAuthenticated && user?.role === "admin" && pathname.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Rule 4: Protect specific user routes
  const protectedUserRoutes = ["/shop/checkout", "/shop/account"];
  if (!isAuthenticated && protectedUserRoutes.some(route => pathname.startsWith(route))) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If no rules match, render the requested component
  return <>{children}</>;
}

export default CheckAuth;