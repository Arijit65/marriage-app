const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const proposalRoutes = require('./proposalRoutes');
const userRoutes = require('./userRoutes');
const planRoutes = require('./planRoutes');
const adRoutes = require('./adRoutes');
const paymentRoutes = require('./paymentRoutes');
const adminRoutes = require('./adminRoutes');

// API prefix
const API_PREFIX = '/api';

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Marriage App API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation route
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    version: '1.0.0',
            endpoints: {
          auth: `${API_PREFIX}/auth`,
          profiles: `${API_PREFIX}/profiles`,
          proposals: `${API_PREFIX}/proposals`,
          users: `${API_PREFIX}/users`,
          plans: `${API_PREFIX}/plans`,
          ads: `${API_PREFIX}/ads`,
          payments: `${API_PREFIX}/payments`,
          admin: `${API_PREFIX}/admin`
        },
    documentation: 'https://docs.marriageapp.com/api'
  });
});

// Mount route modules
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/profiles`, profileRoutes);
router.use(`${API_PREFIX}/proposals`, proposalRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/plans`, planRoutes);
router.use(`${API_PREFIX}/ads`, adRoutes);
router.use(`${API_PREFIX}/payments`, paymentRoutes);
router.use(`${API_PREFIX}/admin`, adminRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
