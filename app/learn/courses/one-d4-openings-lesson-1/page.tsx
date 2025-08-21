'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7`;
const moves = [
  'd4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'Nbd7'
];

const moveExplanations = [
  "1.d4 d5: White controls the center with d4, Black responds with the solid d5 defense.",
  "2.c4 e6: White offers the Queen's Gambit, Black declines with e6 maintaining central control.",
  "3.Nc3 Nf6: White develops the knight, Black develops naturally and attacks the c4 pawn.",
  "4.Bg5 Be7: White pins the knight, Black develops the bishop and breaks the pin.",
  "5.e3 O-O: White prepares kingside development, Black castles for king safety.",
  "6.Nf3 Nbd7: White completes kingside development, Black develops the queenside knight."
];

const theoryTips = [
  "🎯 Control the center with pawns and pieces",
  "⚡ Develop knights before bishops",
  "🛡️ Castle early for king safety",
  "🎪 Prepare for central pawn breaks",
  "📐 Maintain harmonious piece coordination"
];

export default function OneD4OpeningsLesson1() {
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
            Lesson 1: D4 Openings – Queen's Gambit
          </h1>
          <p className="text-[var(--primary-foreground)]">
            Master the classic Queen's Gambit opening
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TOP 60% - Two Separate Cards */}
        <div className="h-[60vh] flex gap-6 p-6">
          {/* LEFT CARD - Chess Board (Wider) */}
          <div className="w-3/5 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] rounded-2xl p-6 border border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold mb-4 text-[var(--accent)] text-center">
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
                className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={prevMove}
                disabled={moveIdx === 0}
              >
                ← Previous
              </button>
              <button
                className="px-4 py-2 bg-[var(--accent)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={nextMove}
                disabled={moveIdx >= moves.length}
              >
                Next →
              </button>
              <button
                className="px-4 py-2 bg-[var(--muted)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--muted)] text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={reset}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={replay}
              >
                Replay
              </button>
            </div>

            <div className="flex gap-3 justify-center mb-4">
              <button
                className="px-6 py-2 bg-[var(--highlight)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--highlight)] hover:opacity-80 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setAutoplay(!autoplay)}
              >
                {autoplay ? '⏸️ Pause' : '▶️ Auto-Play'}
              </button>
            </div>

            {/* Enhanced Move Counter */}
            <div className="text-center mt-3">
              <div className="bg-[var(--card)] rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-[var(--accent)]">
                  Move {Math.floor(moveIdx / 2)} of {Math.floor(moves.length / 2)}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Explanation Panel (Narrower) */}
          <div className="w-2/5 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] rounded-2xl p-6 border border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Lesson Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-lg">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--accent)]">
                  Queen's Gambit
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
            <div className="bg-[var(--card)] rounded-xl p-4 mb-4 shadow-lg">
              <h3 className="font-semibold text-base mb-3 text-[var(--card-foreground)] flex items-center">
                📚 Fundamentals (Chess Trainer Explanation):
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-3">
                The Queen's Gambit is one of the most important openings in chess. It's a strategic opening that focuses on controlling the center and creating long-term pressure. This lesson teaches the fundamental ideas behind the Queen's Gambit and how to handle various black responses.
              </p>

              {/* Theory Tips */}
              <div className="bg-gradient-to-r from-[var(--card)] to-[var(--secondary)] rounded-lg p-3">
                <h4 className="font-semibold text-[var(--accent)] mb-2 text-sm">💡 Key Principles:</h4>
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
            <div className="bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] rounded-xl p-4 mb-4 shadow-lg">
              <h4 className="font-semibold text-[var(--card-foreground)] mb-3 text-sm flex items-center">
                📝 PGN Notation:
              </h4>
              <div className="bg-[var(--background)] text-[var(--accent)] rounded-lg p-3 shadow-inner">
                <div className="font-mono text-xs leading-relaxed">{PGN}</div>
              </div>
            </div>

            {/* Enhanced Current Position Info */}
            <div className="bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-[var(--accent)] mb-2 text-sm flex items-center">
                🎯 Current Position:
              </h4>
              {moveIdx > 0 && moveIdx <= moveExplanations.length && (
                <p className="text-sm text-[var(--accent)] leading-relaxed">
                  {moveExplanations[moveIdx - 1]}
                </p>
              )}
              {moveIdx === 0 && (
                <p className="text-sm text-[var(--accent)]">
                  Starting position - White to move
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM 40% - Enhanced Step-by-Step Cards */}
        <div className="h-[40vh] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 rounded-t-2xl border-t-2 border-[var(--border)]">
          <h3 className="text-lg font-bold mb-4 text-[var(--accent)] text-center">
            Step-by-Step Explanation
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
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
                className={`flex-shrink-0 w-80 bg-[var(--card)] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 border-2 ${
                  index === moveIdx - 1
                    ? 'ring-2 ring-[var(--ring)] shadow-xl border-[var(--ring)]'
                    : 'hover:ring-1 hover:ring-blue-300 border-transparent hover:border-[var(--border)]'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold mr-3 shadow-lg ${
                    index === moveIdx - 1 ? 'bg-[var(--primary)]' : 'bg-[var(--card)]0'
                  }`}>
                    {index + 1}
                  </div>
                  <h4 className={`font-semibold ${
                    index === moveIdx - 1 ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'
                  }`}>
                    Move {index + 1}
                  </h4>
                </div>

                <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                  {explanation}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--primary)] font-medium bg-[var(--secondary)] px-2 py-1 rounded">
                    {moves[index * 2]} {moves[index * 2 + 1]}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[var(--accent)] rounded-full shadow-sm"></div>
                    <div className="w-2 h-2 bg-[var(--accent-soft)] rounded-full shadow-sm"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full shadow-sm"></div>
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
