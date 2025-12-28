# Data Migration Guide: mp_member to users

This guide will help you safely migrate user data from your old `mp_member` table to the new `users` table structure.

## Overview

The migration handles the following key differences:
- **ID Format**: Old `user_id` (integer) → New `custom_id` (string like "H19129-F")
- **Password Storage**: Old plain text → New bcrypt hashed passwords
- **JSON Fields**: Multiple columns → Consolidated JSON fields (profile_stats, privacy_settings, etc.)
- **Status Mapping**: Old enum values → New standardized status values
- **Plan System**: Old paid_type → New plan_id with plan_info JSON

## Field Mapping Reference

| Old Field (mp_member) | New Field (users) | Notes |
|----------------------|-------------------|-------|
| `custom_id` | `id` | Primary identifier |
| `name_of_advertiser` | `name` | User's full name |
| `email` | `email` | Email address |
| `mobile` | `phone_number` | Primary phone |
| `mobile2` | `account_info.mobile2` | Secondary phone |
| `password` | `password` | Re-hashed with bcrypt |
| `user_type` (F/M) | `gender` | Female/Male mapping |
| `status` | `account_status` | Status mapping applied |
| `is_private` | `profile_visibility` | Y→private, N→public |
| `paid_type` | `plan_id` | D→2, G→3, N→1 |
| `mobVerified` | `is_verified` | Verification flag |
| `reg_date` | `created_at` | Registration date |
| Various flags | `account_info` | Stored in JSON |

### Status Mapping

| Old Status | New Account Status | Description |
|-----------|-------------------|-------------|
| Y | active | Active account |
| N | pending_verification | Not verified |
| P | pending_approval | Awaiting approval |
| S | suspended | Suspended account |
| TA | trial_active | Trial period |
| AE | active | Active (email verified) |

### Plan Mapping

| Old paid_type | New plan_id | Description |
|--------------|-------------|-------------|
| D | 2 | Diamond/Premium plan |
| G | 3 | Gold plan |
| N | 1 | Basic/Free plan |

## Prerequisites

1. **Backup your database**
   ```bash
   # Create a backup
   mysqldump -u your_user -p your_database > backup_$(date +%Y%m%d).sql
   ```

2. **Ensure the old table is accessible**
   - The `mp_member` table should exist in the same database
   - Or configure cross-database access if needed

3. **Install dependencies**
   ```bash
   cd server
   npm install bcryptjs sequelize mysql2
   ```

## Migration Methods

### Method 1: Node.js Script (Recommended)

This method properly hashes passwords and handles errors gracefully.

#### Step 1: Review the script
```bash
# Check the migration script
cat server/scripts/migrateMpMemberData.js
```

#### Step 2: Test with a dry run
Modify the script temporarily to add a dry-run mode:
```javascript
// At the top of migrate() function
const DRY_RUN = true; // Set to false for actual migration

// Before User.create()
if (DRY_RUN) {
  console.log('Would create user:', userData.id);
  continue;
}
```

#### Step 3: Run the migration
```bash
cd server
node scripts/migrateMpMemberData.js
```

#### Step 4: Verify the results
```bash
# Connect to your database and check
mysql -u your_user -p your_database

# Run verification queries
SELECT COUNT(*) FROM users WHERE JSON_EXTRACT(account_info, '$.old_user_id') IS NOT NULL;
SELECT account_status, COUNT(*) FROM users GROUP BY account_status;
```

#### Step 5: Rollback if needed
```bash
# If something goes wrong
node scripts/migrateMpMemberData.js rollback
```

### Method 2: SQL Script

For direct database migration without Node.js.

#### Step 1: Import the old data
If `mp_member` is in a different database:
```sql
-- Create a temporary table
CREATE TABLE mp_member LIKE old_database.mp_member;
INSERT INTO mp_member SELECT * FROM old_database.mp_member;
```

#### Step 2: Run the migration SQL
```bash
mysql -u your_user -p your_database < server/migrations/migrate_mp_member_to_users.sql
```

**⚠️ WARNING**: This method creates passwords with a temporary prefix. You MUST:
1. Force all users to reset passwords
2. Update passwords to proper bcrypt hashes

## Post-Migration Tasks

### 1. Verify Data Integrity

```sql
-- Check for missing required fields
SELECT id, name, phone_number, account_status 
FROM users 
WHERE phone_number IS NULL OR phone_number = '';

-- Check for duplicate phone numbers
SELECT phone_number, COUNT(*) as count
FROM users
GROUP BY phone_number
HAVING count > 1;

-- Verify user counts by status
SELECT account_status, COUNT(*) as count
FROM users
GROUP BY account_status;

-- Check plan distribution
SELECT plan_id, COUNT(*) as count
FROM users
GROUP BY plan_id;
```

### 2. Handle Passwords

All migrated users need to reset their passwords since the old passwords cannot be migrated securely.

#### Option A: Force password reset on login
This is already set in the migration script via `account_info.requires_password_reset = true`

Update your login controller to check this flag:
```javascript
// In authController.js login function
if (user.account_info?.requires_password_reset) {
  // Send password reset email
  // Or redirect to password reset page
  return res.status(200).json({
    message: 'Password reset required',
    requires_reset: true,
    user_id: user.id
  });
}
```

#### Option B: Send bulk password reset emails
```javascript
// Create a script to send reset emails
const nodemailer = require('nodemailer');
const { User } = require('./models');

async function sendPasswordResetEmails() {
  const users = await User.findAll({
    where: {
      'account_info.requires_password_reset': true,
      email: { [Op.ne]: null }
    }
  });

  for (const user of users) {
    // Generate reset token
    // Send email with reset link
    console.log(`Sending reset email to ${user.email}`);
  }
}
```

### 3. Migrate Additional Data

If you have related tables (profiles, photos, etc.), create similar migration scripts:

```javascript
// Example: Migrate profile photos
async function migratePhotos() {
  const photos = await sequelize.query(
    'SELECT * FROM old_photos_table',
    { type: QueryTypes.SELECT }
  );

  for (const photo of photos) {
    // Map old user_id to new custom_id
    const mapping = await getUserIdMapping(photo.old_user_id);
    // Create photo record with new user_id
  }
}
```

### 4. Update References

If other tables reference the old `user_id`, create a mapping table:

```sql
-- Create permanent mapping table
CREATE TABLE user_id_mapping (
  old_user_id INT,
  new_user_id VARCHAR(20),
  phone_number VARCHAR(20),
  migration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (old_user_id),
  INDEX idx_new_id (new_user_id)
);

INSERT INTO user_id_mapping (old_user_id, new_user_id, phone_number)
SELECT user_id, custom_id, mobile 
FROM mp_member 
WHERE custom_id IS NOT NULL;
```

## Troubleshooting

### Issue: Duplicate phone numbers
```sql
-- Find duplicates
SELECT phone_number, GROUP_CONCAT(id) as user_ids
FROM users
GROUP BY phone_number
HAVING COUNT(*) > 1;

-- Resolve by appending suffix to duplicates
UPDATE users 
SET phone_number = CONCAT(phone_number, '_dup_', id)
WHERE id IN (SELECT id FROM duplicates);
```

### Issue: Invalid email formats
```sql
-- Find invalid emails
SELECT id, email 
FROM users 
WHERE email IS NOT NULL 
  AND email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- Set to NULL
UPDATE users 
SET email = NULL 
WHERE email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
```

### Issue: Migration script fails midway
```javascript
// Add transaction support to the script
const transaction = await sequelize.transaction();

try {
  // Migration code here
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

## Testing Checklist

- [ ] Database backup created
- [ ] Migration script reviewed
- [ ] Dry run completed successfully
- [ ] User counts match (old vs new)
- [ ] All required fields populated
- [ ] No duplicate phone numbers
- [ ] Account statuses correctly mapped
- [ ] Plan information preserved
- [ ] Old data preserved in account_info JSON
- [ ] Password reset mechanism in place
- [ ] Login tested with migrated user
- [ ] Email notifications configured

## Rollback Procedure

If you need to undo the migration:

### Using Node.js script:
```bash
node scripts/migrateMpMemberData.js rollback
```

### Using SQL:
```sql
-- Delete all migrated users
DELETE FROM users 
WHERE JSON_EXTRACT(account_info, '$.old_user_id') IS NOT NULL;

-- Restore from backup
mysql -u your_user -p your_database < backup_YYYYMMDD.sql
```

## Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [bcrypt.js Documentation](https://github.com/dcodeIO/bcrypt.js)
- [MySQL JSON Functions](https://dev.mysql.com/doc/refman/8.0/en/json-functions.html)

## Support

If you encounter issues:
1. Check the error logs in `server/logs/`
2. Review the migration summary output
3. Verify database connection settings
4. Ensure all dependencies are installed

---

**Last Updated**: December 2025
