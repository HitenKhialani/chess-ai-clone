import React from 'react';

export default function BishopVsKnightEndgamesOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-[var(--card)] rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Bishop vs Knight Endgames</h1>
            <div className="flex gap-3 items-center mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Intermediate</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded text-sm font-semibold">2 hours</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Course Overview</h2>
        <p className="text-lg mb-4">
          Understanding the strengths and weaknesses of bishops versus knights in endgames is crucial. This course will help you master typical plans, winning techniques, and key positions.
        </p>
        <div className="mb-4 font-semibold">You will learn:</div>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>When the bishop is stronger than the knight.</li>
          <li>Maneuvering to restrict the knight.</li>
          <li>How to create winning pawn structures.</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
        <ol className="list-decimal ml-8 space-y-4">
          <li>
            <span className="font-bold">Good Bishop vs Bad Knight (Easy):</span> <br/>
            Learn how to maximize your bishop's power and dominate closed positions.
          </li>
          <li>
            <span className="font-bold">Restricting the Knight (Intermediate):</span> <br/>
            Force the knight into a passive role while improving king and pawn activity.
          </li>
          <li>
            <span className="font-bold">Winning with the Outside Passed Pawn (Advanced):</span> <br/>
            Use the outside passed pawn to stretch the opponent's defenses.
          </li>
        </ol>
      </div>
    </main>
  );
} 