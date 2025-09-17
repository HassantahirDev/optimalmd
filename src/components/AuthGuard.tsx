import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuthToken, getUserType, isAuthenticatedAndValid } from '@/lib/utils';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getAuthToken();
    const userType = getUserType();
    
    // If we have a valid token and user type, and we're on a public route, redirect to dashboard
    if (isAuthenticatedAndValid() && userType) {
      const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/verify-email',
        '/verify-email-pending',
        '/leadership',
        '/how-it-works',
        '/our-services',
        '/privacy-policy',
        '/terms&service',
        '/contact-us',
        '/faqs',
        '/about-us',
        '/our-blog'
      ];
      
      // Check if current route is public
      if (publicRoutes.includes(location.pathname)) {
        // Redirect to dashboard based on user type
        if (userType === 'user') {
          navigate('/dashboard');
        } else if (userType === 'doctor') {
          navigate('/doctor-dashboard');
        }
      }
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthGuard;
