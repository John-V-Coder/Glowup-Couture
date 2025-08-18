import { useState, useEffect } from 'react';
import Preloader from './preloader';

function PageWrapper({ children, message = "Loading..." }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader message={message} />;
  }

  return children;
}

export default PageWrapper;