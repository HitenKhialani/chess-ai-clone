import React from 'react';

export default function OneD4RepertoireOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-[var(--card)] rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">1.d4 Repertoire</h1>
            <div className="flex gap-3 items-center mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Beginner to Advanced</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded text-sm font-semibold">2 hours</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Course Overview</h2>
        <p className="text-lg mb-4">
          The <strong>1.d4 Repertoire course</strong> is designed to build a solid and aggressive opening system for White. It focuses on controlling the center with pawns, piece development, and long-term positional advantages. This course will cover the Queen's Gambit, the Nimzo-Indian Defense, and the King's Indian Defense, providing complete step-by-step lessons with interactive boards and PGN explanations. The objective is to empower players to understand the strategic plans and typical tactics arising from these structures.
        </p>
        <div className="mb-4 font-semibold">You will learn:</div>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>How to build and maintain a strong pawn center</li>
          <li>Key plans and tactics in the Queen's Gambit, Nimzo-Indian, and King's Indian</li>
          <li>How to handle both positional and dynamic play</li>
          <li>Strategic ideas for both sides in these openings</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
        <ol className="list-decimal ml-8 space-y-4">
          <li>
            <span className="font-bold">Queen's Gambit – Building Center Dominance:</span> <br/>
            Learn how to use the Queen's Gambit to dominate the center and create long-term pressure.
          </li>
          <li>
            <span className="font-bold">Nimzo-Indian Defense – Control the Center:</span> <br/>
            Discover how to use the Nimzo-Indian to challenge White's center and create imbalances.
          </li>
          <li>
            <span className="font-bold">King's Indian Defense – Break the Stronghold:</span> <br/>
            Explore the dynamic King's Indian Defense and learn how to counterattack against a strong center.
          </li>
        </ol>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">📌 Important Notes:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Each lesson includes a full paragraph explanation with chess trainer insights</li>
            <li>• PGNs animate move-by-move on the chessboard</li>
            <li>• Step-by-step explanations for every move</li>
            <li>• Interactive controls for learning at your own pace</li>
          </ul>
        </div>
      </div>
    </main>
  );
} 