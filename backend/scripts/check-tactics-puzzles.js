const db = require('../db');

function checkPuzzles() {
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM tactics_puzzles').get().count;
    console.log(`Found ${count} puzzles in the tactics_puzzles table.`);

    if (count > 0) {
      const puzzles = db.prepare('SELECT * FROM tactics_puzzles LIMIT 5').all();
      console.log('Here are the first 5 puzzles:');
      console.log(puzzles);
    }
  } catch (error) {
    console.error('Failed to check tactics puzzles:', error);
  }
}

checkPuzzles(); 