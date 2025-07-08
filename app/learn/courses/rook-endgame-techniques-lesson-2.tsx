import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `[FEN "8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1"]\n\n1... Rf6 2. Ka5 Kf3 3. b6 Rf1 4. Ka6 Ke4 5. b7 Ra1+`;

const moves = [
  'Rf6', 'Ka5', 'Kf3', 'b6', 'Rf1', 'Ka6', 'Ke4', 'b7', 'Ra1+'
];

export default function VancuraLesson() {
  const [game, setGame] = useState(new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1'));
  const [moveIdx, setMoveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (autoplay && moveIdx < moves.length) {
      timer = setTimeout(() => {
        nextMove();
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [autoplay, moveIdx]);

  const nextMove = () => {
    if (moveIdx < moves.length) {
      const newGame = new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1');
      for (let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1');
      for (let i = 0; i < moveIdx - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx - 1);
    }
  };

  const reset = () => {
    setGame(new Chess('8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1'));
    setMoveIdx(0);
    setAutoplay(false);
  };

  const replay = () => {
    reset();
    setAutoplay(true);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10 flex justify-center">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8">
        {/* Left: Explanation */}
        <div className="flex-1 bg-[var(--card)] rounded-xl shadow-lg p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">Lesson 2: Vancura Defense – Save with Checks</h1>
            <p className="text-lg mb-6">
              The Vancura Defense is a powerful method to save difficult rook endgames where your opponent has a dangerous passed pawn. The defender's rook stays on the side and gives continuous lateral checks to stop the enemy king from approaching the pawn. Even though the pawn looks close to promoting, the Vancura Defense forces a draw by perfect rook activity.
            </p>
          </div>
          <div className="mt-8">
            <h2 className="font-semibold mb-2">PGN</h2>
            <pre className="bg-gray-900 text-green-300 rounded p-4 text-sm overflow-x-auto">{PGN}</pre>
          </div>
        </div>
        {/* Right: Chessboard */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <ReactChessboard position={game.fen()} boardWidth={400} />
          <div className="flex gap-2 mt-4">
            <button className="btn" onClick={prevMove} disabled={moveIdx === 0}>Previous</button>
            <button className="btn" onClick={nextMove} disabled={moveIdx >= moves.length}>Next</button>
            <button className="btn" onClick={reset}>Reset</button>
            <button className="btn" onClick={replay}>Replay</button>
            <button className="btn" onClick={() => setAutoplay(!autoplay)}>{autoplay ? 'Pause' : 'Auto-Play'}</button>
          </div>
        </div>
      </div>
    </main>
  );
} 