const mongoose = require('mongoose');

const gameAnalysisSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  pgn: {
    type: String,
    required: true
  },
  fen: {
    type: String,
    required: true
  },
  grandmaster: {
    type: String,
    required: true,
    enum: ['Carlsen', 'Nakamura', 'Caruana', 'Anand']
  },
  suggestedMove: {
    type: String,
    required: true
  },
  justification: {
    type: String,
    required: true
  },
  analysisSource: {
    type: String,
    required: true,
    enum: ['PGN_DATABASE', 'STOCKFISH']
  },
  evaluation: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameAnalysis', gameAnalysisSchema); 