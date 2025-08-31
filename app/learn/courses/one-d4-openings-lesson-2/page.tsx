'use client'

import React, { useState, useEffect } from 'react'

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';
const PGN = `1. d4 Nf6 2. Bf4 d5 3. e3 c5 4. c3 Nc6 5. Nf3 Bg4 6. Nbd2 e6`;
const moves = [ 'd4', 'Nf6', 'Bf4', 'd5', 'e3', 'c5', 'c3', 'Nc6', 'Nf3', 'Bg4', 'Nbd2', 'e6' ];
const moveExplanations = ["1.d4 Nf6: White controls the center with d4, Black responds with the Indian Defense.","2.Bf4 d5: White develops the bishop to f4 (London System), Black challenges the center with d5.","3.e3 c5: White supports the center with e3, Black prepares queenside expansion.","4.c3 Nc6: White prepares for central expansion, Black develops the knight naturally.","5.Nf3 Bg4: White develops the kingside knight, Black pins it with the bishop.","6.Nbd2 e6: White develops the queenside knight, Black prepares kingside development." ];
const theoryTips = ["🎯 Control the center with pawns and pieces","⚡ Develop bishops early in the London System","🛡️ Castle early for king safety","🎪 Prepare for central pawn breaks","📐 Maintain harmonious piece coordination" ];
export default function OneD4OpeningsLesson2() {
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
          <Link href="/learn/courses/one-d4-openings" className="flex items-center text-[var(--primary-foreground)] hover:text-[var(--primary-foreground)] transition-colors duration-200 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Back to Course</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Lesson 2: D4 Openings – London System</h1>
          <p className="text-[var(--primary-foreground)]">Master the solid and flexible London System</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* TOP SECTION - Two Separate Cards */}
        <div className="min-h-[60vh] lg:min-h-[70vh] flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
          {/* LEFT CARD - Chess Board */}
          <div className="w-full lg:w-3/5 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] rounded-2xl p-6 border border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold mb-4 text-[var(--accent)] text-center">Interactive Chess Board</h3>
            <div className="flex justify-center items-center mb-4">
              <ReactChessboard position={game.fen()} boardWidth={320} customBoardStyle={{ borderRadius: "16px", boxShadow: "0 12px 32px -8px rgba(0, 0, 0, 0.3)" }} />
            </div>

            {/* Move Controls */}
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={prevMove} disabled={moveIdx === 0}>← Previous</button>
              <button className="px-4 py-2 bg-[var(--accent)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--accent)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={nextMove} disabled={moveIdx >= moves.length}>Next →</button>
              <button className="px-4 py-2 bg-[var(--muted)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--muted)] text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={reset}>Reset</button>
              <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)] hover:opacity-80 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={replay}>Replay</button>
            </div>

            <div className="flex gap-3 justify-center mb-4">
              <button className="px-6 py-2 bg-[var(--highlight)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--highlight)] hover:opacity-80 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={() => setAutoplay(!autoplay)}>{autoplay ? '⏸️ Pause' : '▶️ Auto-Play'}</button>
            </div>

            {/* Move Counter */}
            <div className="text-center mt-3">
              <div className="bg-[var(--card)] rounded-lg px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-[var(--accent)]">Move {Math.floor(moveIdx / 2)} of {Math.floor(moves.length / 2)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Explanation Panel */}
          <div className="w-full lg:w-2/5 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] rounded-2xl p-6 border border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Lesson Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full flex items-center justify-center text-lg font-bold mr-3 shadow-lg">2</div>
              <div>
                <h2 className="text-xl font-bold text-[var(--accent)]">London System</h2>
                <div className="flex gap-2 mt-1">
                  <span className="bg-[var(--accent)] text-[var(--primary-foreground)] px-2 py-1 rounded text-xs font-semibold shadow-md">Intermediate</span>
                  <span className="bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-1 rounded text-xs font-semibold shadow-md">Opening</span>
                </div>
              </div>
            </div>

            {/* Fundamentals */}
            <div className="bg-[var(--card)] rounded-xl p-4 mb-4 shadow-lg">
              <h3 className="font-semibold text-base mb-3 text-[var(--card-foreground)] flex items-center">📚 Fundamentals (Chess Trainer Explanation):</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-3">The London System is a solid and flexible opening that works against any Black defense. It's characterized by early bishop development to f4 and a solid pawn structure. This system is perfect for players who want a reliable opening that doesn't require extensive memorization.</p>
              <div className="bg-gradient-to-r from-[var(--card)] to-[var(--secondary)] rounded-lg p-3">
                <h4 className="font-semibold text-[var(--accent)] mb-2 text-sm">💡 Key Principles:</h4>
                <ul className="text-xs text-[var(--accent)] space-y-1">
                  {theoryTips.slice(0, 3).map((tip, index) => (
                    <li key={index} className="flex items-center"><span className="mr-2">{tip}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PGN Notation */}
            <div className="bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] rounded-xl p-4 mb-4 shadow-lg">
              <h4 className="font-semibold text-[var(--card-foreground)] mb-3 text-sm flex items-center">📝 PGN Notation:</h4>
              <div className="bg-[var(--background)] text-[var(--accent)] rounded-lg p-3 shadow-inner">
                <div className="font-mono text-xs leading-relaxed">{PGN}</div>
              </div>
            </div>

            {/* Current Position */}
            <div className="bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-[var(--accent)] mb-2 text-sm flex items-center">🎯 Current Position:</h4>
              {moveIdx > 0 && moveIdx <= moveExplanations.length && (
                <p className="text-sm text-[var(--accent)] leading-relaxed">{moveExplanations[moveIdx - 1]}</p>
              )}
              {moveIdx === 0 && (
                <p className="text-sm text-[var(--accent)]">Starting position - White to move</p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - Step-by-Step Cards */}
        <div className="min-h-[40vh] lg:min-h-[30vh] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-4 lg:p-6 rounded-t-2xl border-t-2 border-[var(--border)]">
          <h3 className="text-lg font-bold mb-4 text-[var(--accent)] text-center">Step-by-Step Explanation</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
            {moveExplanations.map((explanation, index) => (
              <div key={index} onClick={() => {
                const newGame = new Chess();
                for (let i = 0; i <= index; i++) { newGame.move(moves[i]); }
                setGame(newGame);
                setMoveIdx(index + 1);
              }}
              className={`flex-shrink-0 w-72 lg:w-80 xl:w-96 bg-[var(--card)] rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 border-2 ${index === moveIdx - 1 ? 'ring-2 ring-[var(--ring)] shadow-xl border-[var(--ring)]' : 'hover:ring-1 hover:ring-[var(--ring)] border-transparent hover:border-[var(--border)]'}`}>
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-bold mr-3 shadow-lg ${index === moveIdx - 1 ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]'}`}>{index + 1}</div>
                  <h4 className={`font-semibold ${index === moveIdx - 1 ? 'text-[var(--accent)]' : 'text-[var(--muted-foreground)]'}`}>Move {index + 1}</h4>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">{explanation}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--accent)] font-medium bg-[var(--accent)] px-2 py-1 rounded">{moves[index * 2]} {moves[index * 2 + 1]}</span>
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
};
