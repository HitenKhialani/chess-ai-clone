import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
const StockfishImport = require('stockfish');
const Stockfish = StockfishImport.default || StockfishImport;

// Use dynamic import for chess.js since it's a CommonJS module
let Chess: any = null;
async function getChess() {
  if (!Chess) {
    const mod = await import('chess.js');
    Chess = mod.Chess;
  }
  return Chess;
}

// Helper to get Stockfish evaluation and best move for a FEN using WASM/JS
function getStockfishEvalAndBestMove(fen: string): Promise<{ evaluation: number, bestMove: string }> {
  return new Promise((resolve, reject) => {
    const engine = Stockfish();
    let evaluation = 0;
    let bestMove = '';
    let resolved = false;
    let ready = false;

    engine.onmessage = (line: string) => {
      if (typeof line !== 'string') return;
      if (line.includes('uciok')) {
        engine.postMessage('isready');
      } else if (line.includes('readyok')) {
        engine.postMessage(`position fen ${fen}`);
        engine.postMessage('go depth 8');
        ready = true;
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
function classifyMove(loss: number) {
  if (loss < 0.3) return { type: 'Best', explanation: 'Excellent move.' };
  if (loss < 0.7) return { type: 'Average', explanation: 'Solid move, but not the best.' };
  if (loss < 1.0) return { type: 'Inaccuracy', explanation: 'Could be improved.' };
  if (loss < 2.0) return { type: 'Mistake', explanation: 'A better move was available.' };
  return { type: 'Blunder', explanation: 'This move loses significant advantage.' };
}

export async function POST(req: NextRequest) {
  try {
    const { moves } = await req.json();
    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const ChessClass = await getChess();
    const chess = new ChessClass();
    const analysis = [];

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const fenBefore = chess.fen();
      const { evaluation: evalBefore, bestMove } = await getStockfishEvalAndBestMove(fenBefore);
      let moveResult;
      try {
        moveResult = chess.move(move);
      } catch (err) {
        console.error('Invalid move in analysis:', { moveIndex: i, move, fenBefore, moves });
        return NextResponse.json({ error: `Invalid move at index ${i}: ${move}`, details: { move, fenBefore, moveIndex: i } }, { status: 400 });
      }
      if (!moveResult) {
        console.error('Invalid move in analysis:', { moveIndex: i, move, fenBefore, moves });
        return NextResponse.json({ error: `Invalid move at index ${i}: ${move}`, details: { move, fenBefore, moveIndex: i } }, { status: 400 });
      }
      // Construct UCI notation for the user's move
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
      const reviewMove: any = {
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

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Game review error:', error);
    const message = (typeof error === 'object' && error && 'message' in error) ? (error as any).message : String(error);
    return NextResponse.json({ error: 'Invalid request', details: message }, { status: 500 });
  }
}