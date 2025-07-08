const express = require('express');
const router = express.Router();
const Stockfish = require('stockfish');
const { Chess } = require('chess.js');

// Helper to get Stockfish evaluation and best move for a FEN
function getStockfishEvalAndBestMove(fen) {
  return new Promise((resolve, reject) => {
    const engine = Stockfish();
    let evaluation = 0;
    let bestMove = '';
    let resolved = false;

    engine.onmessage = (line) => {
      if (typeof line !== 'string') return;
      if (line.includes('uciok')) {
        engine.postMessage('isready');
      } else if (line.includes('readyok')) {
        engine.postMessage(`position fen ${fen}`);
        engine.postMessage('go depth 15');
      } else if (line.startsWith('info') && line.includes('score cp')) {
        const match = line.match(/score cp (-?\d+)/);
        if (match) {
          evaluation = parseInt(match[1], 10) / 100;
        }
      } else if (line.startsWith('bestmove')) {
        const match = line.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (match) {
          bestMove = match[1];
        }
        if (!resolved) {
          resolved = true;
          resolve({ evaluation, bestMove });
        }
      }
    };
    engine.postMessage('uci');
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error('Stockfish analysis timed out'));
      }
    }, 15000);
  });
}

// Classify move type based on evaluation loss
function classifyMove(loss) {
  if (loss < 0.3) return { type: 'Best', explanation: 'Excellent move.' };
  if (loss < 0.7) return { type: 'Average', explanation: 'Solid move, but not the best.' };
  if (loss < 1.0) return { type: 'Inaccuracy', explanation: 'Could be improved.' };
  if (loss < 2.0) return { type: 'Mistake', explanation: 'A better move was available.' };
  return { type: 'Blunder', explanation: 'This move loses significant advantage.' };
}

// POST /api/analyze-game
router.post('/', async (req, res) => {
  try {
    const { moves } = req.body;
    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return res.json([]);
    }
    const chess = new Chess();
    const analysis = [];

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const fenBefore = chess.fen();
      const { evaluation: evalBefore, bestMove } = await getStockfishEvalAndBestMove(fenBefore);
      let moveResult;
      try {
        moveResult = chess.move(move);
      } catch (err) {
        return res.status(400).json({ error: `Invalid move at index ${i}: ${move}` });
      }
      if (!moveResult) {
        return res.status(400).json({ error: `Invalid move at index ${i}: ${move}` });
      }
      const userMoveUci = moveResult.from + moveResult.to + (moveResult.promotion || '');
      const fenAfter = chess.fen();
      const { evaluation: evalAfter } = await getStockfishEvalAndBestMove(fenAfter);
      const loss = Math.abs(evalBefore - evalAfter);
      const { type, explanation } = classifyMove(loss);
      let moveType = type;
      let moveExplanation = explanation;
      if (bestMove && bestMove === userMoveUci) {
        moveType = 'Best';
        moveExplanation = 'Excellent move.';
      }
      const reviewMove = {
        move,
        type: moveType,
        explanation: moveExplanation,
        evaluation: evalAfter.toFixed(2),
      };
      if (bestMove && bestMove !== userMoveUci) {
        reviewMove.bestMove = bestMove;
      }
      analysis.push(reviewMove);
    }

    return res.json(analysis);
  } catch (error) {
    console.error('Game review error:', error);
    return res.status(500).json({ error: 'Invalid request', details: error.message || String(error) });
  }
});

module.exports = router; 