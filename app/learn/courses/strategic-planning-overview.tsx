import React from 'react';

export default function StrategicPlanningOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">Strategic Planning</h1>
          <p className="mb-6">The <b>Strategic Planning</b> course focuses on long-term chess understanding. Players will learn how to create winning plans, improve their weakest pieces, and make positional decisions that win games without rushing into tactics.</p>
          <h2 className="text-2xl font-semibold mb-3">You will learn:</h2>
          <ul className="list-disc ml-8 text-base mb-4">
            <li>How to identify and improve your worst piece</li>
            <li>Creating long-term plans based on pawn structures</li>
            <li>Making positional decisions that win games</li>
            <li>Prophylactic thinking to prevent opponent's ideas</li>
            <li>Strategic planning without rushing into tactics</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
          <ol className="list-decimal ml-8 space-y-4">
            <li><span className="font-bold">Improving the Worst Piece (Easy):</span><br/>A simple but powerful strategic rule is to improve your worst piece. Players learn to reposition bad pieces to stronger squares, increase coordination, and enhance activity step-by-step.</li>
            <li><span className="font-bold">Creating a Long-Term Plan (Intermediate):</span><br/>Players learn to develop long-term positional plans based on pawn structures, weak squares, and open files. Planning helps guide piece placement and pawn breaks toward favorable endgames.</li>
            <li><span className="font-bold">Prophylactic Thinking – Prevent Opponent's Ideas (Advanced):</span><br/>Prophylaxis means stopping the opponent's plans before they start. Players learn how to predict threats, restrict key squares, and quietly prevent tactical shots and active ideas from the opponent.</li>
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