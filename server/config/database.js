const { Sequelize } = require('sequelize');
const { logger } = require('../utils/logger');

// Load environment variables first
require('dotenv').config();

// Determine environment
const env = process.env.NODE_ENV || 'development';

// Database configuration - directly defined to avoid circular dependency
const dbConfig = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin#123',
    database: process.env.DB_NAME || 'marriage-app',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin#123',
    database: process.env.DB_NAME_TEST || 'marriage-app-test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      charset: 'utf8mb4',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
};

// Get current environment config
const currentConfig = dbConfig[env];

// Create Sequelize instance with proper configuration
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    port: currentConfig.port,
    dialect: currentConfig.dialect,
    logging: currentConfig.logging === false ? false : (msg) => logger.debug(msg),
    pool: currentConfig.pool,
    dialectOptions: currentConfig.dialectOptions,
    define: currentConfig.define
  }
);

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    logger.error('❌ Unable to connect to database:', error.message);
    return false;
  }
};

/**
 * Sync database models with database
 * Note: Models are already loaded and associations are defined in models/index.js
 * @param {Object} options - Sequelize sync options
 * @returns {Promise<boolean>}
 */
const syncDatabase = async (options = {}) => {
  try {
    // Default sync options
    const syncOptions = {
      alter: options.alter !== undefined ? options.alter : false,
      force: options.force !== undefined ? options.force : false,
      logging: currentConfig.logging === false ? false : (msg) => logger.debug(msg)
    };

    // Warning for force sync
    if (syncOptions.force) {
      logger.warn('⚠️  Force sync is enabled - This will drop all tables!');
    }

    // Sync all models
    await sequelize.sync(syncOptions);

    logger.info('✅ Database synchronized successfully');
    return true;
  } catch (error) {
    logger.error('❌ Error syncing database:', error.message);
    throw error;
  }
};

/**
 * Initialize database connection and sync
 * @param {Object} options - Initialization options
 * @returns {Promise<void>}
 */
const initializeDatabase = async (options = {}) => {
  try {
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Sync database if requested
    if (options.sync !== false) {
      await syncDatabase(options.syncOptions || {});
    }

    logger.info('✅ Database initialized successfully');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

/**
 * Close database connection
 * @returns {Promise<void>}
 */
const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed successfully');
  } catch (error) {
    logger.error('Error closing database connection:', error.message);
    throw error;
  }
};

/**
 * Check database health
 * @returns {Promise<Object>}
 */
const checkHealth = async () => {
  try {
    await sequelize.authenticate();
    return {
      status: 'healthy',
      message: 'Database is responding',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  initializeDatabase,
  closeConnection,
  checkHealth
};
