const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateAdmin, requireAdminPermission } = require('../middleware/auth');
const { upload } = require('../middleware/mediaUpload');

// Public routes (no authentication required)
router.get('/published', blogController.getPublishedBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/categories', blogController.getCategories);
router.get('/view/:identifier', blogController.getBlog); // Can be ID or slug

// Admin-only routes (require admin authentication)
router.use(authenticateAdmin);

// Blog management routes
router.post('/create', 
  requireAdminPermission('manage_content'),
  upload.array('images', 10), // Support up to 10 images
  blogController.createBlog
);

router.get('/all', 
  requireAdminPermission('manage_content'),
  blogController.getAllBlogs
);

router.get('/:blogId', 
  requireAdminPermission('manage_content'),
  blogController.getBlog
);

router.put('/:blogId', 
  requireAdminPermission('manage_content'),
  upload.array('images', 10),
  blogController.updateBlog
);

router.delete('/:blogId', 
  requireAdminPermission('manage_content'),
  blogController.deleteBlog
);

router.post('/:blogId/publish', 
  requireAdminPermission('manage_content'),
  blogController.publishBlog
);

module.exports = router;
