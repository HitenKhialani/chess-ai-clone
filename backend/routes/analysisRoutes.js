const express = require('express');
const router = express.Router();
const chessAnalysisService = require('../services/chessAnalysisService');
const GameAnalysis = require('../models/GameAnalysis');
const { Chess } = require('chess.js');

// Analyze a position
router.post('/analyze', async (req, res) => {
  try {
    const { fen, grandmaster } = req.body;

    if (!fen || !grandmaster) {
      return res.status(400).json({ error: 'FEN and grandmaster are required' });
    }

    // Validate FEN
    const chess = new Chess();
    try {
      chess.load(fen);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid FEN position' });
    }

    // Check if we already have this analysis
    const existingAnalysis = await GameAnalysis.findOne({
      fen,
      grandmaster
    });

    if (existingAnalysis) {
      return res.json(existingAnalysis);
    }

    // Perform new analysis
    const analysis = await chessAnalysisService.analyzePosition(fen, grandmaster);

    // Save the analysis
    const gameAnalysis = new GameAnalysis({
      gameId: Date.now().toString(),
      pgn: chess.pgn(),
      fen,
      grandmaster,
      suggestedMove: analysis.suggestedMove,
      justification: analysis.justification,
      analysisSource: analysis.analysisSource,
      evaluation: analysis.evaluation
    });

    await gameAnalysis.save();

    res.json(gameAnalysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze position' });
  }
});

// Get analysis history
router.get('/history', async (req, res) => {
  try {
    const { grandmaster } = req.query;
    const query = grandmaster ? { grandmaster } : {};
    
    const analyses = await GameAnalysis.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(analyses);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch analysis history' });
  }
});

module.exports = router; 