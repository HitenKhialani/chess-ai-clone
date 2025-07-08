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
      <div className="w-full max-w-[1200px] flex flex-row justify-center items-start gap-x-8">
        {/* Left: Explanation */}
        <div className="bg-[var(--card)] text-[var(--primary-text)] rounded-xl shadow-xl p-6 w-[400px] min-w-[400px] max-w-[400px] h-[540px] flex flex-col border border-[var(--border)]">
          <div className="flex gap-2 mb-2">
            <span className="bg-[var(--accent)] text-xs font-bold text-white px-2 py-1 rounded">Intermediate</span>
            <span className="bg-blue-600 text-xs font-bold text-white px-2 py-1 rounded">Tactical</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--primary-text)]">Lesson 2: Dragon Variation – Sharp Tactical Play</h1>
          <div className="flex-1 overflow-y-auto mb-4">
            <p className="text-base text-[var(--secondary-text)]">
              The Dragon Variation is one of the sharpest lines in the Sicilian, leading to rich tactical battles and opposite-side castling attacks.
            </p>
            <h2 className="font-bold text-base mb-1 mt-2 text-[var(--primary-text)]">Fundamentals (Chess Trainer Explanation)</h2>
            <p className="mb-2 text-[var(--secondary-text)]">The Dragon is characterized by Black fianchettoing the dark-squared bishop, leading to dynamic play and opposite-side castling. Both sides play for direct attacks; precise calculation is critical.</p>
            <ul className="list-disc list-inside text-base ml-2">
              <li>Black fianchettos the dark-squared bishop, aiming for strong control of the long diagonal.</li>
              <li>White often castles queenside and launches a kingside pawn storm.</li>
              <li>Both sides play for direct attacks; precise calculation is critical.</li>
            </ul>
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