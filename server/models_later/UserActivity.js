const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserActivity = sequelize.define('UserActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Activity Details
  activity_type: {
    type: DataTypes.ENUM(
      'login', 'logout', 'profile_view', 'profile_update', 'photo_upload',
      'proposal_sent', 'proposal_received', 'proposal_accepted', 'proposal_rejected',
      'ad_posted', 'ad_viewed', 'contact_shared', 'search_performed',
      'filter_applied', 'favorite_added', 'favorite_removed', 'block_user',
      'report_user', 'plan_upgraded', 'payment_made', 'verification_completed',
      'message_sent', 'message_read', 'notification_clicked', 'app_opened',
      'profile_boosted', 'featured_profile_viewed', 'admin_action'
    ),
    allowNull: false
  },
  activity_subtype: {
    type: DataTypes.STRING(100),
    comment: 'More specific activity description'
  },
  
  // Activity Data
  activity_data: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Additional data related to the activity'
  },
  target_user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User affected by this activity (if applicable)'
  },
  target_entity_id: {
    type: DataTypes.INTEGER,
    comment: 'ID of entity related to activity (proposal, ad, etc.)'
  },
  target_entity_type: {
    type: DataTypes.STRING(50),
    comment: 'Type of entity (proposal, ad, profile, etc.)'
  },
  
  // Session Information
  session_id: {
    type: DataTypes.STRING(100)
  },
  device_type: {
    type: DataTypes.ENUM('web', 'mobile_web', 'android', 'ios'),
    defaultValue: 'web'
  },
  device_info: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  
  // Location and Network
  ip_address: {
    type: DataTypes.STRING(45)
  },
  location_data: {
    type: DataTypes.JSON,
    defaultValue: {
      country: null,
      region: null,
      city: null,
      latitude: null,
      longitude: null
    }
  },
  user_agent: {
    type: DataTypes.TEXT
  },
  
  // Performance Metrics
  response_time: {
    type: DataTypes.INTEGER,
    comment: 'Response time in milliseconds'
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Activity duration in seconds'
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  error_message: {
    type: DataTypes.TEXT
  },
  
  // Engagement Metrics
  engagement_score: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.00,
    validate: {
      min: 0,
      max: 10
    }
  },
  interaction_depth: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'How deep the user went in the interaction'
  },
  
  // Timestamp
  activity_timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  // Privacy and Security
  is_private: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this activity should be hidden from user'
  },
  is_sensitive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this activity contains sensitive information'
  },
  
  // Analytics
  analytics_processed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  analytics_data: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Processed analytics data'
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
  tableName: 'user_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id', 'activity_timestamp']
    },
    {
      fields: ['activity_type']
    },
    {
      fields: ['target_user_id']
    },
    {
      fields: ['session_id']
    },
    {
      fields: ['ip_address']
    }
  ]
});

// Instance methods
UserActivity.prototype.getEngagementValue = function() {
  const baseValues = {
    'login': 1,
    'profile_view': 2,
    'profile_update': 5,
    'photo_upload': 3,
    'proposal_sent': 10,
    'proposal_received': 5,
    'proposal_accepted': 20,
    'proposal_rejected': 2,
    'ad_posted': 8,
    'contact_shared': 15,
    'search_performed': 1,
    'filter_applied': 2,
    'favorite_added': 3,
    'message_sent': 5,
    'plan_upgraded': 25,
    'verification_completed': 15
  };
  
  return baseValues[this.activity_type] || 1;
};

UserActivity.prototype.isHighValueActivity = function() {
  const highValueActivities = [
    'proposal_accepted', 'plan_upgraded', 'verification_completed',
    'contact_shared', 'profile_boosted'
  ];
  
  return highValueActivities.includes(this.activity_type);
};

// Class methods
UserActivity.trackActivity = async function(userId, activityType, data = {}) {
  const activity = await this.create({
    user_id: userId,
    activity_type: activityType,
    activity_data: data,
    target_user_id: data.targetUserId,
    target_entity_id: data.targetEntityId,
    target_entity_type: data.targetEntityType,
    session_id: data.sessionId,
    device_type: data.deviceType,
    ip_address: data.ipAddress,
    user_agent: data.userAgent,
    location_data: data.locationData,
    engagement_score: data.engagementScore || 1.00,
    interaction_depth: data.interactionDepth || 1
  });
  
  return activity;
};

UserActivity.getUserActivitySummary = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const activities = await this.findAll({
    where: {
      user_id: userId,
      activity_timestamp: {
        [require('sequelize').Op.gte]: startDate
      }
    },
    attributes: [
      'activity_type',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('engagement_score')), 'total_engagement']
    ],
    group: ['activity_type']
  });
  
  return activities.reduce((acc, activity) => {
    acc[activity.activity_type] = {
      count: parseInt(activity.dataValues.count),
      total_engagement: parseFloat(activity.dataValues.total_engagement) || 0
    };
    return acc;
  }, {});
};

UserActivity.getUserEngagementScore = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const result = await this.findOne({
    where: {
      user_id: userId,
      activity_timestamp: {
        [require('sequelize').Op.gte]: startDate
      }
    },
    attributes: [
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'total_activities'],
      [require('sequelize').fn('SUM', require('sequelize').col('engagement_score')), 'total_engagement'],
      [require('sequelize').fn('AVG', require('sequelize').col('engagement_score')), 'avg_engagement']
    ]
  });
  
  return {
    totalActivities: parseInt(result.dataValues.total_activities) || 0,
    totalEngagement: parseFloat(result.dataValues.total_engagement) || 0,
    averageEngagement: parseFloat(result.dataValues.avg_engagement) || 0
  };
};

UserActivity.getMostActiveUsers = async function(days = 7, limit = 10) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.findAll({
    where: {
      activity_timestamp: {
        [require('sequelize').Op.gte]: startDate
      }
    },
    attributes: [
      'user_id',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'activity_count'],
      [require('sequelize').fn('SUM', require('sequelize').col('engagement_score')), 'total_engagement']
    ],
    group: ['user_id'],
    order: [
      [require('sequelize').fn('SUM', require('sequelize').col('engagement_score')), 'DESC']
    ],
    limit: limit,
    include: [{
      model: require('./User'),
      as: 'user',
      attributes: ['id', 'name', 'email']
    }]
  });
};

UserActivity.getActivityTrends = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.findAll({
    where: {
      activity_timestamp: {
        [require('sequelize').Op.gte]: startDate
      }
    },
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('activity_timestamp')), 'date'],
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'activity_count'],
      [require('sequelize').fn('COUNT', require('sequelize').fn('DISTINCT', require('sequelize').col('user_id'))), 'unique_users']
    ],
    group: [require('sequelize').fn('DATE', require('sequelize').col('activity_timestamp'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('activity_timestamp')), 'ASC']]
  });
};

// Scopes
UserActivity.addScope('recent', {
  where: {
    activity_timestamp: {
      [require('sequelize').Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    }
  }
});

UserActivity.addScope('highEngagement', {
  where: {
    engagement_score: {
      [require('sequelize').Op.gte]: 5
    }
  }
});

UserActivity.addScope('successful', {
  where: {
    success: true
  }
});

module.exports = UserActivity;
