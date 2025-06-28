const db = require('../db');

function printGrandmasterGames() {
  const stmt = db.prepare('SELECT id, event, site, date, round, white, black, result, eco, opening, created_at FROM grandmaster_games ORDER BY id DESC');
  const games = stmt.all();
  if (games.length === 0) {
    console.log('No grandmaster games found.');
    return;
  }
  games.forEach(game => {
    console.log('---');
    console.log(`ID: ${game.id}`);
    console.log(`Event: ${game.event}`);
    console.log(`Site: ${game.site}`);
    console.log(`Date: ${game.date}`);
    console.log(`Round: ${game.round}`);
    console.log(`White: ${game.white}`);
    console.log(`Black: ${game.black}`);
    console.log(`Result: ${game.result}`);
    console.log(`ECO: ${game.eco}`);
    console.log(`Opening: ${game.opening}`);
    console.log(`Created At: ${game.created_at}`);
  });
}

printGrandmasterGames(); 