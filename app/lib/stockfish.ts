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
  private depth: number = 15; // Adjust depth based on difficulty level

  constructor() {
    this.engine = Stockfish();
    this.init();
  }

  private init() {
    if (!this.engine) return;
    this.engine.onmessage = (event: any) => {
      const message = event.data;
      if (message === 'uciok') {
        this.engine.postMessage('isready');
      } else if (message === 'readyok') {
        this.isReady = true;
      }
    };
    this.engine.postMessage('uci');
  }

  public async getBestMove(fen: string): Promise<{ bestMove: string; score: number }> {
    return new Promise((resolve) => {
      let bestMove = '';
      let score = 0;

      if (!this.engine) return resolve({ bestMove: '', score: 0 });
      this.engine.onmessage = (event: any) => {
        const message = event.data;
        if (typeof message === 'string' && message.startsWith('bestmove')) {
          const move = message.split(' ')[1];
          resolve({ bestMove: move, score });
        } else if (typeof message === 'string' && message.includes('score cp')) {
          const scoreMatch = message.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            score = parseInt(scoreMatch[1]) / 100; // Convert centipawns to pawns
          }
        }
      };

      this.engine.postMessage('position fen ' + fen);
      this.engine.postMessage('go depth ' + this.depth);
    });
  }

  public setDifficulty(level: 'beginner' | 'intermediate' | 'advanced') {
    switch (level) {
      case 'beginner':
        this.depth = 5;
        break;
      case 'intermediate':
        this.depth = 10;
        break;
      case 'advanced':
        this.depth = 15;
        break;
    }
  }

  public async getPositionEvaluation(fen: string): Promise<number> {
    return new Promise((resolve) => {
      if (!this.engine) return resolve(0);
      this.engine.onmessage = (event: any) => {
        const message = event.data;
        if (typeof message === 'string' && message.includes('score cp')) {
          const scoreMatch = message.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            resolve(parseInt(scoreMatch[1]) / 100);
          }
        }
      };

      this.engine.postMessage('position fen ' + fen);
      this.engine.postMessage('go depth 15');
    });
  }

  public quit() {
    if (this.engine) this.engine.postMessage('quit');
  }

  public setDepth(depth: number) {
    this.depth = depth;
  }
}

// Helper to classify move type based on evaluation loss (matching backend)
function classifyMove(loss: number) {
  if (loss < 0.3) return { type: 'Best', explanation: 'Excellent move.' };
  if (loss < 0.7) return { type: 'Average', explanation: 'Solid move, but not the best.' };
  if (loss < 1.0) return { type: 'Inaccuracy', explanation: 'Could be improved.' };
  if (loss < 2.0) return { type: 'Mistake', explanation: 'A better move was available.' };
  return { type: 'Blunder', explanation: 'This move loses significant advantage.' };
}

// Analyze a list of moves locally using StockfishWrapper
export async function analyzeMovesLocally(moveHistory: string[], chessJsClass: any, depth: number = 15) {
  const stockfish = new StockfishWrapper();
  stockfish.setDepth(depth);
  const chess = new chessJsClass();
  const analysis = [];

  for (let i = 0; i < moveHistory.length; i++) {
    const move = moveHistory[i];
    const fenBefore = chess.fen();
    const evalBefore = await stockfish.getPositionEvaluation(fenBefore);
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
    const evalAfter = await stockfish.getPositionEvaluation(fenAfter);
    const loss = Math.abs(evalBefore - evalAfter);
    const { type, explanation } = classifyMove(loss);
    let moveType = type;
    let moveExplanation = explanation;
    // Optionally, you could get best move from Stockfish here for more accuracy
    const reviewMove: any = {
      move,
      type: moveType,
      explanation: moveExplanation,
      evaluation: evalAfter.toFixed(2),
    };
    analysis.push(reviewMove);
  }
  stockfish.quit();
  return analysis;
} 