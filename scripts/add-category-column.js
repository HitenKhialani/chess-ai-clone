const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../backend/chess.db');
const db = new Database(dbPath);

// Check if the column already exists
const pragma = db.prepare("PRAGMA table_info(user_puzzles);").all();
const hasCategory = pragma.some(col => col.name === 'category');

if (!hasCategory) {
  db.prepare('ALTER TABLE user_puzzles ADD COLUMN category TEXT;').run();
  console.log("Added 'category' column to user_puzzles table.");
} else {
  console.log("'category' column already exists in user_puzzles table.");
}

db.close(); 