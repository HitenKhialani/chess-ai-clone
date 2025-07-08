const express = require('express');
const router = express.Router();
const db = require('../db');

// Get a random puzzle by difficulty range
router.get('/random', (req, res) => {
  const { minRating = 800, maxRating = 2000, theme } = req.query;
  
  let sql = 'SELECT * FROM puzzles WHERE rating BETWEEN ? AND ?';
  let params = [minRating, maxRating];
  
  if (theme) {
    sql += ' AND themes LIKE ?';
    params.push(`%${theme}%`);
  }
  
  sql += ' ORDER BY RANDOM() LIMIT 1';
  
  try {
    const puzzle = db.prepare(sql).get(params);
    if (!puzzle) {
      return res.status(404).json({ error: 'No puzzle found matching criteria' });
    }
    
    // Parse moves string into array
    puzzle.moves = puzzle.moves.split(' ');
    
    res.json(puzzle);
  } catch (err) {
    console.error('Error fetching puzzle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get puzzles by theme
router.get('/theme/:theme', (req, res) => {
  const { theme } = req.params;
  const { limit = 10 } = req.query;
  
  try {
    const puzzles = db.prepare(
      'SELECT * FROM puzzles WHERE themes LIKE ? ORDER BY RANDOM() LIMIT ?'
    ).all(`%${theme}%`, limit);
    
    // Parse moves for each puzzle
    puzzles.forEach(puzzle => {
      puzzle.moves = puzzle.moves.split(' ');
    });
    
    res.json(puzzles);
  } catch (err) {
    console.error('Error fetching puzzles by theme:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a random PGN puzzle by theme
router.get('/pgn/random', (req, res) => {
  const { theme } = req.query;
  let sql = 'SELECT * FROM pgn_puzzles';
  let params = [];
  if (theme) {
    sql += ' WHERE LOWER(themes) LIKE ?';
    params.push(`%${theme.toLowerCase()}%`);
  }
  sql += ' ORDER BY RANDOM() LIMIT 1';
  try {
    let puzzle = db.prepare(sql).get(params);
    // Option 1: If theme is 'endgame' and no puzzle found, return a random puzzle from all
    if (!puzzle && theme && theme.toLowerCase() === 'endgame') {
      puzzle = db.prepare('SELECT * FROM pgn_puzzles ORDER BY RANDOM() LIMIT 1').get();
    }
    if (!puzzle) {
      return res.status(404).json({ error: 'No puzzle found matching criteria' });
    }
    puzzle.moves = puzzle.moves.split(' ');
    res.json(puzzle);
  } catch (err) {
    console.error('Error fetching PGN puzzle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/// Get a puzzle by index (0-based, wraps around) from pgn_puzzles table
router.get('/pgn/by-index/:index', (req, res) => {
  let index = parseInt(req.params.index, 10);
  const total = db.prepare('SELECT COUNT(*) as count FROM pgn_puzzles').get().count;
  if (isNaN(index) || total === 0) {
    return res.status(400).json({ error: 'Invalid index or no puzzles available' });
  }
  index = ((index % total) + total) % total; // wrap around
  const puzzle = db.prepare('SELECT * FROM pgn_puzzles LIMIT 1 OFFSET ?').get(index);
  if (!puzzle) {
    return res.status(404).json({ error: 'No puzzle found at this index' });
  }
  puzzle.moves = puzzle.moves.split(' ');
  res.json(puzzle);
});

// Route to get the total number of puzzles in pgn_puzzles
router.get('/pgn/count', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM pgn_puzzles').get().count;
  res.json({ count: total });
});

// Route to get a pin puzzle by index
router.get('/pin/by-index/:index', (req, res) => {
  let index = parseInt(req.params.index, 10);
  const total = db.prepare('SELECT COUNT(*) as count FROM pin_puzzles').get().count;
  if (isNaN(index) || total === 0) {
    return res.status(400).json({ error: 'Invalid index or no pin puzzles available' });
  }
  index = ((index % total) + total) % total; // wrap around
  const puzzle = db.prepare('SELECT * FROM pin_puzzles LIMIT 1 OFFSET ?').get(index);
  if (!puzzle) {
    return res.status(404).json({ error: 'No pin puzzle found at this index' });
  }
  puzzle.moves = puzzle.moves.split(' ');
  res.json(puzzle);
});

// Route to get the total number of pin puzzles
router.get('/pin/count', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM pin_puzzles').get().count;
  res.json({ count: total });
});

// Route to get a tactics puzzle by index
router.get('/tactics/by-index/:index', (req, res) => {
  let index = parseInt(req.params.index, 10);
  const total = db.prepare('SELECT COUNT(*) as count FROM tactics_puzzles').get().count;
  if (isNaN(index) || total === 0) {
    return res.status(400).json({ error: 'Invalid index or no tactics puzzles available' });
  }
  index = ((index % total) + total) % total; // wrap around
  const puzzle = db.prepare('SELECT * FROM tactics_puzzles LIMIT 1 OFFSET ?').get(index);
  if (!puzzle) {
    return res.status(404).json({ error: 'No tactics puzzle found at this index' });
  }
  puzzle.moves = puzzle.moves.split(' ');
  res.json(puzzle);
});

// Route to get the total number of tactics puzzles
router.get('/tactics/count', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM tactics_puzzles').get().count;
  res.json({ count: total });
});

// Route to get an endgame puzzle by index
router.get('/endgame/by-index/:index', (req, res) => {
  let index = parseInt(req.params.index, 10);
  const total = db.prepare('SELECT COUNT(*) as count FROM endgame_puzzles').get().count;
  if (isNaN(index) || total === 0) {
    return res.status(400).json({ error: 'Invalid index or no endgame puzzles available' });
  }
  index = ((index % total) + total) % total; // wrap around
  const puzzle = db.prepare('SELECT * FROM endgame_puzzles LIMIT 1 OFFSET ?').get(index);
  if (!puzzle) {
    return res.status(404).json({ error: 'No endgame puzzle found at this index' });
  }
  puzzle.moves = puzzle.moves.split(' ');
  res.json(puzzle);
});

// Route to get the total number of endgame puzzles
router.get('/endgame/count', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM endgame_puzzles').get().count;
  res.json({ count: total });
});

// Route to get a fork puzzle by index
router.get('/fork/by-index/:index', (req, res) => {
  let index = parseInt(req.params.index, 10);
  const total = db.prepare('SELECT COUNT(*) as count FROM fork_puzzles').get().count;
  if (isNaN(index) || total === 0) {
    return res.status(400).json({ error: 'Invalid index or no fork puzzles available' });
  }
  index = ((index % total) + total) % total; // wrap around
  const puzzle = db.prepare('SELECT * FROM fork_puzzles LIMIT 1 OFFSET ?').get(index);
  if (!puzzle) {
    return res.status(404).json({ error: 'No fork puzzle found at this index' });
  }
  puzzle.moves = puzzle.moves.split(' ');
  res.json(puzzle);
});

// Route to get the total number of fork puzzles
router.get('/fork/count', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM fork_puzzles').get().count;
  res.json({ count: total });
});

// Route to get a random puzzle by index
router.get('/random/by-index/:index', (req, res) => {
  let index = parseInt(req.params.index, 10);
  const total = db.prepare('SELECT COUNT(*) as count FROM random_puzzles').get().count;
  if (isNaN(index) || total === 0) {
    return res.status(400).json({ error: 'Invalid index or no random puzzles available' });
  }
  index = ((index % total) + total) % total; // wrap around
  const puzzle = db.prepare('SELECT * FROM random_puzzles LIMIT 1 OFFSET ?').get(index);
  if (!puzzle) {
    return res.status(404).json({ error: 'No random puzzle found at this index' });
  }
  puzzle.moves = puzzle.moves.split(' ');
  res.json(puzzle);
});

// Route to get the total number of random puzzles
router.get('/random/count', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM random_puzzles').get().count;
  res.json({ count: total });
});

module.exports = router;