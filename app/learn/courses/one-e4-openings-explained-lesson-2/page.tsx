'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6`;

const moves = [
  'e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bc5', 'Be3', 'Qf6'
];

const moveExplanations = [
  "1.e4 e5: Classic central battle - both sides establish central pawn presence.",
  "2.Nf3 Nc6: Standard development - White's knight attacks e5, Black's defends it.",
  "3.d4: White challenges the center immediately - this is the key move of the Scotch Game.",
  "4.Nxd4: Gains open lines for quick development - White recaptures with the knight.",
  "5.Be3 Qf6: Black defends and targets d4 and b2 - Black develops with tempo."
];

export default function ScotchGameLesson() {
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
      <div className="w-full max-w-[1200px] flex flex-row justify-center items-start gap-x-8">
        {/* Left: Explanation */}
        <div className="bg-[var(--card)] text-[var(--primary-text)] rounded-xl shadow-xl p-6 w-[400px] min-w-[400px] max-w-[400px] h-[540px] flex flex-col border border-[var(--border)]">
          <h1 className="text-2xl font-bold mb-4 text-[var(--primary-text)]">Lesson 2: Scotch Game – Open the Center Quickly</h1>
          <div className="flex gap-2 mb-4">
            <span className="bg-[var(--accent)] text-white px-3 py-1 rounded text-sm font-semibold">Intermediate</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">Direct</span>
          </div>
          <h2 className="font-bold text-base mb-1 text-[var(--primary-text)]">Fundamentals (Chess Trainer Explanation)</h2>
          <p className="mb-4 text-[var(--secondary-text)]">The Scotch Game is a direct and aggressive opening where White seeks to open the center quickly to gain space and attacking chances. It creates open lines for the bishops and queens, and challenges Black's central control in the early game. This opening is perfect for players who prefer active piece play and tactical opportunities over closed, strategic positions.</p>
          <div className="mb-4 mt-auto">
            <h2 className="font-bold text-base mb-1 text-[var(--primary-text)]">PGN Explanation</h2>
            <pre className="bg-[var(--background)] text-green-700 rounded p-2 text-sm overflow-x-auto border border-[var(--border)]">{PGN}</pre>
          </div>
        </div>
        {/* Center: Chessboard */}
        <div className="bg-[var(--card)] text-[var(--primary-text)] rounded-xl shadow-xl p-6 w-[400px] min-w-[400px] max-w-[400px] h-[540px] flex flex-col items-center justify-between border border-[var(--border)]">
          {/* Top Spacer */}
          <div className="flex-1 flex flex-col w-full">
            <div className="flex-1" />
            <div className="w-full flex justify-center ml-6">
              <ReactChessboard position={game.fen()} boardWidth={300} />
            </div>
            <div className="flex-1" />
          </div>
          {/* Controls */}
          <div className="flex flex-wrap gap-2 mt-6 w-full justify-center">
            <button className="px-2 py-1 text-sm min-w-[80px] bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={prevMove} disabled={moveIdx === 0}>Previous</button>
            <button className="px-2 py-1 text-sm min-w-[80px] bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={nextMove} disabled={moveIdx >= moves.length}>Next</button>
            <button className="px-2 py-1 text-sm min-w-[80px] bg-gray-600 text-white rounded hover:bg-gray-700" onClick={reset}>Reset</button>
            <button className="px-2 py-1 text-sm min-w-[80px] bg-purple-600 text-white rounded hover:bg-purple-700" onClick={replay}>Replay</button>
            <button className="px-2 py-1 text-sm min-w-[80px] bg-orange-600 text-white rounded hover:bg-orange-700" onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause' : 'Auto-Play'}</button>
          </div>
          <div className="text-center mt-3 text-sm text-gray-400">
            Move {Math.floor(moveIdx/2)} of {Math.floor(moves.length/2)}
          </div>
        </div>
        {/* Right: Step-by-step explanation */}
        <div className="bg-[var(--card)] text-[var(--primary-text)] rounded-xl shadow-xl p-6 w-[400px] min-w-[400px] max-w-[400px] h-[540px] flex flex-col border border-[var(--border)]">
          <h2 className="font-bold text-base mb-4 text-[var(--primary-text)]">Step-by-Step Explanation</h2>
          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
            {moveExplanations.map((explanation, index) => {
              const match = explanation.match(/^([0-9]+\.[^:]+):\s*(.*)$/);
              const movePart = match ? match[1] : `Move ${index + 1}`;
              const descPart = match ? match[2] : explanation;
              return (
                <div
                  key={index}
                  className="bg-[var(--background)] border-2 border-[var(--accent)] rounded-lg p-4 shadow-sm flex flex-col mb-2"
                >
                  <span className="text-[var(--accent)] font-bold text-base mb-1">Move {index + 1}: <span className="text-[var(--primary-text)] font-bold">{movePart.replace(/^\d+\./, '').trim()}</span></span>
                  <span className="text-[var(--secondary-text)] text-base">{descPart}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
} 