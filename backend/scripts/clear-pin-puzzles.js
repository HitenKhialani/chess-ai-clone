const db = require('../db');
const fs = require('fs');
const path = require('path');

try {
  // Drop the pin_puzzles table if it exists
  db.exec('DROP TABLE IF EXISTS pin_puzzles');
  
  // Recreate the empty pin_puzzles table with the same schema
  const createTableSQL = fs.readFileSync(path.join(__dirname, 'create-pin-puzzles-table.sql'), 'utf8');
  db.exec(createTableSQL);

  console.log('Successfully cleared all pin puzzles from the database.');

} catch (error) {
  console.error('Error clearing pin puzzles:', error);
  process.exit(1);
} 