import React from 'react';

export default function OneE4OpeningsExplainedOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-[var(--card)] rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">1.e4 Openings Explained</h1>
            <div className="flex gap-3 items-center mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Beginner to Advanced</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded text-sm font-semibold">2 hours</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-3">Course Overview</h2>
        <p className="text-lg mb-4">
          The <strong>1.e4 Openings Explained course</strong> is a perfect introduction to chess openings for players aiming to master classical attacking systems. This course focuses on controlling the center, rapid piece development, and creating tactical opportunities right from the opening moves. The course will guide you through three essential openings: the Italian Game, the Scotch Game, and the King's Gambit, each offering valuable lessons in strategy and attack.
        </p>
        
        <div className="mb-4 font-semibold">You will learn:</div>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>Controlling the center with pawns and pieces</li>
          <li>Rapid piece development strategies</li>
          <li>Creating tactical opportunities early</li>
          <li>Understanding pawn sacrifices for attack</li>
          <li>Classical opening principles and their modern applications</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
        <ol className="list-decimal ml-8 space-y-4">
          <li>
            <span className="font-bold">Italian Game – Attack the Center (Easy):</span> <br/>
            <span className="text-sm text-gray-600">Learn the fundamentals of rapid piece development and central control. This classical opening teaches beginners the importance of space, coordination, and king safety while setting up direct tactical possibilities.</span>
          </li>
          <li>
            <span className="font-bold">Scotch Game – Open the Center Quickly (Intermediate):</span> <br/>
            <span className="text-sm text-gray-600">Discover how to challenge Black's center early and create open lines for your pieces. This direct and aggressive opening creates open lines for bishops and queens, challenging Black's central control.</span>
          </li>
          <li>
            <span className="font-bold">King's Gambit – Sacrifice for Attack (Advanced):</span> <br/>
            <span className="text-sm text-gray-600">Explore the sharp King's Gambit where White sacrifices a pawn on move two to launch a powerful kingside attack. This opening emphasizes fast development, open lines, and tactical sharpness.</span>
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