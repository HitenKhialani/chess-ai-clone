'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';
import { useTheme } from 'next-themes';
import { analyzeMovesLocally } from '../../app/lib/stockfish';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect Render at the top level so it's always available
  const isRender = typeof window !== 'undefined' && window.location.hostname.includes('onrender.com');

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
      setLoading(true);
      setError(null);
      // Always use local analysis (frontend only)
      try {
        const chessJsModule = await import('chess.js');
        const ChessClass = chessJsModule.Chess;
        const localReview = await analyzeMovesLocally(moves, ChessClass);
        setReview(localReview);
        setError(null);
      } catch (localErr) {
        setReview([]);
        setError('Failed to analyze game locally.');
      }
      setLoading(false);
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
        {/* Error message display */}
        {error && (
          <div className="text-red-500 text-center my-2">
            {error}
          </div>
        )}
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
                  <div className="font-semibold mb-2 text-sm text-gray-500">Move-by-Move Review</div>
                  <div className="divide-y divide-gray-200">
                    {review.map((move, idx) => (
                      <div key={idx} className="flex items-center py-2 text-sm">
                        <span className="w-8 text-gray-400">{idx + 1}.</span>
                        <span className="w-16 font-mono text-gray-700">{move.move}</span>
                        <span className={`w-20 font-bold flex items-center gap-1
                          ${move.type === 'Best' ? 'text-green-600' :
                            move.type === 'Average' ? 'text-blue-500' :
                            move.type === 'Inaccuracy' ? 'text-yellow-500' :
                            move.type === 'Mistake' ? 'text-orange-500' :
                            move.type === 'Blunder' ? 'text-red-600' : ''}
                        `}>
                          {move.type}
                        </span>
                        <span className="flex-1 text-gray-500 ml-2">{move.explanation}</span>
                        <span className="w-12 text-right text-gray-400">{move.evaluation}</span>
                      </div>
                    ))}
                  </div>
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