const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  pricing_info: {
    type: DataTypes.JSON,
    defaultValue: {
      price: 0.00,
      currency: 'INR',
      duration_days: 30
    }
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      canRequest: false,
      canPostAd: true,
      canViewContact: false,
      maxProposals: 0,
      profileVisibility: 'limited',
      searchFilters: 'basic',
      priorityListing: false,
      featuredProfile: false,
      directContact: false,
      advancedAnalytics: false,
      customFilters: false,
      unlimitedViews: false,
      profileBoosting: false,
      verifiedBadge: false
    }
  },
  plan_settings: {
    type: DataTypes.JSON,
    defaultValue: {
      is_active: true,
      is_popular: false,
      sort_order: 0,
      max_users: null,
      current_users: 0,
      trial_days: 0,
      auto_renew: false
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
  tableName: 'plans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Instance methods
Plan.prototype.isAvailable = function() {
  if (!this.is_active) return false;
  if (this.max_users && this.current_users >= this.max_users) return false;
  return true;
};

Plan.prototype.hasFeature = function(featureName) {
  const features = this.features;
  return features && features[featureName] === true;
};

Plan.prototype.getFeatureValue = function(featureName) {
  const features = this.features;
  return features ? features[featureName] : null;
};

Plan.prototype.isFree = function() {
  return this.price === 0;
};

Plan.prototype.isPremium = function() {
  return this.price > 0;
};

// Class methods
Plan.findActivePlans = function() {
  return this.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC'], ['price', 'ASC']]
  });
};

Plan.findByPrice = function(price) {
  return this.findOne({
    where: { price, is_active: true }
  });
};

Plan.findPopularPlans = function() {
  return this.findAll({
    where: { is_popular: true, is_active: true },
    order: [['sort_order', 'ASC']]
  });
};

Plan.incrementUserCount = function(planId) {
  return this.increment('current_users', {
    where: { id: planId }
  });
};

Plan.decrementUserCount = function(planId) {
  return this.decrement('current_users', {
    where: { id: planId }
  });
};

module.exports = Plan;
