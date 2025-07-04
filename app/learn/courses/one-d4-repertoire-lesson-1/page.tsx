'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6`;

const moves = [
  'd4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'h6', 'Bh4', 'b6'
];

const moveExplanations = [
  "1.d4 d5: Fights for the center.",
  "2.c4: White challenges the d5 pawn immediately.",
  "3.Nc3: Supports c4 and prepares e4.",
  "4.Bg5: Pins the knight, threatening to weaken Black's defense.",
  "5.e3: Opens the diagonal for the light-squared bishop.",
  "6.Nf3: Develops another piece and supports the center.",
  "7.Bh4: Keeps the pin active.",
  "7...b6: Black prepares to fianchetto and develop the bishop."
];

export default function QueensGambitLesson() {
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
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: Explanation */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">Lesson 1: Queen's Gambit – Building Center Dominance</h1>
          <div className="flex gap-2 mb-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Easy</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">Classical</span>
          </div>
          <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
          <p className="mb-4">The Queen's Gambit (1.d4 d5 2.c4) is one of the most respected openings in chess history. White offers a pawn to control the center, aiming to create long-term space and structural advantages. Black can accept the gambit or decline it, leading to varied but rich positions. The key fundamentals involve maintaining pawn center control, supporting the c4 pawn, and achieving harmonious piece development.</p>
          <div className="mb-4">
            <h2 className="font-bold text-base mb-1">PGN Explanation</h2>
            <pre className="bg-gray-900 text-green-300 rounded p-2 text-sm overflow-x-auto">{PGN}</pre>
          </div>
        </div>
        {/* Center + Right: Chessboard and Step-by-Step Explanation */}
        <div className="md:col-span-2 flex flex-col md:flex-row gap-8 w-full">
          {/* Center: Chessboard */}
          <div className="bg-[var(--card)] rounded-xl shadow-lg p-6 flex flex-col items-center w-[500px] mx-auto">
            <div className="flex justify-center">
              <ReactChessboard position={game.fen()} boardWidth={400} />
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center w-full">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={prevMove} disabled={moveIdx === 0}>Previous</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={nextMove} disabled={moveIdx >= moves.length}>Next</button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={reset}>Reset</button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={replay}>Replay</button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700" onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause' : 'Auto-Play'}</button>
            </div>
            <div className="text-center mt-3 text-sm text-gray-600 w-full">
              Move {moveIdx} of {moves.length}
            </div>
          </div>
          {/* Right: Step-by-step explanation */}
          <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col min-w-[320px] max-w-[350px] md:ml-auto">
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
      </div>
    </main>
  );
} 