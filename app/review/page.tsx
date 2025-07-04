'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';
import { useTheme } from 'next-themes';

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const movesParam = searchParams.get('moves');
  const [moves, setMoves] = useState<string[]>([]);
  const [review, setReview] = useState<ReviewMove[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [fen, setFen] = useState('');
  const [collapsed, setCollapsed] = useState(true);
  const moveRefs = useRef<(HTMLLIElement | null)[]>([]);
  const { theme } = useTheme();
  const [moveItemHeight, setMoveItemHeight] = useState(76);

  useEffect(() => {
    if (movesParam) {
      try {
        setMoves(JSON.parse(decodeURIComponent(movesParam)));
      } catch {
        setMoves([]);
      }
    }
  }, [movesParam]);

  useEffect(() => {
    async function fetchReview() {
      if (!moves.length) return;
      const res = await fetch('/api/analyze-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moves }),
      });
      const data = await res.json();
      setReview(data);
    }
    fetchReview();
  }, [moves]);

  useEffect(() => {
    const chess = new Chess();
    for (let i = 0; i < currentMove; i++) {
      chess.move(moves[i]);
    }
    setFen(chess.fen());
  }, [moves, currentMove]);

  useEffect(() => {
    if (moveRefs.current[currentMove]) {
      moveRefs.current[currentMove].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentMove]);

  useEffect(() => {
    if (moveRefs.current[0]) {
      setMoveItemHeight(moveRefs.current[0].offsetHeight || 76);
    }
  }, [review, theme]);

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center relative overflow-hidden font-sans ${theme === 'dark' ? 'bg-[#10182b] text-white' : 'bg-[#f8ddca] text-gray-900'}`}>
      <div className="relative z-10 w-full">
        <h1 className={`text-3xl font-bold mb-4 text-center drop-shadow ${theme === 'dark' ? 'text-blue-200' : 'text-[#d4845c]'}`}>Detailed Game Review</h1>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto">
          <div className="flex flex-col items-center w-full md:w-auto">
            <div className={`rounded-2xl shadow-xl p-4 mb-4 w-full max-w-xs md:max-w-none flex items-center justify-center ${theme === 'dark' ? 'bg-[#1a233a]' : 'bg-white'}` }>
              <Chessboard position={fen} boardWidth={340} />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setCurrentMove(0)} className={`px-2 py-1 rounded shadow transition-all duration-300 ${theme === 'dark' ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' : 'bg-[#d4845c] text-white hover:bg-[#b96a47]'}`}>|&lt;</button>
              <button onClick={() => setCurrentMove(m => Math.max(0, m - 1))} className={`px-2 py-1 rounded shadow transition-all duration-300 ${theme === 'dark' ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' : 'bg-[#d4845c] text-white hover:bg-[#b96a47]'}`}>&lt;</button>
              <span className={`px-2 py-1 font-sans ${theme === 'dark' ? 'text-blue-100' : 'text-gray-700'}`}>Move {currentMove} / {moves.length}</span>
              <button onClick={() => setCurrentMove(m => Math.min(moves.length, m + 1))} className={`px-2 py-1 rounded shadow transition-all duration-300 ${theme === 'dark' ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' : 'bg-[#d4845c] text-white hover:bg-[#b96a47]'}`}>&gt;</button>
              <button onClick={() => setCurrentMove(moves.length)} className={`px-2 py-1 rounded shadow transition-all duration-300 ${theme === 'dark' ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' : 'bg-[#d4845c] text-white hover:bg-[#b96a47]'}`}>&gt;|</button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className={`krishna-card rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[600px] font-sans transition-all duration-500 ease-in-out ${theme === 'dark' ? 'bg-[#1a233a] text-blue-100' : 'bg-white/90 text-gray-900'}`}>
              <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-blue-200' : 'text-[#d4845c]'}`}>Move-by-Move Review</h2>
              {/* Collapsible move list for mobile */}
              <button
                className={`md:hidden absolute top-2 right-2 z-20 rounded-full shadow p-2 border ${theme === 'dark' ? 'bg-[#10182b] border-blue-900' : 'bg-white/80 border-gray-200'}`}
                onClick={() => setCollapsed((c) => !c)}
                aria-label="Toggle move list"
              >
                {collapsed ? (
                  <span className="text-lg">☰</span>
                ) : (
                  <span className="text-lg">×</span>
                )}
              </button>
              <div className={`transition-all duration-500 ease-in-out ${collapsed ? 'translate-x-full opacity-0 pointer-events-none absolute' : 'opacity-100 relative'} md:opacity-100 md:relative md:translate-x-0`}> 
                <div className="relative mt-4">
                  {/* Sliding highlight bar */}
                  <div
                    className="absolute left-0 w-full z-0 transition-transform duration-300 ease-in-out"
                    style={{
                      height: moveItemHeight,
                      transform: `translateY(${currentMove * moveItemHeight}px)`
                    }}
                  >
                    <div className={`mx-0.5 rounded-2xl shadow-lg h-[${moveItemHeight - 8}px] scale-105 animate-highlight-bar
                      ${theme === 'dark' ? 'bg-blue-900' : 'bg-[#e6a06a]'}
                    `} />
                  </div>
                  <ol className="space-y-2 relative z-10">
                    {review.map((move, idx) => (
                      <li
                        key={idx}
                        ref={el => { moveRefs.current[idx] = el; }}
                        className={`p-3 rounded-xl flex flex-col shadow-sm font-sans transition-all duration-500 ease-in-out animate-fade-in-move
                          ${theme === 'dark' ? 'bg-[#232c43]/80' : 'bg-white/80'}`}
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-500">{idx + 1}.</span>
                          <span className={`font-semibold font-sans ${theme === 'dark' ? 'text-blue-100' : 'text-gray-900'}`}>{move.move}</span>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold font-sans
                            ${move.type === 'Best' ? (theme === 'dark' ? 'bg-green-900 text-green-200 border border-green-700' : 'bg-green-100 text-green-700 border border-green-300') :
                              move.type === 'Inaccuracy' ? (theme === 'dark' ? 'bg-yellow-900 text-yellow-200 border border-yellow-700' : 'bg-yellow-100 text-yellow-800 border border-yellow-300') :
                              move.type === 'Mistake' ? (theme === 'dark' ? 'bg-orange-900 text-orange-200 border border-orange-700' : 'bg-orange-100 text-orange-700 border border-orange-300') :
                              move.type === 'Blunder' ? (theme === 'dark' ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-100 text-red-700 border border-red-300') :
                              (theme === 'dark' ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-300')}
                          `}>{move.type}</span>
                          <span className={`ml-2 text-xs font-sans ${theme === 'dark' ? 'text-blue-200' : 'text-gray-500'}`}>Eval: {move.evaluation}</span>
                        </div>
                        <div className={`text-xs mt-1 font-sans ${theme === 'dark' ? 'text-blue-200' : 'text-gray-600'}`}>{move.explanation}</div>
                        {move.bestMove && move.bestMove !== move.move && (
                          <div className="text-xs text-blue-600 mt-1 font-sans">
                            Best move: <span className="font-mono">{move.bestMove}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <style jsx>{`
                @keyframes fade-in-move {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: none; }
                }
                .animate-fade-in-move {
                  animation: fade-in-move 0.5s both;
                }
                @keyframes highlight-bar {
                  0% { box-shadow: 0 0 0 0 ${theme === 'dark' ? '#22336688, 0 2px 8px #22336644' : '#e6a06a88, 0 2px 8px #d4845c44'}; transform: scale(1.02); }
                  50% { box-shadow: 0 0 16px 4px ${theme === 'dark' ? '#22336688, 0 2px 16px #22336644' : '#e6a06a88, 0 2px 16px #d4845c44'}; transform: scale(1.07); }
                  100% { box-shadow: 0 0 0 0 ${theme === 'dark' ? '#22336688, 0 2px 8px #22336644' : '#e6a06a88, 0 2px 8px #d4845c44'}; transform: scale(1.02); }
                }
                .animate-highlight-bar {
                  animation: highlight-bar 0.4s;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen krishna-gradient flex items-center justify-center text-white">Loading review...</div>}>
      <ReviewPageContent />
    </Suspense>
  );
}