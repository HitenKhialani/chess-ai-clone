const db = require('../db');
const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing all puzzles from database...');

// List of all puzzle tables to clear
const puzzleTables = [
  'pgn_puzzles',
  'pin_puzzles', 
  'fork_puzzles',
  'tactics_puzzles',
  'endgame_puzzles',
  'random_puzzles',
  'puzzles' // General puzzles table
];

// Clear all puzzle tables
puzzleTables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`📊 Found ${count} puzzles in ${table}`);
    
    // Clear the table
    db.prepare(`DELETE FROM ${table}`).run();
    console.log(`✅ Cleared ${table}`);
  } catch (error) {
    console.log(`⚠️  Table ${table} not found or already empty`);
  }
});

console.log('\n🔄 Re-importing all puzzles...');

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
      console.log(`📥 Running ${scriptName}...`);
      require(scriptPath);
    } catch (error) {
      console.error(`❌ Error running ${scriptName}:`, error);
    }
  } else {
    console.warn(`⚠️  Import script not found: ${scriptPath}`);
  }
});

// Print summary of all tables
console.log('\n📋 === Database Summary ===');
puzzleTables.forEach(table => {
  try {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
    console.log(`${table}: ${count} puzzles`);
  } catch (error) {
    console.log(`${table}: table not found or error`);
  }
});

console.log('\n🎉 Puzzle database cleared and re-imported successfully!');
console.log('✨ All puzzles have been refreshed!'); 