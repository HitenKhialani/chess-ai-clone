const db = require('../db');

try {
  // Drop the puzzles table if it exists
  db.exec('DROP TABLE IF EXISTS puzzles');
  
  // Recreate the empty puzzles table with the same schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS puzzles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      puzzle_id TEXT NOT NULL UNIQUE,
      fen TEXT NOT NULL,
      moves TEXT NOT NULL,
      rating INTEGER,
      themes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Successfully cleared all puzzles from the database.');
} catch (error) {
  console.error('Error clearing puzzles:', error);
  process.exit(1);
} 