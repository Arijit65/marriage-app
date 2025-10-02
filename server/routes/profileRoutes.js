const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate, checkProfileCompletion } = require('../middleware/auth');

// Profile management routes
router.get('/public/:profileId', profileController.getPublicProfile); // Public route for individual profiles
router.get('/search', authenticate, profileController.searchProfiles);
router.get('/stats/overview', authenticate, profileController.getProfileStats);
router.get('/ad-profiles', profileController.getAdProfiles);
router.get('/:userId', profileController.getProfile);
router.get('/', authenticate, profileController.getProfile);
router.put('/update', authenticate, profileController.updateProfile);
router.put('/photos', authenticate, profileController.updatePhotos);
router.put('/privacy-settings', authenticate, profileController.updatePrivacySettings);
router.put('/partner-preferences', authenticate, profileController.updatePartnerPreferences);
router.put('/toggle-status', authenticate, profileController.toggleProfileStatus);

module.exports = router;