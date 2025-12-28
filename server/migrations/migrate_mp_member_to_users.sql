-- Migration Script: mp_member to users table
-- This script migrates data from the old mp_member structure to the new users/profiles structure
-- 
-- IMPORTANT: 
-- 1. Backup your database before running this script
-- 2. Review the field mappings and adjust as needed
-- 3. Run this in a test environment first

-- ============================================
-- STEP 1: Insert Users from mp_member
-- ============================================

INSERT INTO users (
  id,
  name,
  email,
  phone_number,
  password,
  gender,
  date_of_birth,
  is_verified,
  is_active,
  is_online,
  last_login,
  profile_stats,
  profile_visibility,
  notification_preferences,
  privacy_settings,
  plan_id,
  plan_info,
  account_status,
  account_info,
  created_at,
  updated_at,
  referred_by
)
SELECT 
  -- Generate custom ID similar to old format (H19XXX-F)
  m.custom_id as id,
  
  -- Name from advertiser name
  m.name_of_advertiser as name,
  
  -- Email
  NULLIF(m.email, '') as email,
  
  -- Phone number (primary mobile)
  m.mobile as phone_number,
  
  -- Password (NOTE: Old passwords need re-hashing if they're not bcrypt)
  -- The User model will NOT re-hash on INSERT, only on beforeCreate/beforeUpdate hooks
  -- So we need to handle this carefully
  CASE 
    WHEN m.password IS NOT NULL THEN CONCAT('$2a$12$MIGRATE_', m.password)
    ELSE NULL
  END as password,
  
  -- Gender mapping from user_type (F=Female, M=Male, assuming from context)
  CASE m.user_type
    WHEN 'F' THEN 'female'
    WHEN 'M' THEN 'male'
    ELSE 'other'
  END as gender,
  
  -- Date of birth (will need to be populated from profile data if available)
  NULL as date_of_birth,
  
  -- Verification status
  CASE 
    WHEN m.mobVerified = 'Y' OR m.emailReplyVeri = 'Y' THEN TRUE
    ELSE FALSE
  END as is_verified,
  
  -- Active status based on account status and suspension
  CASE m.status
    WHEN 'Y' THEN TRUE
    WHEN 'P' THEN TRUE
    WHEN 'TA' THEN TRUE
    ELSE FALSE
  END as is_active,
  
  -- Online status (default to false)
  FALSE as is_online,
  
  -- Last login (use active_date or verification_date)
  COALESCE(
    NULLIF(m.active_date, '0000-00-00 00:00:00'),
    NULLIF(m.verification_date, '0000-00-00')
  ) as last_login,
  
  -- Profile stats JSON
  JSON_OBJECT(
    'completion_percentage', 50,
    'views_count', 0,
    'proposals_sent', 0,
    'proposals_received', 0
  ) as profile_stats,
  
  -- Profile visibility
  CASE m.is_private
    WHEN 'Y' THEN 'private'
    ELSE 'public'
  END as profile_visibility,
  
  -- Notification preferences JSON
  JSON_OBJECT(
    'email', IF(m.sms_service_chk = 'Y', TRUE, FALSE),
    'sms', IF(m.sms_service_chk = 'Y', TRUE, FALSE),
    'push', TRUE,
    'proposal_notifications', IF(m.proposalAllowFlag = 'Y', TRUE, FALSE),
    'profile_views', TRUE,
    'matches', TRUE
  ) as notification_preferences,
  
  -- Privacy settings JSON
  JSON_OBJECT(
    'show_phone', FALSE,
    'show_email', FALSE,
    'show_age', TRUE,
    'show_location', TRUE,
    'allow_profile_views', TRUE
  ) as privacy_settings,
  
  -- Plan ID mapping
  CASE m.paid_type
    WHEN 'D' THEN 2  -- Diamond plan
    WHEN 'G' THEN 3  -- Gold plan
    ELSE 1           -- Basic/Free plan
  END as plan_id,
  
  -- Plan info JSON
  JSON_OBJECT(
    'id', CASE m.paid_type WHEN 'D' THEN 2 WHEN 'G' THEN 3 ELSE 1 END,
    'expires_at', NULLIF(m.plan_expire, '0000-00-00'),
    'subscribed_at', NULLIF(m.pay_date, '0000-00-00'),
    'payment_id', NULL
  ) as plan_info,
  
  -- Account status mapping
  CASE m.status
    WHEN 'Y' THEN 'active'
    WHEN 'N' THEN 'pending_verification'
    WHEN 'P' THEN 'pending_approval'
    WHEN 'S' THEN 'suspended'
    WHEN 'TA' THEN 'trial_active'
    WHEN 'AE' THEN 'active'
    ELSE 'pending_verification'
  END as account_status,
  
  -- Account info JSON
  JSON_OBJECT(
    'suspension_reason', m.suspendReason,
    'suspension_until', NULLIF(m.suspend_date, '0000-00-00'),
    'registration_source', COALESCE(m.regSource, 'migration'),
    'ip_address', NULL,
    'user_agent', NULL,
    'timezone', 'Asia/Kolkata',
    'language', 'en',
    'old_user_id', m.user_id,
    'relation_with_candidate', m.relation_with_candidate,
    'ad_source', m.adSource,
    'id_proof_verified', m.id_proof_verified,
    'ad_content_verified', m.ad_content_veri,
    'contact_credit', m.contactCredit,
    'sms_balance', m.smsBalance,
    'marriage_settled', m.marriage_settled,
    'box_member', m.boxMember
  ) as account_info,
  
  -- Created at (use reg_date)
  COALESCE(
    NULLIF(m.reg_date, '0000-00-00 00:00:00'),
    NOW()
  ) as created_at,
  
  -- Updated at
  NOW() as updated_at,
  
  -- Referred by (if ref_id exists, map it to referral code)
  NULL as referred_by

FROM mp_member m
WHERE m.custom_id IS NOT NULL
  AND m.mobile IS NOT NULL
ON DUPLICATE KEY UPDATE
  -- If record exists, update only non-critical fields
  updated_at = NOW();


-- ============================================
-- STEP 2: Create a temporary mapping table
-- ============================================

CREATE TEMPORARY TABLE IF NOT EXISTS user_id_mapping AS
SELECT 
  m.user_id as old_user_id,
  m.custom_id as new_user_id,
  m.mobile as phone_number
FROM mp_member m
WHERE m.custom_id IS NOT NULL;


-- ============================================
-- STEP 3: Password Re-hashing Notice
-- ============================================

-- IMPORTANT: The passwords in the old system need to be re-hashed
-- Since the old passwords appear to be plain text or MD5,
-- you'll need to:
-- 1. Force password reset for all migrated users on first login, OR
-- 2. Use a separate script to hash them properly with bcrypt

-- Update all migrated users to require password reset
UPDATE users 
SET account_info = JSON_SET(
  account_info,
  '$.requires_password_reset',
  TRUE
)
WHERE id IN (SELECT new_user_id FROM user_id_mapping);


-- ============================================
-- STEP 4: Summary Report
-- ============================================

SELECT 
  'Migration Summary' as report_type,
  COUNT(*) as total_records_migrated,
  SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_users,
  SUM(CASE WHEN is_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
  SUM(CASE WHEN account_status = 'suspended' THEN 1 ELSE 0 END) as suspended_users
FROM users
WHERE id IN (SELECT new_user_id FROM user_id_mapping);


-- ============================================
-- STEP 5: Validation Queries
-- ============================================

-- Check for duplicate phone numbers
SELECT phone_number, COUNT(*) as count
FROM users
WHERE id IN (SELECT new_user_id FROM user_id_mapping)
GROUP BY phone_number
HAVING count > 1;

-- Check for users without required fields
SELECT id, name, email, phone_number, account_status
FROM users
WHERE id IN (SELECT new_user_id FROM user_id_mapping)
  AND (phone_number IS NULL OR phone_number = '');
