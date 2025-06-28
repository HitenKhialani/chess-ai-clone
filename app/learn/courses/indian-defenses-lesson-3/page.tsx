'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6`;
const moves = ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nc3', 'exd5', 'cxd5', 'd6'];

const moveExplanations = [
  "1.d4 Nf6 2.c4 c5: Benoni setup.",
  "3.d5 e6: Immediate pawn challenge.",
  "4.Nc3 exd5 5.cxd5 d6: Solid defense."
];

export default function BenoniLesson() {
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
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8">
        {/* Left: Explanation */}
        <div className="flex-1 bg-[var(--card)] rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">Lesson 3: Benoni Defense – Aggressive Pawn Play</h1>
            <div className="flex gap-2 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">Advanced</span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold">Dynamic</span>
            </div>
            <h2 className="text-xl font-semibold mb-3">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="text-lg mb-6 leading-relaxed">
              The Benoni Defense creates sharp, imbalanced pawn structures where Black aggressively challenges White's center. Players learn to handle space disadvantages, use open files, and launch counterattacks with timely pawn breaks. The Benoni is perfect for players who enjoy tactical, high-pressure positions requiring precise calculation.
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">PGN Explanation</h2>
            <div className="bg-gray-900 text-green-300 rounded p-4 mb-4">
              <div className="font-mono text-sm">{PGN}</div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Step-by-Step Explanation</h2>
            <div className="space-y-3">
              {moveExplanations.map((explanation, index) => (
                <div key={index} className="p-3 rounded-lg border bg-white border-gray-300 text-gray-800">
                  <span className="font-semibold text-blue-600">Move {index + 1}:</span> {explanation}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Chessboard */}
        <div className="flex-1 flex flex-col items-center justify-center">
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
      </div>
    </main>
  );
} 