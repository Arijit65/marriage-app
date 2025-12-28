#!/bin/bash

# Migration Helper Script for Cloud Server
# This script helps you import the old data and run the migration

DB_USER=${1:-root}
DB_PASSWORD=${2:-}
DB_NAME=${3:-myappdb}
SQL_FILE=${4:-./mp_member.sql}

echo "=================================================="
echo "🚀 Data Migration Helper for Cloud Server"
echo "=================================================="
echo ""
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "SQL File: $SQL_FILE"
echo ""

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Error: SQL file not found at $SQL_FILE"
    echo ""
    echo "Usage: ./migrate.sh [db_user] [db_password] [db_name] [sql_file]"
    echo "Example: ./migrate.sh root password123 myappdb /path/to/mp_member.sql"
    exit 1
fi

# Step 1: Import the SQL file
echo "Step 1: Importing old data..."
echo "=================================================="

if [ -z "$DB_PASSWORD" ]; then
    # No password
    mysql -u "$DB_USER" "$DB_NAME" < "$SQL_FILE"
else
    # With password
    mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$SQL_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✅ SQL import completed"
    echo ""
else
    echo "❌ SQL import failed"
    exit 1
fi

# Step 2: Verify the table exists
echo "Step 2: Verifying mp_member table..."
echo "=================================================="

if [ -z "$DB_PASSWORD" ]; then
    RECORD_COUNT=$(mysql -u "$DB_USER" "$DB_NAME" -se "SELECT COUNT(*) FROM mp_member;")
else
    RECORD_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -se "SELECT COUNT(*) FROM mp_member;")
fi

if [ $? -eq 0 ]; then
    echo "✅ Table verified with $RECORD_COUNT records"
    echo ""
else
    echo "❌ Failed to verify table"
    exit 1
fi

# Step 3: Run the migration
echo "Step 3: Running Node.js migration script..."
echo "=================================================="
node scripts/migrateMpMemberData.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
else
    echo ""
    echo "❌ Migration script failed"
    exit 1
fi

echo ""
echo "=================================================="
echo "✨ All steps completed!"
echo "=================================================="
