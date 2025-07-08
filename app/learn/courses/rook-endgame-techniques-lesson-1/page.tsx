'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1.Ke2 Ke7 2.Rd1 Rd8 3.Rxd8 Kxd8 4.Kd3 Kd7 5.Kd4 Kd6 6.b4 b6 7.a4 a6 8.a5 bxa5 9.bxa5 Kc6 10.Kc4 Kd6 11.Kd4 Kc6 12.Ke5 Kb5 13.Kf6 Kxa5 14.Kxf7 Kb4 15.Kg7 a5 16.Kxh7 a4 17.Kxg6 a3 18.h4 a2 19.h5 a1=Q 20.h6 Qh8 21.h7 Kc5 22.f4 Kd6 23.f5 Ke7 24.f6+ Kf8 25.f7 Qg7+ 26.Kf5 Qxh7+ 27.Ke6 Qxf7+ 28.Ke5 Qe7+ 29.Kd5 Qe6+ 30.Kd4 Qd6+ 31.Ke4 Qd5+ 32.Kf4 Qe5+ 33.Kg4 Qe4+ 34.Kg5 Qf4+ 35.Kg6 Qf5+ 36.Kh6 Qg5+ 37.Kh7 Qg6+ 38.Kh8 Qg7#`;
const moves = PGN.replace(/\d+\.|\n/g, '').trim().split(/\s+/).filter(m => m && !m.includes('{') && !m.includes('('));

const moveExplanations = [
  "1.Ke2 Ke7: Both sides centralize their kings for the endgame.",
  "2.Rd1 Rd8: Rooks occupy open files.",
  "3.Rxd8 Kxd8: Exchange of rooks, king activity increases.",
  "4.Kd3 Kd7: Both kings head to the center.",
  "5.Kd4 Kd6: Centralization continues.",
  "6.b4 b6: Pawn play on the queenside.",
  "7.a4 a6: Both sides expand on the queenside.",
  "8.a5 bxa5: White sacrifices a pawn to open lines.",
  "9.bxa5 Kc6: Black king approaches the queenside pawns.",
  "10.Kc4 Kd6: Both kings maneuver for position.",
  "11.Kd4 Kc6: Repetition, waiting for a breakthrough.",
  "12.Ke5 Kb5: White king invades.",
  "13.Kf6 Kxa5: Black grabs a pawn.",
  "14.Kxf7 Kb4: White king takes a pawn.",
  "15.Kg7 a5: Black pushes passed pawn.",
  "16.Kxh7 a4: Both sides push pawns.",
  "17.Kxg6 a3: Black's pawn races to promotion.",
  "18.h4 a2: Both sides promote.",
  "19.h5 a1=Q: Black queens.",
  "20.h6 Qh8: Black threatens mate.",
  "21.h7 Kc5: Black king supports the queen.",
  "22.f4 Kd6: White tries to create counterplay.",
  "23.f5 Ke7: Black king approaches.",
  "24.f6+ Kf8: Black king blocks.",
  "25.f7 Qg7+: Black checks.",
  "26.Kf5 Qxh7+: Black wins more material.",
  "27.Ke6 Qxf7+: Black continues to check.",
  "28.Ke5 Qe7+: Black keeps checking.",
  "29.Kd5 Qe6+: Black checks again.",
  "30.Kd4 Qd6+: Black keeps up the pressure.",
  "31.Ke4 Qd5+: Black checks.",
  "32.Kf4 Qe5+: Black checks.",
  "33.Kg4 Qe4+: Black checks.",
  "34.Kg5 Qf4+: Black checks.",
  "35.Kg6 Qf5+: Black checks.",
  "36.Kh6 Qg5+: Black checks.",
  "37.Kh7 Qg6+: Black checks.",
  "38.Kh8 Qg7#: Black mates."
];

export default function RookEndgameTechniquesLesson1() {
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
          <div className="flex gap-2 mb-2">
            <span className="bg-[var(--accent)] text-xs font-bold text-white px-2 py-1 rounded">Endgame</span>
            <span className="bg-blue-600 text-xs font-bold text-white px-2 py-1 rounded">Rook</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--primary-text)]">Lesson 1: Rook Endgame Techniques</h1>
          <div className="flex-1 overflow-y-auto mb-4">
            <p className="text-base text-[var(--secondary-text)]">
              Rook endgames are the most common type of endgame. This lesson covers key techniques such as the Lucena and Philidor positions, and how to convert an advantage.
            </p>
            <h2 className="font-bold text-base mb-1 mt-2 text-[var(--primary-text)]">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="mb-2 text-[var(--secondary-text)]">Learn to activate your rook, cut off the enemy king, and use checks to your advantage.</p>
          </div>
          <div className="mt-auto">
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
            Move {moveIdx} of {moves.length}
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
                  <span className="text-[var(--accent)] font-bold text-base mb-1">Move {index + 1}: <span className="text-[var(--primary-text)] font-bold">{movePart && movePart.replace(/^\d+\./, '').trim()}</span></span>
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