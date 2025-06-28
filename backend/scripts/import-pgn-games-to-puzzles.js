const fs = require('fs');
const path = require('path');
const db = require('../db');

if (process.argv.length < 3) {
  console.error('Usage: node import-pgn-games-to-puzzles.js <pgn_file>');
  process.exit(1);
}

const pgnFile = process.argv[2];
const pgnPath = path.resolve(process.cwd(), pgnFile);

if (!fs.existsSync(pgnPath)) {
  console.error('PGN file not found:', pgnPath);
  process.exit(1);
}

const pgnText = fs.readFileSync(pgnPath, 'utf8');

// Split by [Event ...] which always starts a new puzzle
db.prepare('CREATE TABLE IF NOT EXISTS pgn_puzzles (id INTEGER PRIMARY KEY AUTOINCREMENT, fen TEXT, moves TEXT)').run();
const games = pgnText.split(/\[Event /).filter(Boolean).map(g => "[Event " + g.trim());
let imported = 0;

games.forEach(game => {
  // Extract FEN
  const fenMatch = game.match(/\[FEN "([^"]+)"\]/);
  const fen = fenMatch ? fenMatch[1] : null;
  // Extract moves (after the last header line)
  const movesSection = game.split(/\n\n/).pop() || '';
  const movesLines = movesSection
    .split('\n')
    .filter(line => line && !line.startsWith('['))
    .join(' ')
    .replace(/\d+\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const moves = movesLines.split(' ').filter(m => m && !['1-0', '0-1', '1/2-1/2'].includes(m));
  if (fen && moves.length > 0) {
    db.prepare('INSERT INTO pgn_puzzles (fen, moves) VALUES (?, ?)').run(fen, moves.join(' '));
    imported++;
  }
});

console.log(`Imported ${imported} puzzles from ${pgnFile}`); 