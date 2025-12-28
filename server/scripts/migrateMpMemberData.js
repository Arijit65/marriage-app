/**
 * Migration Script: mp_member to users table
 * 
 * This script handles the migration of user data from the old mp_member table
 * to the new users/profiles structure with proper password hashing.
 * 
 * Usage: node scripts/migrateMpMemberData.js
 */

const bcrypt = require('bcryptjs');
const { sequelize, User, Profile } = require('../models');
const { QueryTypes } = require('sequelize');

// Configuration
const BATCH_SIZE = 100;
const DEFAULT_PASSWORD = 'ChangeMe@123'; // Users will be forced to reset

/**
 * Map old mp_member data to new User structure
 */
function mapMemberToUser(member) {
  // Determine gender from user_type (F=Female, M=Male)
  let gender = 'other';
  if (member.user_type === 'F') gender = 'female';
  else if (member.user_type === 'M') gender = 'male';

  // Map account status
  const statusMap = {
    'Y': 'active',
    'N': 'pending_verification',
    'P': 'pending_approval',
    'S': 'suspended',
    'TA': 'trial_active',
    'AE': 'active'
  };

  // Map plan based on paid_type
  const planMap = {
    'D': 2, // Diamond
    'G': 3, // Gold
    'N': 1  // Free
  };

  return {
    id: member.custom_id,
    name: member.name_of_advertiser || 'User',
    email: member.email || null,
    phone_number: member.mobile,
    password: DEFAULT_PASSWORD, // Will be hashed by model hook
    gender: gender,
    date_of_birth: null, // Will be populated from profile data later
    is_verified: member.mobVerified === 'Y' || member.emailReplyVeri === 'Y',
    is_active: ['Y', 'P', 'TA', 'AE'].includes(member.status),
    is_online: false,
    last_login: (() => {
      if (!member.active_date || member.active_date === '0000-00-00 00:00:00') {
        return null;
      }
      const date = new Date(member.active_date);
      return isNaN(date.getTime()) ? null : date;
    })(),
    profile_stats: {
      completion_percentage: 30,
      views_count: 0,
      proposals_sent: 0,
      proposals_received: 0
    },
    profile_visibility: member.is_private === 'Y' ? 'private' : 'public',
    notification_preferences: {
      email: member.sms_service_chk === 'Y',
      sms: member.sms_service_chk === 'Y',
      push: true,
      proposal_notifications: member.proposalAllowFlag === 'Y',
      profile_views: true,
      matches: true
    },
    privacy_settings: {
      show_phone: false,
      show_email: false,
      show_age: true,
      show_location: true,
      allow_profile_views: true
    },
    plan_id: planMap[member.paid_type] || 1,
    plan_info: {
      id: planMap[member.paid_type] || 1,
      expires_at: member.plan_expire && member.plan_expire !== '0000-00-00' 
        ? member.plan_expire 
        : null,
      subscribed_at: member.pay_date && member.pay_date !== '0000-00-00' 
        ? member.pay_date 
        : null,
      payment_id: null
    },
    account_status: statusMap[member.status] || 'pending_verification',
    account_info: {
      suspension_reason: member.suspendReason || null,
      suspension_until: member.suspend_date && member.suspend_date !== '0000-00-00' 
        ? member.suspend_date 
        : null,
      registration_source: member.regSource || 'migration',
      ip_address: null,
      user_agent: null,
      timezone: 'Asia/Kolkata',
      language: 'en',
      old_user_id: member.user_id,
      relation_with_candidate: member.relation_with_candidate,
      ad_source: member.adSource,
      id_proof_verified: member.id_proof_verified === 'Y',
      ad_content_verified: member.ad_content_veri === 'Y',
      contact_credit: member.contactCredit || 0,
      sms_balance: member.smsBalance || 0,
      marriage_settled: member.marriage_settled === 'Y',
      box_member: member.boxMember === 'Y',
      requires_password_reset: true,
      mobile2: member.mobile2 || null
    },
    created_at: (() => {
      if (!member.reg_date || member.reg_date === '0000-00-00 00:00:00') {
        return new Date();
      }
      const date = new Date(member.reg_date);
      return isNaN(date.getTime()) ? new Date() : date;
    })(),
    updated_at: new Date()
  };
}

/**
 * Fetch members from old mp_member table
 */
async function fetchOldMembers(offset = 0, limit = BATCH_SIZE) {
  const query = `
    SELECT * FROM mp_member 
    WHERE custom_id IS NOT NULL 
      AND mobile IS NOT NULL
    ORDER BY user_id
    LIMIT :limit OFFSET :offset
  `;
  
  return await sequelize.query(query, {
    replacements: { limit, offset },
    type: QueryTypes.SELECT
  });
}

/**
 * Count total members to migrate
 */
async function countMembers() {
  const query = `
    SELECT COUNT(*) as total 
    FROM mp_member 
    WHERE custom_id IS NOT NULL 
      AND mobile IS NOT NULL
  `;
  
  const result = await sequelize.query(query, {
    type: QueryTypes.SELECT
  });
  
  return result[0].total;
}

/**
 * Check if mp_member table exists
 */
async function checkOldTableExists() {
  try {
    await sequelize.query('SELECT 1 FROM mp_member LIMIT 1');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting migration from mp_member to users...\n');

  try {
    // Check if old table exists
    const tableExists = await checkOldTableExists();
    if (!tableExists) {
      console.error('❌ Error: mp_member table not found!');
      console.log('💡 Please ensure the old database table is accessible.');
      return;
    }

    // Count total records
    const totalRecords = await countMembers();
    console.log(`📊 Found ${totalRecords} records to migrate\n`);

    if (totalRecords === 0) {
      console.log('✅ No records to migrate.');
      return;
    }

    let offset = 0;
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Process in batches
    while (offset < totalRecords) {
      const members = await fetchOldMembers(offset, BATCH_SIZE);
      
      console.log(`Processing batch ${Math.floor(offset / BATCH_SIZE) + 1}...`);

      for (const member of members) {
        try {
          const userData = mapMemberToUser(member);
          
          // Check if user already exists
          const existingUser = await User.findByPk(userData.id);
          
          if (existingUser) {
            console.log(`⚠️  User ${userData.id} already exists, skipping...`);
            continue;
          }

          // Create user (password will be hashed by beforeCreate hook)
          await User.create(userData);
          successCount++;
          
          if (successCount % 10 === 0) {
            console.log(`✅ Migrated ${successCount} users...`);
          }

        } catch (error) {
          errorCount++;
          errors.push({
            user_id: member.user_id,
            custom_id: member.custom_id,
            error: error.message
          });
          console.error(`❌ Error migrating user ${member.custom_id}: ${error.message}`);
        }
      }

      offset += BATCH_SIZE;
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total records found: ${totalRecords}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('='.repeat(50) + '\n');

    if (errors.length > 0) {
      console.log('❌ Errors encountered:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.custom_id}: ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }

    // Print statistics
    console.log('\n📊 User Statistics:');
    const stats = await User.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN is_active = 1 THEN 1 ELSE 0 END")), 'active'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN is_verified = 1 THEN 1 ELSE 0 END")), 'verified'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN account_status = 'suspended' THEN 1 ELSE 0 END")), 'suspended']
      ],
      where: {
        'account_info.old_user_id': { [sequelize.Sequelize.Op.ne]: null }
      },
      raw: true
    });

    if (stats[0]) {
      console.log(`   Total migrated users: ${stats[0].total}`);
      console.log(`   Active users: ${stats[0].active}`);
      console.log(`   Verified users: ${stats[0].verified}`);
      console.log(`   Suspended users: ${stats[0].suspended}`);
    }

    console.log('\n✅ Migration completed!');
    console.log('\n⚠️  IMPORTANT NOTES:');
    console.log('   1. All users have been assigned a default password: "ChangeMe@123"');
    console.log('   2. Users are flagged to reset password on first login');
    console.log('   3. Review the account_info field for additional old data');
    console.log('   4. Consider sending password reset emails to all migrated users');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback function - deletes all migrated users
 */
async function rollback() {
  console.log('⚠️  Rolling back migration...');
  
  const result = await User.destroy({
    where: {
      'account_info.old_user_id': { [sequelize.Sequelize.Op.ne]: null }
    }
  });
  
  console.log(`✅ Deleted ${result} migrated users`);
}

// Run migration
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'rollback') {
    rollback()
      .then(() => {
        console.log('✅ Rollback completed');
        process.exit(0);
      })
      .catch(err => {
        console.error('❌ Rollback failed:', err);
        process.exit(1);
      });
  } else {
    migrate()
      .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
      })
      .catch(err => {
        console.error('❌ Script failed:', err);
        process.exit(1);
      });
  }
}

module.exports = { migrate, rollback, mapMemberToUser };
