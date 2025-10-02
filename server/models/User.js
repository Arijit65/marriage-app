const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [1, 100] // Allow shorter names for temp users
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      is: /^\+?[1-9]\d{1,14}$/
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [6, 255]
    }
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: true // Allow null for temp users
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true // Allow null for temp users
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_login: {
    type: DataTypes.DATE
  },
  profile_stats: {
    type: DataTypes.JSON,
    defaultValue: {
      completion_percentage: 0,
      views_count: 0,
      proposals_sent: 0,
      proposals_received: 0
    }
  },
  profile_visibility: {
    type: DataTypes.STRING(20),
    defaultValue: 'public'
  },
  notification_preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      email: true,
      sms: true,
      push: true,
      proposal_notifications: true,
      profile_views: true,
      matches: true
    }
  },
  privacy_settings: {
    type: DataTypes.JSON,
    defaultValue: {
      show_phone: false,
      show_email: false,
      show_age: true,
      show_location: true,
      allow_profile_views: true
    }
  },
  plan_id: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // Default to Basic Free plan
    allowNull: false
  },
  plan_info: {
    type: DataTypes.JSON,
    defaultValue: {
      id: 1,
      expires_at: null,
      subscribed_at: null,
      payment_id: null
    }
  },
  account_status: {
    type: DataTypes.STRING(30),
    defaultValue: 'pending_verification'
  },
  account_info: {
    type: DataTypes.JSON,
    defaultValue: {
      suspension_reason: null,
      suspension_until: null,
      registration_source: 'web',
      ip_address: null,
      user_agent: null,
      timezone: 'UTC',
      language: 'en'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  referredBy: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'referred_by',
    comment: 'Referral code of the RR user who referred this user'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getProfileVisibility = function() {
  return this.profile_visibility;
};

User.prototype.isPlanActive = function() {
  if (!this.plan_info || !this.plan_info.expires_at) {
    return false;
  }
  const expiryDate = new Date(this.plan_info.expires_at);
  return expiryDate > new Date();
};

// Class methods
User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

User.findByPhone = function(phoneNumber) {
  return this.findOne({ where: { phone_number: phoneNumber } });
};

User.findActiveUsers = function() {
  return this.findAll({
    where: {
      is_active: true,
      account_status: 'active'
    }
  });
};

// Define associations
User.associate = function(models) {
  User.hasOne(models.Profile, {
    foreignKey: 'user_id',
    as: 'userProfile',
    onDelete: 'CASCADE'
  });
  User.hasMany(models.OTP, {
    foreignKey: 'user_id',
    as: 'otps',
    onDelete: 'CASCADE'
  });
  
  // Association with RRUser for referrals (no foreign key constraint, just logical relationship)
  User.belongsTo(models.RRUser, {
    foreignKey: 'referredBy',
    targetKey: 'referCode',
    as: 'referrer',
    constraints: false
  });
};

return User;
};
