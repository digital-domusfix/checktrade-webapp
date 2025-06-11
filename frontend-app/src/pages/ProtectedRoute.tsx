import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const profile = useAuthStore((s) => s.profile);
  const location = useLocation();

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
