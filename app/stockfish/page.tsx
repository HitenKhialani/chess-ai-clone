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
    <div className="min-h-screen krishna-gradient flex items-center justify-center relative overflow-hidden">
      <div className="bg-wallpaper-corner krishna-image-glow" />
      <div className="krishna-card p-8 rounded-lg shadow-lg text-white text-center purple-glow relative z-10">
        <h1 className="text-2xl font-bold mb-4 text-rgb(153, 0, 255)">Stockfish Integration</h1>
        <p className="text-rgb(200, 200, 200)">Open dev console to see Stockfish's best move.</p>
      </div>
    </div>
  );
}
