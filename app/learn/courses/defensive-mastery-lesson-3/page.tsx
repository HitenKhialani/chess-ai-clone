'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. ... f6 2. exf6 Qxf6 3. Qxd5+ Kh8 4. Qxa8`;
const moves = [
  'f6', 'exf6', 'Qxf6', 'Qxd5+', 'Kh8', 'Qxa8'
];

export default function DefensiveCounterattackLesson() {
  const [game, setGame] = useState(new Chess('rnbq1rk1/ppp2ppp/3b4/3Pp3/8/2N1P3/PPP2PPP/R1BQ1RK1 b - - 0 1'));
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
      const newGame = new Chess('rnbq1rk1/ppp2ppp/3b4/3Pp3/8/2N1P3/PPP2PPP/R1BQ1RK1 b - - 0 1');
      for (let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess('rnbq1rk1/ppp2ppp/3b4/3Pp3/8/2N1P3/PPP2PPP/R1BQ1RK1 b - - 0 1');
      for (let i = 0; i < moveIdx - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx - 1);
    }
  };

  const reset = () => {
    setGame(new Chess('rnbq1rk1/ppp2ppp/3b4/3Pp3/8/2N1P3/PPP2PPP/R1BQ1RK1 b - - 0 1'));
    setMoveIdx(0);
    setAutoplay(false);
  };

  const replay = () => {
    reset();
    setAutoplay(true);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8">
        {/* Left: Explanation */}
        <div className="flex-1 bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-purple-600 text-xs font-bold text-white px-2 py-1 rounded">Advanced</span>
              <span className="bg-gray-600 text-xs font-bold text-white px-2 py-1 rounded">Defense</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Lesson 3: Defensive Counterattack – Turn Defense into Offense</h1>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
              <p className="mb-2">Great defenders can turn defense into powerful counterattacks. Players learn how to absorb pressure, time defensive pawn breaks, and quickly reverse the initiative against overextended attackers.</p>
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">PGN Explanation</h2>
              <pre className="bg-gray-900 text-green-300 rounded p-2 text-sm overflow-x-auto">{PGN}</pre>
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">Step-by-Step Explanation</h2>
              <div className="space-y-3">
                <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
                  <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 1</span>
                  <span className="text-gray-900 text-base">Black plays f6, challenging the center and preparing to open lines.</span>
                </div>
                <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
                  <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 2</span>
                  <span className="text-gray-900 text-base">White captures en passant, but Black recaptures with the queen, activating it.</span>
                </div>
                <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
                  <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 3</span>
                  <span className="text-gray-900 text-base">White checks on d5, but Black calmly moves the king.</span>
                </div>
                <div className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
                  <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move 4</span>
                  <span className="text-gray-900 text-base">White grabs material, but Black has turned defense into a counterattack.</span>
                </div>
              </div>
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