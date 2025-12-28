# Quick Migration Steps

Since you have the `mp_member.sql` file downloaded, here's the quickest way to migrate:

## Step 1: Import the Old Data

### Option A: Using MySQL Command Line (Recommended - Fastest)
```powershell
# Navigate to where your SQL file is
cd "C:\Users\ariji\Downloads"

# Import the data (replace with your actual database credentials)
mysql -u root -p marriage_app < mp_member.sql

# Or if you have the full path
mysql -u root -p marriage_app < "C:\Users\ariji\Downloads\mp_member.sql"
```

### Option B: Using Node.js Script
```powershell
cd "C:\Users\ariji\OneDrive\Desktop\MY APPS\WORK APPS\marriage app\server"

node scripts/importOldData.js "C:\Users\ariji\Downloads\mp_member.sql"
```

### Option C: Using MySQL Workbench / phpMyAdmin
1. Open MySQL Workbench or phpMyAdmin
2. Select your database
3. Go to Import/SQL tab
4. Choose the file: `C:\Users\ariji\Downloads\mp_member.sql`
5. Click "Execute" or "Import"

## Step 2: Verify the Import
```powershell
# Connect to MySQL
mysql -u root -p marriage_app

# Check if table exists
SHOW TABLES LIKE 'mp_member';

# Check record count
SELECT COUNT(*) FROM mp_member;

# Exit
exit;
```

## Step 3: Run the Migration
```powershell
cd "C:\Users\ariji\OneDrive\Desktop\MY APPS\WORK APPS\marriage app\server"

node scripts/migrateMpMemberData.js
```

## Troubleshooting

### Error: "Access denied for user"
Update your database credentials in `server/config/config.js`

### Error: "Unknown database"
Create the database first:
```sql
CREATE DATABASE IF NOT EXISTS marriage_app;
```

### Error: "Table already exists"
Drop the old table if reimporting:
```sql
DROP TABLE IF EXISTS mp_member;
```

## Quick One-Liner (PowerShell)

```powershell
# Import and migrate in one go
mysql -u root -p marriage_app < "C:\Users\ariji\Downloads\mp_member.sql"; node scripts/migrateMpMemberData.js
```

## What's Happening?

1. **Import**: Creates `mp_member` table in your current database with old data
2. **Migration**: Reads from `mp_member`, transforms data, inserts into `users` table
3. **Result**: You'll have both tables (you can drop `mp_member` after verification)
