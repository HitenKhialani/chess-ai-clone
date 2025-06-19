// Stockfish WASM worker wrapper
importScripts('stockfish.js');

let stockfish = null;

self.onmessage = function(e) {
  if (!stockfish) {
    stockfish = STOCKFISH();
    stockfish.onmessage = function(msg) {
      self.postMessage(msg);
    };
  }
  stockfish.postMessage(e.data);
};
