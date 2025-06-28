'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Chess } from 'chess.js';

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
}

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const movesParam = searchParams.get('moves');
  const [moves, setMoves] = useState<string[]>([]);
  const [review, setReview] = useState<ReviewMove[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [fen, setFen] = useState('');

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

  return (
    <div className="min-h-screen krishna-gradient text-white p-4 flex flex-col items-center relative overflow-hidden">
      <div className="bg-wallpaper-corner krishna-image-glow" />
      <div className="relative z-10 w-full">
        <h1 className="text-3xl font-bold mb-4 text-rgb(153, 0, 255) text-center">Detailed Game Review</h1>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="krishna-card rounded-lg shadow p-4 mb-4 purple-glow">
              <Chessboard position={fen} boardWidth={400} />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setCurrentMove(0)} className="px-2 py-1 bg-gradient-to-r from-rgb(76, 0, 255) to-rgb(153, 0, 255) text-white rounded hover:from-rgb(153, 0, 255) hover:to-rgb(76, 0, 255) transition-all duration-300">|&lt;</button>
              <button onClick={() => setCurrentMove(m => Math.max(0, m - 1))} className="px-2 py-1 bg-gradient-to-r from-rgb(76, 0, 255) to-rgb(153, 0, 255) text-white rounded hover:from-rgb(153, 0, 255) hover:to-rgb(76, 0, 255) transition-all duration-300">&lt;</button>
              <span className="px-2 py-1 text-white">Move {currentMove} / {moves.length}</span>
              <button onClick={() => setCurrentMove(m => Math.min(moves.length, m + 1))} className="px-2 py-1 bg-gradient-to-r from-rgb(76, 0, 255) to-rgb(153, 0, 255) text-white rounded hover:from-rgb(153, 0, 255) hover:to-rgb(76, 0, 255) transition-all duration-300">&gt;</button>
              <button onClick={() => setCurrentMove(moves.length)} className="px-2 py-1 bg-gradient-to-r from-rgb(76, 0, 255) to-rgb(153, 0, 255) text-white rounded hover:from-rgb(153, 0, 255) hover:to-rgb(76, 0, 255) transition-all duration-300">&gt;|</button>
            </div>
          </div>
          <div className="flex-1 krishna-card rounded-lg shadow p-6 text-white overflow-y-auto max-h-[600px] purple-glow">
            <h2 className="text-xl font-bold mb-4 text-rgb(153, 0, 255)">Move-by-Move Review</h2>
            <ol className="space-y-2">
              {review.map((move, idx) => (
                <li key={idx} className={`p-2 rounded ${idx === currentMove - 1 ? 'bg-rgb(153, 0, 255)/20' : ''}`}>
                  <span className="font-mono text-rgb(200, 200, 200)">{idx + 1}.</span>{' '}
                  <span className="font-semibold text-white">{move.move}</span>{' '}
                  <span className={`font-bold ml-2 ${move.type === 'Best' ? 'text-green-400' : move.type === 'Mistake' ? 'text-orange-400' : move.type === 'Blunder' ? 'text-red-400' : 'text-rgb(200, 200, 200)'}`}>{move.type}</span>{' '}
                  <span className="ml-2 text-xs text-rgb(200, 200, 200)">Eval: {move.evaluation}</span>
                  <div className="text-xs text-rgb(200, 200, 200) mt-1">{move.explanation}</div>
                </li>
              ))}
            </ol>
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