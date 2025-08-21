const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'chess.db'));

try {
  const info = db.prepare('DELETE FROM pgns').run();
  console.log(`Deleted ${info.changes} PGN(s) from the database.`);
} catch (error) {
  console.error('Error deleting PGNs:', error);
}

db.close(); 