const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProfileScore = sequelize.define('ProfileScore', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Overall Score (0-100)
  overall_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  // Component Scores
  profile_completion_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  activity_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  verification_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  response_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  quality_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  // Usage Score (Activity-based)
  usage_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  
  // Activity Metrics
  login_frequency: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of logins in last 30 days'
  },
  profile_views_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of profile views received'
  },
  profile_views_given: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of profiles viewed by user'
  },
  proposals_sent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of proposals sent'
  },
  proposals_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of proposals received'
  },
  proposals_accepted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of proposals accepted by user'
  },
  proposals_accepted_by_others: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of user\'s proposals accepted by others'
  },
  response_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    comment: 'Percentage of proposals responded to within 48 hours'
  },
  average_response_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Average response time in hours'
  },
  
  // Quality Metrics
  profile_photos_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  profile_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  document_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  premium_member: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Engagement Metrics
  last_login_date: {
    type: DataTypes.DATE
  },
  last_profile_update: {
    type: DataTypes.DATE
  },
  last_activity_date: {
    type: DataTypes.DATE
  },
  days_since_registration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Search Visibility
  search_visibility_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  featured_until: {
    type: DataTypes.DATE
  },
  boost_multiplier: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.00,
    validate: {
      min: 1.00,
      max: 5.00
    }
  },
  
  // Penalties and Bonuses
  penalty_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Points deducted for violations'
  },
  bonus_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Bonus points for good behavior'
  },
  violation_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Score History
  score_history: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of score changes with timestamps'
  },
  
  // Last Calculation
  last_calculated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  calculation_version: {
    type: DataTypes.STRING(20),
    defaultValue: '1.0'
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
  tableName: 'profile_scores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['overall_score']
    },
    {
      fields: ['usage_score']
    },
    {
      fields: ['search_visibility_score']
    },
    {
      fields: ['last_activity_date']
    }
  ]
});

// Instance methods
ProfileScore.prototype.calculateOverallScore = async function() {
  const weights = {
    profile_completion: 0.25,
    activity: 0.20,
    verification: 0.15,
    response: 0.20,
    quality: 0.20
  };
  
  const overallScore = (
    this.profile_completion_score * weights.profile_completion +
    this.activity_score * weights.activity +
    this.verification_score * weights.verification +
    this.response_score * weights.response +
    this.quality_score * weights.quality
  );
  
  // Apply boost multiplier
  const boostedScore = overallScore * this.boost_multiplier;
  
  // Apply penalties and bonuses
  const finalScore = Math.max(0, Math.min(100, boostedScore - this.penalty_points + this.bonus_points));
  
  await this.update({
    overall_score: finalScore,
    last_calculated_at: new Date()
  });
  
  return finalScore;
};

ProfileScore.prototype.calculateUsageScore = async function() {
  let usageScore = 0;
  
  // Login frequency (max 30 points)
  usageScore += Math.min(30, this.login_frequency * 2);
  
  // Profile views received (max 20 points)
  usageScore += Math.min(20, this.profile_views_received * 0.5);
  
  // Response rate (max 25 points)
  usageScore += this.response_rate * 0.25;
  
  // Average response time (max 15 points)
  if (this.average_response_time <= 24) {
    usageScore += 15;
  } else if (this.average_response_time <= 48) {
    usageScore += 10;
  } else if (this.average_response_time <= 72) {
    usageScore += 5;
  }
  
  // Recent activity (max 10 points)
  const daysSinceLastActivity = this.last_activity_date ? 
    Math.floor((new Date() - new Date(this.last_activity_date)) / (1000 * 60 * 60 * 24)) : 999;
  
  if (daysSinceLastActivity <= 1) usageScore += 10;
  else if (daysSinceLastActivity <= 3) usageScore += 7;
  else if (daysSinceLastActivity <= 7) usageScore += 5;
  else if (daysSinceLastActivity <= 14) usageScore += 2;
  
  await this.update({
    usage_score: Math.min(100, usageScore),
    last_calculated_at: new Date()
  });
  
  return usageScore;
};

ProfileScore.prototype.updateActivityMetrics = async function(activityType, value = 1) {
  const updates = {};
  
  switch (activityType) {
    case 'login':
      updates.login_frequency = this.login_frequency + value;
      updates.last_login_date = new Date();
      break;
    case 'profile_view_received':
      updates.profile_views_received = this.profile_views_received + value;
      break;
    case 'profile_view_given':
      updates.profile_views_given = this.profile_views_given + value;
      break;
    case 'proposal_sent':
      updates.proposals_sent = this.proposals_sent + value;
      break;
    case 'proposal_received':
      updates.proposals_received = this.proposals_received + value;
      break;
    case 'proposal_accepted':
      updates.proposals_accepted = this.proposals_accepted + value;
      break;
    case 'proposal_accepted_by_other':
      updates.proposals_accepted_by_others = this.proposals_accepted_by_others + value;
      break;
  }
  
  updates.last_activity_date = new Date();
  
  await this.update(updates);
  
  // Recalculate scores
  await this.calculateUsageScore();
  await this.calculateOverallScore();
};

ProfileScore.prototype.addScoreHistory = async function(change, reason) {
  const historyEntry = {
    timestamp: new Date(),
    change: change,
    reason: reason,
    previous_score: this.overall_score
  };
  
  const scoreHistory = [...this.score_history, historyEntry];
  
  // Keep only last 50 entries
  if (scoreHistory.length > 50) {
    scoreHistory.splice(0, scoreHistory.length - 50);
  }
  
  await this.update({ score_history: scoreHistory });
};

// Class methods
ProfileScore.findTopProfiles = function(limit = 10) {
  return this.findAll({
    where: {
      overall_score: {
        [require('sequelize').Op.gte]: 70
      }
    },
    include: ['user'],
    order: [['overall_score', 'DESC']],
    limit: limit
  });
};

ProfileScore.findActiveUsers = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.findAll({
    where: {
      last_activity_date: {
        [require('sequelize').Op.gte]: thirtyDaysAgo
      }
    },
    include: ['user'],
    order: [['usage_score', 'DESC']]
  });
};

ProfileScore.calculateAverageScore = async function() {
  const result = await this.findOne({
    attributes: [
      [require('sequelize').fn('AVG', require('sequelize').col('overall_score')), 'average_score']
    ]
  });
  
  return parseFloat(result.dataValues.average_score) || 0;
};

// Scopes
ProfileScore.addScope('highScore', {
  where: {
    overall_score: {
      [require('sequelize').Op.gte]: 80
    }
  }
});

ProfileScore.addScope('active', {
  where: {
    last_activity_date: {
      [require('sequelize').Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  }
});

module.exports = ProfileScore;
