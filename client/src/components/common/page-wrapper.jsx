import { useState, useEffect } from 'react';
import Preloader from './preloader';

function PageWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Preloader/>
      ) : (
        children
      )}
    </>
  );
}

export default PageWrapper;