const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Chess } = require('chess.js');
const pgnParser = require('@mliebelt/pgn-parser');
const { sanitizePGN } = require('./utils/pgnSanitizer');

const pgnFiles = [
  '10_gm_games.pgn',
];

function splitPgnIntoGames(pgnContent) {
  // Split on [Event, but keep the delimiter
  const games = pgnContent.split(/(?=\[Event )/g).map(g => g.trim()).filter(Boolean);
  return games;
}

function normalizePgnMoves(pgnContent) {
  // Convert all line endings to LF
  let normalized = pgnContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Remove trailing blank lines
  normalized = normalized.replace(/\n+$/g, '\n');
  // Ensure exactly one blank line between headers and moves
  const headerMoveSplit = normalized.split(/\n\n/);
  if (headerMoveSplit.length > 2) {
    normalized = headerMoveSplit[0] + '\n\n' + headerMoveSplit.slice(1).join(' ').replace(/\n/g, ' ');
  }
  // Fix move numbers: ensure '1.e4' becomes '1. e4'
  normalized = normalized.replace(/(\d+)\.(?=\S)/g, '$1. ');
  // Remove any double spaces
  normalized = normalized.replace(/  +/g, ' ');
  // Remove trailing whitespace on each line
  normalized = normalized.split('\n').map(line => line.trimEnd()).join('\n');
  return normalized;
}

function fixPgnFormat(pgnContent) {
  // Split into lines
  const lines = pgnContent.split(/\r?\n/);
  // Find the last header line (starts with [)
  let lastHeaderIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('[')) {
      lastHeaderIdx = i;
    }
  }
  // If the line after the last header is not blank, insert a blank line
  if (lastHeaderIdx !== -1 && lines[lastHeaderIdx + 1] && lines[lastHeaderIdx + 1].trim() !== '') {
    lines.splice(lastHeaderIdx + 1, 0, '');
  }
  return lines.join('\n');
}

function perfectPgnFormat(pgnContent) {
  // Convert all line endings to LF
  let normalized = pgnContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Remove leading/trailing blank lines
  normalized = normalized.replace(/^\s+|\s+$/g, '');
  // Ensure exactly one blank line between headers and moves
  const lines = normalized.split('\n');
  let lastHeaderIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('[')) lastHeaderIdx = i;
  }
  if (lastHeaderIdx !== -1 && lines[lastHeaderIdx + 1] && lines[lastHeaderIdx + 1].trim() !== '') {
    lines.splice(lastHeaderIdx + 1, 0, '');
  }
  normalized = lines.join('\n');
  // Collapse multiple blank lines to one
  normalized = normalized.replace(/\n{3,}/g, '\n\n');
  // Fix move numbers: ensure '1.e4' becomes '1. e4'
  normalized = normalized.replace(/(\d+)\.(?=\S)/g, '$1. ');
  // Collapse multiple spaces
  normalized = normalized.replace(/  +/g, ' ');
  // Remove trailing whitespace on each line
  normalized = normalized.split('\n').map(line => line.trimEnd()).join('\n');
  // Ensure result is on its own line at the end
  normalized = normalized.replace(/(1-0|0-1|1\/2-1\/2)(?!\n)/g, '$1\n');
  // Remove any extra blank lines at the end
  normalized = normalized.replace(/\n+$/g, '\n');
  return normalized.trim();
}

const importPgns = async () => {
  for (const filename of pgnFiles) {
    const filePath = path.join(__dirname, '..', filename);
    try {
      let pgnContent = fs.readFileSync(filePath, 'utf8');
      const games = splitPgnIntoGames(pgnContent);
      for (let i = 0; i < games.length; i++) {
        let gameContent = perfectPgnFormat(games[i]);
        // Sanitize and validate PGN
        let sanitized;
        try {
          sanitized = sanitizePGN(gameContent);
        } catch (err) {
          console.error(`PGN from ${filename} (game ${i + 1}) could not be sanitized and will be skipped.`, err);
          continue;
        }
        // Validate with pgn-parser first
        let parsed;
        try {
          parsed = pgnParser.parse(sanitized);
        } catch (err) {
          console.error(`Sanitized PGN from ${filename} (game ${i + 1}) failed to parse with @mliebelt/pgn-parser and will be skipped.`, err);
          continue;
        }
        if (!parsed || parsed.length === 0) {
          console.error(`Sanitized PGN from ${filename} (game ${i + 1}) failed to parse with @mliebelt/pgn-parser (no games found) and will be skipped.`);
          continue;
        }
        const chess = new Chess();
        const loaded = chess.loadPgn(sanitized);
        if (!loaded) {
          console.error(`Sanitized PGN from ${filename} (game ${i + 1}) is invalid for chess.js and will be skipped.`);
          continue;
        }
        const pgnName = `${filename.replace('.pgn', '')} Game ${i + 1}`;
        console.log(`Importing ${pgnName}...`);
        await axios.post('http://localhost:5000/api/pgns', {
          name: pgnName,
          content: sanitized,
        });
        console.log(`${pgnName} imported successfully.`);
      }
    } catch (error) {
      console.error(`Failed to import from ${filename}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  }
};

// Make sure the server is running before importing
console.log('Make sure the backend server is running on port 5000 before proceeding...');
console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');

setTimeout(() => {
  importPgns().then(() => {
    console.log('Import completed.');
    process.exit(0);
  }).catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });
}, 5000); 