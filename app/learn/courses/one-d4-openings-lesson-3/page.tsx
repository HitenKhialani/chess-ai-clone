'use client'

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Chess } from 'chess.js';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

const PGN = `1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. c3 Nc6 6. Nbd2 Bd6`;

const moves = [
  'd4', 'd5', 'Nf3', 'Nf6', 'e3', 'e6', 'Bd3', 'c5', 'c3', 'Nc6', 'Nbd2', 'Bd6'
];

const moveExplanations = [
  "1.d4 d5: White controls the center with d4, Black responds with the solid d5 defense.",
  "2.Nf3 Nf6: White develops the kingside knight, Black develops naturally and attacks the center.",
  "3.e3 e6: White supports the center with e3 (Colle System), Black prepares kingside development.",
  "4.Bd3 c5: White develops the bishop to d3, Black prepares queenside expansion.",
  "5.c3 Nc6: White prepares for central expansion, Black develops the knight naturally.",
  "6.Nbd2 Bd6: White develops the queenside knight, Black develops the bishop actively."
];

const theoryTips = [
  "🎯 Control the center with pawns and pieces",
  "⚡ Develop knights before bishops in the Colle",
  "🛡️ Castle early for king safety",
  "🎪 Prepare for kingside attacks",
  "📐 Maintain harmonious piece coordination"
];

export default function OneD4OpeningsLesson3() {
  const [game, setGame] = React.useState(new Chess());
  const [moveIdx, setMoveIdx] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(false);

  React.useEffect(() => {
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
      for(let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess();
      for(let i = 0; i < moveIdx - 1; i++) {
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
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)]">
      {/* Back Navigation Bar */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link
            href="/learn/courses/one-d4-openings" 
            className="flex items-center text-[var(--primary-foreground)] hover:text-[var(--primary-foreground)] transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Back to Course</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Lesson 3: D4 Openings – Colle System
          </h1>
          <p className="text-[var(--primary-foreground)]">
            Master the attacking Colle System
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TOP SECTION - Responsive Two Column Layout */}
        <div className="min-h-[60vh] layout-flexible p-responsive">
          {/* LEFT CARD - Chess Board (Responsive Width) */}
          <div className="w-responsive-left bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] rounded-2xl p-responsive border border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center">
            <h3 className="text-lg lg:text-xl font-bold mb-4 text-[var(--accent)] text-center">
              Interactive Chess Board
            </h3>
            
            <div className="flex justify-center items-center mb-4">
              <ReactChessboard
                position={game.fen()}
                boardWidth={380}
                customBoardStyle={{
                  borderRadius: "16px",
                  boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.3)"
                }}
              />
            </div>

            {/* Enhanced Move Controls - Responsive Layout */}
            <div className="flex flex-wrap gap-responsive justify-center mb-4 w-full">
              <button
                className="btn-responsive bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1 min-w-[80px] max-w-[120px]"
                onClick={prevMove}
                disabled={moveIdx === 0}
              >
                ← Previous
              </button>
              <button
                className="btn-responsive bg-[var(--accent)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1 min-w-[80px] max-w-[120px]"
                onClick={nextMove}
                disabled={moveIdx >= moves.length}
              >
                Next →
              </button>
              <button
                className="btn-responsive bg-[var(--muted)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--muted)] font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1 min-w-[80px] max-w-[120px]"
                onClick={reset}
              >
                Reset
              </button>
              <button
                className="btn-responsive bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1 min-w-[80px] max-w-[120px]"
                onClick={replay}
              >
                Replay
              </button>
            </div>

            <div className="flex gap-3 justify-center mb-4 w-full">
              <button
                className="btn-responsive-lg bg-[var(--highlight)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--highlight)] hover:opacity-80 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full max-w-[200px]"
                onClick={() => setAutoplay(!autoplay)}
              >
                {autoplay ? '⏸️ Pause' : '▶️ Auto-Play'}
              </button>
            </div>

            {/* Enhanced Move Counter */}
            <div className="text-center mt-3 w-full">
              <div className="bg-[var(--card)] rounded-lg px-4 py-2 shadow-md inline-block">
                <span className="text-xs lg:text-sm font-semibold text-[var(--accent)]">
                  Move {Math.floor(moveIdx / 2)} of {Math.floor(moves.length / 2)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Explanation Panel (Responsive Width) */}
          <div className="w-responsive-right bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] rounded-2xl p-responsive border border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Lesson Info */}
            <div className="flex items-center mb-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full flex items-center justify-center text-base lg:text-lg font-bold mr-3 shadow-lg">
                3
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-[var(--accent)]">
                  Colle System
                </h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-[var(--accent)] text-[var(--primary-foreground)] px-2 py-1 rounded text-xs font-semibold shadow-md">
                    Intermediate
                  </span>
                  <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-1 rounded text-xs font-semibold shadow-md">
                    Opening
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Fundamentals Section */}
            <div className="bg-[var(--card)] rounded-xl p-3 lg:p-4 mb-4 shadow-lg">
              <h3 className="font-semibold text-sm lg:text-base mb-3 text-[var(--card-foreground)] flex items-center">
                📚 Fundamentals (Chess Trainer Explanation):
              </h3>
              <p className="text-[var(--muted-foreground)] text-xs lg:text-sm leading-relaxed mb-3">
                The Colle System is an attacking opening that leads to kingside attacks and tactical opportunities. It's characterized by a solid pawn structure and the bishop development to d3. This system is perfect for players who enjoy attacking play and kingside initiatives.
              </p>

              {/* Theory Tips */}
              <div className="bg-gradient-to-r from-[var(--card)] to-[var(--secondary)] rounded-lg p-3">
                <h4 className="font-semibold text-[var(--accent)] mb-2 text-xs lg:text-sm">💡 Key Principles:</h4>
                <ul className="text-xs text-[var(--accent)] space-y-1">
                  {theoryTips.slice(0, 3).map((tip, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enhanced PGN Notation */}
            <div className="bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] rounded-xl p-3 lg:p-4 mb-4 shadow-lg">
              <h4 className="font-semibold text-[var(--card-foreground)] mb-3 text-xs lg:text-sm flex items-center">
                📝 PGN Notation:
              </h4>
              <div className="bg-[var(--background)] text-[var(--accent)] rounded-lg p-3 shadow-inner">
                <div className="font-mono text-xs leading-relaxed">
                  {PGN}
                </div>
              </div>
            </div>

            {/* Enhanced Current Position Info */}
            <div className="bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] rounded-xl p-3 lg:p-4 shadow-lg">
              <h4 className="font-semibold text-[var(--accent)] mb-2 text-xs lg:text-sm flex items-center">
                🎯 Current Position:
              </h4>
              {moveIdx > 0 && moveIdx <= moveExplanations.length && (
                <p className="text-xs lg:text-sm text-[var(--accent)] leading-relaxed">
                  {moveExplanations[moveIdx - 1]}
                </p>
              )}
              {moveIdx === 0 && (
                <p className="text-xs lg:text-sm text-[var(--accent)]">
                  Starting position - White to move
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - Enhanced Step-by-Step Cards with Better Responsiveness */}
        <div className="min-h-[40vh] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-responsive rounded-t-2xl border-t-2 border-[var(--border)]">
          <h3 className="text-responsive-lg font-bold mb-4 text-[var(--accent)] text-center">
            Step-by-Step Explanation
          </h3>

          {/* Responsive Grid Layout for Cards */}
          <div className="grid-responsive gap-responsive-lg">
            {moveExplanations.map((explanation, index) => (
              <div
                key={index}
                onClick={() => {
                  const newGame = new Chess();
                  for(let i = 0; i <= index; i++) {
                    newGame.move(moves[i]);
                  }
                  setGame(newGame);
                  setMoveIdx(index + 1);
                }}
                className={`bg-[var(--card)] rounded-xl p-3 lg:p-4 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 border-2 ${
                  index === moveIdx - 1 
                    ? 'ring-2 ring-[var(--ring)] shadow-xl border-[var(--ring)]' 
                    : 'hover:ring-1 hover:ring-[var(--ring)] border-transparent hover:border-[var(--border)]'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold mr-2 lg:mr-3 shadow-lg text-sm lg:text-base ${
                    index === moveIdx - 1 ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]'
                  }`}>
                    {index + 1}
                  </div>
                  <h4 className={`font-semibold text-xs lg:text-sm ${
                    index === moveIdx - 1 ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                  }`}>
                    Move {index + 1}
                  </h4>
                </div>
                
                <p className="text-xs lg:text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed line-clamp-3">
                  {explanation}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--accent)] font-medium bg-[var(--accent)] px-2 py-1 rounded">
                    {moves[index * 2]} {moves[index * 2 + 1]}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full shadow-sm"></div>
                    <div className="w-2 h-2 bg-[var(--accent-soft)] rounded-full shadow-sm"></div>
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full shadow-sm"></div>
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