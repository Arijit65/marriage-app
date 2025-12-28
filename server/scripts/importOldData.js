/**
 * Step 1: Import Old Database Data
 * 
 * This script imports the mp_member data from your SQL dump file
 * into the database for migration.
 * 
 * Usage: node scripts/importOldData.js <path-to-sql-file>
 */

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

/**
 * Split SQL file into individual statements
 * Handles multi-line statements and comments correctly
 */
function splitSqlStatements(sqlContent) {
  const statements = [];
  
  // First, extract CREATE TABLE statement
  const createTableMatch = sqlContent.match(/CREATE TABLE[^;]+;/is);
  if (createTableMatch) {
    statements.push(createTableMatch[0].replace(/;$/, ''));
  }

  // Extract all INSERT INTO statements (including multi-row values)
  const insertMatches = sqlContent.matchAll(/INSERT INTO\s+`?mp_member`?[^;]*VALUES[^;]*;/gis);
  for (const match of insertMatches) {
    const fullInsert = match[0];
    statements.push(fullInsert.replace(/;$/, ''));
  }

  // Extract any ALTER TABLE statements
  const alterMatches = sqlContent.matchAll(/ALTER TABLE[^;]+;/gis);
  for (const match of alterMatches) {
    statements.push(match[0].replace(/;$/, ''));
  }

  return statements;
}

/**
 * Execute SQL statements
 */
async function importSqlFile(filePath) {
  console.log('📥 Importing old database data...\n');

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`Reading file: ${filePath}`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');

    // Parse SQL statements
    const statements = splitSqlStatements(sqlContent);
    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Log statement types for debugging
    let statementTypes = {
      CREATE: 0,
      INSERT: 0,
      ALTER: 0,
      OTHER: 0
    };

    for (const stmt of statements) {
      const trimmed = stmt.trim().toUpperCase();
      if (trimmed.startsWith('CREATE')) statementTypes.CREATE++;
      else if (trimmed.startsWith('INSERT')) statementTypes.INSERT++;
      else if (trimmed.startsWith('ALTER')) statementTypes.ALTER++;
      else statementTypes.OTHER++;
    }

    console.log('Statement breakdown:');
    console.log(`  CREATE: ${statementTypes.CREATE}`);
    console.log(`  INSERT: ${statementTypes.INSERT}`);
    console.log(`  ALTER: ${statementTypes.ALTER}`);
    console.log(`  OTHER: ${statementTypes.OTHER}\n`);

    let executed = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails = [];

    // Execute statements one by one
    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i].trim();

      // Skip certain statements
      if (statement.startsWith('SET ') || 
          statement.startsWith('START TRANSACTION') || 
          statement.startsWith('COMMIT') ||
          statement.startsWith('USE ')) {
        skipped++;
        continue;
      }

      try {
        // For INSERT statements, replace invalid dates with NULL
        if (statement.toUpperCase().startsWith('INSERT')) {
          // Replace '0000-00-00 00:00:00' with NULL
          statement = statement.replace(/'0000-00-00 00:00:00'/g, 'NULL');
          // Replace '0000-00-00' with NULL
          statement = statement.replace(/'0000-00-00'/g, 'NULL');
        }

        const result = await sequelize.query(statement, { type: QueryTypes.RAW });
        executed++;

        if (executed % 50 === 0) {
          console.log(`✅ Executed ${executed} statements...`);
        }
      } catch (error) {
        // Check if this is a "table already exists" error (expected for CREATE TABLE)
        if (error.original?.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.message.includes('already exists')) {
          skipped++;
          continue;
        }

        errors++;
        
        // Log detailed error information
        const stmtPreview = statement.substring(0, 80).replace(/\n/g, ' ');
        const errorMsg = error.original?.message || error.message;
        
        if (errorDetails.length < 15) {
          errorDetails.push({
            stmt: stmtPreview,
            error: errorMsg.substring(0, 200)
          });
        }

        // Log INSERT errors immediately for debugging
        if (statement.toUpperCase().startsWith('INSERT')) {
          console.log(`\n⚠️  INSERT Error (statement ${i + 1}):`);
          console.log(`    Statement: ${stmtPreview}...`);
          console.log(`    Error: ${errorMsg}`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total statements found: ${statements.length}`);
    console.log(`Successfully executed: ${executed}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('='.repeat(60) + '\n');

    // Show error details if any
    if (errorDetails.length > 0) {
      console.log('❌ All errors:');
      errorDetails.forEach((err, idx) => {
        console.log(`\n${idx + 1}. Statement: ${err.stmt}...`);
        console.log(`   Error: ${err.error}`);
      });
      console.log('');
    }

    // Verify the data
    try {
      const countResult = await sequelize.query(
        'SELECT COUNT(*) as count FROM mp_member',
        { type: QueryTypes.SELECT }
      );

      const count = countResult[0].count;
      console.log(`\n✅ Verification: Found ${count} records in mp_member table\n`);

      if (count === 0) {
        console.log('⚠️  WARNING: No records found in mp_member table!');
        console.log('   The table was created but INSERT statements may have failed.');
        console.log('   Check the errors above.\n');
      }

      return count;
    } catch (err) {
      console.log('⚠️  Could not verify - mp_member table may not exist');
      return 0;
    }

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  }
}

// Run import
if (require.main === module) {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('❌ Error: Please provide the SQL file path');
    console.log('\nUsage:');
    console.log('  node scripts/importOldData.js <path-to-sql-file>');
    console.log('\nExample:');
    console.log('  node scripts/importOldData.js "C:\\Users\\ariji\\Downloads\\mp_member.sql"');
    console.log('  node scripts/importOldData.js /var/www/marriage-app/server/mp_member.sql\n');
    process.exit(1);
  }

  importSqlFile(filePath)
    .then((count) => {
      if (count > 0) {
        console.log('🚀 Next step: Run the migration script');
        console.log('   node scripts/migrateMpMemberData.js\n');
        process.exit(0);
      } else {
        console.log('❌ No data to migrate');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('❌ Import failed:', err);
      process.exit(1);
    });
}

module.exports = { importSqlFile };
