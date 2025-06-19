export function createStockfish() {
  // Use the public path for the Stockfish worker
  const worker = new Worker('/engine/stockfish.worker.js');
  worker.postMessage('uci');
  worker.postMessage('setoption name MultiPV value 2');
  worker.postMessage('isready');
  return worker;
}