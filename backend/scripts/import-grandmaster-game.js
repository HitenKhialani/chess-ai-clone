const fs = require('fs');
const path = require('path');
const db = require('../db');
const { sanitizePGN, extractPGNMetadata } = require('../utils/pgnSanitizer');

const pgnFile = path.resolve(__dirname, '..', '..', 'anand_game_final.pgn');

console.log('Looking for PGN file at:', pgnFile);
if (!fs.existsSync(pgnFile)) {
  console.error('PGN file not found:', pgnFile);
  process.exit(1);
}
const rawPGN = fs.readFileSync(pgnFile, 'utf8');
let sanitized;
try {
  sanitized = sanitizePGN(rawPGN);
} catch (err) {
  console.error('Failed to sanitize PGN:', err.message);
  process.exit(1);
}
const metadata = extractPGNMetadata(sanitized);
const stmt = db.prepare(`INSERT INTO grandmaster_games (event, site, date, round, white, black, result, eco, opening, pgn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const result = stmt.run(
  metadata.event || null,
  metadata.site || null,
  metadata.date || null,
  metadata.round || null,
  metadata.white || null,
  metadata.black || null,
  metadata.result || null,
  metadata.eco || null,
  metadata.opening || null,
  sanitized
);
console.log('Inserted game with ID:', result.lastInsertRowid);

importGrandmasterGame(); 