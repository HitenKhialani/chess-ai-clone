import { createStockfish } from "./stockfishWorker";
import { parseStockfishLines } from "../utils/parseStockfish";
import { validatePuzzle } from "../utils/validatePuzzle";
import { Chess } from "chess.js";

export function generatePuzzle(fen) {
  return new Promise((resolve) => {
    const stockfish = createStockfish();
    const lines = [];

    stockfish.onmessage = (event) => {
      const msg = event.data;
      if (typeof msg === 'string') {
        if (msg.startsWith('bestmove')) {
          const [best, second] = parseStockfishLines(lines);
          const valid = validatePuzzle(best, second);
          if (valid) {
            resolve({ fen, bestMove: best, secondBestMove: second });
          } else {
            resolve(null);
          }
          stockfish.terminate();
        } else {
          lines.push(msg);
        }
      }
    };

    stockfish.postMessage('position fen ' + fen);
    stockfish.postMessage('go depth 20 multipv 2');
  });
}