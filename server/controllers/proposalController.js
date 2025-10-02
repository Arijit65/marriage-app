const { Proposal, User, Profile } = require('../models');
const { AppError, ValidationError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class ProposalController {
  // Send proposal
  async sendProposal(req, res, next) {
    try {
      const { proposedUserId, message } = req.body;
      const proposerUserId = req.user.id;

      console.log('🔄 Processing proposal request:', {
        proposerUserId,
        proposedUserId,
        message: message ? message.substring(0, 50) + '...' : 'No message',
        timestamp: new Date().toISOString()
      });

      if (!proposedUserId) {
        console.error('❌ Proposed user ID is missing');
        throw new ValidationError('Proposed user ID is required');
      }

      // Check if proposing to self
      if (proposerUserId === proposedUserId) {
        console.error('❌ User trying to propose to themselves:', proposerUserId);
        throw new ValidationError('Cannot send proposal to yourself');
      }

      // Check if this is a static profile ID (frontend demo profiles)
      const staticProfilePattern = /^(DEMO_|[A-Z]\d{5}-[A-Z]$)/; // Matches "DEMO_B25102", "B00004-M" etc.
      if (staticProfilePattern.test(proposedUserId)) {
        console.warn('🚫 Attempt to propose to static demo profile:', proposedUserId);
        throw new AppError('Cannot send proposals to demo profiles. Please create an account to view real profiles.', 400);
      }

      // Check if proposed user exists and has active profile
      console.log('🔍 Looking up proposed user:', proposedUserId);
      const proposedUser = await User.findOne({
        where: { id: proposedUserId, is_active: true },
        include: [{
          model: Profile,
          where: { is_active: true },
          required: false // Changed to false to allow users without profiles
        }]
      });

      console.log('👤 Proposed user lookup result:', proposedUser ? {
        id: proposedUser.id,
        name: proposedUser.name,
        hasProfile: !!proposedUser.Profile
      } : 'NOT FOUND');

      if (!proposedUser) {
        console.error('❌ Proposed user not found or inactive:', proposedUserId);
        throw new AppError('User not found or profile not active', 404);
      }

      // Check if proposal already exists
      const existingProposal = await Proposal.findOne({
        where: {
          proposerUserId,
          proposedUserId,
          status: ['pending', 'accepted']
        }
      });

      if (existingProposal) {
        throw new ValidationError('Proposal already sent to this user');
      }

      // Check if user has received proposal from this user
      const receivedProposal = await Proposal.findOne({
        where: {
          proposerUserId: proposedUserId,
          proposedUserId: proposerUserId,
          status: ['pending', 'accepted']
        }
      });

      if (receivedProposal) {
        throw new ValidationError('You have already received a proposal from this user');
      }

      // Create proposal
      const proposal = await Proposal.create({
        proposerUserId,
        proposedUserId,
        message: message || '',
        status: 'pending',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      // Log activity (temporarily disabled - UserActivity model not available)
      // await UserActivity.create({
      //   userId: proposerUserId,
      //   activityType: 'proposal_sent',
      //   targetUserId: proposedUserId,
      //   data: {
      //     proposalId: proposal.id,
      //     message: message ? message.substring(0, 100) : null
      //   },
      //   sessionInfo: req.sessionID,
      //   deviceInfo: req.headers['user-agent'],
      //   ipAddress: req.ip
      // });

      res.status(201).json({
        success: true,
        message: 'Proposal sent successfully',
        data: {
          proposal: {
            id: proposal.id,
            status: proposal.status,
            message: proposal.message,
            expiresAt: proposal.expiresAt,
            createdAt: proposal.createdAt
          }
        }
      });

    } catch (error) {
      console.error('❌ Error in sendProposal:', {
        error: error.message,
        stack: error.stack,
        proposerUserId: req.user?.id,
        proposedUserId: req.body?.proposedUserId,
        timestamp: new Date().toISOString()
      });
      next(error);
    }
  }

  // Get sent proposals
  async getSentProposals(req, res, next) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { proposerUserId: userId };
      if (status) {
        whereClause.status = status;
      }

      const { count, rows: proposals } = await Proposal.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'ProposedUser',
          attributes: ['id', 'name', 'gender'],
          include: [{
            model: Profile,
            attributes: ['photos', 'age', 'city', 'state', 'occupation', 'maritalStatus']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const formattedProposals = proposals.map(proposal => ({
        id: proposal.id,
        status: proposal.status,
        message: proposal.message,
        responseMessage: proposal.responseMessage,
        contactRevealed: proposal.contactRevealed,
        expiresAt: proposal.expiresAt,
        createdAt: proposal.createdAt,
        respondedAt: proposal.respondedAt,
        proposedUser: {
          id: proposal.ProposedUser.id,
          name: proposal.ProposedUser.name,
          gender: proposal.ProposedUser.gender,
          age: proposal.ProposedUser.Profile?.age,
          location: {
            city: proposal.ProposedUser.Profile?.city,
            state: proposal.ProposedUser.Profile?.state
          },
          photos: proposal.ProposedUser.Profile?.photos?.slice(0, 1) || [],
          occupation: proposal.ProposedUser.Profile?.occupation,
          maritalStatus: proposal.ProposedUser.Profile?.maritalStatus
        }
      }));

      res.json({
        success: true,
        data: {
          proposals: formattedProposals,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            hasNext: page * limit < count,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get received proposals
  async getReceivedProposals(req, res, next) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { proposedUserId: userId };
      if (status) {
        whereClause.status = status;
      }

      const { count, rows: proposals } = await Proposal.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'ProposerUser',
          attributes: ['id', 'name', 'gender'],
          include: [{
            model: Profile,
            attributes: ['photos', 'age', 'city', 'state', 'occupation', 'maritalStatus', 'education', 'familyType']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const formattedProposals = proposals.map(proposal => ({
        id: proposal.id,
        status: proposal.status,
        message: proposal.message,
        contactRevealed: proposal.contactRevealed,
        expiresAt: proposal.expiresAt,
        createdAt: proposal.createdAt,
        proposerUser: {
          id: proposal.ProposerUser.id,
          name: proposal.ProposerUser.name,
          gender: proposal.ProposerUser.gender,
          age: proposal.ProposerUser.Profile?.age,
          location: {
            city: proposal.ProposerUser.Profile?.city,
            state: proposal.ProposerUser.Profile?.state
          },
          photos: proposal.ProposerUser.Profile?.photos?.slice(0, 3) || [],
          occupation: proposal.ProposerUser.Profile?.occupation,
          maritalStatus: proposal.ProposerUser.Profile?.maritalStatus,
          education: proposal.ProposerUser.Profile?.education,
          familyType: proposal.ProposerUser.Profile?.familyType
        }
      }));

      res.json({
        success: true,
        data: {
          proposals: formattedProposals,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            hasNext: page * limit < count,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Respond to proposal
  async respondToProposal(req, res, next) {
    try {
      const { proposalId } = req.params;
      const { status, message, revealContact } = req.body;
      const userId = req.user.id;

      if (!status || !['accepted', 'rejected', 'maybe'].includes(status)) {
        throw new ValidationError('Valid status is required (accepted, rejected, maybe)');
      }

      // Find proposal
      const proposal = await Proposal.findOne({
        where: {
          id: proposalId,
          proposedUserId: userId,
          status: 'pending'
        },
        include: [{
          model: User,
          as: 'ProposerUser',
          attributes: ['id', 'name', 'email', 'phone']
        }]
      });

      if (!proposal) {
        throw new AppError('Proposal not found or already responded', 404);
      }

      // Check if proposal has expired
      if (proposal.isExpired()) {
        throw new ValidationError('Proposal has expired');
      }

      // Update proposal
      await proposal.update({
        status,
        responseMessage: message || '',
        respondedAt: new Date(),
        contactRevealed: revealContact || false
      });

      // If accepted, reveal contact information
      let contactInfo = null;
      if (status === 'accepted' && revealContact) {
        contactInfo = {
          name: proposal.ProposerUser.name,
          email: proposal.ProposerUser.email,
          phone: proposal.ProposerUser.phone
        };
      }

      // Log activity (temporarily disabled - UserActivity model not available)
      // await UserActivity.create({
      //   userId,
      //   activityType: `proposal_${status}`,
      //   targetUserId: proposal.proposerUserId,
      //   data: {
      //     proposalId: proposal.id,
      //     responseMessage: message ? message.substring(0, 100) : null,
      //     contactRevealed: revealContact
      //   },
      //   sessionInfo: req.sessionID,
      //   deviceInfo: req.headers['user-agent'],
      //   ipAddress: req.ip
      // });

      res.json({
        success: true,
        message: `Proposal ${status} successfully`,
        data: {
          proposal: {
            id: proposal.id,
            status: proposal.status,
            responseMessage: proposal.responseMessage,
            contactRevealed: proposal.contactRevealed,
            respondedAt: proposal.respondedAt
          },
          contactInfo
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get proposal details
  async getProposalDetails(req, res, next) {
    try {
      const { proposalId } = req.params;
      const userId = req.user.id;

      const proposal = await Proposal.findOne({
        where: {
          id: proposalId,
          [Op.or]: [
            { proposerUserId: userId },
            { proposedUserId: userId }
          ]
        },
        include: [
          {
            model: User,
            as: 'ProposerUser',
            attributes: ['id', 'name', 'gender', 'email', 'phone'],
            include: [{
              model: Profile,
              attributes: ['photos', 'age', 'city', 'state', 'occupation', 'maritalStatus', 'education', 'familyType', 'aboutMe']
            }]
          },
          {
            model: User,
            as: 'ProposedUser',
            attributes: ['id', 'name', 'gender', 'email', 'phone'],
            include: [{
              model: Profile,
              attributes: ['photos', 'age', 'city', 'state', 'occupation', 'maritalStatus', 'education', 'familyType', 'aboutMe']
            }]
          }
        ]
      });

      if (!proposal) {
        throw new AppError('Proposal not found', 404);
      }

      // Determine which user's info to show based on who's viewing
      const isProposer = proposal.proposerUserId === userId;
      const otherUser = isProposer ? proposal.ProposedUser : proposal.ProposerUser;

      // Show contact info only if proposal is accepted and contact is revealed
      const showContact = proposal.status === 'accepted' && proposal.contactRevealed;

      const formattedProposal = {
        id: proposal.id,
        status: proposal.status,
        message: proposal.message,
        responseMessage: proposal.responseMessage,
        contactRevealed: proposal.contactRevealed,
        expiresAt: proposal.expiresAt,
        createdAt: proposal.createdAt,
        respondedAt: proposal.respondedAt,
        isExpired: proposal.isExpired(),
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          gender: otherUser.gender,
          age: otherUser.Profile?.age,
          location: {
            city: otherUser.Profile?.city,
            state: otherUser.Profile?.state
          },
          photos: otherUser.Profile?.photos || [],
          occupation: otherUser.Profile?.occupation,
          maritalStatus: otherUser.Profile?.maritalStatus,
          education: otherUser.Profile?.education,
          familyType: otherUser.Profile?.familyType,
          aboutMe: otherUser.Profile?.aboutMe,
          contact: showContact ? {
            email: otherUser.email,
            phone: otherUser.phone
          } : null
        }
      };

      res.json({
        success: true,
        data: { proposal: formattedProposal }
      });

    } catch (error) {
      next(error);
    }
  }

  // Withdraw proposal
  async withdrawProposal(req, res, next) {
    try {
      const { proposalId } = req.params;
      const userId = req.user.id;

      const proposal = await Proposal.findOne({
        where: {
          id: proposalId,
          proposerUserId: userId,
          status: 'pending'
        }
      });

      if (!proposal) {
        throw new AppError('Proposal not found or cannot be withdrawn', 404);
      }

      await proposal.update({
        status: 'withdrawn',
        respondedAt: new Date()
      });

      // Log activity (temporarily disabled - UserActivity model not available)
      // await UserActivity.create({
      //   userId,
      //   activityType: 'proposal_withdrawn',
      //   targetUserId: proposal.proposedUserId,
      //   data: { proposalId: proposal.id },
      //   sessionInfo: req.sessionID,
      //   deviceInfo: req.headers['user-agent'],
      //   ipAddress: req.ip
      // });

      res.json({
        success: true,
        message: 'Proposal withdrawn successfully',
        data: {
          proposalId: proposal.id,
          status: proposal.status
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get proposal statistics
  async getProposalStats(req, res, next) {
    try {
      const userId = req.user.id;

      const [
        sentProposals,
        receivedProposals,
        acceptedProposals,
        pendingProposals
      ] = await Promise.all([
        Proposal.count({ where: { proposerUserId: userId } }),
        Proposal.count({ where: { proposedUserId: userId } }),
        Proposal.count({
          where: {
            status: 'accepted',
            [Op.or]: [
              { proposerUserId: userId },
              { proposedUserId: userId }
            ]
          }
        }),
        Proposal.count({
          where: {
            status: 'pending',
            [Op.or]: [
              { proposerUserId: userId },
              { proposedUserId: userId }
            ]
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          sentProposals,
          receivedProposals,
          acceptedProposals,
          pendingProposals,
          totalProposals: sentProposals + receivedProposals
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get recent proposals
  async getRecentProposals(req, res, next) {
    try {
      const userId = req.user.id;
      const { limit = 5 } = req.query;

      const proposals = await Proposal.findAll({
        where: {
          [Op.or]: [
            { proposerUserId: userId },
            { proposedUserId: userId }
          ],
          status: ['pending', 'accepted']
        },
        include: [
          {
            model: User,
            as: 'ProposerUser',
            attributes: ['id', 'name'],
            include: [{
              model: Profile,
              attributes: ['photos']
            }]
          },
          {
            model: User,
            as: 'ProposedUser',
            attributes: ['id', 'name'],
            include: [{
              model: Profile,
              attributes: ['photos']
            }]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });

      const formattedProposals = proposals.map(proposal => {
        const isProposer = proposal.proposerUserId === userId;
        const otherUser = isProposer ? proposal.ProposedUser : proposal.ProposerUser;

        return {
          id: proposal.id,
          status: proposal.status,
          type: isProposer ? 'sent' : 'received',
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            photo: otherUser.Profile?.photos?.[0] || null
          },
          createdAt: proposal.createdAt
        };
      });

      res.json({
        success: true,
        data: { proposals: formattedProposals }
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProposalController();
