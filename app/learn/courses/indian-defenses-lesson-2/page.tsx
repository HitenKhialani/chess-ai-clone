'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7`;
const moves = ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3', 'bxc3', 'Bg7'];

const moveExplanations = [
  "1.d4 Nf6 2.c4 g6: Black fianchettos.",
  "3.Nc3 d5: Challenges the center.",
  "4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3: Black's dynamic setup."
];

export default function GrunfeldLesson() {
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
            <h1 className="text-3xl font-bold mb-4">Lesson 2: Grünfeld Defense – Hypermodern Counterattack</h1>
            <div className="flex gap-2 mb-4">
              <span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-semibold">Intermediate</span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">Hypermodern</span>
            </div>
            <h2 className="text-xl font-semibold mb-3">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="text-lg mb-6 leading-relaxed">
              The Grünfeld Defense teaches hypermodern principles by allowing White to control the center initially, while Black aims to attack it with active piece play. Players learn to break down large pawn centers, create piece pressure, and use dynamic counterplay to quickly seize control in the middlegame.
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