// controllers/userController.js
const { User, Profile, ProfileScore, QualificationsMarks, UserActivity } = require('../models');
const { ValidationError, AppError } = require('../middleware/errorHandler');
const bcrypt = require('bcryptjs');

class UserController {
  // GET /api/users/me
  async me(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
        include: [
          { model: Profile, as: 'profile' },
          { model: ProfileScore, as: 'profileScore' },
          { model: QualificationsMarks, as: 'qualificationsMarks' }
        ]
      });
      if (!user) throw new AppError('User not found', 404);

      res.json({
        success: true,
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/users/settings
  async updateSettings(req, res, next) {
    try {
      const { notification_preferences, privacy_settings, language, timezone } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      const updates = {};
      if (notification_preferences && typeof notification_preferences === 'object') {
        updates.notification_preferences = {
          ...user.notification_preferences,
          ...notification_preferences
        };
      }
      if (privacy_settings && typeof privacy_settings === 'object') {
        updates.privacy_settings = {
          ...user.privacy_settings,
          ...privacy_settings
        };
      }
      if (language) updates.language = language;
      if (timezone) updates.timezone = timezone;

      await user.update(updates);

      await UserActivity.trackActivity(req.user.id, 'profile_update', {
        targetEntityType: 'user',
        activitySubType: 'settings_update',
        activity_data: { updatedKeys: Object.keys(updates) }
      });

      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: { settings: updates }
      });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/users/change-password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw new ValidationError('currentPassword and newPassword are required');
      }
      if (newPassword.length < 6) {
        throw new ValidationError('Password must be at least 6 characters');
      }

      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      const matches = await user.comparePassword(currentPassword);
      if (!matches) throw new ValidationError('Current password is incorrect');

      const hashed = await bcrypt.hash(newPassword, 12);
      await user.update({ password: hashed });

      await UserActivity.trackActivity(req.user.id, 'profile_update', {
        activitySubType: 'password_changed',
        is_sensitive: true
      });

      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/account
  async account(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) throw new AppError('User not found', 404);

      const planActive = user.isPlanActive();

      res.json({
        success: true,
        data: {
          plan: {
            id: user.plan?.id || null,
            name: user.plan?.name || 'Free',
            expires_at: user.plan_expires_at,
            active: planActive
          },
          account_status: user.account_status,
          is_active: user.is_active
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/list (admin)
  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 20, search, status, planId, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
      
      const offset = (page - 1) * limit;
      const where = {};
      
      if (search) {
        where[User.sequelize.Op.or] = [
          { name: { [User.sequelize.Op.like]: `%${search}%` } },
          { email: { [User.sequelize.Op.like]: `%${search}%` } }
        ];
      }
      
      if (status) where.account_status = status;
      if (planId) where.plan_id = planId;

      const users = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          users: users.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: users.count,
            pages: Math.ceil(users.count / limit)
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/:userId (admin)
  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          { model: Profile, as: 'profile' },
          { model: ProfileScore, as: 'profileScore' }
        ]
      });

      if (!user) throw new AppError('User not found', 404);

      res.json({
        success: true,
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/users/:userId (admin)
  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const user = await User.findByPk(userId);
      if (!user) throw new AppError('User not found', 404);

      await user.update(updateData);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/users/:userId (admin)
  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) throw new AppError('User not found', 404);

      await user.destroy();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/:userId/activities
  async getUserActivities(req, res, next) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, activityType, startDate, endDate } = req.query;
      
      const offset = (page - 1) * limit;
      const where = { user_id: userId };
      
      if (activityType) where.activity_type = activityType;
      if (startDate || endDate) {
        where.activity_timestamp = {};
        if (startDate) where.activity_timestamp[UserActivity.sequelize.Op.gte] = startDate;
        if (endDate) where.activity_timestamp[UserActivity.sequelize.Op.lte] = endDate;
      }

      const activities = await UserActivity.findAndCountAll({
        where,
        order: [['activity_timestamp', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          activities: activities.rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: activities.count,
            pages: Math.ceil(activities.count / limit)
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/:userId/activities/summary
  async getUserActivitySummary(req, res, next) {
    try {
      const { userId } = req.params;

      const summary = await UserActivity.findAll({
        where: { user_id: userId },
        attributes: [
          'activity_type',
          [UserActivity.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['activity_type'],
        order: [[UserActivity.sequelize.fn('COUNT', '*'), 'DESC']]
      });

      res.json({
        success: true,
        data: { summary }
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/users/:userId/block (admin)
  async blockUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason, duration } = req.body;

      const user = await User.findByPk(userId);
      if (!user) throw new AppError('User not found', 404);

      const blockUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;
      
      await user.update({
        account_status: 'suspended',
        suspension_reason: reason,
        suspension_until: blockUntil
      });

      res.json({
        success: true,
        message: 'User blocked successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/users/:userId/unblock (admin)
  async unblockUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) throw new AppError('User not found', 404);

      await user.update({
        account_status: 'active',
        suspension_reason: null,
        suspension_until: null
      });

      res.json({
        success: true,
        message: 'User unblocked successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/users/:userId/suspend (admin)
  async suspendUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason, duration } = req.body;

      const user = await User.findByPk(userId);
      if (!user) throw new AppError('User not found', 404);

      const suspendUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;
      
      await user.update({
        account_status: 'suspended',
        suspension_reason: reason,
        suspension_until: suspendUntil
      });

      res.json({
        success: true,
        message: 'User suspended successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/users/:userId/activate (admin)
  async activateUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) throw new AppError('User not found', 404);

      await user.update({
        account_status: 'active',
        is_active: true,
        suspension_reason: null,
        suspension_until: null
      });

      res.json({
        success: true,
        message: 'User activated successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/stats/overview (admin)
  async getUserStats(req, res, next) {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { is_active: true } });
      const verifiedUsers = await User.count({ where: { is_verified: true } });
      const suspendedUsers = await User.count({ where: { account_status: 'suspended' } });

      res.json({
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          suspended: suspendedUsers
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/stats/daily (admin)
  async getDailyUserStats(req, res, next) {
    try {
      const stats = await User.findAll({
        attributes: [
          [User.sequelize.fn('DATE', User.sequelize.col('created_at')), 'date'],
          [User.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: [User.sequelize.fn('DATE', User.sequelize.col('created_at'))],
        order: [[User.sequelize.fn('DATE', User.sequelize.col('created_at')), 'DESC']],
        limit: 30
      });

      res.json({
        success: true,
        data: { stats }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/stats/monthly (admin)
  async getMonthlyUserStats(req, res, next) {
    try {
      const stats = await User.findAll({
        attributes: [
          [User.sequelize.fn('YEAR', User.sequelize.col('created_at')), 'year'],
          [User.sequelize.fn('MONTH', User.sequelize.col('created_at')), 'month'],
          [User.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: [
          User.sequelize.fn('YEAR', User.sequelize.col('created_at')),
          User.sequelize.fn('MONTH', User.sequelize.col('created_at'))
        ],
        order: [
          [User.sequelize.fn('YEAR', User.sequelize.col('created_at')), 'DESC'],
          [User.sequelize.fn('MONTH', User.sequelize.col('created_at')), 'DESC']
        ],
        limit: 12
      });

      res.json({
        success: true,
        data: { stats }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/search/advanced (admin)
  async advancedUserSearch(req, res, next) {
    try {
      const { query, filters } = req.query;
      
      const where = {};
      
      if (query) {
        where[User.sequelize.Op.or] = [
          { name: { [User.sequelize.Op.like]: `%${query}%` } },
          { email: { [User.sequelize.Op.like]: `%${query}%` } }
        ];
      }

      const users = await User.findAll({
        where,
        attributes: { exclude: ['password'] },
        include: [{ model: Profile, as: 'profile' }],
        limit: 50
      });

      res.json({
        success: true,
        data: { users }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
