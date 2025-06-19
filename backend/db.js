const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'chess.db'), { verbose: console.log });

// Create pgns table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS pgns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('SQLite database initialized');

module.exports = db; 