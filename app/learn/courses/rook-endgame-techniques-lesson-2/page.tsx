'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useBoardSize } from '@/hooks/useBoardSize';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1... Rf6 2. Ka5 Kf3 3. b6 Rf1 4. Ka6 Ke4 5. b7 Ra1+`;
const moves = [
  'Rf6', 'Ka5', 'Kf3', 'b6', 'Rf1', 'Ka6', 'Ke4', 'b7', 'Ra1+'
];

export default function RookBehindPassedPawnLesson() {
  const [game, setGame] = useState(new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1'));
  const [moveIdx, setMoveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const { containerRef, width } = useBoardSize(440, 260);

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
      const newGame = new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1');
      for (let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1');
      for (let i = 0; i < moveIdx - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx - 1);
    }
  };

  const reset = () => {
    setGame(new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1'));
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
      <div className="bg-gradient-to-r from-stone-600 to-gray-600 text-[var(--card-foreground)] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link 
            href="/learn/courses/rook-endgame-techniques" 
            className="flex items-center text-[var(--card-foreground)] hover:text-stone-100 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-bold">Back to Course</span>
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* TOP SECTION - Two Cards: Left Board, Right Explanation */}
        <div className="min-h-[60vh] lg:min-h-[70vh] flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
          {/* LEFT CARD - Board */}
          <div className="w-full lg:w-3/5 bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-950/30 dark:to-gray-950/30 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold mb-4 text-stone-700 dark:text-stone-300 text-center">Interactive Chess Board</h3>
            <div className="flex justify-center items-center mb-4">
              <div ref={containerRef} className="w-full max-w-[480px] min-w-[260px]">
                <ReactChessboard position={game.fen()} boardWidth={width} />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <button className="px-4 py-2 bg-[var(--primary)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={prevMove} disabled={moveIdx === 0}>← Previous</button>
              <button className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={nextMove} disabled={moveIdx >= moves.length}>Next →</button>
              <button className="px-4 py-2 bg-gray-600 text-[var(--card-foreground)] rounded-lg hover:bg-[var(--secondary)] text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={reset}>Reset</button>
              <button className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={replay}>Replay</button>
              <button className="px-6 py-2 bg-[var(--primary)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={() => setAutoplay(!autoplay)}>{autoplay ? '⏸️ Pause' : '▶️ Auto-Play'}</button>
            </div>
            <div className="text-center mt-1 text-xs text-[var(--muted-foreground)]">Move {moveIdx} of {moves.length}</div>
          </div>

          {/* RIGHT CARD - Explanation */}
          <div className="w-full lg:w-2/5 bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-950/30 dark:to-gray-950/30 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[var(--card)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-lg">2</div>
              <div>
                <h2 className="text-xl font-bold text-[var(--primary)]">Rook Behind Passed Pawn</h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-yellow-400 text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Intermediate</span>
                  <span className="bg-[var(--primary)] text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Endgame</span>
                </div>
              </div>
            </div>
            <div className="bg-[var(--card)] rounded-xl p-4 mb-4 shadow-lg">
              <h3 className="font-semibold text-base mb-3">📚 Fundamentals</h3>
              <p className="text-sm leading-relaxed">The golden rule: place your rook behind the passed pawn—attacking or defending. Restrict enemy pawns, support your own, and coordinate rook and king for smooth conversion.</p>
            </div>
            <div className="bg-[var(--card)] rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold mb-3 text-sm">📝 PGN Notation</h4>
              <div className="bg-[var(--background)] text-green-300 rounded-lg p-3 shadow-inner"><div className="font-mono text-xs leading-relaxed">{PGN}</div></div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - Steps */}
        <div className="min-h-[35vh] bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-950/30 dark:to-gray-950/30 p-4 lg:p-6 rounded-2xl border-t border-stone-200 dark:border-stone-800">
          <h3 className="text-lg font-bold mb-4 text-[var(--accent)] text-center">Step-by-Step Explanation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[var(--card)] border-2 border-[var(--primary)] rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-[var(--primary)] text-[var(--card-foreground)] font-bold rounded-lg px-3 py-1 mb-2 text-sm shadow">Move 1</span>
              <p className="text-sm text-[var(--muted-foreground)]">The rook moves behind the passed pawn, preparing to support or restrict it.</p>
            </div>
            <div className="bg-[var(--card)] border-2 border-[var(--primary)] rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-[var(--primary)] text-[var(--card-foreground)] font-bold rounded-lg px-3 py-1 mb-2 text-sm shadow">Move 2</span>
              <p className="text-sm text-[var(--muted-foreground)]">The king approaches to help the pawn or stop the opponent's king.</p>
            </div>
            <div className="bg-[var(--card)] border-2 border-[var(--primary)] rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-[var(--primary)] text-[var(--card-foreground)] font-bold rounded-lg px-3 py-1 mb-2 text-sm shadow">Move 3</span>
              <p className="text-sm text-[var(--muted-foreground)]">The pawn advances, supported by the rook and king.</p>
            </div>
            <div className="bg-[var(--card)] border-2 border-[var(--primary)] rounded-lg p-4 shadow-sm">
              <span className="inline-block bg-[var(--primary)] text-[var(--card-foreground)] font-bold rounded-lg px-3 py-1 mb-2 text-sm shadow">Move 4</span>
              <p className="text-sm text-[var(--muted-foreground)]">The rook continues to support or check from behind, keeping the pawn safe.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 