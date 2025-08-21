const express = require('express');
const router = express.Router();
const { Chess } = require('chess.js');

function getStockfishEvalAndBestMove(fen) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const engine = spawn('stockfish');
    let evaluation = 0;
    let bestMove = '';
    let resolved = false;

    engine.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('uciok')) {
          engine.stdin.write('isready\n');
        } else if (line.startsWith('readyok')) {
          engine.stdin.write(`position fen ${fen}\n`);
          engine.stdin.write('go depth 15\n');
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
            engine.kill();
            resolve({ evaluation, bestMove });
          }
        }
      }
    });

    engine.stdin.write('uci\n');
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        engine.kill();
        reject(new Error('Stockfish analysis timed out'));
      }
    }, 15000);
  });
}

// CORRECT move classification logic based on Stockfish analysis
function classifyMove(evalLoss, userMove, bestMove, isCheckmate = false, allowsCheckmate = false, moveNumber = 0) {
  // Special cases first
  if (isCheckmate) {
    return { type: 'Brilliant', explanation: 'Checkmate! The ultimate winning move.' };
  }

  if (allowsCheckmate) {
    return { type: 'Blunder', explanation: 'This move allows checkmate for the opponent.' };
  }

  // Opening tolerance: Allow 1.0 eval tolerance in first 10 moves
  const openingTolerance = moveNumber <= 10 ? 1.0 : 0.0;
  
  // CORRECT classification logic based on evalLoss (played move vs best move)
  if (userMove === bestMove) {
    return { type: 'Correct', explanation: 'Best move according to engine analysis.' };
  }
  
  // Apply opening tolerance
  const adjustedEvalLoss = Math.max(0, evalLoss - openingTolerance);
  
  if (adjustedEvalLoss <= 0.5) {
    return { type: 'Correct', explanation: 'Good move with minimal evaluation loss.' };
  }
  
  if (adjustedEvalLoss <= 2.0) {
    return { type: 'Mistake', explanation: 'A better move was available.' };
  }
  
  return { type: 'Blunder', explanation: 'This move loses significant advantage.' };
}

// CORRECT accuracy calculation based on move types
function calculateAccuracy(analysis) {
  const userMoves = analysis.filter((_, index) => index % 2 === 0); // Only user moves (White)
  if (userMoves.length === 0) return 0;
  
  // Count move types
  let B = 0; // Brilliant moves
  let C = 0; // Correct moves
  let M = 0; // Mistakes
  let BL = 0; // Blunders
  
  userMoves.forEach(move => {
    switch (move.type) {
      case 'Brilliant':
        B++;
        break;
      case 'Correct':
        C++;
        break;
      case 'Mistake':
        M++;
        break;
      case 'Blunder':
        BL++;
        break;
    }
  });
  
  const T = userMoves.length; // Total moves
  
  // Apply the exact formula: ((2*B + 1*C - 0.8*M - 1*BL) / T) * 100
  const accuracy = ((2 * B + 1 * C - 0.8 * M - 1 * BL) / T) * 100;
  
  // Round to 2 decimal places and clamp between 0 and 100
  return Math.max(0, Math.min(100, parseFloat(accuracy.toFixed(2))));
}

// CORRECT ELO mapping based on accuracy
function calculateELO(accuracy) {
  if (accuracy < 20) return 100;
  if (accuracy < 30) return 300;
  if (accuracy < 40) return 500;
  if (accuracy < 50) return 800;
  if (accuracy < 60) return 1000;
  if (accuracy < 70) return 1200;
  if (accuracy < 80) return 1500;
  if (accuracy < 90) return 1700;
  return 2000;
}

// POST /api/analyze-game
router.post('/', async (req, res) => {
  try {
    const { moves } = req.body;
    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return res.json({ analysis: [], accuracy: 0, elo: 0 });
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
      
      // CORRECT eval loss calculation: compare played move vs best move
      let evalLoss = 0;
      if (bestMove && bestMove !== userMoveUci) {
        // Calculate what the evaluation would be after the best move
        const chessCopy = new Chess(fenBefore);
        try {
          chessCopy.move(bestMove);
          const fenAfterBestMove = chessCopy.fen();
          const { evaluation: evalAfterBestMove } = await getStockfishEvalAndBestMove(fenAfterBestMove);
          
          // evalLoss = difference between evaluation after played move vs evaluation after best move
          // This measures how much advantage was lost by not playing the best move
          evalLoss = Math.abs(evalAfter - evalAfterBestMove);
        } catch (err) {
          // If best move calculation fails, use a fallback
          console.warn('Best move calculation failed, using fallback');
          evalLoss = Math.abs(evalBefore - evalAfter);
        }
      } else if (userMoveUci === bestMove) {
        // If played move is the best move, evalLoss should be 0
        evalLoss = 0;
      }
      
      // Check if the move results in checkmate
      const isCheckmate = chess.isCheckmate();
      const allowsCheckmate = chess.isCheck(); // Check if opponent can deliver mate
      
      const { type, explanation } = classifyMove(evalLoss, userMoveUci, bestMove, isCheckmate, allowsCheckmate, i + 1);
      
      const reviewMove = {
        move,
        type,
        explanation,
        evaluation: evalAfter.toFixed(2),
        evalLoss: evalLoss.toFixed(2),
        bestMove: bestMove !== userMoveUci ? bestMove : undefined
      };
      
      analysis.push(reviewMove);
    }

    // Calculate accuracy and ELO using CORRECT formulas
    const accuracy = calculateAccuracy(analysis);
    const elo = calculateELO(accuracy);

    return res.json({
      analysis,
      accuracy: parseFloat(accuracy.toFixed(2)),
      elo
    });
  } catch (error) {
    console.error('Game review error:', error);
    return res.status(500).json({ error: 'Invalid request', details: error.message || String(error) });
  }
});

module.exports = router; 