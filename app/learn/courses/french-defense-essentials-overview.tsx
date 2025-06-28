import React from 'react';

export default function FrenchDefenseEssentialsOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-[var(--card)] rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">French Defense Essentials</h1>
            <div className="flex gap-3 items-center mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Beginner to Intermediate</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded text-sm font-semibold">2.5 hours</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Course Overview</h2>
        <p className="text-lg mb-4">
          The French Defense is a solid and strategic response to 1.e4, focusing on a strong pawn chain and counterattacking potential. This course will guide you through the main lines and explain how to play for both sides.
        </p>
        <div className="mb-4 font-semibold">You will learn:</div>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>Typical pawn structures and breakpoints.</li>
          <li>Counterplay plans for Black.</li>
          <li>Handling White's space advantage.</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
        <ol className="list-decimal ml-8 space-y-4">
          <li>
            <span className="font-bold">Advance Variation – Block the Center (Easy):</span> <br/>
            The Advance Variation leads to closed center positions with long-term pawn maneuvering.
          </li>
          <li>
            <span className="font-bold">Tarrasch Variation – Flexible Structures (Intermediate):</span> <br/>
            The Tarrasch is a modern approach allowing flexible pawn structures and active piece play.
          </li>
          <li>
            <span className="font-bold">Winawer Variation – Complex Play (Advanced):</span> <br/>
            The Winawer leads to sharp and complex positions where both sides must know deep theory.
          </li>
        </ol>
      </div>
    </main>
  );
} 