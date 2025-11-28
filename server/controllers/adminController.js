const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const { logger } = require('../utils/logger');
const { ValidationError, AuthenticationError, ForbiddenError } = require('../middleware/errorHandler');

class AdminController {
  // Generate JWT token for admin
  static generateToken(admin) {
    return jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        type: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
  }

  // Admin Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }

      // Find admin by email
      const admin = await Admin.findByEmail(email);
      
      if (!admin) {
        logger.warn(`Failed login attempt for email: ${email}`);
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if account is locked
      if (admin.isAccountLocked()) {
        const lockTime = new Date(admin.locked_until).toLocaleString();
        throw new AuthenticationError(`Account is locked until ${lockTime} due to multiple failed login attempts`);
      }

      // Check if account is active
      if (!admin.is_active) {
        throw new AuthenticationError('Your account has been deactivated. Please contact the super admin.');
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        await admin.incrementLoginAttempts();
        logger.warn(`Failed login attempt for admin: ${email}`);
        throw new AuthenticationError('Invalid email or password');
      }

      // Reset login attempts on successful login
      await admin.resetLoginAttempts();

      // Update last login
      admin.last_login = new Date();
      await admin.save();

      // Generate token
      const token = AdminController.generateToken(admin);

      logger.info(`Admin logged in: ${admin.email} (${admin.role})`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          admin: admin.toJSON(),
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Admin Profile
  async getProfile(req, res, next) {
    try {
      const admin = await Admin.findByPk(req.admin.id, {
        attributes: { exclude: ['password', 'login_attempts', 'locked_until'] },
        include: [{
          model: Admin,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'role']
        }]
      });

      if (!admin) {
        throw new AuthenticationError('Admin not found');
      }

      res.status(200).json({
        success: true,
        data: { admin }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Admin Profile
  async updateProfile(req, res, next) {
    try {
      const { name, phone_number, profile_info } = req.body;
      const admin = await Admin.findByPk(req.admin.id);

      if (!admin) {
        throw new AuthenticationError('Admin not found');
      }

      // Update allowed fields
      if (name) admin.name = name;
      if (phone_number) admin.phone_number = phone_number;
      if (profile_info) {
        admin.profile_info = {
          ...admin.profile_info,
          ...profile_info
        };
      }

      await admin.save();

      logger.info(`Admin profile updated: ${admin.email}`);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { admin: admin.toJSON() }
      });
    } catch (error) {
      next(error);
    }
  }

  // Change Password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ValidationError('Current password and new password are required');
      }

      if (newPassword.length < 6) {
        throw new ValidationError('New password must be at least 6 characters long');
      }

      const admin = await Admin.findByPk(req.admin.id);

      if (!admin) {
        throw new AuthenticationError('Admin not found');
      }

      // Verify current password
      const isPasswordValid = await admin.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Update password
      admin.password = newPassword;
      await admin.save();

      logger.info(`Admin password changed: ${admin.email}`);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Create Admin (Super Admin Only)
  async createAdmin(req, res, next) {
    try {
      const { name, email, password, role, phone_number, permissions } = req.body;

      // Only super admin can create other admins
      if (req.admin.role !== 'super_admin') {
        throw new ForbiddenError('Only super admins can create new admin accounts');
      }

      // Validate required fields
      if (!name || !email || !password) {
        throw new ValidationError('Name, email, and password are required');
      }

      if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters long');
      }

      // Check if admin already exists
      const existingAdmin = await Admin.findByEmail(email);
      if (existingAdmin) {
        throw new ValidationError('Admin with this email already exists');
      }

      // Create new admin
      const newAdmin = await Admin.create({
        name,
        email,
        password,
        role: role || 'sub_admin',
        phone_number,
        permissions: permissions || undefined,
        created_by: req.admin.id
      });

      logger.info(`New admin created by ${req.admin.email}: ${newAdmin.email} (${newAdmin.role})`);

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: { admin: newAdmin.toJSON() }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Admins (Super Admin Only)
  async getAllAdmins(req, res, next) {
    try {
      // Only super admin can view all admins
      if (req.admin.role !== 'super_admin') {
        throw new ForbiddenError('Only super admins can view all admin accounts');
      }

      const { role, is_active } = req.query;
      
      const whereClause = {};
      if (role) whereClause.role = role;
      if (is_active !== undefined) whereClause.is_active = is_active === 'true';

      const admins = await Admin.findAll({
        where: whereClause,
        attributes: { exclude: ['password', 'login_attempts', 'locked_until'] },
        include: [{
          model: Admin,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'role']
        }],
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: { 
          admins,
          total: admins.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Admin (Super Admin Only)
  async updateAdmin(req, res, next) {
    try {
      const { adminId } = req.params;
      const { name, email, role, phone_number, is_active, permissions } = req.body;

      // Only super admin can update other admins
      if (req.admin.role !== 'super_admin') {
        throw new ForbiddenError('Only super admins can update admin accounts');
      }

      const admin = await Admin.findByPk(adminId);

      if (!admin) {
        throw new ValidationError('Admin not found');
      }

      // Cannot modify yourself
      if (admin.id === req.admin.id) {
        throw new ForbiddenError('You cannot modify your own account through this endpoint');
      }

      // Update allowed fields
      if (name) admin.name = name;
      if (email) admin.email = email;
      if (role) admin.role = role;
      if (phone_number !== undefined) admin.phone_number = phone_number;
      if (is_active !== undefined) admin.is_active = is_active;
      if (permissions && role !== 'super_admin') admin.permissions = permissions;

      await admin.save();

      logger.info(`Admin updated by ${req.admin.email}: ${admin.email}`);

      res.status(200).json({
        success: true,
        message: 'Admin updated successfully',
        data: { admin: admin.toJSON() }
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete Admin (Super Admin Only)
  async deleteAdmin(req, res, next) {
    try {
      const { adminId } = req.params;

      // Only super admin can delete other admins
      if (req.admin.role !== 'super_admin') {
        throw new ForbiddenError('Only super admins can delete admin accounts');
      }

      const admin = await Admin.findByPk(adminId);

      if (!admin) {
        throw new ValidationError('Admin not found');
      }

      // Cannot delete yourself
      if (admin.id === req.admin.id) {
        throw new ForbiddenError('You cannot delete your own account');
      }

      // Prevent deleting the last super admin
      if (admin.role === 'super_admin') {
        const superAdminCount = await Admin.count({
          where: { role: 'super_admin', is_active: true }
        });
        
        if (superAdminCount <= 1) {
          throw new ForbiddenError('Cannot delete the last super admin');
        }
      }

      await admin.destroy();

      logger.info(`Admin deleted by ${req.admin.email}: ${admin.email}`);

      res.status(200).json({
        success: true,
        message: 'Admin deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout
  async logout(req, res, next) {
    try {
      logger.info(`Admin logged out: ${req.admin.email}`);
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
