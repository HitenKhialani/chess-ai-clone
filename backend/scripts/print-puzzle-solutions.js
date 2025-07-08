const db = require('../db');

const rows = db.prepare('SELECT * FROM puzzle_solutions').all();
console.log('puzzle_solutions table:');
rows.forEach(row => {
  console.log(row.puzzle_id, ':', row.solution_moves);
}); 