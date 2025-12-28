const { Proposal, User, Profile } = require('../models');
const { AppError, ValidationError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const { Op } = require('sequelize');

class ProposalController {
  // Send proposal
  async sendProposal(req, res, next) {
    console.log('🎯 sendProposal function CALLED');
    console.log('📦 Request body:', req.body);
    console.log('👤 Request user:', req.user ? { id: req.user.id, name: req.user.name } : 'NO USER');
    
    try {
      const { proposedUserId, message } = req.body;
      const proposerUserId = req.user.id;

      console.log('🔄 Processing proposal request:', {
        proposerUserId,
        proposerUserIdType: typeof proposerUserId,
        proposedUserId,
        proposedUserIdType: typeof proposedUserId,
        message: message ? message.substring(0, 50) + '...' : 'No message',
        timestamp: new Date().toISOString()
      });

      if (!proposedUserId) {
        console.error('❌ Proposed user ID is missing');
        throw new ValidationError('Proposed user ID is required');
      }

      // Parse profile ID if it's in format "B00002-F" or "G00003-M"
      let actualProposedUserId = proposedUserId;
      
      // Check if proposedUserId is a profile ID format (B00002-F, G00003-M, etc.)
      if (typeof proposedUserId === 'string' && /^[BG]\d+-[MF]$/.test(proposedUserId)) {
        console.log('🔍 Detected profile ID format, converting to user ID:', proposedUserId);
        
        // Extract the numeric profile ID from format like "B00002-F"
        const match = proposedUserId.match(/^[BG](\d+)-[MF]$/);
        if (!match) {
          console.error('❌ Invalid profile ID format:', proposedUserId);
          throw new ValidationError('Invalid profile ID format');
        }
        
        const profileId = parseInt(match[1]);
        console.log('🔍 Extracted profile ID:', profileId);
        
        // Find the profile and get associated user ID
        const profile = await Profile.findOne({
          where: { id: profileId },
          attributes: ['id', 'user_id']
        });
        
        if (!profile || !profile.user_id) {
          console.error('❌ Profile or user not found for profile ID:', profileId);
          throw new AppError('Profile not found', 404);
        }
        
        actualProposedUserId = profile.user_id;
        console.log('✅ Converted profile ID to user ID:', { profileId, userId: actualProposedUserId });
      }

      // Don't parse to int - user IDs might be strings like 'K258711F'
      // actualProposedUserId stays as-is (string or number)

      // Check if proposing to self (use loose equality since IDs might be string or number)
      if (proposerUserId == actualProposedUserId) {
        console.error('❌ User trying to propose to themselves:', proposerUserId);
        throw new ValidationError('Cannot send proposal to yourself');
      }

      // Check if proposed user exists and has active profile
      console.log('🔍 Looking up proposed user:', actualProposedUserId);
      const proposedUser = await User.findOne({
        where: { id: actualProposedUserId, is_active: true },
        include: [{
          model: Profile,
          as: 'userProfile',
          required: false
        }]
      });

      console.log('👤 Proposed user lookup result:', proposedUser ? {
        id: proposedUser.id,
        name: proposedUser.name,
        hasProfile: !!proposedUser.userProfile
      } : 'NOT FOUND');

      if (!proposedUser) {
        console.error('❌ Proposed user not found or inactive:', actualProposedUserId);
        throw new AppError('User not found or profile not active', 404);
      }

      // Check if proposal already exists
      const existingProposal = await Proposal.findOne({
        where: {
          proposerUserId,
          proposedUserId: actualProposedUserId,
          status: ['pending', 'accepted']
        }
      });

      if (existingProposal) {
        throw new ValidationError('Proposal already sent to this user');
      }

      // Check if user has received proposal from this user
      const receivedProposal = await Proposal.findOne({
        where: {
          proposerUserId: actualProposedUserId,
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
        proposedUserId: actualProposedUserId,
        message: message || '',
        status: 'pending',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      console.log('✅ Proposal created successfully:', {
        id: proposal.id,
        proposerUserId,
        proposedUserId: actualProposedUserId,
        status: proposal.status
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
        proposedUserIdType: typeof req.body?.proposedUserId,
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
            as: 'userProfile',
            attributes: ['photos', 'profile_photo', 'personal_info', 'location_info', 'education_career_info']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const formattedProposals = proposals.map(proposal => {
        const profile = proposal.ProposedUser.userProfile;
        return {
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
            age: profile?.personal_info?.age || null,
            location: {
              city: profile?.location_info?.city || '',
              state: profile?.location_info?.state || ''
            },
            photos: profile?.photos?.slice(0, 1) || [],
            occupation: profile?.education_career_info?.occupation || '',
            maritalStatus: profile?.personal_info?.marital_status || ''
          }
        };
      });

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
            as: 'userProfile',
            attributes: ['photos', 'profile_photo', 'personal_info', 'location_info', 'education_career_info', 'family_info']
          }]
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const formattedProposals = proposals.map(proposal => {
        const profile = proposal.ProposerUser.userProfile;
        return {
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
            age: profile?.personal_info?.age || null,
            location: {
              city: profile?.location_info?.city || '',
              state: profile?.location_info?.state || ''
            },
            photos: profile?.photos?.slice(0, 3) || [],
            occupation: profile?.education_career_info?.occupation || '',
            maritalStatus: profile?.personal_info?.marital_status || '',
            education: profile?.education_career_info?.education || '',
            familyType: profile?.family_info?.type || ''
          }
        };
      });

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
          attributes: ['id', 'name', 'email', 'phone_number']
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
          phone: proposal.ProposerUser.phone_number
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
            attributes: ['id', 'name', 'gender', 'email', 'phone_number'],
            include: [{
              model: Profile,
              attributes: ['photos', 'age', 'city', 'state', 'occupation', 'maritalStatus', 'education', 'familyType', 'aboutMe']
            }]
          },
          {
            model: User,
            as: 'ProposedUser',
            attributes: ['id', 'name', 'gender', 'email', 'phone_number'],
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
            phone: otherUser.phone_number
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

  // Get all proposals (Admin only)
  async getAllProposalsForAdmin(req, res, next) {
    try {
      const { 
        status, 
        page = 1, 
        limit = 50,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        search = ''
      } = req.query;
      
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause = {};
      if (status && status !== 'all') {
        whereClause.status = status;
      }

      // Build search condition for user names
      const userSearchCondition = search ? {
        [Op.or]: [
          { '$ProposerUser.name$': { [Op.like]: `%${search}%` } },
          { '$ProposedUser.name$': { [Op.like]: `%${search}%` } }
        ]
      } : {};

      const { count, rows: proposals } = await Proposal.findAndCountAll({
        where: {
          ...whereClause,
          ...userSearchCondition
        },
        include: [
          {
            model: User,
            as: 'ProposerUser',
            attributes: ['id', 'name', 'email', 'phone_number', 'gender', 'is_verified'],
            include: [{
              model: Profile,
              as: 'userProfile',
              attributes: ['photos', 'profile_photo', 'personal_info', 'location_info', 'education_career_info']
            }]
          },
          {
            model: User,
            as: 'ProposedUser',
            attributes: ['id', 'name', 'email', 'phone_number', 'gender', 'is_verified'],
            include: [{
              model: Profile,
              as: 'userProfile',
              attributes: ['photos', 'profile_photo', 'personal_info', 'location_info', 'education_career_info']
            }]
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const formattedProposals = proposals.map(proposal => {
        const proposerProfile = proposal.ProposerUser?.userProfile;
        const proposedProfile = proposal.ProposedUser?.userProfile;

        return {
          id: proposal.id,
          status: proposal.status,
          message: proposal.message,
          responseMessage: proposal.responseMessage,
          contactRevealed: proposal.contactRevealed,
          expiresAt: proposal.expiresAt,
          createdAt: proposal.createdAt,
          respondedAt: proposal.respondedAt,
          isExpired: proposal.isExpired(),
          proposerUser: {
            id: proposal.ProposerUser.id,
            name: proposal.ProposerUser.name,
            email: proposal.ProposerUser.email,
            phone: proposal.ProposerUser.phone_number,
            gender: proposal.ProposerUser.gender,
            isVerified: proposal.ProposerUser.is_verified,
            age: proposerProfile?.personal_info?.age || null,
            location: {
              city: proposerProfile?.location_info?.city || '',
              state: proposerProfile?.location_info?.state || ''
            },
            photos: proposerProfile?.photos?.slice(0, 1) || [],
            occupation: proposerProfile?.education_career_info?.occupation || ''
          },
          proposedUser: {
            id: proposal.ProposedUser.id,
            name: proposal.ProposedUser.name,
            email: proposal.ProposedUser.email,
            phone: proposal.ProposedUser.phone_number,
            gender: proposal.ProposedUser.gender,
            isVerified: proposal.ProposedUser.is_verified,
            age: proposedProfile?.personal_info?.age || null,
            location: {
              city: proposedProfile?.location_info?.city || '',
              state: proposedProfile?.location_info?.state || ''
            },
            photos: proposedProfile?.photos?.slice(0, 1) || [],
            occupation: proposedProfile?.education_career_info?.occupation || ''
          }
        };
      });

      // Get status counts for admin dashboard
      const statusCounts = await Promise.all([
        Proposal.count({ where: { status: 'pending' } }),
        Proposal.count({ where: { status: 'accepted' } }),
        Proposal.count({ where: { status: 'rejected' } }),
        Proposal.count({ where: { status: 'withdrawn' } }),
        Proposal.count({ where: { status: 'maybe' } })
      ]);

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
          },
          statistics: {
            pending: statusCounts[0],
            accepted: statusCounts[1],
            rejected: statusCounts[2],
            withdrawn: statusCounts[3],
            maybe: statusCounts[4],
            total: count
          }
        }
      });

    } catch (error) {
      logger.error('Error in getAllProposalsForAdmin:', error);
      next(error);
    }
  }
}

module.exports = new ProposalController();
