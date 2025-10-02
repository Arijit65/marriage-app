// controllers/planController.js
const { Plan, User, UserActivity } = require('../models');
const { AppError, ValidationError } = require('../middleware/errorHandler');

class PlanController {
  // GET /api/plans
  async list(req, res, next) {
    try {
      const plans = await Plan.findActivePlans();
      res.json({ success: true, data: { plans } });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/current
  async current(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      res.json({
        success: true,
        data: {
          plan: user.plan_info || null,
          expires_at: user.plan_info?.expires_at || null,
          active: user.isPlanActive()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/plans/upgrade
  async upgrade(req, res, next) {
    try {
      const { plan_id } = req.body;
      if (!plan_id) throw new ValidationError('plan_id is required');

      const plan = await Plan.findByPk(plan_id);
      if (!plan || !plan.is_active) {
        throw new AppError('Plan not found or inactive', 404);
      }
      if (!plan.isAvailable()) {
        throw new AppError('Plan capacity reached', 400);
      }

      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      // Compute expiry
      const now = new Date();
      const expires = new Date(now);
      expires.setDate(expires.getDate() + (plan.duration_days || 30));

      // Switch plan
      await user.update({
        plan_id: plan.id,
        plan_expires_at: expires
      });

      // Book-keeping
      if (user.plan && user.plan.id !== plan.id) {
        await Plan.decrementUserCount(user.plan.id);
      }
      await Plan.incrementUserCount(plan.id);

      await UserActivity.trackActivity(req.user.id, 'plan_upgraded', {
        targetEntityType: 'plan',
        targetEntityId: plan.id,
        activity_data: { toPlan: plan.name, durationDays: plan.duration_days }
      });

      res.json({
        success: true,
        message: 'Plan upgraded successfully',
        data: {
          plan: {
            id: plan.id,
            name: plan.name,
            expires_at: expires
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/popular
  async popular(req, res, next) {
    try {
      const plans = await Plan.findPopularPlans();
      res.json({ success: true, data: { plans } });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans
  async getPlans(req, res, next) {
    try {
      const plans = await Plan.findActivePlans();
      res.json({ success: true, data: { plans } });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/:planId
  async getPlanById(req, res, next) {
    try {
      const { planId } = req.params;
      const plan = await Plan.findByPk(planId);
      
      if (!plan) {
        throw new AppError('Plan not found', 404);
      }

      res.json({ success: true, data: { plan } });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/user/current
  async getCurrentUserPlan(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      res.json({
        success: true,
        data: {
          plan: user.plan_info || null,
          expires_at: user.plan_info?.expires_at || null,
          active: user.isPlanActive()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/plans/cancel
  async cancelSubscription(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      // Reset to basic plan
      await user.update({
        plan_id: 1,
        plan_info: {
          id: 1,
          expires_at: null,
          subscribed_at: null,
          payment_id: null
        }
      });

      res.json({
        success: true,
        message: 'Subscription cancelled successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/user/history
  async getUserPlanHistory(req, res, next) {
    try {
      // This would typically fetch from a subscription history table
      // For now, return basic info
      res.json({
        success: true,
        data: {
          message: 'Plan history feature coming soon'
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Admin methods
  // POST /api/plans
  async createPlan(req, res, next) {
    try {
      const planData = req.body;
      const plan = await Plan.create(planData);
      
      res.status(201).json({
        success: true,
        message: 'Plan created successfully',
        data: { plan }
      });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/plans/:planId
  async updatePlan(req, res, next) {
    try {
      const { planId } = req.params;
      const updateData = req.body;
      
      const plan = await Plan.findByPk(planId);
      if (!plan) {
        throw new AppError('Plan not found', 404);
      }

      await plan.update(updateData);
      
      res.json({
        success: true,
        message: 'Plan updated successfully',
        data: { plan }
      });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/plans/:planId
  async deletePlan(req, res, next) {
    try {
      const { planId } = req.params;
      
      const plan = await Plan.findByPk(planId);
      if (!plan) {
        throw new AppError('Plan not found', 404);
      }

      await plan.destroy();
      
      res.json({
        success: true,
        message: 'Plan deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/plans/:planId/toggle
  async togglePlanStatus(req, res, next) {
    try {
      const { planId } = req.params;
      
      const plan = await Plan.findByPk(planId);
      if (!plan) {
        throw new AppError('Plan not found', 404);
      }

      await plan.update({ is_active: !plan.is_active });
      
      res.json({
        success: true,
        message: `Plan ${plan.is_active ? 'activated' : 'deactivated'} successfully`,
        data: { plan }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/stats/overview
  async getPlanStats(req, res, next) {
    try {
      // This would return plan statistics
      res.json({
        success: true,
        data: {
          message: 'Plan statistics feature coming soon'
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/stats/subscriptions
  async getSubscriptionStats(req, res, next) {
    try {
      // This would return subscription statistics
      res.json({
        success: true,
        data: {
          message: 'Subscription statistics feature coming soon'
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/plans/stats/revenue
  async getRevenueStats(req, res, next) {
    try {
      // This would return revenue statistics
      res.json({
        success: true,
        data: {
          message: 'Revenue statistics feature coming soon'
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/plans/subscribe
  async subscribeToPlan(req, res, next) {
    try {
      const { planId } = req.body;
      if (!planId) throw new ValidationError('plan_id is required');

      const plan = await Plan.findByPk(planId);
      if (!plan || !plan.is_active) {
        throw new AppError('Plan not found or inactive', 404);
      }
      if (!plan.isAvailable()) {
        throw new AppError('Plan capacity reached', 400);
      }

      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      // Compute expiry
      const now = new Date();
      const expires = new Date(now);
      expires.setDate(expires.getDate() + (plan.duration_days || 30));

      // Switch plan
      await user.update({
        plan_id: plan.id,
        plan_expires_at: expires
      });

      // Book-keeping
      if (user.plan && user.plan.id !== plan.id) {
        await Plan.decrementUserCount(user.plan.id);
      }
      await Plan.incrementUserCount(plan.id);

      await UserActivity.trackActivity(req.user.id, 'plan_upgraded', {
        targetEntityType: 'plan',
        targetEntityId: plan.id,
        activity_data: { toPlan: plan.name, durationDays: plan.duration_days }
      });

      res.json({
        success: true,
        message: 'Plan upgraded successfully',
        data: {
          plan: {
            id: plan.id,
            name: plan.name,
            expires_at: expires
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlanController();
