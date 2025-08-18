import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from './preloader';

function RoutePreloader({ children }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) {
    return <Preloader message="Loading page..." />;
  }

  return children;
}

export default RoutePreloader;