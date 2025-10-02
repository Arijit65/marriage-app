const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ad = sequelize.define('Ad', {
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
  
  // Ad Details
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ad_type: {
    type: DataTypes.ENUM('bride_seeking', 'groom_seeking', 'family_seeking', 'general'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('personal', 'family', 'agent', 'matrimonial_service'),
    defaultValue: 'personal'
  },
  
  // Target Profile
  seeking_gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false
  },
  age_range: {
    type: DataTypes.JSON,
    defaultValue: { min: 18, max: 50 }
  },
  location_preference: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  education_preference: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  occupation_preference: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Contact Information
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  contact_email: {
    type: DataTypes.STRING(255)
  },
  contact_address: {
    type: DataTypes.TEXT
  },
  preferred_contact_method: {
    type: DataTypes.ENUM('phone', 'email', 'whatsapp', 'in_person'),
    defaultValue: 'phone'
  },
  
  // Ad Status
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'expired', 'suspended', 'pending_approval'),
    defaultValue: 'pending_approval'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Visibility Settings
  visibility_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    comment: 'Duration in days'
  },
  visibility_start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  visibility_end_date: {
    type: DataTypes.DATE
  },
  max_views: {
    type: DataTypes.INTEGER,
    defaultValue: null,
    comment: 'Maximum number of views (null for unlimited)'
  },
  
  // Performance Metrics
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  contact_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  response_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversion_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    comment: 'Percentage of views that resulted in contact'
  },
  
  // Media
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  video_url: {
    type: DataTypes.STRING(500)
  },
  
  // Pricing and Packages
  package_type: {
    type: DataTypes.ENUM('free', 'basic', 'premium', 'vip'),
    defaultValue: 'free'
  },
  package_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  
  // Moderation
  is_flagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  flag_reason: {
    type: DataTypes.TEXT
  },
  moderated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  moderation_notes: {
    type: DataTypes.TEXT
  },
  moderation_date: {
    type: DataTypes.DATE
  },
  
  // SEO and Search
  keywords: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  search_tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  seo_title: {
    type: DataTypes.STRING(200)
  },
  seo_description: {
    type: DataTypes.TEXT
  },
  
  // Analytics
  last_viewed: {
    type: DataTypes.DATE
  },
  average_view_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Average time spent viewing ad in seconds'
  },
  bounce_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
    comment: 'Percentage of users who left without contacting'
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
  tableName: 'ads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['ad_type']
    },
    {
      fields: ['seeking_gender']
    },
    {
      fields: ['visibility_end_date']
    },
    {
      fields: ['view_count']
    }
  ],
  hooks: {
    beforeCreate: async (ad) => {
      // Set visibility end date
      if (!ad.visibility_end_date) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + ad.visibility_duration);
        ad.visibility_end_date = endDate;
      }
    }
  }
});

// Instance methods
Ad.prototype.isExpired = function() {
  return new Date() > this.visibility_end_date;
};

Ad.prototype.isActive = function() {
  return this.status === 'active' && !this.isExpired();
};

Ad.prototype.canBeViewed = function() {
  if (!this.isActive()) return false;
  if (this.max_views && this.view_count >= this.max_views) return false;
  return true;
};

Ad.prototype.incrementView = async function() {
  if (this.canBeViewed()) {
    await this.update({
      view_count: this.view_count + 1,
      last_viewed: new Date()
    });
    return true;
  }
  return false;
};

Ad.prototype.incrementContact = async function() {
  await this.update({
    contact_count: this.contact_count + 1
  });
  
  // Update conversion rate
  if (this.view_count > 0) {
    const conversionRate = (this.contact_count / this.view_count) * 100;
    await this.update({ conversion_rate: conversionRate });
  }
};

Ad.prototype.extendVisibility = async function(days) {
  const newEndDate = new Date(this.visibility_end_date);
  newEndDate.setDate(newEndDate.getDate() + days);
  
  await this.update({
    visibility_end_date: newEndDate,
    visibility_duration: this.visibility_duration + days
  });
};

Ad.prototype.autoExpire = async function() {
  if (this.isExpired() && this.status === 'active') {
    await this.update({ status: 'expired' });
  }
};

// Class methods
Ad.findActiveAds = function() {
  return this.findAll({
    where: {
      status: 'active',
      visibility_end_date: {
        [require('sequelize').Op.gt]: new Date()
      }
    },
    include: ['user'],
    order: [
      ['is_featured', 'DESC'],
      ['is_urgent', 'DESC'],
      ['created_at', 'DESC']
    ]
  });
};

Ad.findByType = function(adType, seekingGender) {
  return this.findAll({
    where: {
      ad_type: adType,
      seeking_gender: seekingGender,
      status: 'active',
      visibility_end_date: {
        [require('sequelize').Op.gt]: new Date()
      }
    },
    include: ['user'],
    order: [
      ['is_featured', 'DESC'],
      ['view_count', 'DESC']
    ]
  });
};

Ad.findExpiredAds = function() {
  return this.findAll({
    where: {
      status: 'active',
      visibility_end_date: {
        [require('sequelize').Op.lt]: new Date()
      }
    }
  });
};

Ad.findFeaturedAds = function() {
  return this.findAll({
    where: {
      is_featured: true,
      status: 'active',
      visibility_end_date: {
        [require('sequelize').Op.gt]: new Date()
      }
    },
    include: ['user'],
    order: [['created_at', 'DESC']]
  });
};

Ad.getAdStats = async function(userId) {
  const stats = await this.findAll({
    where: { user_id: userId },
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('view_count')), 'total_views'],
      [require('sequelize').fn('SUM', require('sequelize').col('contact_count')), 'total_contacts']
    ],
    group: ['status']
  });
  
  return stats.reduce((acc, stat) => {
    acc[stat.status] = {
      count: parseInt(stat.dataValues.count),
      total_views: parseInt(stat.dataValues.total_views) || 0,
      total_contacts: parseInt(stat.dataValues.total_contacts) || 0
    };
    return acc;
  }, {});
};

// Scopes
Ad.addScope('active', {
  where: {
    status: 'active',
    visibility_end_date: {
      [require('sequelize').Op.gt]: new Date()
    }
  }
});

Ad.addScope('featured', {
  where: {
    is_featured: true,
    status: 'active'
  }
});

module.exports = Ad;
