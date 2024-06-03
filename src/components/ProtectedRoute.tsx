import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  element: React.ElementType;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Element, path, ...rest }) => {
  const { isAuthenticated } = useAuth();

  const isPublicRoute = path === '/register' || path === '/reset-password' || path.startsWith('/reset-password/');

  if (isAuthenticated || isPublicRoute) {
    return <Element {...rest} />;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
