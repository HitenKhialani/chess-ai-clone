'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7`;

const moves = [
  'e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6', 'Nc3', 'Bg7'
];

const moveExplanations = [
  '1. e4 c5: Sicilian start.',
  '2. Nf3 Nc6: Developing and eyeing d4.',
  '3. d4 cxd4: White opens the center, Black exchanges.',
  '4. Nxd4 g6: Black prepares to fianchetto the bishop.',
  '5. Nc3 Bg7: White develops, Black fianchettos.'
];

export default function AcceleratedDragonLesson() {
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
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8">
        {/* Left: Explanation */}
        <div className="flex-1">
          <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 mb-6">
            <div className="flex gap-2 mb-2">
              <span className="bg-purple-600 text-xs font-bold text-white px-2 py-1 rounded">Advanced</span>
              <span className="bg-blue-600 text-xs font-bold text-white px-2 py-1 rounded">Dynamic</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Lesson 3: Accelerated Dragon – Fast Development</h1>
            <p className="text-base mb-4">The Accelerated Dragon focuses on quick piece development and the powerful g7 bishop.</p>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
              <p className="mb-2">The Accelerated Dragon allows Black to fianchetto quickly without ...d6, aiming for rapid development and flexibility.</p>
              <ul className="list-disc list-inside text-base ml-2">
                <li>Black fianchettos the bishop early, controlling the long diagonal.</li>
                <li>White can play Nc3 and Be3, aiming for space and development.</li>
                <li>Black delays ...d6, keeping options open for ...d5 in one move.</li>
              </ul>
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">PGN Explanation</h2>
              <pre className="bg-gray-900 text-green-300 rounded p-2 text-sm overflow-x-auto">{PGN}</pre>
            </div>
            <div>
              <h2 className="font-bold text-base mb-2">Step-by-Step Explanation</h2>
              <div className="space-y-3">
                {moveExplanations.map((exp, idx) => (
                  <div key={idx} className="bg-white border-2 border-blue-500 flex items-center rounded-md p-3 shadow-sm">
                    <span className="bg-blue-600 text-white font-bold rounded px-2 py-1 mr-3">Move {idx + 1}</span>
                    <span className="text-gray-900">{exp.replace(/^\d+\.\s*/, '')}</span>
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
            <button className="btn" onClick={prevMove} disabled={moveIdx === 0}>Previous</button>
            <button className="btn" onClick={nextMove} disabled={moveIdx >= moves.length}>Next</button>
            <button className="btn" onClick={reset}>Reset</button>
            <button className="btn" onClick={replay}>Replay</button>
            <button className="btn" onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause' : 'Auto-Play'}</button>
          </div>
        </div>
      </div>
    </main>
  );
} 