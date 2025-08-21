CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  profile_picture TEXT,
  total_time_spent INTEGER DEFAULT 0,
  section_times TEXT,
  coins INTEGER DEFAULT 20,
  unlocked_courses TEXT DEFAULT '[]'
); 