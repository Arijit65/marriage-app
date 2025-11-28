import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAdminAuthenticated, 
    isRRAuthenticated, 
    isAuthenticated, 
    adminUser, 
    adminToken,
    rrUser,
    rrToken,
    loading 
  } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Don't check while context is still loading initial state
      if (loading) {
        console.log('⏳ Context still loading, waiting...');
        return;
      }

      let hasAccess = false;

      console.log('🛡️ ProtectedRoute checking auth for role:', requiredRole);
      console.log('🛡️ isAdminAuthenticated:', isAdminAuthenticated);
      console.log('🛡️ adminUser:', adminUser);
      console.log('🛡️ adminToken exists:', !!adminToken);
      console.log('🛡️ adminToken value:', adminToken?.substring(0, 10) + '...');

      if (requiredRole === 'admin') {
        // Use context state which is synced with localStorage
        hasAccess = isAdminAuthenticated && adminUser && adminToken;
        
        console.log('🛡️ Admin route - hasAccess:', hasAccess);
        
        if (!hasAccess) {
          console.log('❌ Admin not authenticated, redirecting to admin-login');
          navigate('/admin-login', {
            state: {
              from: location.pathname,
              message: 'Please login as admin to access this page'
            },
            replace: true
          });
          setIsChecking(false);
          return;
        }
      } else if (requiredRole === 'rr') {
        // Use context state which is synced with localStorage
        hasAccess = isRRAuthenticated && rrUser && rrToken;
        
        console.log('🛡️ RR route - hasAccess:', hasAccess);
        
        if (!hasAccess) {
          console.log('❌ RR not authenticated, redirecting to rr-login');
          navigate('/rr-login', { 
            state: { 
              from: location.pathname,
              message: 'Please login as RR to access this page' 
            },
            replace: true
          });
          setIsChecking(false);
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
            },
            replace: true
          });
          setIsChecking(false);
          return;
        }
      }

      console.log('✅ Authentication check passed, rendering children');
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, location, requiredRole, isAdminAuthenticated, isRRAuthenticated, isAuthenticated, adminUser, adminToken, rrUser, rrToken, loading]);

  // Show loading state if context is still initializing or we're checking auth
  if (loading || isChecking) {
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