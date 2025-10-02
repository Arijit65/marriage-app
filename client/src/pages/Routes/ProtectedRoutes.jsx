import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, isRRAuthenticated, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check role-based authentication
      let hasAccess = false;

      console.log('🛡️ ProtectedRoute checking auth for role:', requiredRole);
      console.log('🛡️ isAdminAuthenticated:', isAdminAuthenticated);
      console.log('🛡️ isRRAuthenticated:', isRRAuthenticated);
      console.log('🛡️ isAuthenticated:', isAuthenticated);

      if (requiredRole === 'admin') {
        hasAccess = isAdminAuthenticated;
        console.log('🛡️ Admin route - hasAccess:', hasAccess);
        if (!hasAccess) {
          console.log('❌ Admin not authenticated, redirecting to admin-login');
          navigate('/admin-login', {
            state: {
              from: location.pathname,
              message: 'Please login as admin to access this page'
            }
          });
          return;
        }
      } else if (requiredRole === 'rr') {
        hasAccess = isRRAuthenticated;
        if (!hasAccess) {
          navigate('/rr-login', { 
            state: { 
              from: location.pathname,
              message: 'Please login as RR to access this page' 
            } 
          });
          return;
        }
      } else {
        // For regular user routes
        hasAccess = isAuthenticated;
        if (!hasAccess) {
          // Store the intended destination
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          
          // If this is the checkout page, store the plan data
          if (location.pathname === '/checkout' && location.state?.planData) {
            sessionStorage.setItem('checkoutPlanData', JSON.stringify(location.state.planData));
          }
          
          navigate('/login', { 
            state: { 
              from: location.pathname,
              message: 'Please login to access this page' 
            } 
          });
          return;
        }
      }

      console.log('✅ Authentication check passed, rendering children');
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, location, requiredRole, isAdminAuthenticated, isRRAuthenticated, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;