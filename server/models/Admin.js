const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'sub_admin'),
      allowNull: false,
      defaultValue: 'sub_admin',
      comment: 'super_admin has full access, sub_admin has limited access'
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^\+?[0-9]{10,15}$/
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether the admin account is active'
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: {
        manage_users: true,
        manage_profiles: true,
        manage_payments: true,
        manage_content: true,
        manage_rr: true,
        manage_admins: false, // Only super_admin can manage other admins
        view_analytics: true,
        manage_plans: true,
        manage_proposals: true
      },
      comment: 'Granular permissions for sub-admins'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Track failed login attempts for security'
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Account lock time after multiple failed attempts'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the super_admin who created this admin'
    },
    profile_info: {
      type: DataTypes.JSON,
      defaultValue: {
        avatar: null,
        department: null,
        notes: null
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
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
        
        // Super admin gets full permissions
        if (admin.role === 'super_admin') {
          admin.permissions = {
            manage_users: true,
            manage_profiles: true,
            manage_payments: true,
            manage_content: true,
            manage_rr: true,
            manage_admins: true,
            view_analytics: true,
            manage_plans: true,
            manage_proposals: true
          };
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 12);
        }
        
        // Ensure super admin always has full permissions
        if (admin.role === 'super_admin') {
          admin.permissions = {
            manage_users: true,
            manage_profiles: true,
            manage_payments: true,
            manage_content: true,
            manage_rr: true,
            manage_admins: true,
            view_analytics: true,
            manage_plans: true,
            manage_proposals: true
          };
        }
      }
    }
  });

  // Instance methods
  Admin.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  Admin.prototype.isAccountLocked = function() {
    if (!this.locked_until) return false;
    return new Date() < new Date(this.locked_until);
  };

  Admin.prototype.incrementLoginAttempts = async function() {
    this.login_attempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this.login_attempts >= 5) {
      this.locked_until = new Date(Date.now() + 30 * 60 * 1000);
    }
    
    await this.save();
  };

  Admin.prototype.resetLoginAttempts = async function() {
    this.login_attempts = 0;
    this.locked_until = null;
    await this.save();
  };

  Admin.prototype.isSuperAdmin = function() {
    return this.role === 'super_admin';
  };

  Admin.prototype.hasPermission = function(permission) {
    if (this.role === 'super_admin') return true;
    return this.permissions && this.permissions[permission] === true;
  };

  Admin.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.login_attempts;
    delete values.locked_until;
    return values;
  };

  // Class methods
  Admin.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  Admin.findActiveAdmins = function() {
    return this.findAll({
      where: { is_active: true },
      attributes: { exclude: ['password'] }
    });
  };

  Admin.findSuperAdmins = function() {
    return this.findAll({
      where: { 
        role: 'super_admin',
        is_active: true 
      },
      attributes: { exclude: ['password'] }
    });
  };

  // Define associations
  Admin.associate = function(models) {
    // Admin who created other admins
    Admin.hasMany(Admin, {
      foreignKey: 'created_by',
      as: 'createdAdmins'
    });
    
    Admin.belongsTo(Admin, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  };

  return Admin;
};
