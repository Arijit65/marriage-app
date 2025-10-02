const express = require('express');
const router = express.Router();
const planPaymentController = require('../controllers/planPaymentController');
const { authenticate, requireRole } = require('../middleware/auth');

// Plan subscription routes (authenticated users)
router.post('/subscribe', authenticate, planPaymentController.createSubscriptionOrder);
router.post('/verify', authenticate, planPaymentController.verifyPayment);
router.get('/subscription/current', authenticate, planPaymentController.getCurrentSubscription);
router.get('/history', authenticate, planPaymentController.getPaymentHistory);

// Admin routes
router.delete('/subscription/:userId', authenticate, requireRole('admin'), planPaymentController.cancelSubscription);

module.exports = router;