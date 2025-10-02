
const razorpay = require('razorpay');
const crypto = require('crypto');
const { User, Payment } = require('../models');
const { AppError, ValidationError } = require('../middleware/errorHandler');

// Initialize Razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.RAZOR_PAY_KEY,
  key_secret: process.env.RAZOR_PAY_SECRET
});

class PlanPaymentController {
  // Create payment order for plan subscription
  async createSubscriptionOrder(req, res, next) {
    try {
      const { planId, location, amount } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!planId || !location || !amount) {
        throw new ValidationError('Plan ID, location, and amount are required');
      }

      // Validate amount
      if (amount <= 0) {
        throw new ValidationError('Invalid amount');
      }

      // Check if user already has an active subscription
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if user already has an active plan
      if (user.plan_id && user.plan_info && user.plan_info.expires_at) {
        const expiryDate = new Date(user.plan_info.expires_at);
        if (expiryDate > new Date()) {
          throw new AppError('User already has an active subscription', 400);
        }
      }

      // Create Razorpay order
      const orderOptions = {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `plan_${Date.now()}_${userId}`,
        notes: {
          userId: userId.toString(),
          planId: planId.toString(),
          planType: 'subscription',
          userEmail: user.email,
          userName: user.name
        }
      };

      // Create Razorpay order
      const order = await razorpayInstance.orders.create(orderOptions);

      // Create payment record in database
      const payment = await Payment.create({
        userId: userId,
        planId: planId,
        amount: amount * 100, // Store in paise
        currency: 'INR',
        razorpayOrderId: order.id,
        receipt: orderOptions.receipt,
        notes: `Plan subscription: ${user.name}`,
        metadata: {
          planId: planId,
          planType: 'subscription',
          userEmail: user.email,
          userName: user.name,
          userPhone: user.phone_number,
          userLocation: location
        }
      });

      res.json({
        success: true,
        message: 'Payment order created successfully',
        data: {
          payment: {
            key: process.env.RAZOR_PAY_KEY,
            amount: order.amount,
            currency: order.currency,
            orderId: order.id
          },
          paymentId: payment.id
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Verify payment and activate subscription
  async verifyPayment(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const userId = req.user.id;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ValidationError('Missing payment verification parameters');
      }

      // Verify signature
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZOR_PAY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        throw new AppError('Invalid payment signature', 400);
      }

      // Get order info from Razorpay
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
      
      if (orderInfo.status !== 'paid') {
        throw new AppError('Payment not completed', 400);
      }

      // Find and update payment record
      const payment = await Payment.findByRazorpayOrderId(razorpay_order_id);
      if (!payment) {
        throw new AppError('Payment record not found', 404);
      }

      // Verify this payment belongs to the authenticated user
      if (payment.userId.toString() !== userId.toString()) {
        throw new AppError('Unauthorized access to payment', 403);
      }

      // Update payment status
      await payment.update({
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      });

      // Update user with plan subscription
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Calculate expiry date (30 days from now for now, can be made configurable)
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Update user plan information
      await user.update({
        plan_id: payment.planId,
        plan_info: {
          id: payment.planId,
          expires_at: expiresAt.toISOString(),
          subscribed_at: now.toISOString(),
          payment_id: payment.id
        }
      });

      res.json({
        success: true,
        message: 'Payment verified and subscription activated successfully',
        data: {
          payment: {
            id: payment.id,
            status: payment.status,
            amount: payment.getFormattedAmount(),
            planId: payment.planId
          },
          subscription: {
            planId: payment.planId,
            expiresAt: expiresAt.toISOString(),
            active: true
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get user's current subscription status
  async getCurrentSubscription(req, res, next) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const subscription = {
        planId: user.plan_id || null,
        planInfo: user.plan_info || null,
        isActive: false
      };

      // Check if subscription is active
      if (user.plan_info && user.plan_info.expires_at) {
        const expiryDate = new Date(user.plan_info.expires_at);
        subscription.isActive = expiryDate > new Date();
      }

      res.json({
        success: true,
        data: { subscription }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get payment history for user
  async getPaymentHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;

      const payments = await Payment.findAll({ 
        where: { userId },
        order: [['created_at', 'DESC']],
        offset: skip,
        limit: parseInt(limit)
      });

      const total = await Payment.count({ where: { userId } });

      res.json({
        success: true,
        data: {
          payments: payments.map(payment => ({
            id: payment.id,
            amount: payment.getFormattedAmount(),
            status: payment.status,
            currency: payment.currency,
            planId: payment.planId,
            createdAt: payment.created_at
          })),
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Cancel subscription (admin only)
  async cancelSubscription(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Reset user plan information
      await user.update({
        plan_id: 1, // Default to basic plan
        plan_info: {
          id: 1,
          expires_at: null,
          cancelled_at: new Date().toISOString()
        }
      });

      res.json({
        success: true,
        message: 'Subscription cancelled successfully'
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlanPaymentController();
