const fs = require('fs');
const path = require('path');
const db = require('../db');

// Create the table if it doesn't exist
const createTableSQL = fs.readFileSync(path.join(__dirname, 'create-random-puzzles-table.sql'), 'utf8');
db.exec(createTableSQL);

// Accept PGN filename as a command-line argument, default to random.pgn
const inputFile = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(__dirname, '../../random.pgn');
const pgnText = fs.readFileSync(inputFile, 'utf8');

// Split PGN into individual puzzles by [SetUp "1"]
const puzzleBlocks = pgnText.split(/\[SetUp "1"\]/).filter(block => block.trim().length > 0);

let count = 0;

for (const block of puzzleBlocks) {
  const fenMatch = block.match(/\[FEN "([^"]+)"\]/);
  const fen = fenMatch ? fenMatch[1] : null;

  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const firstMoveLineIdx = lines.findIndex(line => line.match(/^\d+\./));
  const moveLine = firstMoveLineIdx !== -1 ? lines[firstMoveLineIdx] : '';

  if (fen && moveLine) {
    const moves = moveLine.replace(/\d+\.\s*/g, '').replace(/\s*1-0\s*/, '').trim();
    db.prepare(`INSERT INTO random_puzzles (fen, moves) VALUES (?, ?)`)
      .run(fen, moves);
    count++;
  }
}

console.log(`Imported ${count} random puzzles from PGN.`); 