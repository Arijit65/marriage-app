const express = require('express');
const router = express.Router();
const rrController = require('../controllers/RrController');
const { rrAuthMiddleware, requireRRAdmin } = require('../middleware/rrAuth');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Public RR User routes (no authentication required)
router.post('/register', asyncHandler(rrController.register));
router.post('/login', asyncHandler(rrController.login));

// Protected RR User routes (RR authentication required)
router.get('/profile', rrAuthMiddleware, asyncHandler(rrController.getProfile));
router.put('/profile', rrAuthMiddleware, asyncHandler(rrController.updateProfile));
router.put('/change-password', rrAuthMiddleware, asyncHandler(rrController.changePassword));
router.get('/dashboard', rrAuthMiddleware, asyncHandler(rrController.getDashboard));
router.get('/referred-members', rrAuthMiddleware, asyncHandler(rrController.getReferredMembersList));
router.get('/referral-stats', rrAuthMiddleware, asyncHandler(rrController.getReferralStats));
router.post('/generate-referral-code', rrAuthMiddleware, asyncHandler(rrController.generateReferralCode));

// Admin routes (regular admin authentication required)
router.get('/admin/all', authMiddleware, requireRRAdmin, asyncHandler(rrController.getAllRRUsers));
router.put('/admin/:id/toggle-status', authMiddleware, requireRRAdmin, asyncHandler(rrController.toggleUserStatus));
router.put('/admin/:id/commission', authMiddleware, requireRRAdmin, asyncHandler(rrController.updateCommission));
router.get('/admin/statistics', authMiddleware, requireRRAdmin, asyncHandler(rrController.getStatistics));
router.get('/admin/top-performers', authMiddleware, requireRRAdmin, asyncHandler(rrController.getTopPerformers));

module.exports = router;