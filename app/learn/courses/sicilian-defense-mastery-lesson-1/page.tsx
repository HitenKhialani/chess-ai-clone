'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6`;

const moves = [
  'e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'
];

const moveExplanations = [
  "1.e4 c5: Sicilian start.",
  "2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6: Fighting the center.",
  "5.Nc3 a6: Prepares b5 and flexible setups."
];

export default function NajdorfVariationLesson() {
  const [game, setGame] = useState(new Chess());
  const [moveIdx, setMoveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    let timer;
    if (autoplay && moveIdx < moves.length) {
      timer = setTimeout(() => {
        nextMove();
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [autoplay, moveIdx]);

  const nextMove = () => {
    if (moveIdx < moves.length) {
      const newGame = new Chess();
      for (let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess();
      for (let i = 0; i < moveIdx - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx - 1);
    }
  };

  const reset = () => {
    setGame(new Chess());
    setMoveIdx(0);
    setAutoplay(false);
  };

  const replay = () => {
    reset();
    setAutoplay(true);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 md:[grid-template-columns:1fr_1fr_1fr] gap-8 items-start">
        {/* Left: Explanation */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">Lesson 1: Najdorf Variation – Dynamic Counterplay</h1>
            <div className="flex gap-2 mb-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Easy</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">Dynamic</span>
            </div>
            <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="mb-4">The Najdorf Variation is a powerful response to 1.e4 that provides Black with active play and kingside counterattacks. Players learn to create long-term imbalances, launch pawn storms, and develop quickly for dynamic attacks.</p>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">PGN Explanation</h2>
              <pre className="bg-gray-900 text-green-300 rounded p-2 text-sm overflow-x-auto">{PGN}</pre>
            </div>
          </div>
        </div>
        {/* Center: Chessboard */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-[var(--card)] rounded-xl shadow-lg p-6">
            <ReactChessboard position={game.fen()} boardWidth={400} />
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={prevMove} disabled={moveIdx === 0}>Previous</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={nextMove} disabled={moveIdx >= moves.length}>Next</button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={reset}>Reset</button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={replay}>Replay</button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700" onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause' : 'Auto-Play'}</button>
            </div>
            <div className="text-center mt-3 text-sm text-gray-600">
              Move {moveIdx} of {moves.length}
            </div>
          </div>
        </div>
        {/* Right: Step-by-step explanation */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col">
          <h2 className="font-bold text-base mb-4">Step-by-Step Explanation</h2>
          <div className="space-y-3">
            {moveExplanations.map((explanation, index) => (
              <div
                key={index}
                className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm"
              >
                <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move {index + 1}</span>
                <span className="text-gray-900 text-base">{explanation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 