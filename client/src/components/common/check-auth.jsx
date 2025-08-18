import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const { pathname } = location;

  console.log("Current path:", pathname, "Auth status:", isAuthenticated);

  // 1. Handle root path redirects
  if (pathname === "/") {
    return isAuthenticated
      ? <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} />
      : <Navigate to="/shop/home" />;
  }

  // 2. Handle unauthenticated users
  if (!isAuthenticated) {
    // Block access to protected routes
    if (pathname.includes("/checkout") || 
        pathname.includes("/account") || 
        pathname.includes("/admin")) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    // Allow access to public shop pages
    if (pathname.includes("/shop")) {
      return <>{children}</>;
    }
    // Allow access to auth pages
    if (pathname.includes("/auth")) {
      return <>{children}</>;
    }
    // Redirect any other paths to shop home
    return <Navigate to="/shop/home" replace />;
  }

  // 3. Handle authenticated users
  if (isAuthenticated) {
    // Redirect away from auth pages if already logged in
    if (pathname.includes("/auth")) {
      return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} replace />;
    }

    // Admin-specific rules
    if (user?.role === "admin") {
      // Block admin from accessing customer routes
      if (pathname.includes("/shop") || pathname.includes("/checkout")) {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Allow access to admin routes
      if (pathname.includes("/admin")) {
        return <>{children}</>;
      }
    } 
    // Customer-specific rules
    else {
      // Block customers from admin routes
      if (pathname.includes("/admin")) {
        return <Navigate to="/unauthorized" replace />;
      }
      // Allow access to shop and checkout
      if (pathname.includes("/shop") || pathname.includes("/checkout")) {
        return <>{children}</>;
      }
    }
  }

  // 4. Fallback for any unhandled routes
  return <Navigate to={isAuthenticated ? (user?.role === "admin" ? "/admin/dashboard" : "/shop/home") : "/shop/home"} replace />;
}

export default CheckAuth;