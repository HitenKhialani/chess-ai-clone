-- Create tables for the chess puzzle system

-- Users table for tracking puzzle progress
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    puzzle_rating INTEGER DEFAULT 1200,
    total_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Puzzles table for storing generated and curated puzzles
CREATE TABLE IF NOT EXISTS puzzles (
    id SERIAL PRIMARY KEY,
    puzzle_id VARCHAR(100) UNIQUE NOT NULL,
    fen TEXT NOT NULL,
    solution JSONB NOT NULL, -- Array of moves
    theme VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    description TEXT,
    source VARCHAR(100) DEFAULT 'auto-generated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_daily BOOLEAN DEFAULT FALSE,
    daily_date DATE
);

-- User puzzle attempts for tracking progress
CREATE TABLE IF NOT EXISTS puzzle_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    puzzle_id INTEGER REFERENCES puzzles(id),
    solved BOOLEAN NOT NULL,
    attempts INTEGER DEFAULT 1,
    time_spent INTEGER, -- in milliseconds
    rating_change INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily puzzle stats
CREATE TABLE IF NOT EXISTS daily_puzzle_stats (
    id SERIAL PRIMARY KEY,
    puzzle_id INTEGER REFERENCES puzzles(id),
    date DATE NOT NULL,
    total_solvers INTEGER DEFAULT 0,
    average_time INTEGER DEFAULT 0,
    average_attempts DECIMAL(3,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Puzzle Rush sessions
CREATE TABLE IF NOT EXISTS puzzle_rush_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    score INTEGER NOT NULL,
    puzzles_solved INTEGER NOT NULL,
    best_streak INTEGER NOT NULL,
    time_limit INTEGER NOT NULL, -- in seconds
    lives_used INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_puzzles_category ON puzzles(category);
CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON puzzles(difficulty);
CREATE INDEX IF NOT EXISTS idx_puzzles_theme ON puzzles(theme);
CREATE INDEX IF NOT EXISTS idx_puzzles_daily ON puzzles(is_daily, daily_date);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_user ON puzzle_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_puzzle ON puzzle_attempts(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_users_rating ON users(puzzle_rating DESC);
