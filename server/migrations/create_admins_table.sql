-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'sub_admin') NOT NULL DEFAULT 'sub_admin',
  phone_number VARCHAR(20) DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  permissions JSON DEFAULT NULL,
  last_login DATETIME DEFAULT NULL,
  login_attempts INTEGER DEFAULT 0,
  locked_until DATETIME DEFAULT NULL,
  created_by INTEGER DEFAULT NULL,
  profile_info JSON DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_is_active (is_active),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default super admin (password: SuperAdmin@123)
-- Note: This is a hashed bcrypt password with salt rounds = 12
INSERT INTO admins (name, email, password, role, is_active, permissions, created_at, updated_at)
VALUES (
  'Super Administrator',
  'admin@marriageapp.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWJ7iZSm',
  'super_admin',
  TRUE,
  JSON_OBJECT(
    'manage_users', TRUE,
    'manage_profiles', TRUE,
    'manage_payments', TRUE,
    'manage_content', TRUE,
    'manage_rr', TRUE,
    'manage_admins', TRUE,
    'view_analytics', TRUE,
    'manage_plans', TRUE,
    'manage_proposals', TRUE
  ),
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Insert demo sub-admin (password: SubAdmin@123)
INSERT INTO admins (name, email, password, role, is_active, permissions, created_by, created_at, updated_at)
VALUES (
  'Sub Administrator',
  'subadmin@marriageapp.com',
  '$2a$12$6k8JN7hqV8.QqmGpF5RZHOxvHZmFcVPxZ0pqKXqLQJ9YqZvQqGqKe',
  'sub_admin',
  TRUE,
  JSON_OBJECT(
    'manage_users', TRUE,
    'manage_profiles', TRUE,
    'manage_payments', TRUE,
    'manage_content', TRUE,
    'manage_rr', TRUE,
    'manage_admins', FALSE,
    'view_analytics', TRUE,
    'manage_plans', FALSE,
    'manage_proposals', TRUE
  ),
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE updated_at = NOW();
