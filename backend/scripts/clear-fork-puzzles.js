const db = require('../db');

function clearPuzzles() {
  try {
    db.prepare('DELETE FROM fork_puzzles').run();
    console.log('Successfully cleared the fork_puzzles table.');
  } catch (error) {
    console.error('Failed to clear fork_puzzles table:', error);
  }
}

clearPuzzles(); 