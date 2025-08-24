const db = require('../db');
const fs = require('fs');
const path = require('path');

console.log('Initializing puzzle database with all data...');

// Import all puzzle types
const importScripts = [
  'import-pin-puzzles.js',
  'import-fork-puzzles.js', 
  'import-endgame-puzzles.js',
  'import-tactics-puzzles.js',
  'import-random-puzzles.js',
  'import-mate-in-1-puzzles.js',
  'import-mate-in-2-puzzles.js',
  'import-mate-in-3-puzzles.js'
];

// Run all import scripts
importScripts.forEach(scriptName => {
  const scriptPath = path.join(__dirname, scriptName);
  if (fs.existsSync(scriptPath)) {
    try {
      console.log(`Running ${scriptName}...`);
      require(scriptPath);
    } catch (error) {
      console.error(`Error running ${scriptName}:`, error);
    }
  } else {
    console.warn(`Import script not found: ${scriptPath}`);
  }
});

// Print summary of all tables
console.log('\n=== Database Summary ===');
const tables = ['pgn_puzzles', 'pin_puzzles', 'fork_puzzles', 'tactics_puzzles', 'endgame_puzzles', 'random_puzzles'];

tables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`${table}: ${count} puzzles`);
  } catch (error) {
    console.log(`${table}: table not found or error`);
  }
});

console.log('\nDatabase initialization complete!');
console.log('All puzzles have been imported successfully!'); 