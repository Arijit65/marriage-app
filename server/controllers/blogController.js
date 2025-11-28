const { Blog, Admin } = require('../models');
const { logger } = require('../utils/logger');
const { ValidationError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

class BlogController {
  // Create new blog post
  async createBlog(req, res, next) {
    try {
      const { 
        title, 
        slug, 
        excerpt, 
        content, 
        category, 
        tags, 
        status, 
        is_featured,
        meta_title,
        meta_description,
        meta_keywords
      } = req.body;

      // Validate required fields
      if (!title || !content) {
        throw new ValidationError('Title and content are required');
      }

      // Handle uploaded images
      let featured_image = null;
      let images = [];

      if (req.files && req.files.length > 0) {
        // First image is featured image
        featured_image = `/uploads/${req.files[0].filename}`;
        
        // Rest are additional images
        images = req.files.slice(1).map(file => `/uploads/${file.filename}`);
      }

      // Create blog post
      const blog = await Blog.create({
        title,
        slug: slug || null, // Will be auto-generated from title if null
        excerpt: excerpt || null,
        content,
        featured_image,
        images,
        author_id: req.admin.id,
        author_name: req.admin.name,
        category: category || 'General',
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
        status: status || 'draft',
        is_featured: is_featured === 'true' || is_featured === true || false,
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt,
        meta_keywords
      });

      logger.info(`Blog created by admin ${req.admin.email}: ${blog.title}`);

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: { blog }
      });
    } catch (error) {
      // Clean up uploaded files if blog creation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(async (file) => {
          try {
            await fs.unlink(file.path);
          } catch (err) {
            logger.error('Error deleting file:', err);
          }
        });
      }
      next(error);
    }
  }

  // Get all blogs (with filters)
  async getAllBlogs(req, res, next) {
    try {
      const { 
        status, 
        category, 
        author_id, 
        is_featured,
        page = 1, 
        limit = 10,
        search
      } = req.query;

      const whereClause = {};
      
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;
      if (author_id) whereClause.author_id = author_id;
      if (is_featured !== undefined) whereClause.is_featured = is_featured === 'true';
      
      // Search in title, excerpt, and content
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { excerpt: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const { count, rows: blogs } = await Blog.findAndCountAll({
        where: whereClause,
        include: [{
          model: Admin,
          as: 'author',
          attributes: ['id', 'name', 'email', 'role']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        success: true,
        data: {
          blogs,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get published blogs (public endpoint)
  async getPublishedBlogs(req, res, next) {
    try {
      const { 
        category, 
        page = 1, 
        limit = 10,
        search
      } = req.query;

      const whereClause = { status: 'published' };
      
      if (category) whereClause.category = category;
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { excerpt: { [Op.like]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const { count, rows: blogs } = await Blog.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['author_id'] },
        order: [['published_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        success: true,
        data: {
          blogs,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get featured blogs
  async getFeaturedBlogs(req, res, next) {
    try {
      const { limit = 5 } = req.query;

      const blogs = await Blog.findFeatured(parseInt(limit));

      res.status(200).json({
        success: true,
        data: { blogs }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single blog by ID or slug
  async getBlog(req, res, next) {
    try {
      const { identifier } = req.params;

      let blog;
      
      // Check if identifier is a number (ID) or string (slug)
      if (!isNaN(identifier)) {
        blog = await Blog.findByPk(identifier, {
          include: [{
            model: Admin,
            as: 'author',
            attributes: ['id', 'name', 'email', 'role']
          }]
        });
      } else {
        blog = await Blog.findBySlug(identifier);
        if (blog) {
          blog = await Blog.findByPk(blog.id, {
            include: [{
              model: Admin,
              as: 'author',
              attributes: ['id', 'name', 'email', 'role']
            }]
          });
        }
      }

      if (!blog) {
        throw new ValidationError('Blog post not found');
      }

      // Increment views count for published blogs
      if (blog.status === 'published') {
        await blog.incrementViews();
      }

      res.status(200).json({
        success: true,
        data: { blog }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update blog
  async updateBlog(req, res, next) {
    try {
      const { blogId } = req.params;
      const { 
        title, 
        slug, 
        excerpt, 
        content, 
        category, 
        tags, 
        status, 
        is_featured,
        meta_title,
        meta_description,
        meta_keywords
      } = req.body;

      const blog = await Blog.findByPk(blogId);

      if (!blog) {
        throw new ValidationError('Blog post not found');
      }

      // Update fields
      if (title) blog.title = title;
      if (slug) blog.slug = slug;
      if (excerpt !== undefined) blog.excerpt = excerpt;
      if (content) blog.content = content;
      if (category) blog.category = category;
      if (tags) blog.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      if (status) {
        blog.status = status;
        if (status === 'published' && !blog.published_at) {
          blog.published_at = new Date();
        }
      }
      if (is_featured !== undefined) blog.is_featured = is_featured === 'true' || is_featured === true;
      if (meta_title) blog.meta_title = meta_title;
      if (meta_description) blog.meta_description = meta_description;
      if (meta_keywords !== undefined) blog.meta_keywords = meta_keywords;

      // Handle new uploaded images
      if (req.files && req.files.length > 0) {
        // Delete old images
        if (blog.featured_image) {
          try {
            await fs.unlink(path.join(__dirname, '..', blog.featured_image));
          } catch (err) {
            logger.warn('Could not delete old featured image');
          }
        }
        
        if (blog.images && blog.images.length > 0) {
          for (const img of blog.images) {
            try {
              await fs.unlink(path.join(__dirname, '..', img));
            } catch (err) {
              logger.warn('Could not delete old image');
            }
          }
        }

        // Set new images
        blog.featured_image = `/uploads/${req.files[0].filename}`;
        blog.images = req.files.slice(1).map(file => `/uploads/${file.filename}`);
      }

      await blog.save();

      logger.info(`Blog updated by admin ${req.admin.email}: ${blog.title}`);

      res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: { blog }
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete blog
  async deleteBlog(req, res, next) {
    try {
      const { blogId } = req.params;

      const blog = await Blog.findByPk(blogId);

      if (!blog) {
        throw new ValidationError('Blog post not found');
      }

      // Delete associated images
      if (blog.featured_image) {
        try {
          await fs.unlink(path.join(__dirname, '..', blog.featured_image));
        } catch (err) {
          logger.warn('Could not delete featured image');
        }
      }
      
      if (blog.images && blog.images.length > 0) {
        for (const img of blog.images) {
          try {
            await fs.unlink(path.join(__dirname, '..', img));
          } catch (err) {
            logger.warn('Could not delete image');
          }
        }
      }

      await blog.destroy();

      logger.info(`Blog deleted by admin ${req.admin.email}: ${blog.title}`);

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Publish blog
  async publishBlog(req, res, next) {
    try {
      const { blogId } = req.params;

      const blog = await Blog.findByPk(blogId);

      if (!blog) {
        throw new ValidationError('Blog post not found');
      }

      await blog.publish();

      logger.info(`Blog published by admin ${req.admin.email}: ${blog.title}`);

      res.status(200).json({
        success: true,
        message: 'Blog post published successfully',
        data: { blog }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get blog categories
  async getCategories(req, res, next) {
    try {
      const categories = await Blog.findAll({
        attributes: ['category'],
        where: { status: 'published' },
        group: ['category']
      });

      const categoryList = categories.map(c => c.category).filter(Boolean);

      res.status(200).json({
        success: true,
        data: { categories: categoryList }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BlogController();
