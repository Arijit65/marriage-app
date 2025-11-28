const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [3, 255],
        notEmpty: true
      }
    },
    slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [50, 50000]
      }
    },
    featured_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Main featured image URL'
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of additional image URLs'
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id'
      },
      comment: 'Admin who created the blog'
    },
    author_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Author display name'
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'General',
      validate: {
        len: [2, 100]
      }
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of blog tags'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
      allowNull: false
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Show on homepage or featured section'
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times blog was viewed'
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    meta_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'SEO meta title'
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'SEO meta description'
    },
    meta_keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'SEO keywords'
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when blog was published'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'blogs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['author_id'] },
      { fields: ['status'] },
      { fields: ['category'] },
      { fields: ['is_featured'] },
      { fields: ['published_at'] }
    ],
    hooks: {
      beforeValidate: (blog) => {
        // Auto-generate slug from title if not provided
        if (!blog.slug && blog.title) {
          blog.slug = blog.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        
        // Set published_at when status changes to published
        if (blog.status === 'published' && !blog.published_at) {
          blog.published_at = new Date();
        }
      }
    }
  });

  // Instance methods
  Blog.prototype.incrementViews = async function() {
    this.views_count += 1;
    await this.save();
  };

  Blog.prototype.incrementLikes = async function() {
    this.likes_count += 1;
    await this.save();
  };

  Blog.prototype.publish = async function() {
    this.status = 'published';
    this.published_at = new Date();
    await this.save();
  };

  Blog.prototype.unpublish = async function() {
    this.status = 'draft';
    await this.save();
  };

  Blog.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Class methods
  Blog.findBySlug = function(slug) {
    return this.findOne({ where: { slug } });
  };

  Blog.findPublished = function(options = {}) {
    return this.findAll({
      where: { status: 'published' },
      order: [['published_at', 'DESC']],
      ...options
    });
  };

  Blog.findFeatured = function(limit = 5) {
    return this.findAll({
      where: { 
        status: 'published',
        is_featured: true 
      },
      order: [['published_at', 'DESC']],
      limit
    });
  };

  Blog.findByCategory = function(category, options = {}) {
    return this.findAll({
      where: { 
        category,
        status: 'published'
      },
      order: [['published_at', 'DESC']],
      ...options
    });
  };

  Blog.findByAuthor = function(authorId, options = {}) {
    return this.findAll({
      where: { author_id: authorId },
      order: [['created_at', 'DESC']],
      ...options
    });
  };

  // Define associations
  Blog.associate = function(models) {
    Blog.belongsTo(models.Admin, {
      foreignKey: 'author_id',
      as: 'author',
      onDelete: 'CASCADE'
    });
  };

  return Blog;
};
