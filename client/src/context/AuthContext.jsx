import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Helper function to safely parse JSON from localStorage
const safeParseJSON = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Failed to parse ${key} from localStorage:`, error);
    return null;
  }
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
  // Add admin and RR user states
  adminUser: safeParseJSON('adminUser'),
  rrUser: safeParseJSON('rrUser'),
  // Add user phone for display
  userPhone: localStorage.getItem('userPhone') || ''
};

// Action types
const AUTH_ACTIONS = {
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAIL: 'AUTH_FAIL',
  LOGOUT: 'LOGOUT',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_LOADING: 'SET_LOADING',
  // Add admin and RR actions
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  RR_LOGIN: 'RR_LOGIN',
  ADMIN_LOGOUT: 'ADMIN_LOGOUT',
  RR_LOGOUT: 'RR_LOGOUT',
  // Add user phone actions
  SET_USER_PHONE: 'SET_USER_PHONE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_SUCCESS:
      // Don't store in localStorage here as it's handled by the functions
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.AUTH_FAIL:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case AUTH_ACTIONS.LOGOUT:
      // localStorage clearing is handled by the logout function
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    // Admin and RR actions
    case AUTH_ACTIONS.ADMIN_LOGIN:
      localStorage.setItem('adminToken', action.payload.token);
      localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
      console.log('🔄 Admin login reducer - setting adminUser:', action.payload.user);
      return {
        ...state,
        adminUser: action.payload.user,
        error: null
      };
    case AUTH_ACTIONS.RR_LOGIN:
      localStorage.setItem('rrToken', action.payload.token);
      localStorage.setItem('rrUser', JSON.stringify(action.payload.user));
      return {
        ...state,
        rrUser: action.payload.user,
        error: null
      };
    case AUTH_ACTIONS.ADMIN_LOGOUT:
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return {
        ...state,
        adminUser: null
      };
    case AUTH_ACTIONS.RR_LOGOUT:
      localStorage.removeItem('rrToken');
      localStorage.removeItem('rrUser');
      return {
        ...state,
        rrUser: null
      };
    case AUTH_ACTIONS.SET_USER_PHONE:
      localStorage.setItem('userPhone', action.payload);
      return {
        ...state,
        userPhone: action.payload
      };
    default:
      return state;
  }
};

// Configure axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

// For demo purposes, we'll keep axios simple without interceptors
// In production, you would add proper request/response interceptors

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount
  useEffect(() => {
    loadUser();
    loadAdminUser();
    loadRRUser();
  }, []);

  // Load user from token - Professional implementation
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Parse stored user data
        const user = JSON.parse(userData);
        
        // Verify token by making API call to get current user profile
        const response = await axios.get('/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          // Token is valid, set user data
          console.log('✅ loadUser API response:', response.data.data.user);
          dispatch({
            type: AUTH_ACTIONS.AUTH_SUCCESS,
            payload: {
              user: response.data.data.user,
              token: token
            }
          });
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Token is invalid, clear storage and set as unauthenticated
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({
          type: AUTH_ACTIONS.AUTH_FAIL,
          payload: 'Invalid or expired token'
        });
      }
    } else {
      // No token or user data, just set loading to false
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Load admin user from localStorage
  const loadAdminUser = () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const adminUser = localStorage.getItem('adminUser');
      
      if (adminToken && adminUser) {
        dispatch({
          type: AUTH_ACTIONS.ADMIN_LOGIN,
          payload: {
            user: JSON.parse(adminUser),
            token: adminToken
          }
        });
      }
    } catch (error) {
      console.error('Error loading admin user:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  };

  // Load RR user from localStorage
  const loadRRUser = () => {
    try {
      const rrToken = localStorage.getItem('rrToken');
      const rrUser = localStorage.getItem('rrUser');
      
      if (rrToken && rrUser) {
        dispatch({
          type: AUTH_ACTIONS.RR_LOGIN,
          payload: {
            user: JSON.parse(rrUser),
            token: rrToken
          }
        });
      }
    } catch (error) {
      console.error('Error loading RR user:', error);
      localStorage.removeItem('rrToken');
      localStorage.removeItem('rrUser');
    }
  };

  // Register user - Professional implementation
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const res = await axios.post('/auth/register', userData);
      
      if (res.data.success && res.data.data.token && res.data.data.user) {
        // Store token and user data in localStorage
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        
        // Set auth state
        dispatch({
          type: AUTH_ACTIONS.AUTH_SUCCESS,
          payload: {
            user: res.data.data.user,
            token: res.data.data.token
          }
        });
        
        console.log('✅ Registration successful - User authenticated');
        return { success: true, data: res.data.data };
      } else {
        throw new Error(res.data.message || 'Registration failed - Invalid response');
      }
    } catch (error) {
      console.error('❌ Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAIL,
        payload: errorMessage
      });
      return { success: false, error: errorMessage, errors: error.response?.data?.errors };
    }
  };

  // Login function with OTP support - Professional implementation
  const login = async (phone, otp = null) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const loginData = { phone };
      if (otp) {
        loginData.otp = otp;
      }
      
      const res = await axios.post('/auth/login', loginData);
      
      if (res.data.success) {
        // If OTP is required, return success with OTP flag
        if (res.data.data.requiresOTP) {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          console.log('📱 OTP required for login');
          return { 
            success: true, 
            requiresOTP: true, 
            message: res.data.message,
            fallback: res.data.data.fallback,
            fallbackOTP: res.data.data.fallbackOTP
          };
        }
        
        // If login successful, set user data
        if (res.data.data.token && res.data.data.user) {
          // Store token and user data in localStorage
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
          
          dispatch({
            type: AUTH_ACTIONS.AUTH_SUCCESS,
            payload: {
              user: res.data.data.user,
              token: res.data.data.token
            }
          });
          
          // Set user phone for display
          dispatch({ type: AUTH_ACTIONS.SET_USER_PHONE, payload: phone });
          
          console.log('✅ Login successful - User authenticated');
          return { success: true, data: res.data.data };
        } else {
          throw new Error('Invalid login response - missing token or user data');
        }
      } else {
        dispatch({
          type: AUTH_ACTIONS.AUTH_FAIL,
          payload: res.data.message || 'Login failed'
        });
        return { success: false, error: res.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAIL,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Send OTP (for phone verification during registration)
  const sendOTP = async (phone) => {
    try {
      const res = await axios.post('/auth/send-phone-otp', { phone });
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP (for phone verification during registration)
  const verifyOTP = async (phone, otp) => {
    try {
      const res = await axios.post('/auth/verify-phone-otp', { phone, otp });
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      return { success: false, error: errorMessage };
    }
  };

  // Logout function - Professional implementation
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear auth state
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    dispatch({ type: AUTH_ACTIONS.SET_USER_PHONE, payload: '' });
    
    console.log('✅ User logged out successfully');
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERRORS });
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/auth/profile', profileData);
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: {
          user: res.data.data.user,
          token: state.token
        }
      });
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage, errors: error.response?.data?.errors };
    }
  };

  // Change password
  const changePassword = async (passwords) => {
    try {
      const res = await axios.put('/auth/change-password', passwords);
      return { success: true, data: res.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      return { success: false, error: errorMessage, errors: error.response?.data?.errors };
    }
  };

  // Admin login (hardcoded for now)
  const adminLogin = (adminData, token) => {
    console.log('🔐 Admin login called with:', { adminData, token });
    dispatch({
      type: AUTH_ACTIONS.ADMIN_LOGIN,
      payload: {
        user: adminData,
        token: token
      }
    });
    console.log('✅ Admin login dispatch completed');
  };

  // RR login (hardcoded for now)
  const rrLogin = (rrData, token) => {
    dispatch({
      type: AUTH_ACTIONS.RR_LOGIN,
      payload: {
        user: rrData,
        token: token
      }
    });
  };

  // Admin logout
  const adminLogout = () => {
    dispatch({ type: AUTH_ACTIONS.ADMIN_LOGOUT });
  };

  // RR logout
  const rrLogout = () => {
    dispatch({ type: AUTH_ACTIONS.RR_LOGOUT });
  };

  // Logout all (clear all sessions)
  const logoutAll = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    dispatch({ type: AUTH_ACTIONS.ADMIN_LOGOUT });
    dispatch({ type: AUTH_ACTIONS.RR_LOGOUT });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    // Add admin and RR states
    adminUser: state.adminUser,
    rrUser: state.rrUser,
    rrToken: localStorage.getItem('rrToken'),
    adminToken: localStorage.getItem('adminToken'),
    isAdminAuthenticated: !!state.adminUser,
    isRRAuthenticated: !!state.rrUser,
    // Add user phone for display
    userPhone: state.userPhone,
    // Original functions
    register,
    login,
    logout,
    sendOTP,
    verifyOTP,
    clearErrors,
    updateProfile,
    changePassword,
    loadUser,
    // Admin and RR functions
    adminLogin,
    rrLogin,
    adminLogout,
    rrLogout,
    logoutAll
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

