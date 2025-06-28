const db = require('../db');
const fs = require('fs');
const path = require('path');

try {
  // Drop the pgn_puzzles table if it exists
  db.exec('DROP TABLE IF EXISTS pgn_puzzles');
  
  // Recreate the empty pgn_puzzles table with the same schema
  const createTableSQL = fs.readFileSync(path.join(__dirname, 'create-pgn-puzzles-table.sql'), 'utf8');
  db.exec(createTableSQL);

  console.log('Successfully cleared all PGN puzzles from the database.');

  db.prepare('DELETE FROM pgn_puzzles').run();
  console.log('Deleted puzzles from pgn_puzzles table.');
} catch (error) {
  console.error('Error clearing PGN puzzles:', error);
  process.exit(1);
} 