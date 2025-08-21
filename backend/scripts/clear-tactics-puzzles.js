const db = require('../db');

function clearPuzzles() {
  try {
    db.prepare('DELETE FROM tactics_puzzles').run();
    console.log('Successfully cleared the tactics_puzzles table.');
  } catch (error) {
    console.error('Failed to clear tactics_puzzles table:', error);
  }
}

clearPuzzles(); 