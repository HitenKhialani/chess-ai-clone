const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'chess.db');
const db = new Database(dbPath);
console.log(`Database opened: ${dbPath}`);

// Initialize the database with the schema
function initializeDB() {

  const scripts = [
    path.join(__dirname, 'scripts', 'create-pgn-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-grandmaster-games-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-games-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-time-log-table.sql'),
  ];
  scripts.forEach((schemaPath) => {
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema);
      console.log(`SQLite schema initialized: ${schemaPath}`);
    }
  });

  const schemaPath = path.join(__dirname, 'scripts', 'create-pgn-puzzles-table.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('SQLite database initialized');
  }

}

initializeDB();

module.exports = db; 