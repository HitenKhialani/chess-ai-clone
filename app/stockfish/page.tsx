'use client';
import { useEffect, useRef } from 'react';

export default function StockfishPage() {
  const engine = useRef<Worker | null>(null);

  useEffect(() => {
    engine.current = new Worker('/engine/stockfish.js');

    engine.current.onmessage = (e) => {
      console.log('Stockfish output:', e.data);
    };

    engine.current.postMessage('uci');
    engine.current.postMessage('isready');
    engine.current.postMessage('position startpos moves e2e4 e7e5');
    engine.current.postMessage('go depth 10');

    return () => engine.current?.terminate();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Stockfish Integration</h1>
      <p>Open dev console to see Stockfish's best move.</p>
    </div>
  );
}
