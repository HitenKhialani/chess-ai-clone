const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'chess.db'), { verbose: console.log });

const getPgnContent = (name) => {
  try {
    const stmt = db.prepare('SELECT content FROM pgns WHERE name = ?');
    const result = stmt.get(name);
    if (result) {
      console.log(`PGN content for ${name}:`);
      console.log(result.content);
    } else {
      console.log(`No PGN found with name: ${name}`);
    }
  } catch (error) {
    console.error('Error fetching PGN content:', error);
  }
};

getPgnContent('Caruana');
db.close(); 