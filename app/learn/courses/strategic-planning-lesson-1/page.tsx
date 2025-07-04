'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

const fen = "rnbqkbnr/pppp1ppp/4p3/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3";
const solution = ["e4e5", "d7d5", "e5d6"];

const moveExplanations = [
  { move: 'e4', text: 'White grabs central space and opens lines for the queen and bishop.' },
  { move: 'e6', text: 'Black prepares to challenge the center with d5.' },
  { move: 'd4', text: 'White reinforces the center and opens lines for the other bishop.' },
  { move: 'd5', text: 'Black immediately contests the center.' },
  { move: 'Nc3', text: 'White develops a knight, attacking d5 and supporting e4.' },
  { move: 'Nf6', text: 'Black develops a knight, attacking e4.' },
  { move: 'Nf3', text: 'White develops another knight, defending e4 and preparing to castle.' },
  { move: 'Bb4', text: 'Black pins the knight and increases pressure on the center.' },
  { move: 'e5', text: 'White gains space and attacks the knight.' },
  { move: 'Ne4', text: 'Black centralizes the knight, attacking c3 and f2.' },
  { move: 'Bd2', text: 'White breaks the pin and prepares to recapture on c3.' },
  { move: 'Nxd2', text: 'Black exchanges knights, simplifying the position.' },
  { move: 'Qxd2', text: 'White recaptures, keeping the queen active.' },
  { move: 'c5', text: 'Black attacks the center and prepares to develop the queenside.' },
  { move: 'a3', text: 'White attacks the bishop, forcing it to decide.' },
  { move: 'Ba5', text: 'Black retreats, keeping the pin.' },
  { move: 'dxc5', text: 'White wins a pawn and opens the d-file.' },
  { move: 'Nc6', text: 'Black develops a knight, attacking d4 and supporting the center.' },
];

const moves = [
  'e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'Nf3', 'Bb4', 'e5', 'Ne4', 'Bd2', 'Nxd2', 'Qxd2', 'c5', 'a3', 'Ba5', 'dxc5', 'Nc6'
];

export default function ImprovingWorstPieceLesson() {
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
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 md:[grid-template-columns:1fr_1fr_1fr] gap-8 items-start">
        {/* Left column: Explanation and moves */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 max-w-xl w-full mt-8">
          <div className="flex gap-2 mb-2">
            <span className="bg-green-500 text-xs font-bold text-white px-2 py-1 rounded">Easy</span>
            <span className="bg-orange-600 text-xs font-bold text-white px-2 py-1 rounded">Strategy</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Lesson 1: Improving the Worst Piece</h1>
          <div className="mb-4">
            <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="mb-2">A simple but powerful strategic rule is to improve your worst piece. Players learn to reposition bad pieces to stronger squares, increase coordination, and enhance activity step-by-step.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-1">PGN Explanation</h3>
            <div className="bg-gray-900 text-green-200 rounded px-3 py-2 text-sm font-mono mb-2">1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Nf3 Bb4 5. e5 Ne4 6. Bd2 Nxd2 7. Qxd2 c5 8. a3 Ba5 9. dxc5 Nc6</div>
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