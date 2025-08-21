CREATE TABLE IF NOT EXISTS user_puzzles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  puzzle_id TEXT NOT NULL,
  result TEXT NOT NULL,      -- solved/failed
  category TEXT,             -- puzzle category
  solved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
); 