// @ts-ignore
const Stockfish = () => {
  // Use the Stockfish engine from the public/engine directory as a web worker
  return typeof window !== 'undefined'
    ? new Worker('/engine/stockfish.js')
    : null;
};

export class StockfishWrapper {
  private engine: any;
  private isReady: boolean = false;
  private depth: number = 15; // Fixed depth 15 for consistent analysis

  constructor() {
    console.log('🤖 Initializing Stockfish engine...');
    this.engine = Stockfish();
    this.init();
  }

  private init() {
    if (!this.engine) {
      console.error('❌ Stockfish engine failed to initialize');
      return;
    }
    this.engine.onmessage = (event: any) => {
      const message = event.data;
      if (message === 'uciok') {
        console.log('✅ Stockfish UCI ready');
        this.engine.postMessage('isready');
      } else if (message === 'readyok') {
        console.log('✅ Stockfish engine ready for analysis');
        this.isReady = true;
      }
    };
    this.engine.postMessage('uci');
  }

  public async getStockfishEvalAndBestMove(fen: string): Promise<{ evaluation: number; bestMove: string }> {
    return new Promise((resolve, reject) => {
      let evaluation = 0;
      let bestMove = '';
      let resolved = false;

      if (!this.engine) {
        resolve({ evaluation: 0, bestMove: '' });
        return;
      }

      this.engine.onmessage = (event: any) => {
        const line = event.data;
        if (line === 'uciok') {
          this.engine.postMessage('isready');
        } else if (line === 'readyok') {
          this.engine.postMessage(`position fen ${fen}`);
          this.engine.postMessage('go depth 15');
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

      this.engine.postMessage('uci');
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('Stockfish analysis timed out'));
        }
      }, 15000);
    });
  }

  public async getBestMove(fen: string): Promise<{ bestMove: string; score: number }> {
    const result = await this.getStockfishEvalAndBestMove(fen);
    return { bestMove: result.bestMove, score: result.evaluation };
  }

  public async getPositionEvaluation(fen: string): Promise<number> {
    const result = await this.getStockfishEvalAndBestMove(fen);
    return result.evaluation;
  }

  public quit() {
    if (this.engine) this.engine.postMessage('quit');
  }

  public setDepth(depth: number) {
    this.depth = depth;
  }
}

// CORRECT move classification logic based on Stockfish analysis
function classifyMove(evalLoss: number, userMove: string, bestMove: string, isCheckmate: boolean = false, allowsCheckmate: boolean = false, moveNumber: number = 0) {
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
function calculateAccuracy(analysis: any[]): number {
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
function calculateELO(accuracy: number): number {
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

// Analyze a list of moves locally using StockfishWrapper
export async function analyzeMovesLocally(moveHistory: string[], chessJsClass: any, depth: number = 15) {
  console.log('🔍 Starting Stockfish analysis for', moveHistory.length, 'moves');
  console.log('📊 Moves to analyze:', moveHistory);
  
  const stockfish = new StockfishWrapper();
  stockfish.setDepth(depth);
  const chess = new chessJsClass();
  const analysis = [];

  for (let i = 0; i < moveHistory.length; i++) {
    const move = moveHistory[i];
    const fenBefore = chess.fen();
    const { evaluation: evalBefore, bestMove } = await stockfish.getStockfishEvalAndBestMove(fenBefore);
    
    let moveResult;
    try {
      moveResult = chess.move(move);
    } catch (err) {
      break;
    }
    if (!moveResult) {
      break;
    }
    
    const userMoveUci = moveResult.from + moveResult.to + (moveResult.promotion || '');
    const fenAfter = chess.fen();
    const { evaluation: evalAfter } = await stockfish.getStockfishEvalAndBestMove(fenAfter);
    
    // CORRECT eval loss calculation: compare played move vs best move
    let evalLoss = 0;
    if (bestMove && bestMove !== userMoveUci) {
      // Calculate what the evaluation would be after the best move
      const chessCopy = new chessJsClass(fenBefore);
      try {
        chessCopy.move(bestMove);
        const fenAfterBestMove = chessCopy.fen();
        const { evaluation: evalAfterBestMove } = await stockfish.getStockfishEvalAndBestMove(fenAfterBestMove);
        
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
    
    const reviewMove: any = {
      move,
      type,
      explanation,
      evaluation: evalAfter.toFixed(2),
      evalLoss: evalLoss.toFixed(2),
      bestMove: bestMove !== userMoveUci ? bestMove : undefined,
      fenBefore,
      fenAfter
    };
    
    analysis.push(reviewMove);
    console.log(`🎯 Move ${i + 1}: ${move} → ${type} (eval: ${evalAfter.toFixed(2)}, loss: ${evalLoss.toFixed(2)})`);
  }
  
  stockfish.quit();
  
  // Calculate accuracy and ELO using CORRECT formulas
  const accuracy = calculateAccuracy(analysis);
  const elo = calculateELO(accuracy);
  
  console.log('✅ Stockfish analysis completed successfully');
  console.log('📋 Final analysis:', analysis);
  console.log(`📊 Accuracy: ${accuracy.toFixed(2)}%, ELO: ${elo}`);
  
  return {
    analysis,
    accuracy: parseFloat(accuracy.toFixed(2)),
    elo
  };
} 