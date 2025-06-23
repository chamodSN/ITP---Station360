import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/authAdmin';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAdminAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
