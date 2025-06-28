'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5`;

const moves = [
  'e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ne5'
];

const moveExplanations = [
  "1.e4 e5: Classical opening - both sides establish central control.",
  "2.f4: White offers a pawn to open the f-file - this is the King's Gambit sacrifice.",
  "3.Nf3: Prepares to attack quickly - White develops with tempo.",
  "4.h4 g4: White pushes for kingside space - Black advances to defend.",
  "5.Ne5: Centralizes the knight - preparing for a rapid assault."
];

export default function KingsGambitLesson() {
  const [game, setGame] = useState(new Chess());
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
            <h1 className="text-3xl font-bold mb-4">Lesson 3: King's Gambit – Sacrifice for Attack</h1>
            <div className="flex gap-2 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">Advanced</span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold">Sharp</span>
            </div>
            
            <h2 className="text-xl font-semibold mb-3">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="text-lg mb-6 leading-relaxed">
              The King's Gambit is a sharp and risky opening where White sacrifices a pawn on move two to launch a powerful kingside attack. It emphasizes fast development, open lines, and tactical sharpness. This opening is for players who enjoy unbalanced and aggressive positions, where the initiative and attacking chances compensate for the material deficit.
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
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-white border-gray-300 text-gray-800"
                >
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
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={prevMove} 
                disabled={moveIdx === 0}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={nextMove} 
                disabled={moveIdx >= moves.length}
              >
                Next
              </button>
              <button 
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" 
                onClick={reset}
              >
                Reset
              </button>
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" 
                onClick={replay}
              >
                Replay
              </button>
              <button 
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700" 
                onClick={() => setAutoplay(!autoplay)}
              >
                {autoplay ? 'Pause' : 'Auto-Play'}
              </button>
            </div>
            <div className="text-center mt-3 text-sm text-gray-600">
              Move {Math.floor(moveIdx/2)} of {Math.floor(moves.length/2)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 