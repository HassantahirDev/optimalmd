import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getUserType, isAuthenticatedAndValid } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'user' | 'doctor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType = 'user' 
}) => {
  const navigate = useNavigate();

  if (!isAuthenticatedAndValid()) {
    navigate('/login');
    return null;
  }

  if (requiredUserType) {
    const userType = getUserType();
    if (userType !== requiredUserType) {
      navigate('/login');
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
