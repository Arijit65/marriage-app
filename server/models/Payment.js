const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Support both registration and plan-based payments
    registrationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'registrations',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER, // Store in paise (smallest currency unit)
      allowNull: false,
      validate: {
        min: 1
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'INR',
      validate: {
        isIn: [['INR', 'USD']]
      }
    },
    razorpayOrderId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    razorpayPaymentId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    razorpaySignature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      defaultValue: 'razorpay'
    },
    receipt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: (payment) => {
        // Custom validation to ensure either registrationId or userId is provided
        if (!payment.registrationId && !payment.userId) {
          throw new Error('Either registrationId or userId must be provided');
        }
      }
    }
  });

  // Instance methods
  Payment.prototype.getFormattedAmount = function() {
    return `₹${this.amount / 100}`; // Convert from paise to rupees
  };

  // Class methods
  Payment.findByRazorpayOrderId = function(orderId) {
    return this.findOne({ where: { razorpayOrderId: orderId } });
  };

  Payment.findByRegistrationId = function(registrationId) {
    return this.findOne({ where: { registrationId: registrationId } });
  };

  Payment.findByUserId = function(userId) {
    return this.findOne({ where: { userId: userId } });
  };

  // Define associations
  Payment.associate = function(models) {
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'SET NULL'
    });
    
    // If you have a Registration model
    if (models.Registration) {
      Payment.belongsTo(models.Registration, {
        foreignKey: 'registrationId',
        as: 'registration',
        onDelete: 'SET NULL'
      });
    }
  };

  return Payment;
}; 