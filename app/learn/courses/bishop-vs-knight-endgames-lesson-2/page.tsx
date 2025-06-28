'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `8/8/8/2k5/2N5/4K3/8/8 w - - 0 1`;

const moves = [
  'Kd3', 'Kd5', 'Nc4', 'Kc5', 'Ne3', 'Kd6', 'Ke4', 'Ke6', 'Nd5', 'Kf6'
];

const moveExplanations = [
  "1. Kd3: White's king heads to the center, supporting the knight.",
  "2. Kd5: Black's king also centralizes.",
  "3. Nc4: The knight uses an outpost to control key squares.",
  "4. Kc5: Black's king tries to invade.",
  "5. Ne3: The knight repositions for tactical threats.",
  "6. Kd6: Black's king stays active.",
  "7. Ke4: White's king invades further.",
  "8. Ke6: Black's king blocks.",
  "9. Nd5: The knight creates tactical threats (forks, blockades).",
  "10. Kf6: Both sides maneuver for space."
];

export default function KnightOutpostsLesson() {
  const [game, setGame] = useState(new Chess('8/8/8/2k5/2N5/4K3/8/8 w - - 0 1'));
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
      const newGame = new Chess('8/8/8/2k5/2N5/4K3/8/8 w - - 0 1');
      for (let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess('8/8/8/2k5/2N5/4K3/8/8 w - - 0 1');
      for (let i = 0; i < moveIdx - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx - 1);
    }
  };

  const reset = () => {
    setGame(new Chess('8/8/8/2k5/2N5/4K3/8/8 w - - 0 1'));
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
        <div className="flex-1">
          <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 mb-6">
            <div className="flex gap-2 mb-2">
              <span className="bg-yellow-400 text-xs font-bold text-white px-2 py-1 rounded">Intermediate</span>
              <span className="bg-blue-600 text-xs font-bold text-white px-2 py-1 rounded">Endgame</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Lesson 2: Knight Outposts – Short-Range Tactics</h1>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
              <p className="mb-2">Knights are dangerous in closed endgames where outposts and blockades limit bishop activity. Players learn to use knights on strong squares, control key pawns, and create tactical forks. Knights can often outperform bishops in positions with locked pawn structures.</p>
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">PGN Explanation</h2>
              <pre className="bg-gray-900 text-green-300 rounded p-2 text-sm overflow-x-auto">{PGN}</pre>
            </div>
            <div>
              <h2 className="font-bold text-base mb-2">Step-by-Step Explanation</h2>
              <div className="space-y-3">
                {moveExplanations.map((exp, idx) => (
                  <div key={idx} className="bg-white border-2 border-blue-500 flex items-center rounded-lg p-4 shadow-sm">
                    <span className="inline-block bg-blue-600 text-white font-bold rounded-lg px-4 py-2 mr-4 text-base shadow">Move {idx + 1}</span>
                    <span className="text-gray-900 text-base">{exp.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Chessboard */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <ReactChessboard position={game.fen()} boardWidth={400} />
          <div className="flex gap-2 mt-4">
            <button className="rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 transition" onClick={prevMove} disabled={moveIdx === 0}>Previous</button>
            <button className="rounded bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 transition" onClick={nextMove} disabled={moveIdx >= moves.length}>Next</button>
            <button className="rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 transition" onClick={reset}>Reset</button>
            <button className="rounded bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 transition" onClick={replay}>Replay</button>
            <button className={`rounded ${autoplay ? 'bg-orange-600 hover:bg-orange-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold px-4 py-2 transition`} onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause' : 'Auto-Play'}</button>
          </div>
        </div>
      </div>
    </main>
  );
} 