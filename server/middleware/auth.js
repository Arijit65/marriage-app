const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logger } = require('../utils/logger');
const { validationResult } = require('express-validator');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
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
    
    // Find user
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Allow users with pending_verification status to access most endpoints
    // Only restrict access for suspended or banned accounts
    if (user.account_status === 'suspended' || user.account_status === 'banned') {
      return res.status(401).json({
        success: false,
        message: 'Account is suspended. Please contact support.'
      });
    }

    // Check if plan is still active
    if (user.plan_info && user.plan_info.expires_at && new Date() > new Date(user.plan_info.expires_at)) {
      // Plan expired, downgrade to free plan
      await user.update({ 
        plan_id: 1, // Basic Free plan
        plan_info: {
          id: 1,
          expires_at: null,
          subscribed_at: null,
          payment_id: null
        }
      });
      logger.warn(`User ${user.id} plan expired, downgraded to free plan`);
    }

    // Add user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
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

// Optional authentication middleware (doesn't fail if no token)
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.userId);

    if (user && user.is_active && user.account_status !== 'suspended' && user.account_status !== 'banned') {
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (error) {
    // Don't fail for optional auth, just continue
    next();
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Plan-based authorization middleware
const requirePlan = (requiredPlan) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Check if user has an active plan
    const isPlanActive = req.user.isPlanActive ? req.user.isPlanActive() : false;
    
    if (!isPlanActive) {
      return res.status(403).json({
        success: false,
        message: `This feature requires an active ${requiredPlan} plan. Please upgrade your plan.`
      });
    }

    // For now, we'll allow access if user has any active plan
    // You can add more specific plan validation here based on plan_id
    next();
  };
};

// Rate limiting middleware for specific actions
const rateLimitAction = (action, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = `${req.userId}_${action}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    if (attempts.has(key)) {
      attempts.set(key, attempts.get(key).filter(timestamp => timestamp > windowStart));
    } else {
      attempts.set(key, []);
    }

    const userAttempts = attempts.get(key);

    if (userAttempts.length >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: `Too many ${action} attempts. Please try again later.`
      });
    }

    userAttempts.push(now);
    next();
  };
};

// Profile completion middleware
const requireProfileCompletion = (minPercentage = 50) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.profile_completion_percentage < minPercentage) {
      return res.status(403).json({
        success: false,
        message: `Profile must be at least ${minPercentage}% complete to access this feature.`
      });
    }

    next();
  };
};

// Verification middleware
const requireVerification = (verificationType = 'phone') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    let isVerified = false;
    
    switch (verificationType) {
      case 'phone':
        isVerified = req.user.is_verified;
        break;
      case 'email':
        isVerified = req.user.email_verified;
        break;
      case 'profile':
        isVerified = req.user.profile?.profile_verified;
        break;
      default:
        isVerified = req.user.is_verified;
    }

    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: `${verificationType} verification required.`
      });
    }

    next();
  };
};

// Generate JWT token
const generateToken = (userId, expiresIn = '1h') => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Check profile completion (alias for requireProfileCompletion)
const checkProfileCompletion = requireProfileCompletion;

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole,
  requirePlan,
  rateLimitAction,
  requireProfileCompletion,
  requireVerification,
  generateToken,
  verifyToken,
  validateRequest,
  checkProfileCompletion, // Add this export
  authenticate: authMiddleware,
  generateJWT: generateToken,
  verifyJWT: verifyToken
};
