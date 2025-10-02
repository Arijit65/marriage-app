const { RRUser, User } = require('../models');
const { AppError, ValidationError } = require('../middleware/errorHandler');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Generate JWT token
const generateToken = (userId, expiresIn = '1h') => {
  return jwt.sign(
    { id: userId, type: 'rr_user' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn }
  );
};

class RRController {
  // Register a new RR User
  async register(req, res, next) {
    try {
      const {
        name,
        email,
        mobileNo,
        password,
        commission = 5.00
      } = req.body;

      // Validate required fields
      if (!name || !email || !mobileNo || !password) {
        throw new ValidationError('Name, email, mobile number and password are required');
      }

      // Check if email already exists
      const existingEmail = await RRUser.findByEmail(email);
      if (existingEmail) {
        throw new ValidationError('Email already registered');
      }

      // Check if mobile number already exists
      const existingMobile = await RRUser.findByMobile(mobileNo);
      if (existingMobile) {
        throw new ValidationError('Mobile number already registered');
      }


      // Create new RR User
      const rrUser = await RRUser.create({
        name,
        email: email.toLowerCase(),
        mobileNo,
        password,
        commission: parseFloat(commission),
        registeredAt: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'RR User registered successfully',
        data: {
          rrUser: rrUser.toSafeJSON()
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Login RR User
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Find user by email
      const rrUser = await RRUser.findByEmail(email.toLowerCase());
      if (!rrUser) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if account is active
      if (!rrUser.active) {
        throw new AppError('Account is deactivated. Please contact support.', 401);
      }

      // Verify password
      const isPasswordValid = await rrUser.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Update last login
      await rrUser.updateLastLogin();

      // Generate JWT token
      const token = generateToken(rrUser.id, '7d');

      res.json({
        success: true,
        message: 'RR User login successful',
        data: {
          user: {
            id: rrUser.id,
            name: rrUser.name,
            email: rrUser.email,
            mobileNo: rrUser.mobileNo,
            commission: rrUser.commission,
            totalEarning: rrUser.totalEarning,
            referCount: rrUser.referCount,
            referCode: rrUser.referCode,
            active: rrUser.active,
            lastLogin: rrUser.lastLogin
          },
          token
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get RR User profile
  async getProfile(req, res, next) {
    try {
      const rrUserId = req.rrUser.id;

      const rrUser = await RRUser.findByPk(rrUserId, {
        include: [{
          model: User,
          as: 'referredUsers',
          attributes: ['id', 'name', 'email', 'created_at'],
          limit: 10,
          order: [['created_at', 'DESC']]
        }]
      });

      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      res.json({
        success: true,
        data: {
          rrUser: rrUser.toSafeJSON(),
          recentReferrals: rrUser.referredUsers || []
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Update RR User profile
  async updateProfile(req, res, next) {
    try {
      const rrUserId = req.rrUser.id;
      const {
        name,
        mobileNo,
        settings
      } = req.body;

      const rrUser = await RRUser.findByPk(rrUserId);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      // Check if mobile number is being updated and if it already exists
      if (mobileNo && mobileNo !== rrUser.mobileNo) {
        const existingMobile = await RRUser.findByMobile(mobileNo);
        if (existingMobile) {
          throw new ValidationError('Mobile number already registered');
        }
      }

      // Update fields
      const updateData = {};
      if (name) updateData.name = name;
      if (mobileNo) updateData.mobileNo = mobileNo;
      if (settings) updateData.settings = { ...rrUser.settings, ...settings };

      await rrUser.update(updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          rrUser: rrUser.toSafeJSON()
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const rrUserId = req.rrUser.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ValidationError('Current password and new password are required');
      }

      if (newPassword.length < 6) {
        throw new ValidationError('New password must be at least 6 characters long');
      }

      const rrUser = await RRUser.findByPk(rrUserId);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await rrUser.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Update password
      await rrUser.update({ password: newPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Get dashboard data
  async getDashboard(req, res, next) {
    try {
      const rrUserId = req.rrUser.id;

      const rrUser = await RRUser.findByPk(rrUserId);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      // Get referred users with pagination
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const referredUsers = await User.findAndCountAll({
        where: { referredBy: rrUser.referCode },
        attributes: ['id', 'name', 'email', 'created_at', 'is_verified'],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Calculate this month's earnings and referrals
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const monthlyReferrals = await User.count({
        where: {
          referredBy: rrUser.referCode,
          created_at: {
            [Op.gte]: thisMonth
          }
        }
      });

      // You can add earnings calculation based on your business logic
      const monthlyEarnings = monthlyReferrals * (rrUser.commission / 100) * 100; // Example calculation

      res.json({
        success: true,
        data: {
          summary: {
            totalReferrals: rrUser.referCount,
            totalEarnings: parseFloat(rrUser.totalEarning),
            monthlyReferrals,
            monthlyEarnings,
            commissionRate: parseFloat(rrUser.commission),
            referCode: rrUser.referCode,
            active: rrUser.active
          },
          referredUsers: {
            data: referredUsers.rows,
            pagination: {
              currentPage: parseInt(page),
              totalPages: Math.ceil(referredUsers.count / limit),
              totalCount: referredUsers.count,
              hasNext: page * limit < referredUsers.count,
              hasPrev: page > 1
            }
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get all RR Users (Admin only)
  async getAllRRUsers(req, res, next) {
    try {
      const { page = 1, limit = 20, search, active } = req.query;
      const offset = (page - 1) * limit;

      // Build search criteria
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { referCode: { [Op.like]: `%${search}%` } },
          { mobileNo: { [Op.like]: `%${search}%` } }
        ];
      }

      if (active !== undefined) {
        whereClause.active = active === 'true';
      }

      const { count, rows: rrUsers } = await RRUser.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          rrUsers,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            hasNext: page * limit < count,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Toggle RR User status (Admin only)
  async toggleUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { active } = req.body;

      if (typeof active !== 'boolean') {
        throw new ValidationError('Active status must be a boolean');
      }

      const rrUser = await RRUser.findByPk(id);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      await rrUser.update({ active });

      res.json({
        success: true,
        message: `RR User ${active ? 'activated' : 'deactivated'} successfully`,
        data: {
          rrUser: rrUser.toSafeJSON()
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Update commission (Admin only)
  async updateCommission(req, res, next) {
    try {
      const { id } = req.params;
      const { commission } = req.body;

      if (commission === undefined || commission < 0 || commission > 100) {
        throw new ValidationError('Commission must be between 0 and 100');
      }

      const rrUser = await RRUser.findByPk(id);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      await rrUser.update({ commission: parseFloat(commission) });

      res.json({
        success: true,
        message: 'Commission updated successfully',
        data: {
          rrUser: rrUser.toSafeJSON()
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get top performers
  async getTopPerformers(req, res, next) {
    try {
      const { type = 'earnings', limit = 10 } = req.query;

      let topPerformers;
      
      if (type === 'earnings') {
        topPerformers = await RRUser.getTopEarners(parseInt(limit));
      } else if (type === 'referrals') {
        topPerformers = await RRUser.getTopReferrers(parseInt(limit));
      } else {
        throw new ValidationError('Type must be either "earnings" or "referrals"');
      }

      res.json({
        success: true,
        data: {
          type,
          topPerformers
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get statistics
  async getStatistics(req, res, next) {
    try {
      const totalRRUsers = await RRUser.count();
      const activeRRUsers = await RRUser.count({ where: { active: true } });
      const totalEarnings = await RRUser.sum('totalEarning');
      const totalReferrals = await RRUser.sum('referCount');

      // Monthly statistics
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const monthlyRegistrations = await RRUser.count({
        where: {
          createdAt: {
            [Op.gte]: thisMonth
          }
        }
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalRRUsers,
            activeRRUsers,
            totalEarnings: parseFloat(totalEarnings) || 0,
            totalReferrals: parseInt(totalReferrals) || 0
          },
          monthly: {
            newRegistrations: monthlyRegistrations
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get referred members list for an RR user
  async getReferredMembersList(req, res, next) {
    try {
      const rrUserId = req.rrUser.id;
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const rrUser = await RRUser.findByPk(rrUserId);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      // Check if referral code exists
      if (!rrUser.referCode) {
        return res.json({
          success: true,
          data: {
            members: [],
            pagination: {
              currentPage: parseInt(page),
              totalPages: 0,
              totalCount: 0,
              hasNext: false,
              hasPrev: false
            },
            stats: {
              totalMembers: 0,
              activeMembers: 0,
              totalCommissionEarned: 0
            }
          }
        });
      }

      const { User, Profile } = require('../models');
      
      // Build search criteria
      let whereClause = { referredBy: rrUser.referCode };
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { phone_number: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      // Get referred members with profile information
      const { count, rows: members } = await User.findAndCountAll({
        where: whereClause,
        include: [{
          model: Profile,
          as: 'userProfile',
          attributes: ['photos', 'personal_info', 'location_info', 'education_career_info']
        }],
        attributes: ['id', 'name', 'email', 'phone_number', 'gender', 'date_of_birth', 'plan_id', 'account_status', 'created_at', 'last_login'],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Calculate commission for each member (you can adjust this logic based on your business rules)
      const membersWithCommission = members.map(member => {
        // Example commission calculation - adjust as needed
        let commissionAmount = 0;
        if (member.plan_id > 1) { // If user has a paid plan
          commissionAmount = (rrUser.commission / 100) * 100; // Base commission amount
        }

        return {
          id: member.id,
          name: member.name,
          email: member.email,
          phone: member.phone_number,
          gender: member.gender,
          dateOfBirth: member.date_of_birth,
          planId: member.plan_id,
          accountStatus: member.account_status,
          joinDate: member.created_at,
          lastLogin: member.last_login,
          commission: commissionAmount,
          photo: member.userProfile?.photos?.[0] || null,
          location: {
            state: member.userProfile?.location_info?.state || '',
            city: member.userProfile?.location_info?.city || ''
          },
          education: member.userProfile?.education_career_info?.education || '',
          profession: member.userProfile?.education_career_info?.occupation || ''
        };
      });

      // Calculate stats
      const totalMembers = count;
      const activeMembers = members.filter(m => m.account_status === 'active').length;
      const totalCommissionEarned = membersWithCommission.reduce((sum, m) => sum + m.commission, 0);

      res.json({
        success: true,
        data: {
          members: membersWithCommission,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            hasNext: page * limit < count,
            hasPrev: page > 1
          },
          stats: {
            totalMembers,
            activeMembers,
            totalCommissionEarned
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get referral statistics for an RR user
  async getReferralStats(req, res, next) {
    try {
      const rrUserId = req.rrUser.id;

      const rrUser = await RRUser.findByPk(rrUserId);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      // Get total referrals and recent ones
      const { User } = require('../models');
      const totalReferrals = await User.count({
        where: { referredBy: rrUser.referCode }
      });

      // Get this month's referrals
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const monthlyReferrals = await User.count({
        where: {
          referredBy: rrUser.referCode,
          created_at: {
            [Op.gte]: thisMonth
          }
        }
      });

      // Get recent referrals with user details
      const recentReferrals = await User.findAll({
        where: { referredBy: rrUser.referCode },
        attributes: ['id', 'name', 'phone_number', 'gender', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: 10
      });

      res.json({
        success: true,
        data: {
          referralCode: rrUser.referCode,
          totalReferrals,
          monthlyReferrals,
          totalEarnings: parseFloat(rrUser.totalEarning),
          commissionRate: parseFloat(rrUser.commission),
          recentReferrals
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Generate referral code (one-time only)
  async generateReferralCode(req, res, next) {
    try {
      const rrUserId = req.rrUser.id;

      const rrUser = await RRUser.findByPk(rrUserId);
      if (!rrUser) {
        throw new AppError('RR User not found', 404);
      }

      // Check if referral code already exists
      if (rrUser.referCode) {
        return res.json({
          success: true,
          message: 'Referral code already exists',
          data: {
            referCode: rrUser.referCode
          }
        });
      }

      // Generate referral code: First+Last letter of name + ID + Last two digits of mobile
      const name = rrUser.name.trim();
      const firstLetter = name.charAt(0).toUpperCase();
      const lastLetter = name.charAt(name.length - 1).toUpperCase();
      const mobileNo = rrUser.mobileNo;
      const lastTwoDigits = mobileNo.slice(-2);
      
      const referralCode = `${firstLetter}${lastLetter}${rrUser.id}$${lastTwoDigits}`;

      // Update the RR user with the generated referral code
      await rrUser.update({ referCode: referralCode });

      res.json({
        success: true,
        message: 'Referral code generated successfully',
        data: {
          referCode: referralCode
        }
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RRController();