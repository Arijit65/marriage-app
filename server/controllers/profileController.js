const { Profile, User, ProfileScore, UserActivity } = require('../models');
const { Op } = require('sequelize');
const { AppError, ValidationError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

class ProfileController {
  // Get user profile
  async getProfile(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.id;

      const profile = await Profile.findOne({
        where: { userId: userId || currentUserId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'phone', 'gender', 'dateOfBirth', 'isPhoneVerified', 'isEmailVerified', 'planId']
        }]
      });

      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      // Check if profile is active and visible
      if (!profile.isActive) {
        throw new AppError('Profile is not active', 404);
      }

      // If viewing own profile, return full data
      if (userId === currentUserId || !userId) {
        return res.json({
          success: true,
          data: { profile }
        });
      }

      // For other profiles, respect privacy settings
      const publicProfile = {
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        age: profile.calculateAge(),
        location: profile.privacySettings?.showLocation ? {
          city: profile.city,
          state: profile.state,
          country: profile.country
        } : null,
        photos: profile.privacySettings?.showPhotos ? profile.photos : [],
        aboutMe: profile.privacySettings?.showAboutMe ? profile.aboutMe : null,
        education: profile.privacySettings?.showEducation ? {
          highestEducation: profile.highestEducation,
          institution: profile.institution,
          fieldOfStudy: profile.fieldOfStudy
        } : null,
        career: profile.privacySettings?.showCareer ? {
          occupation: profile.occupation,
          company: profile.company,
          income: profile.privacySettings?.showIncome ? profile.income : null
        } : null,
        family: profile.privacySettings?.showFamily ? {
          familyType: profile.familyType,
          familyStatus: profile.familyStatus,
          familyIncome: profile.privacySettings?.showFamilyIncome ? profile.familyIncome : null
        } : null,
        partnerPreferences: profile.partnerPreferences,
        profileCompletion: profile.profileCompletion,
        isVerified: profile.isVerified,
        lastActive: profile.lastActive
      };

      // Log profile view
      await UserActivity.create({
        userId: currentUserId,
        activityType: 'profile_viewed',
        targetUserId: profile.userId,
        data: { profileId: profile.id },
        sessionInfo: req.sessionID,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      });

      res.json({
        success: true,
        data: { profile: publicProfile }
      });

    } catch (error) {
      next(error);
    }
  }

  // Create or update profile
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Find existing profile
      let profile = await Profile.findOne({ where: { userId } });

      if (!profile) {
        // Create new profile
        profile = await Profile.create({
          userId,
          ...updateData
        });
      } else {
        // Update existing profile
        await profile.update(updateData);
      }

      // Recalculate profile completion
      await profile.calculateProfileCompletion();

      // Update profile score
      await ProfileScore.updateProfileScore(userId);

      // Log activity
      await UserActivity.create({
        userId,
        activityType: 'profile_updated',
        data: { 
          updatedFields: Object.keys(updateData),
          profileCompletion: profile.profileCompletion
        },
        sessionInfo: req.sessionID,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          profile: {
            id: profile.id,
            profileCompletion: profile.profileCompletion,
            isActive: profile.isActive,
            lastUpdated: profile.updatedAt
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Update profile photos
  async updatePhotos(req, res, next) {
    try {
      const userId = req.user.id;
      const { photos } = req.body;

      if (!photos || !Array.isArray(photos)) {
        throw new ValidationError('Photos array is required');
      }

      // Validate photo URLs
      const validPhotos = photos.filter(photo => 
        photo && typeof photo === 'string' && photo.trim().length > 0
      );

      if (validPhotos.length > 10) {
        throw new ValidationError('Maximum 10 photos allowed');
      }

      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      await profile.update({ photos: validPhotos });

      // Recalculate profile completion
      await profile.calculateProfileCompletion();

      // Update profile score
      await ProfileScore.updateProfileScore(userId);

      // Log activity
      await UserActivity.create({
        userId,
        activityType: 'photos_updated',
        data: { photoCount: validPhotos.length },
        sessionInfo: req.sessionID,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Photos updated successfully',
        data: {
          photos: validPhotos,
          photoCount: validPhotos.length
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Update privacy settings
  async updatePrivacySettings(req, res, next) {
    try {
      const userId = req.user.id;
      const { privacySettings } = req.body;

      if (!privacySettings || typeof privacySettings !== 'object') {
        throw new ValidationError('Privacy settings object is required');
      }

      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      // Merge with existing privacy settings
      const updatedPrivacySettings = {
        ...profile.privacySettings,
        ...privacySettings
      };

      await profile.update({ privacySettings: updatedPrivacySettings });

      // Log activity
      await UserActivity.create({
        userId,
        activityType: 'privacy_settings_updated',
        data: { updatedSettings: Object.keys(privacySettings) },
        sessionInfo: req.sessionID,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Privacy settings updated successfully',
        data: {
          privacySettings: updatedPrivacySettings
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Update partner preferences
  async updatePartnerPreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const { partnerPreferences } = req.body;

      if (!partnerPreferences || typeof partnerPreferences !== 'object') {
        throw new ValidationError('Partner preferences object is required');
      }

      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      // Merge with existing preferences
      const updatedPreferences = {
        ...profile.partnerPreferences,
        ...partnerPreferences
      };

      await profile.update({ partnerPreferences: updatedPreferences });

      // Log activity
      await UserActivity.create({
        userId,
        activityType: 'partner_preferences_updated',
        data: { updatedPreferences: Object.keys(partnerPreferences) },
        sessionInfo: req.sessionID,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: 'Partner preferences updated successfully',
        data: {
          partnerPreferences: updatedPreferences
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Activate/Deactivate profile
  async toggleProfileStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        throw new ValidationError('isActive must be a boolean');
      }

      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      await profile.update({ isActive });

      // Log activity
      await UserActivity.create({
        userId,
        activityType: isActive ? 'profile_activated' : 'profile_deactivated',
        data: { previousStatus: !isActive },
        sessionInfo: req.sessionID,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      });

      res.json({
        success: true,
        message: `Profile ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
          isActive
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Search profiles
  async searchProfiles(req, res, next) {
    try {
      const {
        gender,
        ageMin,
        ageMax,
        location,
        education,
        occupation,
        religion,
        caste,
        maritalStatus,
        page = 1,
        limit = 20,
        sortBy = 'lastActive',
        sortOrder = 'DESC'
      } = req.query;

      const currentUserId = req.user.id;
      const offset = (page - 1) * limit;

      // Build search criteria
      const whereClause = {
        isActive: true,
        userId: { [Op.ne]: currentUserId }
      };

      if (gender) {
        whereClause['$User.gender$'] = gender;
      }

      if (ageMin || ageMax) {
        const currentDate = new Date();
        const minDate = ageMax ? new Date(currentDate.getFullYear() - ageMax, currentDate.getMonth(), currentDate.getDate()) : null;
        const maxDate = ageMin ? new Date(currentDate.getFullYear() - ageMin, currentDate.getMonth(), currentDate.getDate()) : null;
        
        if (minDate && maxDate) {
          whereClause['$User.dateOfBirth$'] = {
            [Op.between]: [minDate, maxDate]
          };
        } else if (minDate) {
          whereClause['$User.dateOfBirth$'] = {
            [Op.lte]: minDate
          };
        } else if (maxDate) {
          whereClause['$User.dateOfBirth$'] = {
            [Op.gte]: maxDate
          };
        }
      }

      if (location) {
        whereClause[Op.or] = [
          { city: { [Op.like]: `%${location}%` } },
          { state: { [Op.like]: `%${location}%` } },
          { country: { [Op.like]: `%${location}%` } }
        ];
      }

      if (education) {
        whereClause.highestEducation = education;
      }

      if (occupation) {
        whereClause.occupation = { [Op.like]: `%${occupation}%` };
      }

      if (religion) {
        whereClause.religion = religion;
      }

      if (caste) {
        whereClause.caste = caste;
      }

      if (maritalStatus) {
        whereClause.maritalStatus = maritalStatus;
      }

      // Build order clause
      const orderClause = [[sortBy, sortOrder.toUpperCase()]];

      const { count, rows: profiles } = await Profile.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          attributes: ['id', 'name', 'gender', 'dateOfBirth', 'isPhoneVerified', 'isEmailVerified']
        }],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format response
      const formattedProfiles = profiles.map(profile => ({
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        age: profile.calculateAge(),
        location: {
          city: profile.city,
          state: profile.state,
          country: profile.country
        },
        photos: profile.photos?.slice(0, 3) || [], // Show only first 3 photos
        aboutMe: profile.aboutMe,
        education: {
          highestEducation: profile.highestEducation,
          institution: profile.institution
        },
        career: {
          occupation: profile.occupation,
          company: profile.company
        },
        religion: profile.religion,
        caste: profile.caste,
        maritalStatus: profile.maritalStatus,
        profileCompletion: profile.profileCompletion,
        isVerified: profile.isVerified,
        lastActive: profile.lastActive
      }));

      // Log search activity
      await UserActivity.create({
        userId: currentUserId,
        activityType: 'profile_search',
        data: { 
          searchCriteria: req.query,
          resultsCount: formattedProfiles.length
        },
        sessionInfo: req.sessionID,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      });

      res.json({
        success: true,
        data: {
          profiles: formattedProfiles,
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

  // Get profile statistics
  async getProfileStats(req, res, next) {
    try {
      const userId = req.user.id;

      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      // Get profile score
      const profileScore = await ProfileScore.findOne({ where: { userId } });

      // Get recent activities
      const recentActivities = await UserActivity.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 10,
        attributes: ['activityType', 'createdAt', 'data']
      });

      res.json({
        success: true,
        data: {
          profileCompletion: profile.profileCompletion,
          isActive: profile.isActive,
          isVerified: profile.isVerified,
          lastActive: profile.lastActive,
          profileScore: profileScore ? {
            overallScore: profileScore.overallScore,
            completionScore: profileScore.completionScore,
            activityScore: profileScore.activityScore,
            verificationScore: profileScore.verificationScore,
            responseScore: profileScore.responseScore,
            qualityScore: profileScore.qualityScore
          } : null,
          recentActivities: recentActivities.map(activity => ({
            type: activity.activityType,
            timestamp: activity.createdAt,
            data: activity.data
          }))
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get advertisement profiles in specified format
  async getAdProfiles(req, res, next) {
    try {
      const { page = 1, limit = 20, gender, ageMin, ageMax, location } = req.query;
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause = {};
      
      if (gender) {
        whereClause['$user.gender$'] = gender;
      }

      // Age filter
      if (ageMin || ageMax) {
        const currentDate = new Date();
        const minDate = ageMax ? new Date(currentDate.getFullYear() - ageMax, currentDate.getMonth(), currentDate.getDate()) : null;
        const maxDate = ageMin ? new Date(currentDate.getFullYear() - ageMin, currentDate.getMonth(), currentDate.getDate()) : null;
        
        if (minDate && maxDate) {
          whereClause['$user.date_of_birth$'] = {
            [Op.between]: [minDate, maxDate]
          };
        } else if (minDate) {
          whereClause['$user.date_of_birth$'] = {
            [Op.lte]: minDate
          };
        } else if (maxDate) {
          whereClause['$user.date_of_birth$'] = {
            [Op.gte]: maxDate
          };
        }
      }

      // Location filter
      if (location) {
        whereClause[Op.or] = [
          { '$location_info.city$': { [Op.like]: `%${location}%` } },
          { '$location_info.state$': { [Op.like]: `%${location}%` } }
        ];
      }

      const { count, rows: profiles } = await Profile.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'gender', 'date_of_birth', 'is_verified', 'is_active']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Format profiles to match the required structure
      const formattedProfiles = profiles.map((profile, index) => {
        const user = profile.user;
        const personalInfo = profile.personal_info || {};
        const locationInfo = profile.location_info || {};
        const religiousInfo = profile.religious_info || {};
        const educationInfo = profile.education_career_info || {};
        const lifestyleInfo = profile.lifestyle_info || {};
        const additionalInfo = profile.additional_info || {};

        // Calculate age
        let actualAge = 25; // Default age
        try {
          if (user.date_of_birth) {
            const birthDate = new Date(user.date_of_birth);
            const today = new Date();
            if (!isNaN(birthDate.getTime())) {
              const age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
              if (actualAge < 18 || actualAge > 80) actualAge = 25; // Validate age range
            }
          }
        } catch (error) {
          console.log('Age calculation error:', error);
          actualAge = 25;
        }

        // Generate profile ID
        const profileId = `B${String(profile.id).padStart(5, '0')}-${user.gender === 'Male' ? 'M' : 'F'}`;

        // Build ethnicity string
        const ethnicityParts = [
          religiousInfo.religion || '',
          religiousInfo.caste || '',
          locationInfo.state || ''
        ].filter(Boolean);
        const ethnicity = ethnicityParts.join(', ');

        // Build qualification string
        const qualificationParts = [
          educationInfo.education || '',
          educationInfo.company || ''
        ].filter(Boolean);
        const qualification = qualificationParts.join(', ');

        // Build profession string
        const professionParts = [
          educationInfo.occupation || '',
          educationInfo.company || '',
          locationInfo.city || ''
        ].filter(Boolean);
        const profession = professionParts.join(', ');

        // Build personal details string
        const personalDetailsParts = [
          personalInfo.complexion || '',
          personalInfo.body_type || '',
          lifestyleInfo.diet || '',
          lifestyleInfo.drinking === 'never' ? 'Non-Drinker' : ''
        ].filter(Boolean);
        const personalDetails = personalDetailsParts.join(', ');

        // Get member type based on profile completion
        const profileSettings = profile.profile_settings || {};
        const memberType = profileSettings.is_complete ? 'PREMIUM' : 'QUICK';

        // Get verification status
        const verified = user.is_verified && profileSettings.is_verified;

        return {
          id: profile.id,
          profileId: profileId,
          memberType: memberType,
          name: user.name,
          age: actualAge,
          height: personalInfo.height || "5'5\"",
          details: `${user.gender === 'Male' ? 'Groom' : 'Bride'}, ${actualAge} years / ${personalInfo.height || "5'5\""}`,
          ethnicity: ethnicity,
          qualification: qualification,
          profession: profession,
          personalDetails: personalDetails,
          aboutMyself: profile.about_me || "Tech-savvy individual with traditional values...",
          yetToMarryVerified: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : "2025-03-12",
          selfVerified: user.is_verified ? "Mobile" : "Pending",
          photos: Array.isArray(profile.photos) ? profile.photos.length : 0,
          videoProfiles: 0, // Default value
          image: (Array.isArray(profile.photos) && profile.photos.length > 0) 
            ? (profile.photos[0].startsWith('http') ? profile.photos[0] : `http://localhost:5000${profile.photos[0]}`)
            : profile.profile_photo 
              ? (profile.profile_photo.startsWith('http') ? profile.profile_photo : `http://localhost:5000${profile.profile_photo}`)
              : null,
          verified: verified,
          contactEmail: user.is_verified
        };
      });

      res.json({
        success: true,
        data: {
          profiles: formattedProfiles,
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

  // Get public profile by profile ID (no authentication required)
  async getPublicProfile(req, res, next) {
    try {
      const { profileId } = req.params;

      // Parse profile ID to get the actual profile ID
      // Format: B00002-F where B00002 is the profile ID and F is gender
      const match = profileId.match(/^[BG](\d+)-[MF]$/);
      if (!match) {
        throw new AppError('Invalid profile ID format', 400);
      }

      const actualProfileId = parseInt(match[1]);
      const gender = match[2] === 'M' ? 'Male' : 'Female';

      // Find profile by ID
      const profile = await Profile.findOne({
        where: { id: actualProfileId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'gender', 'date_of_birth', 'is_verified', 'is_active']
        }]
      });

      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      const user = profile.user;
      
      // Check if profile is active
      const profileSettings = profile.profile_settings || {};
      if (!user.is_active) {
        throw new AppError('Profile is not active', 404);
      }
      const personalInfo = profile.personal_info || {};
      const locationInfo = profile.location_info || {};
      const religiousInfo = profile.religious_info || {};
      const educationInfo = profile.education_career_info || {};
      const lifestyleInfo = profile.lifestyle_info || {};
      const additionalInfo = profile.additional_info || {};

      // Calculate age
      let actualAge = 25; // Default age
      try {
        if (user.date_of_birth) {
          const birthDate = new Date(user.date_of_birth);
          const today = new Date();
          if (!isNaN(birthDate.getTime())) {
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
            if (actualAge < 18 || actualAge > 80) actualAge = 25; // Validate age range
          }
        }
      } catch (error) {
        console.log('Age calculation error:', error);
        actualAge = 25;
      }

      // Get profile settings
      const memberType = profileSettings.is_complete ? 'PREMIUM' : 'QUICK';
      const verified = user.is_verified && profileSettings.is_verified;

      // Format response to match the expected structure
      const formattedProfile = {
        id: profileId,
        views: Math.floor(Math.random() * 200) + 50, // Random view count for demo
        adType: `${memberType} Member`,
        verified: verified,
        ytmVerifiedOn: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : "2025-03-12",
        images: profile.photos && Array.isArray(profile.photos) && profile.photos.length > 0 
          ? profile.photos.map(photo => photo.startsWith('http') ? photo : `http://localhost:5000${photo}`)
          : (profile.profile_photo ? [(profile.profile_photo.startsWith('http') ? profile.profile_photo : `http://localhost:5000${profile.profile_photo}`)] : []),
        details: {
          "My Details": `${user.gender === 'Male' ? 'Groom' : 'Bride'}, ${actualAge}, ${personalInfo.height || "5'5\""}, ${profile.marital_status || 'Unmarried'}`,
          "Ethnicity": [
            religiousInfo.religion || '',
            religiousInfo.caste || '',
            locationInfo.state || ''
          ].filter(Boolean).join(', '),
          "Qualification": [
            educationInfo.education || '',
            educationInfo.college || ''
          ].filter(Boolean).join(', '),
          "Profession": [
            educationInfo.occupation || '',
            educationInfo.company || '',
            locationInfo.city || ''
          ].filter(Boolean).join(', '),
          "Personal Details": [
            personalInfo.complexion || '',
            personalInfo.body_type || '',
            lifestyleInfo.diet || '',
            lifestyleInfo.drinking === 'never' ? 'Non-Drinker' : ''
          ].filter(Boolean).join(', '),
          "About Myself": profile.about_me || "Tech-savvy individual with traditional values...",
          "Our Family": additionalInfo.family_description || "Traditional family with strong values",
          "Resident Of": locationInfo.city && locationInfo.state ? `${locationInfo.city}, ${locationInfo.state}` : locationInfo.state || '-'
        },
        expectations: {
          "We Are Looking For": profile.partner_preferences?.looking_for || "Compatible partner with similar values",
          "We May Go For": profile.partner_preferences?.may_consider || "Open to various backgrounds"
        }
      };

      res.json({
        success: true,
        data: formattedProfile
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
