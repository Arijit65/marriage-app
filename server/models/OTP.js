const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING(20),
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // OTP Details
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false,
    validate: {
      len: [6, 6],
      isNumeric: true
    }
  },
  otp_type: {
    type: DataTypes.ENUM('registration', 'login', 'password_reset', 'phone_verification', 'email_verification', 'profile_update'),
    allowNull: false
  },
  
  // Status and Usage
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_expired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attempts_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      max: 5
    }
  },
  max_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  
  // Timing
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used_at: {
    type: DataTypes.DATE
  },
  last_attempt_at: {
    type: DataTypes.DATE
  },
  
  // Delivery Information
  delivery_method: {
    type: DataTypes.ENUM('sms', 'email', 'whatsapp', 'voice_call'),
    defaultValue: 'sms'
  },
  delivery_status: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'blocked'),
    defaultValue: 'pending'
  },
  delivery_provider: {
    type: DataTypes.STRING(50),
    defaultValue: 'twilio'
  },
  delivery_message_id: {
    type: DataTypes.STRING(100)
  },
  delivery_error: {
    type: DataTypes.TEXT
  },
  
  // Security
  ip_address: {
    type: DataTypes.STRING(45)
  },
  user_agent: {
    type: DataTypes.TEXT
  },
  device_fingerprint: {
    type: DataTypes.STRING(255)
  },
  is_suspicious: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  suspicious_reason: {
    type: DataTypes.TEXT
  },
  
  // Rate Limiting
  rate_limit_key: {
    type: DataTypes.STRING(100),
    comment: 'Key for rate limiting (phone_number + type)'
  },
  
  // Metadata
  session_id: {
    type: DataTypes.STRING(100)
  },
  request_id: {
    type: DataTypes.STRING(100)
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
  tableName: 'otps',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['phone_number', 'otp_type']
    },
    {
      fields: ['email', 'otp_type']
    },
    {
      fields: ['otp_code']
    },
    {
      fields: ['expires_at']
    },
    {
      fields: ['rate_limit_key']
    }
  ],
  hooks: {
    beforeCreate: async (otp) => {
      // Set expiry time (10 minutes from creation)
      if (!otp.expires_at) {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);
        otp.expires_at = expiryDate;
      }
      
      // Generate rate limit key
      otp.rate_limit_key = `${otp.phone_number}_${otp.otp_type}`;
    }
  }
});

// Instance methods
OTP.prototype.isValid = function() {
  return !this.is_used && !this.is_expired && this.attempts_count < this.max_attempts;
};

OTP.prototype.isExpired = function() {
  return new Date() > this.expires_at;
};

OTP.prototype.verifyOTP = async function(inputOTP) {
  if (!this.isValid()) {
    return { valid: false, reason: 'OTP is not valid' };
  }
  
  if (this.isExpired()) {
    await this.update({ is_expired: true });
    return { valid: false, reason: 'OTP has expired' };
  }
  
  if (this.attempts_count >= this.max_attempts) {
    return { valid: false, reason: 'Maximum attempts exceeded' };
  }
  
  // Increment attempts
  await this.update({
    attempts_count: this.attempts_count + 1,
    last_attempt_at: new Date()
  });
  
  if (this.otp_code === inputOTP) {
    await this.update({
      is_used: true,
      used_at: new Date()
    });
    return { valid: true, reason: 'OTP verified successfully' };
  }
  
  return { valid: false, reason: 'Invalid OTP code' };
};

OTP.prototype.markAsExpired = async function() {
  await this.update({ is_expired: true });
};

OTP.prototype.resendOTP = async function() {
  // Generate new OTP
  const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
  
  await this.update({
    otp_code: newOTP,
    is_used: false,
    is_expired: false,
    attempts_count: 0,
    expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });
  
  return newOTP;
};

// Class methods
OTP.findValidOTP = function(phoneNumber, otpType) {
  return this.findOne({
    where: {
      phone_number: phoneNumber,
      otp_type: otpType,
      is_used: false,
      is_expired: false,
      attempts_count: {
        [require('sequelize').Op.lt]: require('sequelize').col('max_attempts')
      },
      expires_at: {
        [require('sequelize').Op.gt]: new Date()
      }
    },
    order: [['created_at', 'DESC']]
  });
};

OTP.findRecentOTPs = function(phoneNumber, minutes = 10) {
  const timeLimit = new Date(Date.now() - minutes * 60 * 1000);
  
  return this.findAll({
    where: {
      phone_number: phoneNumber,
      created_at: {
        [require('sequelize').Op.gte]: timeLimit
      }
    },
    order: [['created_at', 'DESC']]
  });
};

OTP.cleanupExpiredOTPs = async function() {
  return await this.destroy({
    where: {
      expires_at: {
        [require('sequelize').Op.lt]: new Date()
      }
    }
  });
};

OTP.getRateLimitInfo = async function(phoneNumber, otpType) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentOTPs = await this.count({
    where: {
      phone_number: phoneNumber,
      otp_type: otpType,
      created_at: {
        [require('sequelize').Op.gte]: oneHourAgo
      }
    }
  });
  
  return {
    count: recentOTPs,
    limit: 5, // Max 5 OTPs per hour
    remaining: Math.max(0, 5 - recentOTPs)
  };
};

// Scopes
OTP.addScope('valid', {
  where: {
    is_used: false,
    is_expired: false,
    attempts_count: {
      [require('sequelize').Op.lt]: require('sequelize').col('max_attempts')
    },
    expires_at: {
      [require('sequelize').Op.gt]: new Date()
    }
  }
});

OTP.addScope('recent', {
  where: {
    created_at: {
      [require('sequelize').Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    }
  }
});

// Define associations
OTP.associate = function(models) {
  OTP.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

return OTP;
};
