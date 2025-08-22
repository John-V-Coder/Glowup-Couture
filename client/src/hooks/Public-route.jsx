import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = ({ isAuthenticated, redirectPath = '/' }) => {
  // If the user is authenticated, they should not see public-only routes (like login/register).
  // Redirect them to the specified path, which is usually the dashboard or home page.
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // If the user is NOT authenticated, allow them to view the public routes.
  return <Outlet />;
};

export default PublicRoute;