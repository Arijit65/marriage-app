# Cloud Server Migration Instructions

Since you're running on a cloud server (appears to be Linux), here's how to properly migrate your data:

## Step 1: Upload the SQL File to Your Cloud Server

### Using SCP (if you have SSH access):
```bash
# From your local machine
scp C:\Users\ariji\Downloads\mp_member.sql your_user@your_server.com:/var/www/marriage-app/server/

# Example:
scp C:\Users\ariji\Downloads\mp_member.sql root@192.168.1.100:/var/www/marriage-app/server/
```

### Or using SFTP:
```bash
# Connect to your server
sftp your_user@your_server.com

# Navigate to the directory
cd /var/www/marriage-app/server/

# Upload the file
put C:\Users\ariji\Downloads\mp_member.sql
```

## Step 2: SSH into Your Cloud Server

```bash
# Connect to your server
ssh your_user@your_server.com

# Or if using IP
ssh root@192.168.1.100
```

## Step 3: Import the Data

### Option A: Direct MySQL Import (Fastest)
```bash
# Navigate to your project directory
cd /var/www/marriage-app/server

# Import the SQL file
mysql -u root -p myappdb < mp_member.sql

# Enter your database password when prompted
```

### Option B: Using the Shell Script
```bash
# Make script executable
chmod +x migrate.sh

# Run the migration script
./migrate.sh root your_db_password myappdb mp_member.sql

# Or simpler (if no password):
./migrate.sh root "" myappdb mp_member.sql
```

## Step 4: Verify the Import

```bash
# Check how many records were imported
mysql -u root -p myappdb -e "SELECT COUNT(*) FROM mp_member;"

# You should see: 11819 (or similar number based on your data)
```

## Step 5: Run the Node.js Migration

```bash
# Still in /var/www/marriage-app/server directory

# Run the migration script
node scripts/migrateMpMemberData.js

# This will:
# 1. Read from mp_member table
# 2. Transform the data
# 3. Insert into users table
# 4. Show you a summary report
```

## Step 6: Verify Migration Results

```bash
# Check total migrated users
mysql -u root -p myappdb -e "SELECT COUNT(*) FROM users WHERE JSON_EXTRACT(account_info, '$.old_user_id') IS NOT NULL;"

# Check user distribution by status
mysql -u root -p myappdb -e "SELECT account_status, COUNT(*) as count FROM users GROUP BY account_status;"

# Check for any issues
mysql -u root -p myappdb -e "SELECT id, email, phone_number FROM users WHERE phone_number IS NULL LIMIT 10;"
```

## Troubleshooting

### Error: "Access denied for user"
```bash
# Check your MySQL credentials
mysql -u root -p -e "SELECT 1;"

# Update credentials in /var/www/marriage-app/server/config/config.js if needed
```

### Error: "Can't find file"
```bash
# Check if the SQL file is in the correct location
ls -la /var/www/marriage-app/server/mp_member.sql

# If not found, upload it first using SCP/SFTP
```

### Error: "No such file or directory" (for migrate.sh)
```bash
# Make sure you're in the right directory
pwd
# Should show: /var/www/marriage-app/server

# If not, navigate there
cd /var/www/marriage-app/server

# Then try again
./migrate.sh
```

### Need to Rollback?
```bash
# Delete all migrated users (only if migration went wrong)
node scripts/migrateMpMemberData.js rollback
```

## Complete One-Line Command

If everything is set up correctly, you can run the entire migration with:

```bash
cd /var/www/marriage-app/server && \
mysql -u root -p myappdb < mp_member.sql && \
node scripts/migrateMpMemberData.js
```

## Common Issues on Cloud Servers

### 1. MySQL Connection Issues
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Or
sudo service mysql status

# Start MySQL if needed
sudo systemctl start mysql
```

### 2. Node.js Not Found
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using package manager
sudo apt-get install nodejs npm
```

### 3. Permission Issues
```bash
# Fix file permissions
chmod +x migrate.sh
chmod 644 mp_member.sql

# If needed, fix directory permissions
sudo chown -R your_user:your_user /var/www/marriage-app/server
```

## Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify the SQL file exists and is readable
3. Check database connection settings in `config/config.js`
4. Ensure MySQL and Node.js are installed
5. Check file permissions with `ls -la`

---

**Last Updated**: December 2025
