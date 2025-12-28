# Quick Fix for Cloud Server

Since the table structure exists but has no data, use one of these methods to load the data:

## Method 1: Direct MySQL Import (Fastest & Most Reliable)

```bash
# SSH into your cloud server
ssh root@your_server_ip
cd /var/www/marriage-app/server

# Import the data directly - this bypasses Node.js parsing issues
mysql -u root -p myappdb < mp_member.sql

# Verify
mysql -u root -p myappdb -e "SELECT COUNT(*) FROM mp_member;"
```

If that doesn't work (if data still shows 0), try:

```bash
# Drop the empty table first
mysql -u root -p myappdb -e "DROP TABLE IF EXISTS mp_member;"

# Then reimport
mysql -u root -p myappdb < mp_member.sql

# Verify
mysql -u root -p myappdb -e "SELECT COUNT(*) FROM mp_member;"
```

## Method 2: Using Node.js Direct Importer

If MySQL command isn't available:

```bash
cd /var/www/marriage-app/server

# Try the improved Node.js importer
node scripts/importDirectly.js mp_member.sql

# Or the data loader
node scripts/loadData.js mp_member.sql
```

## Method 3: Check What's Actually in Your SQL File

```bash
# See how many INSERT statements are in the file
grep -c "INSERT INTO" mp_member.sql

# See the first INSERT statement
grep "INSERT INTO" mp_member.sql | head -1

# Check file size
ls -lh mp_member.sql
```

## Once Data is Loaded

```bash
# Run the migration
node scripts/migrateMpMemberData.js

# Verify migration worked
mysql -u root -p myappdb -e "SELECT COUNT(*) FROM users WHERE JSON_EXTRACT(account_info, '$.old_user_id') IS NOT NULL;"
```

## Troubleshooting

### If still getting 0 records after import:

```bash
# Check if table structure is correct
mysql -u root -p myappdb -e "DESCRIBE mp_member;"

# Check table existence
mysql -u root -p myappdb -e "SHOW TABLES LIKE 'mp_member';"

# Check for any data (including checking specific columns)
mysql -u root -p myappdb -e "SELECT * FROM mp_member LIMIT 1\G"
```

### The issue might be:
1. **SQL file doesn't contain INSERT statements** - check with `grep "INSERT INTO" mp_member.sql`
2. **SQL file format is incompatible** - try exporting again from source database
3. **Parser skipping INSERT statements** - use direct MySQL import instead

## Recommended Action

Run this command on your cloud server:

```bash
cd /var/www/marriage-app/server
mysql -u root -p myappdb < mp_member.sql
echo "Import complete. Checking records..."
mysql -u root -p myappdb -e "SELECT COUNT(*) as 'Total Records' FROM mp_member;"
```

If that shows a count > 0, then run:

```bash
node scripts/migrateMpMemberData.js
```

