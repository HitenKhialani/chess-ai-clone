import { Chess } from 'chess.js';

// Modular draw detection logic for chess.js
// Usage: import { checkDrawCondition, updateDrawHistory } from './drawLogic'
// Call updateDrawHistory(game, drawState) after every move
// Call checkDrawCondition(game, drawState) to check for draw

export interface DrawState {
  fenHistory?: string[];
  fenCounts?: { [key: string]: number };
  halfmoveClock?: number;
}

export interface DrawResult {
  isDraw: boolean;
  reason: string;
}

export function updateDrawHistory(game: Chess, drawState: DrawState): void {
  // Maintain FEN history for threefold repetition
  const fen = game.fen();
  drawState.fenHistory = drawState.fenHistory || [];
  drawState.fenCounts = drawState.fenCounts || {};
  drawState.fenHistory.push(fen);
  drawState.fenCounts[fen] = (drawState.fenCounts[fen] || 0) + 1;

  // Fifty-move rule: count half-moves since last pawn move or capture
  if (!drawState.halfmoveClock) drawState.halfmoveClock = 0;
  const lastMove = game.history({ verbose: true }).slice(-1)[0];
  if (lastMove && (lastMove.piece === 'p' || lastMove.captured)) {
    drawState.halfmoveClock = 0;
  } else {
    drawState.halfmoveClock++;
  }
}

export function checkDrawCondition(game: Chess, drawState: DrawState): DrawResult {
  // Stalemate (check this first as it's most common)
  if (!game.isCheck() && game.moves().length === 0) {
    return { isDraw: true, reason: 'Stalemate' };
  }

  // Threefold repetition
  const fen = game.fen();
  if (drawState.fenCounts && drawState.fenCounts[fen] >= 3) {
    return { isDraw: true, reason: 'Threefold repetition' };
  }

  // Fifty-move rule (100 half-moves = 50 full moves)
  if (drawState.halfmoveClock && drawState.halfmoveClock >= 100) {
    return { isDraw: true, reason: 'Fifty-move rule' };
  }

  // Insufficient material
  if (isInsufficientMaterial(game)) {
    return { isDraw: true, reason: 'Insufficient material' };
  }

  return { isDraw: false, reason: '' };
}

function isInsufficientMaterial(game: Chess): boolean {
  const board = game.board();
  let whitePieces: string[] = [];
  let blackPieces: string[] = [];

  // Count pieces on the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        if (piece.color === 'w') {
          whitePieces.push(piece.type);
        } else {
          blackPieces.push(piece.type);
        }
      }
    }
  }

  // Only kings
  if (whitePieces.length === 1 && blackPieces.length === 1 && 
      whitePieces[0] === 'k' && blackPieces[0] === 'k') {
    return true;
  }

  // King + bishop or king + knight vs king
  if (whitePieces.length === 2 && blackPieces.length === 1) {
    if (whitePieces.includes('k') && 
        (whitePieces.includes('b') || whitePieces.includes('n')) &&
        blackPieces[0] === 'k') {
      return true;
    }
  }

  if (blackPieces.length === 2 && whitePieces.length === 1) {
    if (blackPieces.includes('k') && 
        (blackPieces.includes('b') || blackPieces.includes('n')) &&
        whitePieces[0] === 'k') {
      return true;
    }
  }

  // King + bishop vs king + bishop (same color bishops)
  if (whitePieces.length === 2 && blackPieces.length === 2) {
    if (whitePieces.includes('k') && whitePieces.includes('b') &&
        blackPieces.includes('k') && blackPieces.includes('b')) {
      // Check if bishops are on same color squares
      const whiteBishopSquare = findBishopSquare(board, 'w');
      const blackBishopSquare = findBishopSquare(board, 'b');
      
      if (whiteBishopSquare && blackBishopSquare) {
        const whiteBishopColor = (whiteBishopSquare.row + whiteBishopSquare.col) % 2;
        const blackBishopColor = (blackBishopSquare.row + blackBishopSquare.col) % 2;
        if (whiteBishopColor === blackBishopColor) {
          return true;
        }
      }
    }
  }

  return false;
}

function findBishopSquare(board: any[][], color: 'w' | 'b'): { row: number; col: number } | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'b' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

// Legacy function for backward compatibility
function countPieces(pieceList: string[]): { [key: string]: number } {
  const counts: { [key: string]: number } = { 
    w: 0, b: 0, K: 0, k: 0, Q: 0, q: 0, R: 0, r: 0, 
    B: 0, N: 0, n: 0, P: 0, p: 0 
  };
  for (const p of pieceList) {
    if (counts[p] !== undefined) counts[p]++;
    if (p === 'K') counts.w++;
    if (p === 'k') counts.b++;
  }
  return counts;
} 