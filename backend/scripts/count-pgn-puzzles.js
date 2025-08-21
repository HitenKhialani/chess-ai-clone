const db = require('../db');
const row = db.prepare('SELECT COUNT(*) as count FROM pgn_puzzles').get();
console.log('Number of puzzles in pgn_puzzles:', row.count); 