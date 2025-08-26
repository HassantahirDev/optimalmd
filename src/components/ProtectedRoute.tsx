import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getUserType } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'user' | 'doctor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType = 'user' 
}) => {
  const navigate = useNavigate();

  // Simple check: if no token in localStorage, redirect to login
  const token = getAuthToken();
  if (!token) {
    navigate('/login');
    return null;
  }

  // Check user type if required
  if (requiredUserType) {
    const userType = getUserType();
    if (userType !== requiredUserType) {
      navigate('/login');
      return null;
    }
  }

  // If we get here, user is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
