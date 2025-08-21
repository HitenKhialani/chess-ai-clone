const db = require('../db');

function clearPuzzles() {
  try {
    db.prepare('DELETE FROM random_puzzles').run();
    console.log('Successfully cleared the random_puzzles table.');
  } catch (error) {
    console.error('Failed to clear random_puzzles table:', error);
  }
}

clearPuzzles(); 