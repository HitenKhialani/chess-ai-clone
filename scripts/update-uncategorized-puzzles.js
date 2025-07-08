const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../backend/chess.db');
const db = new Database(dbPath);

const result = db.prepare("UPDATE user_puzzles SET category = 'Mate in 1' WHERE category IS NULL OR category = '';").run();
console.log(`Updated ${result.changes} rows to category 'Mate in 1'.`);

db.close(); 