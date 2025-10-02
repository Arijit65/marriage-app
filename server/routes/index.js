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

// API version prefix
const API_VERSION = '/api/v1';

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
          auth: `${API_VERSION}/auth`,
          profiles: `${API_VERSION}/profiles`,
          proposals: `${API_VERSION}/proposals`,
          users: `${API_VERSION}/users`,
          plans: `${API_VERSION}/plans`,
          ads: `${API_VERSION}/ads`,
          payments: `${API_VERSION}/payments`
        },
    documentation: 'https://docs.marriageapp.com/api'
  });
});

// Mount route modules
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/profiles`, profileRoutes);
router.use(`${API_VERSION}/proposals`, proposalRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/plans`, planRoutes);
router.use(`${API_VERSION}/ads`, adRoutes);
router.use(`${API_VERSION}/payments`, paymentRoutes);

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
