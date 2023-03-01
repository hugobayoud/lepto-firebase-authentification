import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '../context/AuthContext';

// Use it in App.js for each route which needs to be protected
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthState();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
