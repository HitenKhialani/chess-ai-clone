import React from 'react';

export default function SicilianDefenseMasteryOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-[var(--card)] rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Sicilian Defense Mastery</h1>
            <div className="flex gap-3 items-center mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Beginner to Advanced</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded text-sm font-semibold">2 hours</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Course Overview</h2>
        <p className="text-lg mb-4">
          The <strong>Sicilian Defense Mastery course</strong> focuses on one of the most aggressive responses to 1.e4. It teaches how to counterattack, create imbalanced positions, and build dynamic pawn structures. This course covers the Najdorf Variation, Dragon Variation, and Accelerated Dragon, each offering unique attacking opportunities.
        </p>
        <div className="mb-4 font-semibold">You will learn:</div>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>How to counterattack and create imbalances</li>
          <li>Dynamic pawn structures and attacking plans</li>
          <li>Key ideas in the Najdorf, Dragon, and Accelerated Dragon</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
        <ol className="list-decimal ml-8 space-y-4">
          <li>
            <span className="font-bold">Najdorf Variation – Dynamic Counterplay (Easy):</span> <br/>
            Learn how to use the Najdorf to create long-term imbalances and dynamic attacks.
          </li>
          <li>
            <span className="font-bold">Dragon Variation – Sharp Tactical Play (Intermediate):</span> <br/>
            Master the Dragon's sharp tactical play and kingside counterattacks.
          </li>
          <li>
            <span className="font-bold">Accelerated Dragon – Fast Development (Advanced):</span> <br/>
            Discover the Accelerated Dragon's fast development and flexible setups.
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