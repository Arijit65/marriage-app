const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const RRUser = sequelize.define('RRUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
        notEmpty: true
      }
    },
    referCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: 'refer_code',
      validate: {
        len: [4, 20],
        is: /^[A-Z0-9$]+$/i
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    mobileNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'mobile_no',
      validate: {
        is: /^\+?[1-9]\d{9,14}$/,
        notEmpty: true
      }
    },
    commission: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      },
      comment: 'Commission percentage (0-100)'
    },
    totalEarning: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'total_earning',
      validate: {
        min: 0
      }
    },
    referCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'refer_count',
      validate: {
        min: 0
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
        notEmpty: true
      }
    },
    // Additional useful fields
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'registered_at'
    },
    // JSON field for additional settings/preferences
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        paymentInfo: {
          bankAccount: null,
          upiId: null,
          paymentMethod: 'bank'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'rr_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['refer_code']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['mobile_no']
      },
      {
        fields: ['active']
      }
    ],
    hooks: {
      beforeCreate: async (rrUser) => {
        // Hash password before creating user
        if (rrUser.password) {
          rrUser.password = await bcrypt.hash(rrUser.password, 12);
        }
      },
      beforeUpdate: async (rrUser) => {
        // Hash password if it's being updated
        if (rrUser.changed('password')) {
          rrUser.password = await bcrypt.hash(rrUser.password, 12);
        }
      }
    }
  });

  // Instance methods
  RRUser.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  RRUser.prototype.updateEarnings = async function(amount) {
    this.totalEarning = (parseFloat(this.totalEarning) + parseFloat(amount)).toFixed(2);
    this.updatedAt = new Date();
    return await this.save();
  };

  RRUser.prototype.incrementReferCount = async function() {
    this.referCount += 1;
    this.updatedAt = new Date();
    return await this.save();
  };

  RRUser.prototype.updateLastLogin = async function() {
    this.lastLogin = new Date();
    this.updatedAt = new Date();
    return await this.save();
  };

  RRUser.prototype.toSafeJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  // Class methods
  RRUser.findByReferCode = function(referCode) {
    return this.findOne({ 
      where: { 
        referCode: referCode.toUpperCase(),
        active: true 
      } 
    });
  };

  RRUser.findByEmail = function(email) {
    return this.findOne({ where: { email: email.toLowerCase() } });
  };

  RRUser.findByMobile = function(mobileNo) {
    return this.findOne({ where: { mobileNo } });
  };

  RRUser.getTopEarners = function(limit = 10) {
    return this.findAll({
      where: { active: true },
      order: [['totalEarning', 'DESC']],
      limit,
      attributes: { exclude: ['password'] }
    });
  };

  RRUser.getTopReferrers = function(limit = 10) {
    return this.findAll({
      where: { active: true },
      order: [['referCount', 'DESC']],
      limit,
      attributes: { exclude: ['password'] }
    });
  };

  // Define associations
  RRUser.associate = function(models) {
    // Association with User model for referrals
    RRUser.hasMany(models.User, {
      foreignKey: 'referredBy',
      as: 'referredUsers'
    });
    
    // You can add more associations as needed
    // For example, earnings history, commission records, etc.
  };

  return RRUser;
};