import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * A wrapper around routes that require authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 * If allowedRoles is provided, the user must have one of those roles to access the route.
 */
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('access_token') !== null;
  
  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If allowedRoles is provided and user doesn't have required role, redirect to unauthorized
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  // User is authenticated and has required role, render the children
  return children;
};

export default PrivateRoute;