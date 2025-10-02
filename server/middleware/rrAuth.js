const jwt = require('jsonwebtoken');
const { RRUser } = require('../models');
const { logger } = require('../utils/logger');

// RR User Authentication middleware
const rrAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token is for RR user
    if (decoded.type !== 'rr_user') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token type.'
      });
    }

    // Find RR user
    const rrUser = await RRUser.findByPk(decoded.id);

    if (!rrUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. RR User not found.'
      });
    }

    // Check if RR user is active
    if (!rrUser.active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Add RR user to request
    req.rrUser = rrUser;
    req.rrUserId = rrUser.id;

    next();
  } catch (error) {
    logger.error('RR Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Optional RR authentication middleware (doesn't fail if no token)
const optionalRRAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.type === 'rr_user') {
      const rrUser = await RRUser.findByPk(decoded.id);

      if (rrUser && rrUser.active) {
        req.rrUser = rrUser;
        req.rrUserId = rrUser.id;
      }
    }

    next();
  } catch (error) {
    // Don't fail for optional auth, just continue
    next();
  }
};

// Admin-only middleware for RR management
const requireRRAdmin = (req, res, next) => {
  // For now, we'll check if it's a regular admin user
  // You can modify this logic based on your admin system
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

module.exports = {
  rrAuthMiddleware,
  optionalRRAuthMiddleware,
  requireRRAdmin,
  authenticate: rrAuthMiddleware
};