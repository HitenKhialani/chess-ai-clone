import React from 'react';

export default function IndianDefensesOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-[var(--card)] rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Indian Game Structures Explained</h1>
            <div className="flex gap-3 items-center mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Beginner to Advanced</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded text-sm font-semibold">2 hours</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Course Overview</h2>
        <p className="text-lg mb-4">
          The <strong>Indian Game Structures Explained course</strong> explores openings where Black allows White to build a big center, planning to counterattack later. These openings emphasize flexible pawn structures, deep strategies, and dynamic counterplay. This course covers the Old Indian Defense, Grünfeld Defense, and Benoni Defense.
        </p>
        <div className="mb-4 font-semibold">You will learn:</div>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>How to play for counterattack against a big center</li>
          <li>Key pawn structures and their strategic plans</li>
          <li>Dynamic play and timing pawn breaks</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
        <ol className="list-decimal ml-8 space-y-4">
          <li>
            <span className="font-bold">Old Indian Defense – Classical Solid Defense (Easy):</span> <br/>
            Learn how to build a solid defensive structure and prepare for counterplay in the Old Indian.
          </li>
          <li>
            <span className="font-bold">Grünfeld Defense – Hypermodern Counterattack (Intermediate):</span> <br/>
            Master the Grünfeld's dynamic piece play and center attacks.
          </li>
          <li>
            <span className="font-bold">Benoni Defense – Aggressive Pawn Play (Advanced):</span> <br/>
            Explore the Benoni's sharp pawn breaks and tactical counterplay.
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