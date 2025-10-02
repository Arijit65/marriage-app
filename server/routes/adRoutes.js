const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { authenticate, checkProfileCompletion } = require('../middleware/auth');

// Public routes
router.get('/', adController.getAds);
router.get('/:adId', adController.getAdById);
router.post('/:adId/contact', adController.contactAdOwner);
router.post('/:adId/view', adController.viewAd);

// User routes (authenticated)
router.post('/', authenticate, checkProfileCompletion, adController.createAd);
router.get('/user/my-ads', authenticate, adController.getUserAds);
router.put('/:adId', authenticate, adController.updateAd);
router.delete('/:adId', authenticate, adController.deleteAd);
router.put('/:adId/toggle', authenticate, adController.toggleAdStatus);
router.get('/user/contacted-ads', authenticate, adController.getContactedAds);

// Ad statistics routes
router.get('/:adId/stats', authenticate, adController.getAdStats);
router.get('/user/stats/overview', authenticate, adController.getUserAdStats);

// Search and filter routes
router.get('/search/advanced', authenticate, adController.advancedAdSearch);
router.get('/search/similar/:adId', authenticate, adController.getSimilarAds);

module.exports = router;