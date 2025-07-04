'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. Qe8+ Kh7 2. Qh5+ Kg8 3. Qe8+ Kh7 4. Qh5+`;
const moves = [
  'Qe8+', 'Kh7', 'Qh5+', 'Kg8', 'Qe8+', 'Kh7', 'Qh5+'
];

export default function PerpetualCheckLesson() {
  const [game, setGame] = useState(new Chess('8/8/8/8/8/8/6k1/6QK w - - 0 1'));
  const [moveIdx, setMoveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (autoplay && moveIdx < moves.length) {
      timer = setTimeout(() => {
        nextMove();
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [autoplay, moveIdx]);

  const nextMove = () => {
    if (moveIdx < moves.length) {
      const newGame = new Chess('8/8/8/8/8/8/6k1/6QK w - - 0 1');
      for (let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess('8/8/8/8/8/8/6k1/6QK w - - 0 1');
      for (let i = 0; i < moveIdx - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx - 1);
    }
  };

  const reset = () => {
    setGame(new Chess('8/8/8/8/8/8/6k1/6QK w - - 0 1'));
    setMoveIdx(0);
    setAutoplay(false);
  };

  const replay = () => {
    reset();
    setAutoplay(true);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 md:[grid-template-columns:1fr_1fr_1fr] gap-8 items-stretch">
        {/* Left: Explanation */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col h-[600px]">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-green-500 text-xs font-bold text-white px-2 py-1 rounded">Easy</span>
              <span className="bg-blue-600 text-xs font-bold text-white px-2 py-1 rounded">Endgame</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Lesson 1: Perpetual Check – Forcing Draws</h1>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
              <p className="mb-2">Perpetual check is a vital drawing resource in queen endgames. Players learn how to create never-ending check sequences, force draws from worse positions, and handle open kings to escape losses.</p>
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">PGN Explanation</h2>
              <pre className="bg-gray-900 text-green-300 rounded p-2 text-sm overflow-x-auto">{PGN}</pre>
            </div>
          </div>
        </div>
        {/* Center: Chessboard */}
        <div className="flex flex-col h-[600px] justify-between items-center">
          <div className="bg-[var(--card)] rounded-xl shadow-lg p-6 flex flex-col h-full justify-between">
            <ReactChessboard position={game.fen()} boardWidth={400} />
            <div className="flex gap-2 mt-4 justify-center">
              <button className="rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 transition" onClick={prevMove} disabled={moveIdx === 0}>Previous</button>
              <button className="rounded bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 transition" onClick={nextMove} disabled={moveIdx >= moves.length}>Next</button>
              <button className="rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 transition" onClick={reset}>Reset</button>
              <button className="rounded bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 transition" onClick={replay}>Replay</button>
              <button className={`rounded ${autoplay ? 'bg-orange-600 hover:bg-orange-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold px-4 py-2 transition`} onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause' : 'Auto-Play'}</button>
            </div>
            <div className="text-center mt-3 text-sm text-gray-600">
              Move {moveIdx} of {moves.length}
            </div>
          </div>
        </div>
        {/* Right: Step-by-step explanation */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col h-[600px]">
          <h2 className="font-bold text-base mb-4">Step-by-Step Explanation</h2>
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 1</span>
              <span className="text-gray-900 text-base">White checks the king, starting the perpetual sequence.</span>
            </div>
            <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 2</span>
              <span className="text-gray-900 text-base">Black's king moves, but White continues checking.</span>
            </div>
            <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 3</span>
              <span className="text-gray-900 text-base">The checks repeat, and Black cannot escape.</span>
            </div>
            <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 4</span>
              <span className="text-gray-900 text-base">The perpetual check forces a draw.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 