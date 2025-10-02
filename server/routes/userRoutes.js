const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');

// User management routes (admin only)
router.get('/list', userController.getUsers);
router.get('/:userId', authenticate, requireRole('admin'), userController.getUserById);
router.put('/:userId', authenticate, requireRole('admin'), userController.updateUser);
router.delete('/:userId', authenticate, requireRole('admin'), userController.deleteUser);

// User activity routes
router.get('/:userId/activities', authenticate, userController.getUserActivities);
router.get('/:userId/activities/summary', authenticate, userController.getUserActivitySummary);

// User moderation routes (admin only)
router.post('/:userId/block', authenticate, requireRole('admin'), userController.blockUser);
router.post('/:userId/unblock', authenticate, requireRole('admin'), userController.unblockUser);
router.post('/:userId/suspend', authenticate, requireRole('admin'), userController.suspendUser);
router.post('/:userId/activate', authenticate, requireRole('admin'), userController.activateUser);

// User statistics routes (admin only)
router.get('/stats/overview', authenticate, requireRole('admin'), userController.getUserStats);
router.get('/stats/daily', authenticate, requireRole('admin'), userController.getDailyUserStats);
router.get('/stats/monthly', authenticate, requireRole('admin'), userController.getMonthlyUserStats);

// User search routes (admin only)
router.get('/search/advanced', authenticate, requireRole('admin'), userController.advancedUserSearch);

module.exports = router;