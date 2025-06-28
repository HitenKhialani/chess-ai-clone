'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 O-O-O`;

const moves = [
  'e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'O-O-O'
];

const moveExplanations = [
  '1. e4 c5: The Sicilian Defense begins. Black immediately contests the center.',
  '2. Nf3 d6: White develops and prepares d4. Black supports the c5 pawn and prepares ...Nf6.',
  '3. d4 cxd4: White strikes in the center. Black exchanges pawns.',
  '4. Nxd4 Nf6: White recaptures, Black develops and attacks e4.',
  '5. Nc3 g6: White supports the center, Black prepares to fianchetto the bishop.',
  '6. Be3 Bg7: White develops, aiming for queenside castling. Black fianchettos.',
  '7. f3 O-O: White supports e4 and prepares Qd2. Black castles kingside.',
  '8. Qd2 Nc6: White prepares queenside castling and a kingside attack. Black develops.',
  '9. O-O-O: White castles queenside, ready to launch a pawn storm on the kingside.'
];

export default function DragonVariationLesson() {
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
              <span className="bg-yellow-400 text-xs font-bold text-white px-2 py-1 rounded">Intermediate</span>
              <span className="bg-blue-600 text-xs font-bold text-white px-2 py-1 rounded">Tactical</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Lesson 2: Dragon Variation – Sharp Tactical Play</h1>
            <p className="text-base mb-4">The Dragon Variation is one of the sharpest lines in the Sicilian, leading to rich tactical battles and opposite-side castling attacks.</p>
            <div className="mb-4">
              <h2 className="font-bold text-base mb-1">Fundamentals (Chess Trainer Explanation)</h2>
              <p className="mb-2">The Dragon is characterized by Black fianchettoing the dark-squared bishop, leading to dynamic play and opposite-side castling. Both sides play for direct attacks; precise calculation is critical.</p>
              <ul className="list-disc list-inside text-base ml-2">
                <li>Black fianchettos the dark-squared bishop, aiming for strong control of the long diagonal.</li>
                <li>White often castles queenside and launches a kingside pawn storm.</li>
                <li>Both sides play for direct attacks; precise calculation is critical.</li>
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