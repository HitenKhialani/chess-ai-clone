const fs = require('fs');
const path = require('path');
const db = require('../db');

// Create the table if it doesn't exist
const createTableSQL = fs.readFileSync(path.join(__dirname, 'create-pgn-puzzles-table.sql'), 'utf8');
db.exec(createTableSQL);

// Accept PGN filename as a command-line argument, default to creative_7_puzzles.pgn
const inputFile = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(__dirname, '../../creative_7_puzzles.pgn');
const pgnText = fs.readFileSync(inputFile, 'utf8');

// Split PGN into individual puzzles by [Event ...]
const puzzleBlocks = pgnText.split(/\n\s*\[Event /).filter(Boolean).map((block, i) => (i === 0 && block.startsWith('[Event') ? block : '[Event ' + block));

let count = 0;

for (const block of puzzleBlocks) {
  const fen = block.match(/\[FEN "([^"]+)"\]/)?.[1] || '';
  const themes = 'Mate in 1'; // Set theme for mate-in-1 puzzles
  const rating = 800; // Set a default rating for mate-in-1 puzzles
  const source = block.match(/\[Site "([^"]+)"\]/)?.[1] || '';
  // Moves: find the first non-header, non-empty line after the headers
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const firstMoveLineIdx = lines.findIndex(line => !line.startsWith('[') && line !== '');
  const moveLine = firstMoveLineIdx !== -1 ? lines[firstMoveLineIdx] : '';
  if (fen && moveLine) {
    const moves = moveLine.replace(/\d+\./g, '').replace(/\s+/g, ' ').replace(/\*$/, '').trim();
    db.prepare(`INSERT INTO pgn_puzzles (fen, moves, themes, rating, source) VALUES (?, ?, ?, ?, ?)`)
      .run(fen, moves, themes, rating || null, source);
    count++;
  }
}

console.log(`Imported ${count} mate-in-1 puzzles from PGN.`); 