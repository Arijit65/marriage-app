const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { authenticate, checkProfileCompletion } = require('../middleware/auth');

// Proposal management routes
router.post('/send', authenticate, checkProfileCompletion, proposalController.sendProposal);
router.get('/sent', authenticate, proposalController.getSentProposals);
router.get('/received', authenticate, proposalController.getReceivedProposals);
router.get('/recent', authenticate, proposalController.getRecentProposals);

// Individual proposal routes
router.get('/:proposalId', authenticate, proposalController.getProposalDetails);
router.put('/:proposalId/respond', authenticate, proposalController.respondToProposal);
router.delete('/:proposalId/withdraw', authenticate, proposalController.withdrawProposal);

// Statistics routes
router.get('/stats/overview', authenticate, proposalController.getProposalStats);

module.exports = router;