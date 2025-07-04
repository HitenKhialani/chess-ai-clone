import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Use dynamic import for chess.js since it's a CommonJS module
let Chess: any = null;
async function getChess() {
  if (!Chess) {
    const mod = await import('chess.js');
    Chess = mod.Chess;
  }
  return Chess;
}

// Helper to get Stockfish evaluation and best move for a FEN
function getStockfishEvalAndBestMove(fen: string): Promise<{ evaluation: number, bestMove: string }> {
  return new Promise((resolve, reject) => {
    const stockfish = spawn('stockfish');
    let evaluation = 0;
    let bestMove = '';
    let resolved = false;

    stockfish.stdin.write(`position fen ${fen}\n`);
    stockfish.stdin.write('go depth 15\n');

    stockfish.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('score cp')) {
        const match = output.match(/score cp (-?\d+)/);
        if (match) {
          evaluation = parseInt(match[1]) / 100;
        }
      }
      if (output.includes('bestmove') && !resolved) {
        const match = output.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (match) {
          bestMove = match[1];
        }
        resolved = true;
        stockfish.kill();
        resolve({ evaluation, bestMove });
      }
    });
    stockfish.on('error', (err) => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });
    stockfish.on('exit', () => {
      if (!resolved) {
        resolved = true;
        resolve({ evaluation, bestMove });
      }
    });
  });
}

// Classify move type based on evaluation loss
function classifyMove(loss: number) {
  if (loss < 0.3) return { type: 'Best', explanation: 'Excellent move.' };
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

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Game review error:', error);
    const message = (typeof error === 'object' && error && 'message' in error) ? (error as any).message : String(error);
    return NextResponse.json({ error: 'Invalid request', details: message }, { status: 500 });
  }
}