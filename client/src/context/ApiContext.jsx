import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ApiContext = createContext();

// Configure API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ApiProvider = ({ children }) => {
  const { token, adminToken, rrToken } = useAuth();

  // Create axios instance for regular users
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Create axios instance for admin users
  const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Create axios instance for RR users
  const rrApi = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to regular requests
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

  // Add admin token to admin requests
  adminApi.interceptors.request.use(
    (config) => {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        console.log('🔑 Admin API request with token:', adminToken.substring(0, 10) + '...');
      } else {
        console.log('⚠️ Admin API request WITHOUT token');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add RR token to RR requests
  rrApi.interceptors.request.use(
    (config) => {
      if (rrToken) {
        config.headers.Authorization = `Bearer ${rrToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle response errors for regular API
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  // Handle response errors for admin API
  adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Admin token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        console.log('🔴 Admin token expired, redirecting to admin login');
        window.location.href = '/admin-login';
      }
      return Promise.reject(error);
    }
  );

  // Handle response errors for RR API
  rrApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // RR token expired or invalid
        localStorage.removeItem('rrToken');
        localStorage.removeItem('rrUser');
        window.location.href = '/rr-login';
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
    },

    // Get advertisement profiles for AddSection component
    getAdProfiles: async (filters = {}) => {
      try {
        const res = await api.get('/profile/ad-profiles', { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        console.error('Failed to fetch ad profiles:', error);
        return { success: false, error: error.response?.data?.message || 'Failed to fetch ad profiles' };
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

  // Blog API methods
  const blogApi = {
    // Get all blogs (admin)
    getAllBlogs: async (filters = {}) => {
      try {
        const res = await adminApi.get('/blogs/all', { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch blogs' };
      }
    },

    // Create new blog
    createBlog: async (blogData) => {
      try {
        const formData = new FormData();
        
        // Add text fields
        Object.keys(blogData).forEach(key => {
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else if (key === 'images' && Array.isArray(blogData[key])) {
            blogData[key].forEach(file => {
              formData.append('images', file);
            });
          } else if (key !== 'images') {
            formData.append(key, blogData[key]);
          }
        });

        const res = await adminApi.post('/blogs/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to create blog' };
      }
    },

    // Update blog
    updateBlog: async (blogId, blogData) => {
      try {
        const formData = new FormData();
        
        Object.keys(blogData).forEach(key => {
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else if (key === 'images' && Array.isArray(blogData[key])) {
            blogData[key].forEach(file => {
              formData.append('images', file);
            });
          } else if (key !== 'images') {
            formData.append(key, blogData[key]);
          }
        });

        const res = await adminApi.put(`/blogs/${blogId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to update blog' };
      }
    },

    // Delete blog
    deleteBlog: async (blogId) => {
      try {
        const res = await adminApi.delete(`/blogs/${blogId}`);
        return { success: true, data: res.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to delete blog' };
      }
    },

    // Publish blog
    publishBlog: async (blogId) => {
      try {
        const res = await adminApi.post(`/blogs/${blogId}/publish`);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to publish blog' };
      }
    },

    // Get blog by ID
    getBlog: async (blogId) => {
      try {
        const res = await adminApi.get(`/blogs/${blogId}`);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch blog' };
      }
    },

    // Get blog categories
    getCategories: async () => {
      try {
        const res = await api.get('/blogs/categories');
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch categories' };
      }
    },

    // Public blog API methods (no authentication required)
    getPublishedBlogs: async (filters = {}) => {
      try {
        const res = await api.get('/blogs/published', { params: filters });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch published blogs' };
      }
    },

    // Get single published blog by ID or slug
    getPublishedBlog: async (identifier) => {
      try {
        const res = await api.get(`/blogs/view/${identifier}`);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch blog' };
      }
    },

    // Get featured blogs
    getFeaturedBlogs: async (limit = 5) => {
      try {
        const res = await api.get('/blogs/featured', { params: { limit } });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch featured blogs' };
      }
    }
  };

  // Admin API methods
  const adminApi_methods = {
    // Get admin profile
    getProfile: async () => {
      try {
        const res = await adminApi.get('/admin/profile');
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch admin profile' };
      }
    },

    // Get user statistics for admin dashboard
    getUserStats: async () => {
      try {
        const res = await adminApi.get('/admin/users/stats');
        return { success: true, data: res.data.data };
      } catch (error) {
        console.error('Admin getUserStats error:', error);
        return { success: false, error: error.response?.data?.message || 'Failed to fetch user stats' };
      }
    },

    // Get users by status (for member listing)
    getUsersByStatus: async (status, page = 1, limit = 10, search = '') => {
      try {
        const params = { status, page, limit };
        if (search) params.search = search;
        
        const res = await adminApi.get('/admin/users', { params });
        return { success: true, data: res.data.data };
      } catch (error) {
        console.error('Admin getUsersByStatus error:', error);
        return { success: false, error: error.response?.data?.message || 'Failed to fetch users' };
      }
    },

    // Update user status
    updateUserStatus: async (userId, status, reason = '') => {
      try {
        const res = await adminApi.put(`/admin/users/${userId}/status`, { status, reason });
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to update user status' };
      }
    },

    // Delete user
    deleteUser: async (userId) => {
      try {
        const res = await adminApi.delete(`/admin/users/${userId}`);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to delete user' };
      }
    },

    // Get all admins (super admin only)
    getAllAdmins: async () => {
      try {
        const res = await adminApi.get('/admin/list');
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch admins' };
      }
    },

    // Create new admin (super admin only)
    createAdmin: async (adminData) => {
      try {
        const res = await adminApi.post('/admin/create', adminData);
        return { success: true, data: res.data.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to create admin', errors: error.response?.data?.errors };
      }
    }
  };

  const value = {
    api,
    adminApi,
    rrApi,
    profileApi,
    proposalApi,
    planApi,
    uploadApi,
    userApi,
    adminApi_methods,
    blogApi
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
