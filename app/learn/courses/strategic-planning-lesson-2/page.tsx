'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

const fen = "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1";
const solution = ["d7d5", "c2c4", "e7e6"];

const moveExplanations = [
  { move: 'd4', text: 'White grabs central space and opens lines for the queen and bishop.' },
  { move: 'd5', text: 'Black immediately contests the center.' },
  { move: 'c4', text: 'White expands on the queenside and prepares to fianchetto the bishop.' },
  { move: 'e6', text: 'Black supports the d5 pawn and opens lines for the dark-squared bishop.' },
];

const moves = [
  'd4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Nf3', 'Be7', 'e3', 'O-O', 'h6', 'Bh4', 'b6'
];

export default function CreatingLongTermPlanLesson() {
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
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-6xl flex flex-row gap-8 justify-center items-start">
        {/* Left column: Explanation and moves */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 max-w-xl w-full mt-8">
          <div className="flex gap-2 mb-2">
            <span className="bg-yellow-400 text-xs font-bold text-white px-2 py-1 rounded">Intermediate</span>
            <span className="bg-orange-600 text-xs font-bold text-white px-2 py-1 rounded">Strategy</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Lesson 2: Creating a Long-Term Plan</h1>
          <div className="mb-4">
            <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="mb-2">Players learn to develop long-term positional plans based on pawn structures, weak squares, and open files. Planning helps guide piece placement and pawn breaks toward favorable endgames.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-1">PGN Explanation</h3>
            <div className="bg-gray-900 text-green-200 rounded px-3 py-2 text-sm font-mono mb-2">1. d4 d5 2. c4 e6</div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Step-by-Step Explanation</h3>
            <div className="space-y-3">
              {moveExplanations.map((step, idx) => (
                <div key={idx} className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
                  <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move {idx + 1}</span>
                  <span className="text-gray-900 text-base">{step.move}: {step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right column: Chessboard */}
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