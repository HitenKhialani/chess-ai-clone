-- Seed the database with initial puzzle data

-- Insert sample users
INSERT INTO users (username, email, puzzle_rating, total_solved, current_streak, best_streak) VALUES
('ChessMaster2024', 'master@chess.com', 2156, 1247, 23, 45),
('TacticalGenius', 'genius@tactics.com', 2089, 1156, 18, 32),
('EndgameExpert', 'expert@endgame.com', 2034, 1089, 15, 28),
('PuzzleWizard', 'wizard@puzzles.com', 1987, 967, 12, 25),
('StrategicMind', 'mind@strategy.com', 1923, 834, 9, 22)
ON CONFLICT (username) DO NOTHING;

-- Insert sample tactical puzzles
INSERT INTO puzzles (puzzle_id, fen, solution, theme, category, difficulty, rating, description, source) VALUES
('tactics-fork-001', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4', '["Ng5", "h6", "Nxf7"]', 'Fork', 'tactics', 1200, 1180, 'White can win material with a knight fork', 'auto-generated'),
('tactics-pin-001', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4', '["Bg5", "Be7", "Bxf6"]', 'Pin', 'tactics', 1100, 1050, 'Pin the knight to win material', 'auto-generated'),
('tactics-skewer-001', 'r1bq1rk1/ppp2ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7', '["Bxf7+", "Kh8", "Bb3"]', 'Skewer', 'tactics', 1300, 1250, 'Use a skewer to win the exchange', 'auto-generated'),
('endgame-kp-001', '8/8/8/8/8/3K4/3P4/3k4 w - - 0 1', '["Kd4", "Kd2", "Ke5"]', 'King and Pawn', 'endgames', 1000, 950, 'Win with precise king and pawn technique', 'auto-generated'),
('endgame-rook-001', '8/8/8/8/8/3k4/3R4/3K4 w - - 0 1', '["Rd3+", "Ke4", "Ra3"]', 'Rook Endgame', 'endgames', 1400, 1350, 'Cut off the king with your rook', 'auto-generated'),
('middlegame-center-001', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4', '["d4", "exd4", "e5"]', 'Central Break', 'middlegame', 1500, 1450, 'Break open the center with a pawn advance', 'auto-generated'),
('gm-sacrifice-001', 'r2qkb1r/pp2nppp/3p4/2pP4/2P1P3/2N2N2/PP1B1PPP/R2QK2R w KQkq - 0 8', '["Nxe7+", "Qxe7", "Qh5+"]', 'Sacrifice', 'grandmaster', 1800, 1750, 'Find the winning combination for White', 'GM Game - Kasparov vs Karpov, 1984')
ON CONFLICT (puzzle_id) DO NOTHING;

-- Set today's daily puzzle
UPDATE puzzles SET is_daily = TRUE, daily_date = CURRENT_DATE 
WHERE puzzle_id = 'gm-sacrifice-001';

-- Insert sample puzzle attempts
INSERT INTO puzzle_attempts (user_id, puzzle_id, solved, attempts, time_spent, rating_change) VALUES
(1, 1, TRUE, 1, 45000, 15),
(1, 2, TRUE, 2, 67000, 12),
(2, 1, TRUE, 1, 38000, 18),
(2, 3, FALSE, 3, 120000, -8),
(3, 4, TRUE, 1, 89000, 10)
ON CONFLICT DO NOTHING;

-- Insert daily puzzle stats
INSERT INTO daily_puzzle_stats (puzzle_id, date, total_solvers, average_time, average_attempts) VALUES
(7, CURRENT_DATE, 1247, 145, 2.3)
ON CONFLICT DO NOTHING;

-- Insert sample puzzle rush sessions
INSERT INTO puzzle_rush_sessions (user_id, score, puzzles_solved, best_streak, time_limit, lives_used) VALUES
(1, 450, 23, 12, 180, 2),
(2, 380, 19, 8, 180, 3),
(3, 520, 26, 15, 180, 1)
ON CONFLICT DO NOTHING;
