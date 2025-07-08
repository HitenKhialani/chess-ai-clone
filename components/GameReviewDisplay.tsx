import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
}

interface GameReviewDisplayProps {
  review: ReviewMove[];
  summary?: string;
  accuracy?: string;
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

export const GameReviewDisplay: React.FC<GameReviewDisplayProps> = ({ review, summary, accuracy }) => {
  const [collapsed, setCollapsed] = useState(false);
  // Calculate stats
  const moveTypeCounts = review.reduce(
    (acc, move) => {
      acc[move.type] = (acc[move.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const computedAccuracy = accuracy || (review.length
    ? (
        (moveTypeCounts['Best'] || 0) /
        review.length *
        100
      ).toFixed(1)
    : '0.0');

  // Prepare data for evaluation graph
  const evalData = review.map((move, idx) => ({
    move: idx + 1,
    evaluation: parseFloat(move.evaluation),
  }));

  return (
    <div className="game-review-panel bg-[var(--card)] text-[var(--primary-text)] shadow-xl rounded-2xl p-6 font-sans relative">
      {/* Collapsible toggle for mobile */}
      <button
        className="md:hidden absolute top-2 right-2 z-20 bg-white/80 rounded-full shadow p-2 border border-gray-200"
        onClick={() => setCollapsed((c) => !c)}
        aria-label="Toggle move list"
      >
        {collapsed ? (
          <span className="text-lg">☰</span>
        ) : (
          <span className="text-lg">×</span>
        )}
      </button>
      {/* Summary bubble */}
      <div className="bg-[#f6edff] rounded-lg p-3 mb-2 flex items-center gap-3 shadow-sm">
        <img src={placeholderAvatar} alt="You" className="w-10 h-10 rounded-full border-2 border-[#7C3AED]" />
        <span className="text-gray-700 text-sm font-sans">{summary || 'Some good positional play let you seize the advantage in the middlegame.'}</span>
      </div>
      {/* Evaluation graph */}
      <div className="bg-white rounded-lg shadow p-2 mb-2">
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={evalData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
            <XAxis dataKey="move" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip formatter={(v: number) => v.toFixed(2)} labelFormatter={l => `Move ${l}`} />
            <Line type="monotone" dataKey="evaluation" stroke="#7C3AED" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Player info and accuracy */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src={placeholderAvatar} alt="You" className="w-10 h-10 rounded-full border-2 border-[#7C3AED]" />
          <div>
            <div className="font-bold text-[#7C3AED] font-sans">You</div>
            <div className="text-xs text-gray-500 font-sans">Accuracy</div>
            <div className="font-bold text-lg text-[#7C3AED] font-sans">{computedAccuracy}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src={botAvatar} alt="Bot" className="w-10 h-10 rounded-full border-2 border-[#818cf8]" />
          <div>
            <div className="font-bold text-[#818cf8] font-sans">Bot</div>
            <div className="text-xs text-gray-500 font-sans">Accuracy</div>
            <div className="font-bold text-lg text-[#818cf8] font-sans">-</div>
          </div>
        </div>
      </div>
      {/* Move type summary */}
      <div className="grid grid-cols-6 gap-2 text-center mb-2">
        {['Brilliant', 'Great', 'Best', 'Mistake', 'Miss', 'Blunder'].map((type) => (
          <div key={type} className="flex flex-col items-center">
            <span className="text-lg">{typeIcons[type]}</span>
            <span className="text-xs text-gray-500 font-sans">{type}</span>
            <span className={`font-bold font-sans ${typeColors[type] || ''}`}>{moveTypeCounts[type] || 0}</span>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes fade-in-move {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in-move {
          animation: fade-in-move 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default GameReviewDisplay; 