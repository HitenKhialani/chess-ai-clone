CREATE TABLE IF NOT EXISTS grandmaster_games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT,
  site TEXT,
  date TEXT,
  round TEXT,
  white TEXT,
  black TEXT,
  result TEXT,
  eco TEXT,
  opening TEXT,
  pgn TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
); 