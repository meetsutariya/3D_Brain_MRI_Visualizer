import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { destroyGUI } from './main';

const RouteListener = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      destroyGUI();
    }
  }, [location]);

  return null;
};

export default RouteListener;