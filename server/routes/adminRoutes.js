const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const { authenticateAdmin, requireSuperAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes (requires admin authentication)
router.use(authenticateAdmin);

// Admin profile management
router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.updateProfile);
router.put('/change-password', adminController.changePassword);
router.post('/logout', adminController.logout);

// User management routes (admin access to user functions)
router.get('/users/stats', userController.getUserStats);
router.get('/users', userController.getUsers);
router.put('/users/:userId/status', userController.updateUserStatus);
router.delete('/users/:userId', userController.deleteUser);

// Admin management (super admin only)
router.post('/create', requireSuperAdmin, adminController.createAdmin);
router.get('/list', requireSuperAdmin, adminController.getAllAdmins);
router.put('/:adminId', requireSuperAdmin, adminController.updateAdmin);
router.delete('/:adminId', requireSuperAdmin, adminController.deleteAdmin);

module.exports = router;
