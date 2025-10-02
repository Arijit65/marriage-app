const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { upload } = require('../middleware/mediaUpload');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/send-registration-otp', authController.sendRegistrationOTP);
// Accept multiple images under field name 'photos'
router.post('/register', upload.array('photos', 10), authController.register);

// Login (OTP-based primary, password fallback)
router.post('/login', authController.login);

// Phone verification
router.post('/send-phone-otp', authController.sendPhoneOTP);
router.post('/verify-phone-otp', authController.verifyPhoneOTP);

// Password reset
router.post('/send-password-reset-otp', authController.sendPasswordResetOTP);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);
router.post('/logout', authenticate, authController.logout);
router.delete('/account', authenticate, authController.deleteAccount);

module.exports = router;