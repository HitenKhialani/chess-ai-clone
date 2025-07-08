import React from 'react';

export default function DefensiveMasteryOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">Defensive Mastery</h1>
          <p className="mb-6">The <b>Defensive Mastery</b> course helps players develop the skills to survive tough attacks and save difficult positions. Players will learn to block, exchange pieces effectively, and use defensive tactics to neutralize pressure and counterattack.</p>
          <h2 className="text-2xl font-semibold mb-3">You will learn:</h2>
          <ul className="list-disc ml-8 text-base mb-4">
            <li>How to block and exchange pieces to neutralize attacks</li>
            <li>When to simplify and remove key attacking pieces</li>
            <li>How to use defensive tactics to survive pressure</li>
            <li>Turning defense into counterattack opportunities</li>
            <li>Staying calm and accurate under pressure</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
          <ol className="list-decimal ml-8 space-y-4">
            <li><span className="font-bold">Finding Only Moves – Survive Under Pressure (Easy):</span><br/>Players learn to calmly find the only move to survive critical attacks. These lessons focus on forcing sequences, accurate defense, and staying composed under intense pressure.</li>
            <li><span className="font-bold">The Art of Exchange – Removing Attackers (Intermediate):</span><br/>Exchanging key attacking pieces can dismantle enemy plans. Players learn when to simplify, how to trade effectively, and how to steer the game toward safer positions by neutralizing threats.</li>
            <li><span className="font-bold">Defensive Counterattack – Turn Defense into Offense (Advanced):</span><br/>Great defenders can turn defense into powerful counterattacks. Players learn how to absorb pressure, time defensive pawn breaks, and quickly reverse the initiative against overextended attackers.</li>
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