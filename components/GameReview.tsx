import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import GameReviewDisplay from './GameReviewDisplay';
import { Chess } from 'chess.js';

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
}

interface GameReviewProps {
  moveHistory: string[];
  onClose?: () => void;
  shouldSave?: boolean;
}

const typeColors: Record<string, string> = {
  Best: 'text-green-600',
  Inaccuracy: 'text-yellow-500',
  Mistake: 'text-orange-500',
  Blunder: 'text-red-600',
};

const typeIcons: Record<string, string> = {
  Brilliant: '✨',
  Great: '👍',
  Best: '✔️',
  Mistake: '❗',
  Miss: '❓',
  Blunder: '??',
};

const placeholderAvatar =
  'https://ui-avatars.com/api/?name=You&background=7C3AED&color=fff&rounded=true&size=64';
const botAvatar =
  'https://ui-avatars.com/api/?name=Bot&background=818cf8&color=fff&rounded=true&size=64';

export const GameReview: React.FC<GameReviewProps> = ({ moveHistory, onClose, shouldSave = true }) => {
  const [review, setReview] = useState<ReviewMove[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!moveHistory || moveHistory.length === 0) return;
    setLoading(true);
    setError(null);
    fetch('/api/analyze-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moves: moveHistory }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(typeof data === 'string' ? data : data.error || 'Failed to analyze game');
          (window as any).lastGameReviewError = data;
          return;
        }
        setReview(data);
        // --- Save report to backend if user is logged in ---
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // Determine result using chess.js
        let result = 'unknown';
        try {
          const chess = new Chess();
          moveHistory.forEach((move) => chess.move(move));
          if (chess.isCheckmate()) {
            // The side who just moved delivered checkmate
            result = chess.turn() === 'w' ? 'loss' : 'win';
          } else if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
            result = 'draw';
          } else if (chess.isGameOver()) {
            // Fallback for other game over states
            result = 'draw';
          }
        } catch (e) {
          // fallback to unknown
        }
        if (token && Array.isArray(data) && data.length > 0 && shouldSave) {
          fetch('/api/users/save-game', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              game_report: data,
              result,
            }),
          });
        }
        // ---
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [moveHistory, shouldSave]);

  // Calculate stats
  const moveTypeCounts = review.reduce(
    (acc, move) => {
      acc[move.type] = (acc[move.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const accuracy = review.length
    ? (
        (moveTypeCounts['Best'] || 0) /
        review.length *
        100
      ).toFixed(1)
    : '0.0';

  // Prepare data for evaluation graph
  const evalData = review.map((move, idx) => ({
    move: idx + 1,
    evaluation: parseFloat(move.evaluation),
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row p-0 relative overflow-hidden">
        {/* Left: Board placeholder */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100">
          <div className="w-[320px] h-[320px] bg-gradient-to-br from-[#f3e8ff] to-[#fff9db] rounded-lg flex items-center justify-center">
            <span className="text-gray-400">(Board preview here)</span>
          </div>
        </div>
        {/* Right: Review panel */}
        <div className="flex-1 p-8 flex flex-col gap-4 min-w-[340px] max-w-[420px]">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-2 text-[#7C3AED]">Game Review</h2>
          {loading && <div className="text-center py-8">Analyzing game...</div>}
          {error && (
            <div className="text-red-500">
              {error}
              {(window as any).lastGameReviewError?.details && (
                <pre className="text-xs text-gray-400 mt-2">{JSON.stringify((window as any).lastGameReviewError.details, null, 2)}</pre>
              )}
            </div>
          )}
          {!loading && !error && review.length > 0 && (
            <GameReviewDisplay review={review} />
          )}
          {/* Game rating and review button */}
          {!loading && !error && review.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div>
                <div className="text-xs text-gray-500">Game Rating</div>
                <div className="font-bold text-2xl text-[#7C3AED]">{Math.max(1000, Math.floor(Number(accuracy) * 20))}</div>
              </div>
              <button
                className="bg-[#7C3AED] hover:bg-[#5b21b6] text-white font-bold px-6 py-2 rounded-lg shadow transition"
                onClick={() => router.push(`/review?moves=${encodeURIComponent(JSON.stringify(moveHistory))}`)}
              >
                Start Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameReview; 