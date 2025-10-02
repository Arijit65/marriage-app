const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Personal Information
  personal_info: {
    type: DataTypes.JSON,
    defaultValue: {
      height: null,
      weight: null,
      complexion: '',
      body_type: '',
      marital_status: '',
      children: 'no'
    }
  },
  
  // Location Information
  location_info: {
    type: DataTypes.JSON,
    defaultValue: {
      city: '',
      state: '',
      country: 'India',
      latitude: null,
      longitude: null
    }
  },
  
  // Religious Information
  religious_info: {
    type: DataTypes.JSON,
    defaultValue: {
      religion: '',
      community: '',
      caste: '',
      gothra: '',
      manglik: 'dont_know'
    }
  },
  
  // Education & Career
  education_career_info: {
    type: DataTypes.JSON,
    defaultValue: {
      education: '',
      education_category: '',
      education_degree: '',
      occupation: '',
      occupation_detail: '',
      company: '',
      annual_income: 'below_3_lakhs'
    }
  },
  
  // Family Information
  family_info: {
    type: DataTypes.JSON,
    defaultValue: {
      type: 'nuclear',
      status: 'middle_class',
      location: '',
      father_name: '',
      father_occupation: '',
      mother_name: '',
      mother_occupation: '',
      siblings: 0
    }
  },
  
  // Partner Preferences
  partner_preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      age_range: { min: 18, max: 50 },
      height_range: { min: 150, max: 200 },
      education: [],
      occupation: [],
      location: [],
      religion: [],
      caste: [],
      marital_status: ['never_married'],
      family_type: [],
      annual_income: []
    }
  },
  
  // Photos
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  profile_photo: {
    type: DataTypes.STRING(500)
  },
  
  // About Me
  about_me: {
    type: DataTypes.TEXT
  },
  hobbies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  interests: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Lifestyle
  lifestyle_info: {
    type: DataTypes.JSON,
    defaultValue: {
      diet: 'vegetarian',
      smoking: 'never',
      drinking: 'never'
    }
  },
  
  // Additional Information
  additional_info: {
    type: DataTypes.JSON,
    defaultValue: {
      languages_known: [],
      native_language: '',
      disability: 'none'
    }
  },
  
  // Registration specific fields
  registration_info: {
    type: DataTypes.JSON,
    defaultValue: {
      qualification_level: '',
      qualification_category: '',
      qualification_degree: '',
      profession: '',
      profession_detail: '',
      advertiser_name: '',
      relation_with_candidate: ''
    }
  },
  
  // Profile Settings & Stats
  profile_settings: {
    type: DataTypes.JSON,
    defaultValue: {
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
  },
  
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'profiles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    afterUpdate: async (profile) => {
      try {
        // Update profile completion percentage
        const completionPercentage = await profile.calculateCompletionPercentage();
        const settings = profile.profile_settings || {};
        settings.is_complete = completionPercentage >= 80;
        settings.completion_percentage = completionPercentage;
        await profile.update({ 
          profile_settings: settings
        });
      } catch (error) {
        console.error('Error in Profile afterUpdate hook:', error);
      }
    }
  }
});

// Instance methods
Profile.prototype.calculateCompletionPercentage = async function() {
  const personal = this.personal_info || {};
  const location = this.location_info || {};
  const religious = this.religious_info || {};
  const education = this.education_career_info || {};
  const family = this.family_info || {};
  const lifestyle = this.lifestyle_info || {};

  const requiredFields = {
    personal: ['height', 'weight', 'complexion', 'body_type', 'marital_status'],
    location: ['city', 'state'],
    religious: ['religion', 'community', 'caste'],
    education: ['education', 'education_category', 'education_degree', 'occupation', 'occupation_detail', 'annual_income'],
    family: ['type', 'status'],
    lifestyle: ['diet'],
    other: ['about_me', 'profile_photo']
  };

  let totalFields = 0;
  let completedFields = 0;

  for (const [section, fields] of Object.entries(requiredFields)) {
    totalFields += fields.length;
    for (const field of fields) {
      if (section === 'other') {
        if (this[field] && this[field] !== '') completedFields++;
      } else {
        const info = this[section + '_info'] || {};
        if (info[field] && info[field] !== '') completedFields++;
      }
    }
  }

  return Math.round((completedFields / totalFields) * 100);
};

Profile.prototype.getAge = function() {
  if (!this.user || !this.user.date_of_birth) return null;
  const today = new Date();
  const birthDate = new Date(this.user.date_of_birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

Profile.prototype.isProfileBoosted = function() {
  const settings = this.profile_settings || {};
  if (!settings.boost_expires_at) return false;
  return new Date() < new Date(settings.boost_expires_at);
};

Profile.prototype.canViewContact = function(viewerUser) {
  // Admin can always view
  if (viewerUser.role === 'admin') return true;
  
  // Profile owner can view their own contact
  if (viewerUser.id === this.user_id) return true;
  
  // Check profile settings
  const settings = this.profile_settings || {};
  return settings.show_contact_info === true;
};

// Class methods
Profile.findByLocation = function(city, state) {
  return this.findAll({
    where: {
      '$location_info.city$': city,
      '$location_info.state$': state
    },
    include: ['owner']
  });
};

Profile.findByAgeRange = function(minAge, maxAge) {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
  
  return this.findAll({
    include: [{
      model: require('./User'),
      as: 'user',
      where: {
        date_of_birth: {
          [require('sequelize').Op.between]: [minDate, maxDate]
        }
      }
    }]
  });
};

Profile.findFeaturedProfiles = function() {
  return this.findAll({
    where: {
      '$profile_settings.is_featured$': true,
      '$profile_settings.is_complete$': true
    },
    include: ['owner'],
    order: [[sequelize.json('profile_settings.views_count'), 'DESC']]
  });
};

// Define associations
Profile.associate = function(models) {
  Profile.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

return Profile;
};
