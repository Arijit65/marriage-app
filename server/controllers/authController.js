const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile, OTP } = require('../models');
const { Sequelize, Op } = require('sequelize');
const { generateJWT, verifyJWT } = require('../middleware/auth');
const { sendOTP, verifyOTP } = require('../services/otpService');
const { logger } = require('../utils/logger');
const { AppError, ValidationError, AuthenticationError } = require('../middleware/errorHandler');

class AuthController {
  // Generate secure password
  static generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Generate temporary user ID (AYYNNNNF format)
  static generateTempUserId() {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits
    
    // Get month first letter (A=Jan, B=Feb, C=Mar, etc.)
    const monthLetter = String.fromCharCode(64 + month); // A=65, B=66, etc.
    
    // Generate serial number (4 digits, starting from 0001)
    const serialNumber = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `${monthLetter}${year}${serialNumber}F`;
  }

  // Send OTP for registration (first step)
  async sendRegistrationOTP(req, res, next) {
    try {
      const { phone } = req.body;

      if (!phone) {
        throw new ValidationError('Phone number is required');
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { phone_number: phone } });
      if (existingUser) {
        throw new ValidationError('User with this phone number already exists');
      }

      // Send OTP without creating user
      const otpResult = await sendOTP(phone, 'registration');
      
      if (!otpResult.success) {
        throw new AppError('Failed to send OTP', 500);
      }

      res.json({
        success: true,
        message: 'OTP sent successfully for registration',
        data: {
          phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3'), // Mask phone number
          fallback: otpResult.fallback,
          fallbackOTP: otpResult.fallbackOTP
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Register new user (after OTP verification)
  async register(req, res, next) {
    try {
      console.log('\n📝 REGISTRATION REQUEST DATA 📝');
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      console.log('📝 REGISTRATION REQUEST DATA 📝\n');
      
      const { 
        name, email, phone, gender, dateOfBirth,
        maritalStatus, state, religion, community, caste, motherTongue,
        profession, professionDetail, highestQualification, qualificationCategory,
        qualificationDegree, advertiserName, relationWithCandidate,
        otp, referCode
      } = req.body;

      // Collect uploaded photo paths (served via /uploads)
      let uploadedPhotos = [];
      if (Array.isArray(req.files) && req.files.length > 0) {
        uploadedPhotos = req.files.map((file) => `/uploads/${file.filename}`);
      }

      // Use advertiserName as member name if name is not provided
      const memberName = name || advertiserName;

      if (!otp) {
        throw new ValidationError('OTP is required for registration');
      }

      if (!phone) {
        throw new ValidationError('Phone number is required');
      }

      // Verify OTP first
      const verificationResult = await verifyOTP(phone, otp, 'registration');
      
      if (!verificationResult.success) {
        throw new ValidationError(verificationResult.error || 'Invalid OTP');
      }

      // Check if user already exists with phone
      const existingPhoneUser = await User.findOne({ where: { phone_number: phone } });
      if (existingPhoneUser) {
        throw new ValidationError('User with this phone number already exists');
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmailUser = await User.findOne({ 
          where: { 
            email: email.toLowerCase()
          }
        });
        
        if (existingEmailUser) {
          throw new ValidationError('User with this email already exists');
        }
      }

      // Validate required fields
      if (!memberName || !gender || !dateOfBirth) {
        throw new ValidationError('Member name (advertiser name), gender, and date of birth are required');
      }

      // Process referral code if present
      let referrerRRUser = null;
      if (referCode) {
        const { RRUser } = require('../models');
        referrerRRUser = await RRUser.findByReferCode(referCode);
        if (!referrerRRUser) {
          throw new ValidationError('Invalid referral code');
        }
      }

      // Generate user ID and password
      const userId = AuthController.generateTempUserId();
      const autoGeneratedPassword = AuthController.generatePassword();
      
      console.log(`\n🔐 REGISTRATION COMPLETED 🔐`);
      console.log(`📱 Phone: ${phone}`);
      console.log(`🆔 User ID: ${userId}`);
      console.log(`🔑 Generated Password: ${autoGeneratedPassword}`);
      console.log(`👤 User: ${memberName}`);
      console.log(`🔐 REGISTRATION COMPLETED 🔐\n`);

      // Create new user
      const user = await User.create({
        id: userId,
        name: memberName,
        email: email ? email.toLowerCase() : null,
        phone_number: phone,
        password: autoGeneratedPassword, // Will be hashed by model hook
        gender,
        date_of_birth: dateOfBirth,
        plan_id: 1,
        account_status: 'active', // Account is now active
        is_phone_verified: true, // Phone is verified
        referredBy: referCode || null, // Store the referral code
        account_info: {
          suspension_reason: null,
          suspension_until: null,
          registration_source: referCode ? 'rr_link' : 'web',
          ip_address: req.ip || null,
          user_agent: req.headers['user-agent'] || null,
          timezone: 'UTC',
          language: 'en'
        }
      });

      // Create profile with additional fields
      const profileData = {
        user_id: user.id,
        personal_info: {
          marital_status: maritalStatus,
          height: null,
          weight: null,
          complexion: '',
          body_type: '',
          children: 'no'
        },
        location_info: {
          state: state,
          country: 'India',
          city: '',
          latitude: null,
          longitude: null
        },
        religious_info: {
          religion: religion,
          community: community,
          caste: caste,
          gothra: '',
          manglik: 'dont_know'
        },
        education_career_info: {
          education: highestQualification,
          education_category: qualificationCategory,
          education_degree: qualificationDegree,
          occupation: profession,
          occupation_detail: professionDetail,
          company: '',
          annual_income: 'below_3_lakhs'
        },
        family_info: {
          type: 'nuclear',
          status: 'middle_class',
          location: '',
          father_name: '',
          father_occupation: '',
          mother_name: '',
          mother_occupation: '',
          siblings: 0
        },
        lifestyle_info: {
          diet: 'vegetarian',
          smoking: 'never',
          drinking: 'never'
        },
        additional_info: {
          languages_known: [],
          native_language: motherTongue,
          disability: 'none'
        },
        photos: uploadedPhotos,
        registration_info: {
          qualification_level: highestQualification,
          qualification_category: qualificationCategory,
          qualification_degree: qualificationDegree,
          profession: profession,
          profession_detail: professionDetail,
          advertiser_name: advertiserName,
          relation_with_candidate: relationWithCandidate
        },
        profile_settings: {
          is_complete: false,
          is_verified: false,
          is_featured: false,
          boost_expires_at: null,
          show_contact_info: false,
          show_photos_to_all: true,
          views_count: 0,
          likes_count: 0,
          last_update: null
        }
      };
      
      await Profile.create(profileData);

      // Update RR User statistics if referral code was used
      if (referrerRRUser) {
        await referrerRRUser.incrementReferCount();
        console.log(`🎉 Referral processed successfully for RR User: ${referrerRRUser.name} (Code: ${referCode})`);
      }

      // Generate JWT token
      const token = generateJWT(user.id);

      res.status(201).json({
        success: true,
        message: 'Registration completed successfully! Your account is now active.',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone_number,
            gender: user.gender,
            isPhoneVerified: true,
            isEmailVerified: false,
            planId: user.plan_id
          },
          token
        }
      });

    } catch (error) {
      next(error);
    }
  }



  // Login user - OTP based (primary method)
  async login(req, res, next) {
    try {
      const { email, phone, otp, password } = req.body;

      if (!email && !phone) {
        throw new ValidationError('Email or phone is required');
      }

      // Find user
      const whereConditions = [];
      if (email) {
        whereConditions.push({ email: email.toLowerCase() });
      }
      if (phone) {
        whereConditions.push({ phone_number: phone });
      }

      const user = await User.findOne({
        where: {
          [Op.or]: whereConditions
        },
        include: [{
          model: Profile,
          as: 'userProfile',
          attributes: ['profile_settings']
        }]
      });

      if (!user) {
        throw new AuthenticationError('User not found with this email or phone number');
      }

      // Check if user is active
      if (!user.is_active) {
        throw new AuthenticationError('Account is deactivated. Please contact support.');
      }

      // Primary login method: OTP verification
      if (otp) {
        // Verify OTP
        const verificationResult = await verifyOTP(phone || user.phone_number, otp, 'login');
        
        if (!verificationResult.success) {
          throw new ValidationError(verificationResult.error || 'Invalid OTP');
        }

        // Update last login
        await user.update({
          last_login: new Date()
        });

        // Generate JWT token
        const token = generateJWT(user.id);

        res.json({
          success: true,
          message: 'Login successful via OTP',
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone_number,
              gender: user.gender,
              isVerified: user.is_verified,
              isActive: user.is_active,
              planId: user.plan_id,
              profileCompletion: user.userProfile?.profile_completion || 0
            },
            token
          }
        });

      } else if (password) {
        // Fallback login method: Password verification
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new AuthenticationError('Invalid password');
        }

        // Update last login
        await user.update({
          last_login: new Date()
        });

        // Generate JWT token
        const token = generateJWT(user.id);

        res.json({
          success: true,
          message: 'Login successful via password',
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone_number,
              gender: user.gender,
              isVerified: user.is_verified,
              isActive: user.is_active,
              planId: user.plan_id,
              profileCompletion: user.userProfile?.profile_completion || 0
            },
            token
          }
        });

      } else {
        // No OTP or password provided - send OTP for login
        const otpResult = await sendOTP(phone || user.phone_number, 'login');
        
        if (!otpResult.success) {
          throw new AppError('Failed to send login OTP', 500);
        }

        res.json({
          success: true,
          message: 'OTP sent for login. Please verify with the OTP.',
          data: {
            phone: (phone || user.phone_number).replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3'), // Mask phone number
            fallback: otpResult.fallback,
            fallbackOTP: otpResult.fallbackOTP,
            requiresOTP: true
          }
        });
      }

    } catch (error) {
      next(error);
    }
  }


  // Send OTP for phone verification
  async sendPhoneOTP(req, res, next) {
    try {
      const { phone } = req.body;

      if (!phone) {
        throw new ValidationError('Phone number is required');
      }

      // Check if user exists
      const user = await User.findOne({ where: { phone_number: phone } });
      if (!user) {
        throw new ValidationError('User not found with this phone number');
      }

      // Send OTP
      const otpResult = await sendOTP(phone, 'phone_verification');
      
      if (!otpResult.success) {
        throw new AppError('Failed to send OTP', 500);
      }

      // Log activity - temporarily disabled
      // await UserActivity.create({
      //   userId: user.id,
      //   activityType: 'otp_requested',
      //   data: { otpType: 'phone_verification' },
      //   sessionInfo: req.sessionID,
      //   deviceInfo: req.headers['user-agent'],
      //   ipAddress: req.ip
      // });

      res.json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3') // Mask phone number
        }
      });

    } catch (error) {
      next(error);
    }
  }


  // Verify phone OTP
  async verifyPhoneOTP(req, res, next) {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        throw new ValidationError('Phone number and OTP are required');
      }

      // Find user
      const user = await User.findOne({ where: { phone_number: phone } });
      if (!user) {
        throw new ValidationError('User not found');
      }

      // Verify OTP
      const verificationResult = await verifyOTP(phone, otp, 'phone_verification');
      
      if (!verificationResult.success) {
        throw new ValidationError(verificationResult.error || 'Invalid OTP');
      }

      // Update user verification status and activate account
      await user.update({ 
        isPhoneVerified: true,
        account_status: 'active'
      });

      // Log activity - temporarily disabled
      // await UserActivity.create({
      //   userId: user.id,
      //   activityType: 'phone_verified',
      //   data: { verificationMethod: 'otp' },
      //   sessionInfo: req.sessionID,
      //   deviceInfo: req.headers['user-agent'],
      //   ipAddress: req.ip
      // });

      res.json({
        success: true,
        message: 'Phone number verified successfully',
        data: {
          isPhoneVerified: true
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Profile,
          as: 'userProfile',
          attributes: { exclude: ['id', 'userId'] }
        }],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: { user }
      });

    } catch (error) {
      next(error);
    }
  }

  // Logout user
  async logout(req, res, next) {
    try {
      // Log activity - temporarily disabled
      // await UserActivity.create({
      //   userId: req.user.id,
      //   activityType: 'user_logout',
      //   data: { logoutMethod: 'manual' },
      //   sessionInfo: req.sessionID,
      //   deviceInfo: req.headers['user-agent'],
      //   ipAddress: req.ip
      // });

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Send password reset OTP
  async sendPasswordResetOTP(req, res, next) {
    try {
      const { email, phone } = req.body;

      if (!email && !phone) {
        throw new ValidationError('Email or phone is required');
      }

      // Find user
      const whereConditions = [];
      if (email) {
        whereConditions.push({ email: email.toLowerCase() });
      }
      if (phone) {
        whereConditions.push({ phone_number: phone });
      }

      const user = await User.findOne({
        where: {
          [Op.or]: whereConditions
        }
      });

      if (!user) {
        throw new ValidationError('User not found');
      }

      // Send OTP
      const otpResult = await sendOTP(phone || user.phone_number, 'password_reset');
      
      if (!otpResult.success) {
        throw new AppError('Failed to send OTP', 500);
      }

      res.json({
        success: true,
        message: 'Password reset OTP sent successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Reset password
  async resetPassword(req, res, next) {
    try {
      const { email, phone, otp, newPassword } = req.body;

      // Find user
      const whereConditions = [];
      if (email) {
        whereConditions.push({ email: email.toLowerCase() });
      }
      if (phone) {
        whereConditions.push({ phone_number: phone });
      }

      const user = await User.findOne({
        where: {
          [Op.or]: whereConditions
        }
      });

      if (!user) {
        throw new ValidationError('User not found');
      }

      // Verify OTP
      const verificationResult = await verifyOTP(phone || user.phone_number, otp, 'password_reset');
      
      if (!verificationResult.success) {
        throw new ValidationError('Invalid OTP');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = verifyJWT(refreshToken);
      
      if (!decoded) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new access token
      const newToken = generateJWT(decoded.userId);

      res.json({
        success: true,
        data: {
          token: newToken
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Update profile
  async updateProfile(req, res, next) {
    try {
      const { name, email, phone, gender, dateOfBirth } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update user fields
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase();
      if (phone) updateData.phone_number = phone;
      if (gender) updateData.gender = gender;
      if (dateOfBirth) updateData.date_of_birth = dateOfBirth;

      await user.update(updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });

    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new ValidationError('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Delete account
  async deleteAccount(req, res, next) {
    try {
      const { password } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new ValidationError('Password is incorrect');
      }

      // Delete user (this will cascade to related records)
      await user.destroy();

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
