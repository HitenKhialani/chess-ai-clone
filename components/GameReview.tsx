import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import GameReviewDisplay from './GameReviewDisplay';
import { Chess } from 'chess.js';
import { analyzeMovesLocally } from '../app/lib/stockfish';
import dynamic from 'next/dynamic';

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

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

export const GameReview: React.FC<GameReviewProps> = ({ moveHistory, onClose, shouldSave = true }) => {
  const [review, setReview] = useState<ReviewMove[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fen, setFen] = useState('start');
  const [simIndex, setSimIndex] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const simTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!moveHistory || moveHistory.length === 0) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const chessJsModule = await import('chess.js');
        const ChessClass = chessJsModule.Chess;
        const localReview = await analyzeMovesLocally(moveHistory, ChessClass);
        setReview(localReview);
        setError(null);
      } catch (localErr) {
        setReview([]);
        setError('Failed to analyze game locally.');
      }
      setLoading(false);
    })();
  }, [moveHistory, shouldSave]);

  // Reset board to start when modal opens or moveHistory changes
  useEffect(() => {
    setFen('start');
    setSimIndex(0);
    setSimulating(false);
    if (simTimeout.current) clearTimeout(simTimeout.current);
  }, [moveHistory]);

  // Simulate moves
  useEffect(() => {
    if (!simulating) return;
    if (simIndex > moveHistory.length) return;
    const runSim = async () => {
      const chessJsModule = await import('chess.js');
      const ChessClass = chessJsModule.Chess;
      const chess = new ChessClass();
      for (let i = 0; i < simIndex; i++) {
        chess.move(moveHistory[i]);
      }
      setFen(chess.fen());
      if (simIndex < moveHistory.length) {
        simTimeout.current = setTimeout(() => setSimIndex(idx => idx + 1), 1000);
      } else {
        setSimulating(false);
      }
    };
    runSim();
    return () => { if (simTimeout.current) clearTimeout(simTimeout.current); };
  }, [simIndex, simulating, moveHistory]);

  const handleStart = () => {
    setSimIndex(1);
    setSimulating(true);
  };
  const handleStop = () => {
    setSimulating(false);
    if (simTimeout.current) clearTimeout(simTimeout.current);
  };

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
        {/* Left: Board preview with simulation */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-100 py-8 gap-4">
          <div className="w-[320px] h-[320px] bg-gradient-to-br from-[#f3e8ff] to-[#fff9db] rounded-lg flex items-center justify-center">
            <Chessboard position={fen} boardWidth={300} />
          </div>
          <div className="flex gap-4 mt-2">
            <button onClick={handleStart} disabled={simulating} className="px-4 py-2 rounded bg-[#7C3AED] text-white font-bold disabled:opacity-50">Start</button>
            <button onClick={handleStop} disabled={!simulating} className="px-4 py-2 rounded bg-gray-400 text-white font-bold disabled:opacity-50">Stop</button>
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