// Modular draw detection logic for chess.js
// Usage: import { checkDrawCondition, updateDrawHistory } from './drawLogic'
// Call updateDrawHistory(game, drawState) after every move
// Call checkDrawCondition(game, drawState) to check for draw

export function updateDrawHistory(game, drawState) {
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

export function checkDrawCondition(game, drawState) {
  // Threefold repetition
  const fen = game.fen();
  if (drawState.fenCounts && drawState.fenCounts[fen] >= 3) {
    return { isDraw: true, reason: 'Threefold repetition' };
  }

  // Fifty-move rule
  if (drawState.halfmoveClock >= 100) {
    return { isDraw: true, reason: 'Fifty-move rule' };
  }

  // Stalemate
  if (!game.in_check() && game.moves().length === 0) {
    return { isDraw: true, reason: 'Stalemate' };
  }

  // Insufficient material
  if (isInsufficientMaterial(game)) {
    return { isDraw: true, reason: 'Insufficient material' };
  }

  return { isDraw: false, reason: '' };
}

function isInsufficientMaterial(game) {
  // Only kings
  const pieces = game.fen().split(' ')[0].replace(//g, '');
  const pieceList = pieces.replace(/[1-8/]/g, '').split('');
  if (pieceList.every(p => p.toLowerCase() === 'k')) return true;

  // King + bishop or king + knight vs king
  const counts = countPieces(pieceList);
  if (
    (counts.w === 1 && counts.b === 1 &&
      ((counts.B === 1 && counts.N === 0 && counts.n === 0 && counts.b === 0) ||
        (counts.N === 1 && counts.B === 0 && counts.b === 0 && counts.n === 0))) ||
    (counts.w === 1 && counts.b === 1 &&
      ((counts.b === 1 && counts.n === 0 && counts.B === 0 && counts.N === 0) ||
        (counts.n === 1 && counts.b === 0 && counts.B === 0 && counts.N === 0)))
  ) {
    return true;
  }

  // King + bishop vs king + bishop (same color)
  if (
    counts.w === 1 && counts.b === 1 &&
    ((counts.B === 1 && counts.b === 1 && counts.N === 0 && counts.n === 0) ||
      (counts.B === 0 && counts.b === 0 && counts.N === 0 && counts.n === 0))
  ) {
    // Check if both bishops are on the same color
    // This requires board state, so skip for now (can be improved)
    return true;
  }

  return false;
}

function countPieces(pieceList) {
  const counts = { w: 0, b: 0, K: 0, k: 0, Q: 0, q: 0, R: 0, r: 0, B: 0, b: 0, N: 0, n: 0, P: 0, p: 0 };
  for (const p of pieceList) {
    if (counts[p] !== undefined) counts[p]++;
    if (p === 'K') counts.w++;
    if (p === 'k') counts.b++;
  }
  return counts;
} 