const fs = require('fs');
const csv = require('csv-parse');
const path = require('path');
const db = require('../db');

// Create puzzles table
const createTableSQL = fs.readFileSync(path.join(__dirname, 'create-puzzle-table.sql'), 'utf8');
db.exec(createTableSQL);

// Prepare the insert statement
const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO puzzles (puzzle_id, fen, moves, rating, themes)
  VALUES (?, ?, ?, ?, ?)
`);

// Read and parse CSV file
const parser = csv.parse({
  columns: true,
  skip_empty_lines: true
});

const inputFile = path.join(__dirname, '../../lichess_db_puzzle.csv');
const fileStream = fs.createReadStream(inputFile);

let count = 0;
fileStream.pipe(parser)
  .on('data', (row) => {
    try {
      insertStmt.run(
        row.PuzzleId,
        row.FEN,
        row.Moves,
        parseInt(row.Rating) || null,
        row.Themes || null
      );
      count++;
      if (count % 100 === 0) {
        console.log(`Imported ${count} puzzles...`);
      }
    } catch (err) {
      console.error(`Error importing puzzle ${row.PuzzleId}:`, err);
    }
  })
  .on('end', () => {
    console.log(`Import complete! Total puzzles imported: ${count}`);
    // Create an index on rating for faster queries
    db.exec('CREATE INDEX IF NOT EXISTS idx_puzzles_rating ON puzzles(rating);');
  })
  .on('error', (err) => {
    console.error('Error parsing CSV:', err);
  }); 