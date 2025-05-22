/**
 * Script to set up the database tables and sample data for the Faculty Dashboard
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  console.log('Setting up database for Faculty Dashboard...');
  
  // Create connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'lucky',
    password: process.env.DB_PASSWORD || '#Db@1234',
    database: process.env.DB_NAME || 'reporting_system',
    multipleStatements: true // Allow multiple SQL statements
  });
  
  try {
    // Read SQL script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'setup_faculty_dashboard.sql'),
      'utf8'
    );
    
    console.log('Executing SQL script...');
    
    // Execute SQL script
    await connection.query(sqlScript);
    
    console.log('✅ Database setup completed successfully!');
    
    // Check tables and counts
    const tables = ['faculty_student_mapping', 'student_summary', 'certifications', 'attendance', 'achievements'];
    
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`Table ${table}: ${rows[0].count} records`);
    }
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

// Run the setup
setupDatabase().catch(console.error);