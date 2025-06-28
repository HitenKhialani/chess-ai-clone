import React from 'react';

export default function QueenEndgamesOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">Queen Endgames</h1>
          <p className="mb-6">The <b>Queen Endgames</b> course explores the sharpest and most dangerous endgames in chess. Players will learn perpetual checks, pawn races, and key drawing techniques. Queen endgames require precision, calculation, and quick decision-making to convert or save positions.</p>
          <h2 className="text-2xl font-semibold mb-3">You will learn:</h2>
          <ul className="list-disc ml-8 text-base mb-4">
            <li>How to use perpetual check to force draws</li>
            <li>Techniques for winning pawn races with the queen</li>
            <li>Centralizing the queen for maximum power</li>
            <li>Key defensive and offensive queen endgame strategies</li>
            <li>Practical calculation and decision-making in sharp endgames</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
          <ol className="list-decimal ml-8 space-y-4">
            <li><span className="font-bold">Perpetual Check – Forcing Draws (Easy):</span><br/>Learn how to create never-ending check sequences and force draws from worse positions.</li>
            <li><span className="font-bold">Pawn Race Endgames – Speed vs. Defense (Intermediate):</span><br/>Master pawn races, tempo tricks, and defensive checks to win or save games.</li>
            <li><span className="font-bold">Centralization – Power of the Queen (Advanced):</span><br/>Use the queen's central power to dominate, restrict, and create unstoppable threats.</li>
          </ol>
          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="font-bold mb-2 text-blue-700">Important Notes:</div>
            <ul className="list-disc ml-6 text-blue-900">
              <li>Each lesson includes a full paragraph explanation with chess trainer insights</li>
              <li>PGNs animate move-by-move on the chessboard</li>
              <li>Step-by-step explanations for every move</li>
              <li>Interactive controls for learning at your own pace</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 