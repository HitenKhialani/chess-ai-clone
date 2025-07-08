import React from 'react';

export default function AttackingChessOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">Attacking Chess</h1>
          <p className="mb-6">The <b>Attacking Chess</b> course teaches players how to create powerful attacks against the opponent's king and weak squares. Players will develop tactical vision, learn key attack patterns, and build the confidence to sacrifice material for strong initiative.</p>
          <h2 className="text-2xl font-semibold mb-3">You will learn:</h2>
          <ul className="list-disc ml-8 text-base mb-4">
            <li>How to launch attacks against the king and weak squares</li>
            <li>Classic checkmating patterns and tactical motifs</li>
            <li>When and how to sacrifice material for initiative</li>
            <li>How to use pawn storms to break through defenses</li>
            <li>Building confidence in sharp, attacking positions</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
          <ol className="list-decimal ml-8 space-y-4">
            <li><span className="font-bold">Classic Checkmates – Direct Attacks (Easy):</span><br/>Learn classic attacking patterns like the back-rank mate, smothered mate, and basic two-piece checkmates.</li>
            <li><span className="font-bold">Sacrifices to Destroy Defense (Intermediate):</span><br/>Master the art of sacrificing material to break open the king and overwhelm defenses.</li>
            <li><span className="font-bold">Attack with Pawns – The Pawn Storm (Advanced):</span><br/>Use pawn storms to open files, coordinate attacks, and create crushing threats.</li>
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