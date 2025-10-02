const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proposal = sequelize.define('Proposal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  proposer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  proposed_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  },
  proposal_info: {
    type: DataTypes.JSON,
    defaultValue: {
      type: 'direct',
      message: '',
      reason: '',
      family_details: {},
      proposer_contact_revealed: false,
      proposed_user_contact_revealed: false,
      response_message: '',
      response_reason: '',
      communication_channel: 'app',
      meeting_preference: null
    }
  },
  
  timeline_info: {
    type: DataTypes.JSON,
    defaultValue: {
      sent_at: null,
      responded_at: null,
      expires_at: null,
      viewed_at: null
    }
  },
  
  privacy_info: {
    type: DataTypes.JSON,
    defaultValue: {
      is_anonymous: false,
      hide_contact_until_acceptance: true
    }
  },
  
  tracking_info: {
    type: DataTypes.JSON,
    defaultValue: {
      viewed_by_proposed_user: false,
      reminder_sent: false,
      reminder_count: 0,
      response_time_hours: null,
      communication_score: 0
    }
  },
  
  moderation_info: {
    type: DataTypes.JSON,
    defaultValue: {
      is_flagged: false,
      flag_reason: null,
      moderated_by: null,
      moderation_notes: null
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
  tableName: 'proposals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['proposer_id', 'proposed_user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['sent_at']
    },
    {
      fields: ['expires_at']
    }
  ],
  hooks: {
    beforeCreate: async (proposal) => {
      // Set expiry date if not provided
      if (!proposal.expires_at) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        proposal.expires_at = expiryDate;
      }
    },
    afterUpdate: async (proposal) => {
      // Update response time when status changes
      if (proposal.changed('status') && proposal.status === 'accepted' && !proposal.response_time_hours) {
        const responseTime = Math.round((new Date() - new Date(proposal.sent_at)) / (1000 * 60 * 60));
        await proposal.update({ response_time_hours: responseTime });
      }
      
      // Reveal contacts when proposal is accepted
      if (proposal.changed('status') && proposal.status === 'accepted') {
        await proposal.update({
          proposer_contact_revealed: true,
          proposed_user_contact_revealed: true
        });
      }
    }
  }
});

// Instance methods
Proposal.prototype.isExpired = function() {
  return new Date() > this.expires_at;
};

Proposal.prototype.canBeResponded = function() {
  return this.status === 'pending' && !this.isExpired();
};

Proposal.prototype.isActive = function() {
  return ['pending', 'accepted'].includes(this.status) && !this.isExpired();
};

Proposal.prototype.getResponseTime = function() {
  if (!this.responded_at || !this.sent_at) return null;
  return Math.round((new Date(this.responded_at) - new Date(this.sent_at)) / (1000 * 60 * 60));
};

Proposal.prototype.markAsViewed = async function() {
  if (!this.viewed_by_proposed_user) {
    await this.update({
      viewed_by_proposed_user: true,
      viewed_at: new Date()
    });
  }
};

Proposal.prototype.sendReminder = async function() {
  if (this.reminder_count < 3) {
    await this.update({
      reminder_sent: true,
      reminder_count: this.reminder_count + 1
    });
    return true;
  }
  return false;
};

// Class methods
Proposal.findPendingProposals = function(userId) {
  return this.findAll({
    where: {
      proposed_user_id: userId,
      status: 'pending'
    },
    include: [
      {
        model: require('./User'),
        as: 'proposer',
        include: ['profile']
      }
    ],
    order: [['sent_at', 'DESC']]
  });
};

Proposal.findSentProposals = function(userId) {
  return this.findAll({
    where: {
      proposer_id: userId
    },
    include: [
      {
        model: require('./User'),
        as: 'proposedUser',
        include: ['profile']
      }
    ],
    order: [['sent_at', 'DESC']]
  });
};

Proposal.findAcceptedProposals = function(userId) {
  return this.findAll({
    where: {
      status: 'accepted',
      [require('sequelize').Op.or]: [
        { proposer_id: userId },
        { proposed_user_id: userId }
      ]
    },
    include: [
      {
        model: require('./User'),
        as: 'proposer',
        include: ['profile']
      },
      {
        model: require('./User'),
        as: 'proposedUser',
        include: ['profile']
      }
    ],
    order: [['responded_at', 'DESC']]
  });
};

Proposal.findExpiredProposals = function() {
  return this.findAll({
    where: {
      status: 'pending',
      expires_at: {
        [require('sequelize').Op.lt]: new Date()
      }
    }
  });
};

Proposal.getProposalStats = async function(userId) {
  const stats = await this.findAll({
    where: {
      [require('sequelize').Op.or]: [
        { proposer_id: userId },
        { proposed_user_id: userId }
      ]
    },
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    group: ['status']
  });
  
  return stats.reduce((acc, stat) => {
    acc[stat.status] = parseInt(stat.dataValues.count);
    return acc;
  }, {});
};

// Scopes
Proposal.addScope('active', {
  where: {
    status: ['pending', 'accepted'],
    expires_at: {
      [require('sequelize').Op.gt]: new Date()
    }
  }
});

Proposal.addScope('recent', {
  where: {
    sent_at: {
      [require('sequelize').Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    }
  }
});

module.exports = Proposal;
