CREATE TABLE IF NOT EXISTS user_games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  game_report TEXT NOT NULL, -- JSON or serialized report data
  result TEXT NOT NULL,      -- win/loss/draw
  played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
); 