import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ApiContext = createContext();

// Configure API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ApiProvider = ({ children }) => {
  const { token } = useAuth();

  // Create axios instance
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle response errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('rrToken');

        // Check current path to determine where to redirect
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin') || currentPath.includes('/admin-')) {
          window.location.href = '/admin-login';
        } else if (currentPath.includes('/rr') || currentPath.includes('/rr-')) {
          window.location.href = '/rr-login';
        } else {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  // Profile API methods
  const profileApi = {
    // Get profile
    getProfile: async (userId = null) => {
      try {
        const url = userId ? `/profiles/${userId}` : '/profiles';
        const res = await api.get(url);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch profile' };
      }
    },

    // Update profile
    updateProfile: async (profileData) => {
      try {
        const res = await api.put('/profiles/update', profileData);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Failed to update profile',
          errors: error.response?.data?.errors 
        };
      }
    },

    // Update photos
    updatePhotos: async (photos) => {
      try {
        const res = await api.put('/profiles/photos', { photos });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to update photos' };
      }
    },

    // Update privacy settings
    updatePrivacySettings: async (privacySettings) => {
      try {
        const res = await api.put('/profiles/privacy-settings', { privacySettings });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to update privacy settings' };
      }
    },

    // Update partner preferences
    updatePartnerPreferences: async (partnerPreferences) => {
      try {
        const res = await api.put('/profiles/partner-preferences', { partnerPreferences });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to update partner preferences' };
      }
    },

    // Search profiles
    searchProfiles: async (filters = {}) => {
      try {
        const res = await api.get('/profiles/search', { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to search profiles' };
      }
    },

    // Get profile stats
    getProfileStats: async () => {
      try {
        const res = await api.get('/profiles/stats/overview');
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch profile stats' };
      }
    }
  };

  // Proposal API methods
  const proposalApi = {
    // Send proposal
    sendProposal: async (receiverId, message = '') => {
      try {
        const res = await api.post('/proposals/send', { receiverId, message });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to send proposal' };
      }
    },

    // Get sent proposals
    getSentProposals: async (filters = {}) => {
      try {
        const res = await api.get('/proposals/sent', { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch sent proposals' };
      }
    },

    // Get received proposals
    getReceivedProposals: async (filters = {}) => {
      try {
        const res = await api.get('/proposals/received', { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch received proposals' };
      }
    },

    // Respond to proposal
    respondToProposal: async (proposalId, status, message = '') => {
      try {
        const res = await api.put(`/proposals/${proposalId}/respond`, { status, message });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to respond to proposal' };
      }
    },

    // Get proposal details
    getProposal: async (proposalId) => {
      try {
        const res = await api.get(`/proposals/${proposalId}`);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch proposal' };
      }
    }
  };

  // Plan API methods
  const planApi = {
    // Get all plans
    getPlans: async () => {
      try {
        const res = await api.get('/plans');
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch plans' };
      }
    },

    // Get current plan
    getCurrentPlan: async () => {
      try {
        const res = await api.get('/plans/current');
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch current plan' };
      }
    },

    // Subscribe to plan
    subscribeToPlan: async (planId, paymentData) => {
      try {
        const res = await api.post('/plans/subscribe', { planId, ...paymentData });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to subscribe to plan' };
      }
    }
  };

  // Upload API methods
  const uploadApi = {
    // Upload file
    uploadFile: async (file, type = 'profile') => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const res = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to upload file' };
      }
    }
  };

  // User API methods (Admin)
  const userApi = {
    // Get users with pagination and filters
    getUsers: async (filters = {}) => {
      try {
        const res = await api.get('/users/list', { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch users' };
      }
    },

    // Get user by ID
    getUserById: async (userId) => {
      try {
        const res = await api.get(`/users/${userId}`);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch user' };
      }
    },

    // Update user
    updateUser: async (userId, updateData) => {
      try {
        const res = await api.put(`/users/${userId}`, updateData);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to update user' };
      }
    },

    // Delete user
    deleteUser: async (userId) => {
      try {
        const res = await api.delete(`/users/${userId}`);
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to delete user' };
      }
    },

    // Block user
    blockUser: async (userId, reason, duration) => {
      try {
        const res = await api.post(`/users/${userId}/block`, { reason, duration });
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to block user' };
      }
    },

    // Unblock user
    unblockUser: async (userId) => {
      try {
        const res = await api.post(`/users/${userId}/unblock`);
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to unblock user' };
      }
    },

    // Suspend user
    suspendUser: async (userId, reason, duration) => {
      try {
        const res = await api.post(`/users/${userId}/suspend`, { reason, duration });
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to suspend user' };
      }
    },

    // Activate user
    activateUser: async (userId) => {
      try {
        const res = await api.post(`/users/${userId}/activate`);
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to activate user' };
      }
    },

    // Get user statistics
    getUserStats: async () => {
      try {
        const res = await api.get('/users/stats/overview');
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch user stats' };
      }
    },

    // Get user activities
    getUserActivities: async (userId, filters = {}) => {
      try {
        const res = await api.get(`/users/${userId}/activities`, { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch user activities' };
      }
    },

    // Advanced user search
    advancedUserSearch: async (query, filters = {}) => {
      try {
        const res = await api.get('/users/search/advanced', {
          params: { query, filters }
        });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to search users' };
      }
    }
  };

  const value = {
    api,
    profileApi,
    proposalApi,
    planApi,
    uploadApi,
    userApi
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext;
