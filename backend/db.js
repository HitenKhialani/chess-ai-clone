const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'chess.db');
const db = new Database(dbPath);
console.log(`Database opened: ${dbPath}`);

// Initialize the database with the schema
function initializeDB() {
  console.log('Initializing database schema...');
  
  const scripts = [
    path.join(__dirname, 'scripts', 'create-pgn-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-pin-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-fork-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-tactics-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-endgame-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-random-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-grandmaster-games-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-games-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-puzzles-table.sql'),
    path.join(__dirname, 'scripts', 'create-user-time-log-table.sql'),
    path.join(__dirname, 'scripts', 'create-simplo-chats-table.sql'),
  ];
  
  scripts.forEach((schemaPath) => {
    if (fs.existsSync(schemaPath)) {
      try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        console.log(`SQLite schema initialized: ${path.basename(schemaPath)}`);
      } catch (error) {
        console.error(`Error initializing schema ${schemaPath}:`, error);
      }
    } else {
      console.warn(`Schema file not found: ${schemaPath}`);
    }
  });

  // Ensure the main PGN puzzles table exists
  const mainSchemaPath = path.join(__dirname, 'scripts', 'create-pgn-puzzles-table.sql');
  if (fs.existsSync(mainSchemaPath)) {
    try {
      const schema = fs.readFileSync(mainSchemaPath, 'utf8');
      db.exec(schema);
      console.log('Main PGN puzzles table schema initialized');
    } catch (error) {
      console.error('Error initializing main schema:', error);
    }
  }

  console.log('Database initialization complete');
}

initializeDB();

module.exports = db; 