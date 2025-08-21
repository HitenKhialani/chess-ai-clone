'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6`;

const moves = [
  'e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bc5', 'Be3', 'Qf6'
];

const moveExplanations = [
  "1.e4 e5: Classic central battle - both sides establish central pawn presence.",
  "2.Nf3 Nc6: Standard development - White's knight attacks e5, Black's defends it.",
  "3.d4: White challenges the center immediately - this is the key move of the Scotch Game.",
  "4.Nxd4: Gains open lines for quick development - White recaptures with the knight.",
  "5.Be3 Qf6: Black defends and targets d4 and b2 - Black develops with tempo."
];

const theoryTips = [
  "🎯 Challenge the center early and aggressively",
  "⚡ Create open lines for bishops and queens",
  "🛡️ Maintain active piece play",
  "🎪 Prefer tactical opportunities over closed positions",
  "📐 Develop pieces to their most active squares"
];

export default function ScotchGameLesson() {
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
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)]">
      {/* Back Navigation Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-[var(--card-foreground)] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link 
            href="/learn/courses/one-e4-openings-explained" 
            className="flex items-center text-[var(--card-foreground)] hover:text-[var(--card-foreground)]/80 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-bold">Back to Course</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-[var(--card-foreground)] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Lesson 2: Scotch Game – Open the Center Quickly
          </h1>
          <p className="text-blue-100">
            Learn the fundamentals of rapid piece development and central control
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* TOP SECTION - Two Separate Cards */}
        <div className="min-h-[60vh] lg:min-h-[70vh] flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
          {/* LEFT CARD - Chess Board */}
          <div className="w-full lg:w-3/5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 border border-[var(--border)] dark:border-green-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold mb-4 text-[var(--accent)] dark:text-green-300 text-center">
              Interactive Chess Board
            </h3>
            
            <div className="flex justify-center items-center mb-4">
              <ReactChessboard 
                position={game.fen()} 
                boardWidth={320}
                customBoardStyle={{
                  borderRadius: "16px",
                  boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.3)"
                }}
              />
            </div>

            {/* Enhanced Move Controls */}
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <button 
                className="px-4 py-2 bg-[var(--primary)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                onClick={prevMove} 
                disabled={moveIdx === 0}
              >
                ← Previous
              </button>
              <button 
                className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                onClick={nextMove} 
                disabled={moveIdx >= moves.length}
              >
                Next →
              </button>
              <button 
                className="px-4 py-2 bg-gray-600 text-[var(--card-foreground)] rounded-lg hover:bg-[var(--secondary)] text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                onClick={reset}
              >
                Reset
              </button>
              <button 
                className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                onClick={replay}
              >
                Replay
              </button>
            </div>

            <div className="flex gap-3 justify-center mb-4">
              <button 
                className="px-6 py-2 bg-[var(--primary)] text-[var(--card-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                onClick={() => setAutoplay(!autoplay)}
              >
                {autoplay ? '⏸️ Pause' : '▶️ Auto-Play'}
              </button>
            </div>

            {/* Enhanced Move Counter */}
            <div className="text-center mt-3">
              <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-[var(--accent)] dark:text-green-300">
                  Move {Math.floor(moveIdx/2)} of {Math.floor(moves.length/2)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Explanation Panel */}
          <div className="w-full lg:w-2/5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-[var(--border)] dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Lesson Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[var(--card)]0 text-[var(--card-foreground)] rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-lg">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--primary)] dark:text-blue-300">
                  Scotch Game
                </h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-yellow-600 text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Intermediate</span>
                  <span className="bg-[var(--primary)] text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Direct</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Fundamentals Section */}
            <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-xl p-4 mb-4 shadow-lg">
              <h3 className="font-semibold text-base mb-3 text-[var(--card-foreground)] dark:text-gray-200 flex items-center">
                📚 Fundamentals (Chess Trainer Explanation):
              </h3>
              <p className="text-[var(--card-foreground)] dark:text-[var(--muted-foreground)] text-sm leading-relaxed mb-3">
                The Scotch Game is a direct and aggressive opening where White seeks to open the center quickly to gain space and attacking chances. It creates open lines for the bishops and queens, and challenges Black's central control in the early game. This opening is perfect for players who prefer active piece play and tactical opportunities over closed, strategic positions.
              </p>
              
              {/* Theory Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-sm">💡 Key Principles:</h4>
                <ul className="text-xs text-[var(--primary)] dark:text-blue-300 space-y-1">
                  {theoryTips.slice(0, 3).map((tip, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enhanced PGN Notation */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 mb-4 shadow-lg">
              <h4 className="font-semibold text-[var(--card-foreground)] dark:text-gray-200 mb-3 text-sm flex items-center">
                📝 PGN Notation:
              </h4>
              <div className="bg-[var(--background)] text-green-300 rounded-lg p-3 shadow-inner">
                <div className="font-mono text-xs leading-relaxed">{PGN}</div>
              </div>
            </div>

            {/* Enhanced Current Position Info */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 text-sm flex items-center">
                🎯 Current Position:
              </h4>
              {moveIdx > 0 && moveIdx <= moveExplanations.length && (
                <p className="text-sm text-[var(--accent)] dark:text-purple-300 leading-relaxed">
                  {moveExplanations[moveIdx - 1]}
                </p>
              )}
              {moveIdx === 0 && (
                <p className="text-sm text-[var(--accent)] dark:text-purple-300">
                  Starting position - White to move
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - Enhanced Step-by-Step Cards */}
        <div className="min-h-[40vh] lg:min-h-[30vh] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 lg:p-6 rounded-t-2xl border-t-2 border-[var(--border)] dark:border-purple-800">
          <h3 className="text-lg font-bold mb-4 text-[var(--accent)] dark:text-purple-300 text-center">
            Step-by-Step Explanation
          </h3>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-600 dark:scrollbar-track-purple-900">
            {moveExplanations.map((explanation, index) => (
              <div
                key={index}
                onClick={() => {
                  const newGame = new Chess();
                  for (let i = 0; i <= index; i++) {
                    newGame.move(moves[i]);
                  }
                  setGame(newGame);
                  setMoveIdx(index + 1);
                }}
                className={`flex-shrink-0 w-72 lg:w-80 xl:w-96 bg-[var(--card)] dark:bg-[var(--card)] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 border-2 ${
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
                  {explanation}
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