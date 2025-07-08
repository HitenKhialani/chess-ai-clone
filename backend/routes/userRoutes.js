const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// @route   POST /api/users/signup
// @desc    Register new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, email, password, profile_picture } = req.body;

  try {
    // Check if user already exists
    const userExists = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email, username);
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const stmt = db.prepare('INSERT INTO users (username, email, password, profile_picture) VALUES (?, ?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword, profile_picture || null);
    const userId = result.lastInsertRowid;

    const payload = {
      user: {
        id: userId,
        username,
        email,
      },
    };

    jwt.sign(
      payload,
      'jwtSecret', // Replace with a strong secret from environment variables
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: userId, username, email, profile_picture: profile_picture || null } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      'jwtSecret', // Replace with a strong secret from environment variables
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, profile_picture: user.profile_picture } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Middleware to authenticate JWT and set req.user
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, 'jwtSecret'); // Use env secret in production
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// POST /api/users/save-game
// Save a game report for the logged-in user
router.post('/save-game', authMiddleware, (req, res) => {
  const { game_report, result } = req.body;
  const userId = req.user.id;
  if (!game_report || !result) {
    return res.status(400).json({ msg: 'Missing game report or result' });
  }
  try {
    // Prevent duplicate saves by checking for existing game with same move history
    const existing = db.prepare('SELECT id FROM user_games WHERE user_id = ? AND game_report = ?').get(userId, JSON.stringify(game_report));
    if (existing) {
      return res.status(200).json({ msg: 'Game report already saved' });
    }
    const stmt = db.prepare('INSERT INTO user_games (user_id, game_report, result) VALUES (?, ?, ?)');
    stmt.run(userId, JSON.stringify(game_report), result);
    res.json({ msg: 'Game report saved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to save game report' });
  }
});

// GET /api/users/game-reports
// Fetch all game reports for the logged-in user
router.get('/game-reports', authMiddleware, (req, res) => {
  const userId = req.user.id;
  try {
    const stmt = db.prepare('SELECT * FROM user_games WHERE user_id = ? ORDER BY played_at DESC');
    const games = stmt.all(userId).map(g => ({ ...g, game_report: JSON.parse(g.game_report) }));
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch game reports' });
  }
});

// GET /api/users/total-time
// Fetch total time spent for the logged-in user
router.get('/total-time', authMiddleware, (req, res) => {
  const userId = req.user.id;
  try {
    const stmt = db.prepare('SELECT total_time_spent FROM users WHERE id = ?');
    const user = stmt.get(userId);
    res.json({ total_time_spent: user?.total_time_spent || 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch total time' });
  }
});

// POST /api/users/increment-time
// Increment total_time_spent and section_times for the logged-in user
router.post('/increment-time', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { seconds, section } = req.body;
  if (!seconds || typeof seconds !== 'number' || seconds < 1) {
    return res.status(400).json({ msg: 'Invalid seconds' });
  }
  try {
    db.prepare('UPDATE users SET total_time_spent = total_time_spent + ? WHERE id = ?').run(seconds, userId);
    if (section) {
      // Update section_times JSON
      let user = db.prepare('SELECT section_times FROM users WHERE id = ?').get(userId);
      let sectionTimes = {};
      try { sectionTimes = user && user.section_times ? JSON.parse(user.section_times) : {}; } catch {}
      sectionTimes[section] = (sectionTimes[section] || 0) + seconds;
      db.prepare('UPDATE users SET section_times = ? WHERE id = ?').run(JSON.stringify(sectionTimes), userId);
    }
    // Log time increment by date
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    db.prepare('INSERT INTO user_time_log (user_id, date, seconds) VALUES (?, ?, ?)').run(userId, today, seconds);
    res.json({ msg: 'Time updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to update time' });
  }
});

// GET /api/users/time-log
// Return time spent per day for the logged-in user
router.get('/time-log', authMiddleware, (req, res) => {
  const userId = req.user.id;
  try {
    const rows = db.prepare('SELECT date, SUM(seconds) as seconds FROM user_time_log WHERE user_id = ? GROUP BY date ORDER BY date ASC').all(userId);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch time log' });
  }
});

// GET /api/users/section-times
// Return total_time_spent and section_times for the logged-in user
router.get('/section-times', authMiddleware, (req, res) => {
  const userId = req.user.id;
  try {
    const user = db.prepare('SELECT total_time_spent, section_times FROM users WHERE id = ?').get(userId);
    let sectionTimes = {};
    try { sectionTimes = user && user.section_times ? JSON.parse(user.section_times) : {}; } catch {}
    res.json({ total_time_spent: user?.total_time_spent || 0, section_times: sectionTimes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch section times' });
  }
});

// POST /api/users/solve-puzzle
// Record a solved puzzle for the logged-in user
router.post('/solve-puzzle', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { puzzle_id, category } = req.body;
  if (!puzzle_id) {
    return res.status(400).json({ msg: 'Missing puzzle_id' });
  }
  try {
    // Only insert if not already solved
    const existing = db.prepare('SELECT id FROM user_puzzles WHERE user_id = ? AND puzzle_id = ?').get(userId, puzzle_id);
    if (existing) {
      return res.status(200).json({ msg: 'Puzzle already recorded' });
    }
    db.prepare('INSERT INTO user_puzzles (user_id, puzzle_id, result, category) VALUES (?, ?, ?, ?)').run(userId, puzzle_id, 'solved', category || null);
    
    // Award 1 coin for solving the puzzle
    db.prepare('UPDATE users SET coins = COALESCE(coins, 0) + 1 WHERE id = ?').run(userId);

    let bonusAwarded = false;
    if (category) {
        const categoryToTableMap = {
            'fork': 'fork_puzzles',
            'pin': 'pin_puzzles',
            'tactics': 'tactics_puzzles',
            'random': 'random_puzzles',
            'endgame': 'endgame_puzzles',
        };

        const puzzleTable = categoryToTableMap[category.toLowerCase()];

        if (puzzleTable) {
            // Get total puzzles in the category
            const totalPuzzlesInCategory = db.prepare(`SELECT COUNT(*) as count FROM ${puzzleTable}`).get().count;

            // Get user's solved puzzles in this category
            const solvedPuzzlesInCategory = db.prepare('SELECT COUNT(*) as count FROM user_puzzles WHERE user_id = ? AND category = ? AND result = ?').get(userId, category, 'solved').count;

            if (totalPuzzlesInCategory > 0 && solvedPuzzlesInCategory === totalPuzzlesInCategory) {
                db.prepare('UPDATE users SET coins = COALESCE(coins, 0) + 5 WHERE id = ?').run(userId);
                bonusAwarded = true;
            }
        }
    }

    res.json({ msg: 'Puzzle recorded', coinsGained: 1 + (bonusAwarded ? 5 : 0) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to record puzzle' });
  }
});

// GET /api/users/puzzles-solved
// Return the count of unique puzzles solved by the user
router.get('/puzzles-solved', authMiddleware, (req, res) => {
  const userId = req.user.id;
  try {
    const row = db.prepare('SELECT COUNT(DISTINCT puzzle_id) as count FROM user_puzzles WHERE user_id = ? AND result = ?').get(userId, 'solved');
    res.json({ puzzles_solved: row.count || 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch puzzle count' });
  }
});

// GET /api/users/puzzles-solved-by-category
// Return the count of puzzles solved by category for the user
router.get('/puzzles-solved-by-category', authMiddleware, (req, res) => {
  const userId = req.user.id;
  try {
    const rows = db.prepare('SELECT category, COUNT(DISTINCT puzzle_id) as count FROM user_puzzles WHERE user_id = ? AND result = ? GROUP BY category').all(userId, 'solved');
    const result = {};
    for (const row of rows) {
      result[row.category || 'Uncategorized'] = row.count;
    }
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch puzzle stats' });
  }
});

// GET /api/users/me
// Fetch current user details
router.get('/me', authMiddleware, (req, res) => {
    const userId = req.user.id;
    try {
        const user = db.prepare('SELECT id, username, email, coins, unlocked_courses, profile_picture FROM users WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.unlocked_courses = JSON.parse(user.unlocked_courses || '[]');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Failed to fetch user details' });
    }
});

// POST /api/users/unlock-course
// Unlock a course for the user
router.post('/unlock-course', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { courseSlug } = req.body;
    const courseCost = 5;

    if (!courseSlug) {
        return res.status(400).json({ msg: 'Missing courseSlug' });
    }

    try {
        const user = db.prepare('SELECT coins, unlocked_courses FROM users WHERE id = ?').get(userId);

        if ((user.coins || 0) < courseCost) {
            return res.status(400).json({ msg: 'Insufficient coins' });
        }

        const unlockedCourses = JSON.parse(user.unlocked_courses || '[]');
        if (unlockedCourses.includes(courseSlug)) {
            return res.status(400).json({ msg: 'Course already unlocked' });
        }

        const newCoins = (user.coins || 0) - courseCost;
        const newUnlockedCourses = [...unlockedCourses, courseSlug];

        db.prepare('UPDATE users SET coins = ?, unlocked_courses = ? WHERE id = ?').run(newCoins, JSON.stringify(newUnlockedCourses), userId);

        res.json({ msg: 'Course unlocked successfully', coins: newCoins, unlockedCourses: newUnlockedCourses });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Failed to unlock course' });
    }
});

// POST /api/users/add-test-coins
// Add 10 coins for testing
router.post('/add-test-coins', authMiddleware, (req, res) => {
    const userId = req.user.id;
    try {
        db.prepare('UPDATE users SET coins = COALESCE(coins, 0) + 10 WHERE id = ?').run(userId);
        const user = db.prepare('SELECT coins FROM users WHERE id = ?').get(userId);
        res.json({ msg: 'Added 10 coins', coins: user.coins });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Failed to add test coins' });
    }
});

module.exports = router; 