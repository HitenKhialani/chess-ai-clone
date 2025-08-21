const db = require('./db');

function cleanupDuplicates() {
  try {
    console.log('Starting duplicate cleanup...');
    
    // Get all games
    const allGames = db.prepare('SELECT * FROM user_games ORDER BY played_at DESC').all();
    console.log(`Found ${allGames.length} total games`);
    
    const duplicates = [];
    const seen = new Set();
    
    // Find duplicates based on move history
    allGames.forEach(game => {
      try {
        const gameReport = JSON.parse(game.game_report);
        const moves = Array.isArray(gameReport) ? gameReport.map(move => move.move || move) : [];
        const movesKey = `${game.user_id}-${game.result}-${moves.join(',')}`;
        
        if (seen.has(movesKey)) {
          duplicates.push(game.id);
        } else {
          seen.add(movesKey);
        }
      } catch (err) {
        console.error('Error parsing game report:', err);
      }
    });
    
    console.log(`Found ${duplicates.length} duplicate games`);
    
    if (duplicates.length > 0) {
      // Delete duplicates, keeping the most recent one
      const placeholders = duplicates.map(() => '?').join(',');
      const stmt = db.prepare(`DELETE FROM user_games WHERE id IN (${placeholders})`);
      stmt.run(...duplicates);
      console.log(`Deleted ${duplicates.length} duplicate games`);
    }
    
    // Verify cleanup
    const remainingGames = db.prepare('SELECT COUNT(*) as count FROM user_games').get();
    console.log(`Remaining games: ${remainingGames.count}`);
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

cleanupDuplicates(); 