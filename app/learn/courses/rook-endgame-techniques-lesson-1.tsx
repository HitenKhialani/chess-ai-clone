import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

const PGN = `[FEN "8/8/8/8/8/2k5/2P5/2K5 w - - 0 1"]\n\n1. Rc8+ Kd4 2. Kd2 Ke4 3. Rc4+ Kf3 4. Kd3`;

const moves = [
  'Rc8+', 'Kd4', 'Kd2', 'Ke4', 'Rc4+', 'Kf3', 'Kd3'
];

export default function LucenaLesson() {
  const [game, setGame] = useState(new Chess('8/8/8/8/8/2k5/2P5/2K5 w - - 0 1'));
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
      const newGame = new Chess('8/8/8/8/8/2k5/2P5/2K5 w - - 0 1');
      for (let i = 0; i <= moveIdx; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx + 1);
    }
  };

  const prevMove = () => {
    if (moveIdx > 0) {
      const newGame = new Chess('8/8/8/8/8/2k5/2P5/2K5 w - - 0 1');
      for (let i = 0; i < moveIdx - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setMoveIdx(moveIdx - 1);
    }
  };

  const reset = () => {
    setGame(new Chess('8/8/8/8/8/2k5/2P5/2K5 w - - 0 1'));
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
            <h1 className="text-3xl font-bold mb-4">Lesson 1: Lucena Position – Build the Bridge</h1>
            <p className="text-lg mb-6">
              The Lucena position is one of the most important winning techniques in rook endgames. It happens when your pawn has reached the seventh rank and your king is in front of the pawn. The winning method is called building a bridge. The rook creates a shield to block enemy checks, allowing the pawn to promote safely. This technique is essential for winning endgames with a rook and pawn against a rook.
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