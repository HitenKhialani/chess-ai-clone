'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)]">
      {/* Back Navigation Bar */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-[var(--card-foreground)] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link 
            href="/learn/courses/bishop-vs-knight-endgames" 
            className="flex items-center text-[var(--card-foreground)] hover:text-[var(--card-foreground)]/80 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-bold">Back to Course</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-[var(--card-foreground)] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Lesson 2: Pawn Structure Considerations</h1>
          <p className="text-orange-100">Master the strategic implications of pawn structures in bishop vs knight endgames.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* TOP SECTION */}
        <div className="min-h-[60vh] lg:min-h-[70vh] flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
          {/* LEFT CARD - Board */}
          <div className="w-full lg:w-3/5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-6 border border-[var(--border)] dark:border-orange-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold mb-4 text-[var(--primary)] dark:text-orange-300 text-center">Interactive Chess Board</h3>
            <div className="flex justify-center items-center mb-4">
              <ReactChessboard 
                position={game.fen()} 
                boardWidth={320}
                customBoardStyle={{ borderRadius: '16px', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.3)' }}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <button className="px-4 py-2 bg-[var(--primary)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={prevMove} disabled={moveIdx === 0}>← Previous</button>
              <button className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={nextMove} disabled={moveIdx >= moves.length}>Next →</button>
              <button className="px-4 py-2 bg-gray-600 text-[var(--card-foreground)] rounded-lg hover:bg-[var(--secondary)] text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={reset}>Reset</button>
              <button className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={replay}>Replay</button>
            </div>
            <div className="flex gap-3 justify-center mb-2">
              <button className="px-6 py-2 bg-[var(--primary)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={() => setAutoplay(!autoplay)}>{autoplay ? '⏸️ Pause' : '▶️ Auto-Play'}</button>
            </div>
            <div className="text-center mt-1">
              <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-[var(--primary)] dark:text-orange-300">Move {moveIdx} of {moves.length}</span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Explanation */}
          <div className="w-full lg:w-2/5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-[var(--border)] dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Lesson Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[var(--primary)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-lg">2</div>
              <div>
                <h2 className="text-xl font-bold text-[var(--primary)] dark:text-orange-300">Pawn Structure Considerations</h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-yellow-400 text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Intermediate</span>
                  <span className="bg-[var(--primary)] text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Endgame</span>
                </div>
              </div>
            </div>

            {/* Fundamentals */}
            <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-xl p-4 mb-4 shadow-lg">
              <h3 className="font-semibold text-base mb-3 text-[var(--card-foreground)] dark:text-gray-200">📚 Fundamentals (Chess Trainer Explanation)</h3>
              <p className="text-[var(--card-foreground)] dark:text-[var(--muted-foreground)] text-sm leading-relaxed mb-3">
                Knights excel when pawn structures are locked and outposts are available; bishops thrive when pawn chains are flexible and diagonals are open. Evaluate pawn breaks and color-complex weaknesses to decide which piece to favor.
              </p>
            </div>

            {/* PGN */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 mb-4 shadow-lg">
              <h4 className="font-semibold text-[var(--card-foreground)] dark:text-gray-200 mb-3 text-sm">📝 PGN Notation:</h4>
              <div className="bg-[var(--background)] text-green-300 rounded-lg p-3 shadow-inner">
                <div className="font-mono text-xs leading-relaxed">{PGN}</div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - Steps */}
        <div className="min-h-[40vh] lg:min-h-[30vh] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 lg:p-6 rounded-t-2xl border-t-2 border-[var(--border)] dark:border-purple-800">
          <h3 className="text-lg font-bold mb-4 text-[var(--accent)] dark:text-purple-300 text-center">Step-by-Step Explanation</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-600 dark:scrollbar-track-purple-900">
            {moveExplanations.map((explanation, index) => (
              <div
                key={index}
                onClick={() => {
                  const newGame = new Chess('8/8/8/2k5/2N5/4K3/8/8 w - - 0 1');
                  for (let i = 0; i <= index; i++) {
                    newGame.move(moves[i]);
                  }
                  setGame(newGame);
                  setMoveIdx(index + 1);
                }}
                className={`flex-shrink-0 w-80 bg-[var(--card)] dark:bg-[var(--card)] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 border-2 ${
                  index === moveIdx - 1 
                    ? 'ring-2 ring-blue-500 shadow-xl border-blue-300' 
                    : 'hover:ring-1 hover:ring-purple-300 border-transparent hover:border-[var(--border)]'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[var(--accent-foreground)] font-bold mr-3 shadow-lg ${
                    index === moveIdx - 1 ? 'bg-[var(--card)]0' : 'bg-[var(--accent)]'
                  }`}>
                    {index + 1}
                  </div>
                  <h4 className={`font-semibold ${
                    index === moveIdx - 1 ? 'text-[var(--primary)] dark:text-blue-300' : 'text-[var(--card-foreground)] dark:text-[var(--muted-foreground)]'
                  }`}>
                    Move {index + 1}
                  </h4>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] mb-3 leading-relaxed">
                  {explanation.replace(/^\d+\.\s*/, '')}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--accent)] dark:text-purple-400 font-medium bg-[var(--secondary)] dark:bg-purple-900 px-2 py-1 rounded">
                    {moves[index * 2]} {moves[index * 2 + 1]}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full shadow-sm"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
 