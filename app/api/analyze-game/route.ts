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

// Helper to get Stockfish evaluation for a FEN
function getStockfishEval(fen: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const stockfish = spawn('stockfish.exe');
    let evaluation = 0;
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
        resolved = true;
        stockfish.kill();
        resolve(evaluation);
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
        resolve(evaluation);
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
      const evalBefore = await getStockfishEval(fenBefore);
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
      const fenAfter = chess.fen();
      const evalAfter = await getStockfishEval(fenAfter);
      const loss = Math.abs(evalBefore - evalAfter);
      const { type, explanation } = classifyMove(loss);
      analysis.push({
        move,
        type,
        explanation,
        evaluation: evalAfter.toFixed(2),
      });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Game review error:', error);
    const message = (typeof error === 'object' && error && 'message' in error) ? (error as any).message : String(error);
    return NextResponse.json({ error: 'Invalid request', details: message }, { status: 500 });
  }
}