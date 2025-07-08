'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';

const Chessboard = dynamic(
  () => import('react-chessboard').then((m) => m.Chessboard),
  { ssr: false }
);

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [game] = useState(() => {
    const chess = new Chess();
    // Set up an interesting position (Sicilian Defense)
    chess.move('e4');
    chess.move('c5');
    chess.move('Nf3');
    chess.move('d6');
    chess.move('d4');
    chess.move('cxd4');
    chess.move('Nxd4');
    chess.move('Nf6');
    chess.move('Nc3');
    chess.move('a6');
    return chess;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden">
      <div className="bg-wallpaper krishna-image-glow" />
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-20 relative z-10">
        {/* Left: Hero Text */}
        <div className="flex-1 max-w-xl">
          <div className="mb-4">
            <span className="inline-block card text-[var(--primary-text)] px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-[var(--accent)]">AI-Powered Chess Training</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight text-[var(--primary-text)]">Endgame</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[var(--secondary-text)]">Where AI Learning Begins</h2>
          <p className="mb-8 text-lg text-[var(--secondary-text)]">
            Master chess with AI-powered analysis, personalized training, and insights from the world's greatest grandmasters. Elevate your game from beginner to master.
          </p>
          <div className="flex gap-4 mb-8">
            <Link href="/learn">
              <Button className="btn border border-[var(--accent)] text-[var(--primary-text)] hover:glow-accent bg-[var(--card)] px-6 py-3 text-lg font-semibold rounded-lg shadow-lg">Start Training</Button>
            </Link>
            <Link href="/analysis">
              <Button variant="outline" className="btn border border-[var(--accent)] text-[var(--primary-text)] hover:glow-accent bg-[var(--card)] px-6 py-3 text-lg font-semibold rounded-lg shadow-lg">Analyze Position</Button>
            </Link>
          </div>
          <div className="flex gap-8 mt-8">
            <div>
              <div className="text-2xl font-bold text-[var(--primary-text)]">3200+</div>
              <div className="text-[var(--secondary-text)] text-sm">Stockfish Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--primary-text)]">20+</div>
              <div className="text-[var(--secondary-text)] text-sm">GM Styles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--primary-text)]">10K+</div>
              <div className="text-[var(--secondary-text)] text-sm">Master Games</div>
            </div>
          </div>
        </div>
        {/* Right: Static Chessboard */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="flex flex-col items-center justify-center p-8 krishna-card backdrop-blur-sm rounded-2xl card-shadow border border-rgb(153, 0, 255)/30 purple-glow">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-[var(--primary-text)]">Sicilian Defense</h3>
              <p className="text-sm text-[var(--secondary-text)]">A Dynamic Opening</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <Chessboard 
                position={game.fen()}
                arePiecesDraggable={false}
                boardWidth={320}
                customBoardStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 32px rgba(153, 0, 255, 0.3)'
                }}
                customDarkSquareStyle={{ backgroundColor: '#8B4513' }}
                customLightSquareStyle={{ backgroundColor: '#DEB887' }}
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--secondary-text)]">Position:</span>
                <span className="text-[var(--primary-text)] font-mono">Sicilian Defense</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--secondary-text)]">Evaluation:</span>
                <span className="text-[var(--secondary-text)] font-mono">+0.2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
