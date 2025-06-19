export function validatePuzzle(best, second) {
  const evalGap = best.eval - second.eval;
  return evalGap > 200; // Accept puzzles with clear best move
}