import React from 'react';

export default function RookEndgameTechniquesOverview() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">Rook Endgame Techniques</h1>
          <p className="mb-6">The <b>Rook Endgame Techniques</b> course focuses on the most common and essential endgames in chess. Players will learn key concepts such as active rooks, the importance of the seventh rank, and defensive methods to save draws. These lessons are practical and game-saving, providing the foundation for endgame mastery.</p>
          <h2 className="text-2xl font-semibold mb-3">You will learn:</h2>
          <ul className="list-disc ml-8 text-base mb-4">
            <li>How to activate your rook for maximum impact</li>
            <li>The golden rule: placing the rook behind passed pawns</li>
            <li>Techniques for cutting off the enemy king</li>
            <li>Lucena and Philidor positions for winning and drawing</li>
            <li>Practical defensive and offensive strategies in rook endgames</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-3">Lessons Included</h2>
          <ol className="list-decimal ml-8 space-y-4">
            <li><span className="font-bold">The Active Rook – Key to Winning (Easy):</span><br/>Learn why an active rook is the most powerful piece in the endgame. Discover how to invade open files, cut off the enemy king, and win pawns.</li>
            <li><span className="font-bold">Rook Behind Passed Pawn – The Golden Rule (Intermediate):</span><br/>Master the essential rule of placing your rook behind passed pawns, whether you are attacking or defending. Coordinate your rook and king for smooth conversion.</li>
            <li><span className="font-bold">Lucena & Philidor Positions – Essential Endgame Knowledge (Advanced):</span><br/>Understand the Lucena (winning) and Philidor (drawing) positions—cornerstones of rook endgame technique. Learn how to win or save a draw in these classic scenarios.</li>
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