import React from 'react';

export default function EnglishOpeningOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full bg-[var(--card)] rounded-xl shadow-lg p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">1.c4 Openings Explained</h1>
            <div className="flex gap-3 items-center mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">Beginner to Advanced</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded text-sm font-semibold">2 hours</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Course Overview</h2>
        <p className="text-lg mb-4">
          The <strong>1.c4 Openings Explained course</strong> introduces the English Opening, focusing on flexible pawn structures, flank attacks, and smooth piece development. This course covers the English Four Knights, the Botvinnik System, and the Reversed Sicilian.
        </p>
        <div className="mb-4 font-semibold">You will learn:</div>
        <ul className="list-disc ml-8 text-base mb-4">
          <li>Flexible pawn structures and how to use them</li>
          <li>Flank attacks and piece maneuvering</li>
          <li>Strategic plans in the English Opening</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
        <ol className="list-decimal ml-8 space-y-4">
          <li>
            <span className="font-bold">English Four Knights – Classical Development (Easy):</span> <br/>
            Learn the basics of harmonious development and central control in the English Four Knights.
          </li>
          <li>
            <span className="font-bold">Botvinnik System – Deep Strategic Play (Intermediate):</span> <br/>
            Master the Botvinnik System's long-term pressure and strategic pawn levers.
          </li>
          <li>
            <span className="font-bold">Reversed Sicilian – Flank Attack (Advanced):</span> <br/>
            Use Sicilian-style counterplay with an extra tempo for dynamic flank attacks.
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