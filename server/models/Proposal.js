const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proposal = sequelize.define('Proposal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    proposerUserId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'proposer_user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    proposedUserId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'proposed_user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'maybe', 'withdrawn', 'expired'),
      allowNull: false,
      defaultValue: 'pending'
    },
    responseMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'response_message',
      validate: {
        len: [0, 1000]
      }
    },
    contactRevealed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'contact_revealed'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at'
    },
    respondedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'responded_at'
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
    tableName: 'proposals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['proposer_user_id']
      },
      {
        fields: ['proposed_user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['expires_at']
      },
      {
        unique: false,
        fields: ['proposer_user_id', 'proposed_user_id', 'status']
      }
    ]
  });

  // Instance methods
  Proposal.prototype.isExpired = function() {
    return new Date() > this.expiresAt;
  };

  Proposal.prototype.canRespond = function() {
    return this.status === 'pending' && !this.isExpired();
  };

  Proposal.prototype.canWithdraw = function() {
    return this.status === 'pending';
  };

  // Class methods
  Proposal.findByUsers = function(proposerUserId, proposedUserId) {
    return this.findOne({
      where: {
        proposerUserId,
        proposedUserId,
        status: ['pending', 'accepted']
      }
    });
  };

  Proposal.findActiveProposals = function(userId) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        [Op.or]: [
          { proposerUserId: userId },
          { proposedUserId: userId }
        ],
        status: ['pending', 'accepted']
      },
      order: [['createdAt', 'DESC']]
    });
  };

  Proposal.findExpiredProposals = function() {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        status: 'pending',
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });
  };

  // Define associations
  Proposal.associate = function(models) {
    // Proposal belongs to proposer user
    Proposal.belongsTo(models.User, {
      foreignKey: 'proposerUserId',
      as: 'ProposerUser',
      onDelete: 'CASCADE'
    });

    // Proposal belongs to proposed user
    Proposal.belongsTo(models.User, {
      foreignKey: 'proposedUserId',
      as: 'ProposedUser',
      onDelete: 'CASCADE'
    });
  };

  return Proposal;
};