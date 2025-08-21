'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. Kf1 Ke7 2. Ke2 Kd7 3. Kd3 Kc7 4. Kc4 Kb7 5. Kb5 Ka7 6. Ka6 Ka8 7. Ka7 Ka7 8. Ka8 Ka8 9. Ka7 Ka7 10. Ka6 Ka6 11. Ka5 Ka5 12. Ka4 Ka4 13. Ka3 Ka3 14. Ka2 Ka2 15. Ka1 Ka1 16. Ka2 Ka2 17. Ka3 Ka3 18. Ka4 Ka4 19. Ka5 Ka5 20. Ka6 Ka6 21. Ka7 Ka7 22. Ka8 Ka8 23. Ka7 Ka7 24. Ka6 Ka6 25. Ka5 Ka5 26. Ka4 Ka4 27. Ka3 Ka3 28. Ka2 Ka2 29. Ka1 Ka1 30. Ka2 Ka2 31. Ka3 Ka3 32. Ka4 Ka4 33. Ka5 Ka5 34. Ka6 Ka6 35. Ka7 Ka7 36. Ka8 Ka8 37. Ka7 Ka7 38. Ka6 Ka6 39. Ka5 Ka5 40. Ka4 Ka4 41. Ka3 Ka3 42. Ka2 Ka2 43. Ka1 Ka1 44. Ka2 Ka2 45. Ka3 Ka3 46. Ka4 Ka4 47. Ka5 Ka5 48. Ka6 Ka6 49. Ka7 Ka7 50. Ka8 Ka8`;
const moves = [
  'Kf1', 'Ke7', 'Ke2', 'Kd7', 'Kd3', 'Kc7', 'Kc4', 'Kb7', 'Kb5', 'Ka7', 'Ka6', 'Ka8', 'Ka7', 'Ka7', 'Ka8', 'Ka8', 'Ka7', 'Ka7', 'Ka6', 'Ka6', 'Ka5', 'Ka5', 'Ka4', 'Ka4', 'Ka3', 'Ka3', 'Ka2', 'Ka2', 'Ka1', 'Ka1', 'Ka2', 'Ka2', 'Ka3', 'Ka3', 'Ka4', 'Ka4', 'Ka5', 'Ka5', 'Ka6', 'Ka6', 'Ka7', 'Ka7', 'Ka8', 'Ka8', 'Ka7', 'Ka7', 'Ka6', 'Ka6', 'Ka5', 'Ka5', 'Ka4', 'Ka4', 'Ka3', 'Ka3', 'Ka2', 'Ka2', 'Ka1', 'Ka1', 'Ka2', 'Ka2', 'Ka3', 'Ka3', 'Ka4', 'Ka4', 'Ka5', 'Ka5', 'Ka6', 'Ka6', 'Ka7', 'Ka7', 'Ka8', 'Ka8'
];

const moveExplanations = [
  "1.Kf1 Ke7: White's king approaches the center, Black responds with king opposition.",
  "2.Ke2 Kd7: Both kings continue their central approach, maintaining opposition.",
  "3.Kd3 Kc7: Kings move closer to the center, preparing for the endgame phase.",
  "4.Kc4 Kb7: White's king gains central control, Black maintains defensive position.",
  "5.Kb5 Ka7: White's king advances further, Black's king retreats to safety.",
  "6.Ka6 Ka8: White's king reaches the edge, Black's king maintains opposition."
];

const theoryTips = [
  "🎯 Use king opposition to restrict enemy king movement",
  "⚡ Control key squares with your king",
  "🛡️ Maintain king safety in endgames",
  "🎪 Create zugzwang positions",
  "📐 Master basic king and pawn endgames"
];

export default function RookEndgameTechniquesLesson() {
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

      {/* Header */}
      <div className="bg-gradient-to-r from-stone-600 to-gray-600 text-[var(--card-foreground)] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Lesson 1: Rook Endgame Techniques – King Opposition
          </h1>
          <p className="text-stone-100">
            Master fundamental rook endgame principles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TOP 60% - Two Separate Cards */}
        <div className="h-[60vh] flex gap-6 p-6">
          {/* LEFT CARD - Chess Board (Wider) */}
          <div className="w-3/5 bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-950/30 dark:to-gray-950/30 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold mb-4 text-stone-700 dark:text-stone-300 text-center">
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
                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Move {Math.floor(moveIdx/2)} of {Math.floor(moves.length/2)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Explanation Panel (Narrower) */}
          <div className="w-2/5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-[var(--border)] dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Lesson Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-stone-500 text-[var(--card-foreground)] rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-lg">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-700 dark:text-stone-300">
                  Rook Endgame Techniques
                </h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-[var(--accent)] text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Advanced</span>
                  <span className="bg-[var(--primary)] text-[var(--card-foreground)] px-2 py-1 rounded text-xs font-bold shadow-md">Endgame</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Fundamentals Section */}
            <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-xl p-4 mb-4 shadow-lg">
              <h3 className="font-semibold text-base mb-3 text-[var(--card-foreground)] dark:text-gray-200 flex items-center">
                📚 Fundamentals (Chess Trainer Explanation):
              </h3>
              <p className="text-[var(--card-foreground)] dark:text-[var(--muted-foreground)] text-sm leading-relaxed mb-3">
                Rook endgames are among the most common and important endgame types. This lesson teaches fundamental principles like king opposition, rook activity, and pawn structure evaluation.
              </p>
              
              {/* Theory Tips */}
              <div className="bg-gradient-to-r from-stone-50 to-gray-50 dark:from-stone-900/20 dark:to-gray-900/20 rounded-lg p-3">
                <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-2 text-sm">💡 Key Principles:</h4>
                <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1">
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

        {/* BOTTOM 40% - Enhanced Step-by-Step Cards */}
        <div className="h-[40vh] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-t-2xl border-t-2 border-[var(--border)] dark:border-purple-800">
          <h3 className="text-lg font-bold mb-4 text-[var(--accent)] dark:text-purple-300 text-center">
            Step-by-Step Explanation
          </h3>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-600 dark:scrollbar-track-purple-900">
            {moveExplanations.map((explanation, index) => (
              <div
                key={index}
                onClick={() => {
                  const newGame = new Chess('8/8/8/8/8/8/8/8 w - - 0 1');
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