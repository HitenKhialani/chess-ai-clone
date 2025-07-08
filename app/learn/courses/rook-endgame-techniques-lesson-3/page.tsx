'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1.Ke1 Ke8 2.Rd1 Rd8 3.Rxd8+ Kxd8 4.Kd2 Kd7 5.Kd3 Kd6 6.b3 b6 7.a3 a6 8.a4 a5 9.b4 axb4 10.cxb4 Kc6 11.Kc4 Kd6 12.Kb5 Kc7 13.Ka6 Kc6 14.Ka7 Kc7 15.Ka8 Kc8 16.a5 bxa5 17.bxa5 Kc7 18.a6 Kc8 19.a7 Kc7 20.f4 Kc8 21.f5 Kc7 22.f6 Kc8 23.f7 Kc7 24.f8=Q Kc8 25.Qf7 Kd8 26.Qf6+ Kd7 27.Qe5 Kc6 28.Qe6+ Kc7 29.Qd5 Kc8 30.Qd6 Kb7 31.Qd7+ Kb6 32.Qb7+ Kc5 33.Qb6+ Kc4 34.Qb5+ Kc3 35.Qb4+ Kc2 36.Qb3+ Kc1 37.Qb2+ Kd1 38.Qb1#`;
const moves = PGN.replace(/\d+\.|\n/g, '').trim().split(/\s+/).filter(m => m && !m.includes('{') && !m.includes('('));

const moveExplanations = [
  "1.Ke1 Ke8: Both kings centralize for the endgame.",
  "2.Rd1 Rd8: Rooks take open files.",
  "3.Rxd8+ Kxd8: Rooks are exchanged.",
  "4.Kd2 Kd7: Kings head to the center.",
  "5.Kd3 Kd6: Centralization continues.",
  "6.b3 b6: Pawn play on the queenside.",
  "7.a3 a6: Both sides expand on the queenside.",
  "8.a4 a5: Both sides lock the queenside.",
  "9.b4 axb4: White sacrifices a pawn to open lines.",
  "10.cxb4 Kc6: Black king approaches the queenside pawns.",
  "11.Kc4 Kd6: Both kings maneuver for position.",
  "12.Kb5 Kc7: White king invades.",
  "13.Ka6 Kc6: Black king blocks.",
  "14.Ka7 Kc7: White king keeps pushing.",
  "15.Ka8 Kc8: Black king blocks.",
  "16.a5 bxa5: White sacrifices a pawn.",
  "17.bxa5 Kc7: Black king approaches.",
  "18.a6 Kc8: White pushes passed pawn.",
  "19.a7 Kc7: Black king blocks.",
  "20.f4 Kc8: White tries to create counterplay.",
  "21.f5 Kc7: Black king blocks.",
  "22.f6 Kc8: White pushes.",
  "23.f7 Kc7: Black king blocks.",
  "24.f8=Q Kc8: White queens.",
  "25.Qf7 Kd6: White queen checks.",
  "26.Qf6+ Kd7: Black king blocks.",
  "27.Qe5 Kc6: White queen checks.",
  "28.Qe6+ Kc7: Black king blocks.",
  "29.Qd5 Kc8: White queen checks.",
  "30.Qd6 Kb7: Black king blocks.",
  "31.Qd7+ Kb6: White queen checks.",
  "32.Qb7+ Kc5: Black king blocks.",
  "33.Qb6+ Kc4: White queen checks.",
  "34.Qb5+ Kc3: Black king blocks.",
  "35.Qb4+ Kc2: White queen checks.",
  "36.Qb3+ Kc1: Black king blocks.",
  "37.Qb2+ Kd1: White queen checks.",
  "38.Qb1#: White mates."
];

export default function RookEndgameTechniquesLesson3() {
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
          <h1 className="text-3xl font-bold mb-2 text-[var(--primary-text)]">Lesson 3: Rook Endgame Techniques</h1>
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