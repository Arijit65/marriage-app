// controllers/adController.js
const { Ad, UserActivity } = require('../models');
const { AppError, ValidationError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class AdController {
  // POST /api/ads/create
  async create(req, res, next) {
    try {
      const {
        title,
        description,
        ad_type,
        category,
        seeking_gender,
        age_range,
        location_preference,
        education_preference,
        occupation_preference,
        contact_person,
        contact_phone,
        contact_email,
        contact_address,
        preferred_contact_method,
        package_type,
        package_price,
        photos,
        video_url,
        is_featured,
        is_urgent,
        visibility_duration
      } = req.body;

      // Basic validations
      if (!title || !description || !ad_type || !seeking_gender || !contact_person || !contact_phone) {
        throw new ValidationError('Missing required fields for ad creation');
      }

      const ad = await Ad.create({
        user_id: req.user.id,
        title,
        description,
        ad_type,
        category,
        seeking_gender,
        age_range,
        location_preference,
        education_preference,
        occupation_preference,
        contact_person,
        contact_phone,
        contact_email,
        contact_address,
        preferred_contact_method,
        package_type,
        package_price,
        photos,
        video_url,
        is_featured: !!is_featured,
        is_urgent: !!is_urgent,
        visibility_duration
      });

      await UserActivity.trackActivity(req.user.id, 'ad_posted', {
        targetEntityType: 'ad',
        targetEntityId: ad.id,
        activity_data: { adType: ad.ad_type, featured: ad.is_featured }
      });

      res.status(201).json({
        success: true,
        message: 'Ad created successfully, pending approval',
        data: { ad }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/ads
  async list(req, res, next) {
    try {
      const { ad_type, seeking_gender, featured, urgent, page = 1, limit = 20 } = req.query;
      const where = {
        status: 'active',
        visibility_end_date: { [Op.gt]: new Date() }
      };
      if (ad_type) where.ad_type = ad_type;
      if (seeking_gender) where.seeking_gender = seeking_gender;
      if (typeof featured !== 'undefined') where.is_featured = featured === 'true';
      if (typeof urgent !== 'undefined') where.is_urgent = urgent === 'true';

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { count, rows } = await Ad.findAndCountAll({
        where,
        order: [
          ['is_featured', 'DESC'],
          ['is_urgent', 'DESC'],
          ['created_at', 'DESC']
        ],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          ads: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalCount: count
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/ads/:id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const ad = await Ad.findByPk(id);
      if (!ad) throw new AppError('Ad not found', 404);
      if (ad.user_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('Not authorized to update this ad', 403);
      }

      // Restrict fields: prevent direct status changes unless admin
      const forbidden = ['status', 'payment_status', 'is_verified', 'moderated_by', 'moderation_notes', 'moderation_date'];
      const updates = { ...req.body };
      if (req.user.role !== 'admin') forbidden.forEach((f) => delete updates[f]);

      await ad.update(updates);

      await UserActivity.trackActivity(req.user.id, 'ad_posted', {
        activitySubType: 'ad_updated',
        targetEntityType: 'ad',
        targetEntityId: ad.id
      });

      res.json({
        success: true,
        message: 'Ad updated successfully',
        data: { ad }
      });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/ads/:id
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const ad = await Ad.findByPk(id);
      if (!ad) throw new AppError('Ad not found', 404);
      if (ad.user_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('Not authorized to delete this ad', 403);
      }

      await ad.destroy();

      await UserActivity.trackActivity(req.user.id, 'admin_action', {
        activitySubType: 'ad_deleted',
        targetEntityType: 'ad',
        targetEntityId: id
      });

      res.json({
        success: true,
        message: 'Ad deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/ads/mine
  async mine(req, res, next) {
    try {
      const ads = await Ad.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: { ads }
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/ads/stats
  async stats(req, res, next) {
    try {
      const stats = await Ad.getAdStats(req.user.id);
      res.json({
        success: true,
        data: { stats }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdController();
