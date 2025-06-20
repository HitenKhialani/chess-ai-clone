const mongoose = require('mongoose');

const pgnSchema = new mongoose.Schema({
  player_white: {
    type: String,
    required: true,
  },
  player_black: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Storing as String for flexibility with various PGN date formats
    required: true,
  },
  pgn: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('PGN', pgnSchema); 