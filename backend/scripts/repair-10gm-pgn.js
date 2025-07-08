const fs = require('fs');

// Accept input and output file paths as command-line arguments
const inputPath = process.argv[2] || '10_gm_games.pgn';
const outputPath = process.argv[3] || '10_gm_games_repaired.pgn';

console.log('Repairing PGN:');
console.log('  Input:', inputPath);
console.log('  Output:', outputPath);

const pgn = fs.readFileSync(inputPath, 'utf8');

// Split into games
const games = pgn.split(/\n\s*\[Event /).filter(Boolean).map((block, i) => (i === 0 && block.startsWith('[Event') ? block : '[Event ' + block));

const repairedGames = games.map(game => {
  // Split into lines
  const lines = game.split(/\r?\n/);
  // Find the last header line
  let lastHeaderIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('[')) lastHeaderIdx = i;
  }
  // If the line after the last header is not blank, insert a blank line
  if (lastHeaderIdx !== -1 && lines[lastHeaderIdx + 1] && lines[lastHeaderIdx + 1].trim() !== '') {
    lines.splice(lastHeaderIdx + 1, 0, '');
  }
  // Collapse multiple blank lines to one
  let repaired = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  // Remove leading/trailing blank lines
  repaired = repaired.replace(/^\s+|\s+$/g, '');
  return repaired;
});

const repairedPgn = repairedGames.join('\n\n');
fs.writeFileSync(outputPath, repairedPgn, 'utf8');
console.log('Repaired PGN written to', outputPath); 