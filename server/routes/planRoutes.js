const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { authenticate, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', planController.getPlans);
router.get('/:planId', planController.getPlanById);

// User routes (authenticated)
router.get('/user/current', authenticate, planController.getCurrentUserPlan);
router.post('/subscribe', authenticate, planController.subscribeToPlan);
router.post('/cancel', authenticate, planController.cancelSubscription);
router.get('/user/history', authenticate, planController.getUserPlanHistory);

// Admin routes
router.post('/', authenticate, requireRole('admin'), planController.createPlan);
router.put('/:planId', authenticate, requireRole('admin'), planController.updatePlan);
router.delete('/:planId', authenticate, requireRole('admin'), planController.deletePlan);
router.put('/:planId/toggle', authenticate, requireRole('admin'), planController.togglePlanStatus);

// Plan statistics routes (admin only)
router.get('/stats/overview', authenticate, requireRole('admin'), planController.getPlanStats);
router.get('/stats/subscriptions', authenticate, requireRole('admin'), planController.getSubscriptionStats);
router.get('/stats/revenue', authenticate, requireRole('admin'), planController.getRevenueStats);

module.exports = router;