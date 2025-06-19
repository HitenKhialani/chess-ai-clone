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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#111827]">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-20">
        {/* Left: Hero Text */}
        <div className="flex-1 text-white max-w-xl">
          <div className="mb-4">
            <span className="inline-block bg-white/10 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold mb-2">AI-Powered Chess Training</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Endgame</h1>
          <h2 className="text-2xl font-semibold mb-4">Where AI Learning Begins</h2>
          <p className="mb-8 text-lg text-purple-100">
            Master chess with AI-powered analysis, personalized training, and insights from the world's greatest grandmasters. Elevate your game from beginner to master.
          </p>
          <div className="flex gap-4 mb-8">
            <Link href="/learn">
              <Button className="bg-[#a78bfa] hover:bg-[#7c3aed] text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-lg">Start Training</Button>
            </Link>
            <Link href="/analysis">
              <Button variant="outline" className="border-white/30 text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-lg bg-white/10 hover:bg-white/20">
                Analyze Position
              </Button>
            </Link>
          </div>
          <div className="flex gap-8 mt-8">
            <div>
              <div className="text-2xl font-bold">3200+</div>
              <div className="text-purple-200 text-sm">Stockfish Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">20+</div>
              <div className="text-purple-200 text-sm">GM Styles</div>
            </div>
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-purple-200 text-sm">Master Games</div>
            </div>
          </div>
        </div>

        {/* Right: Static Chessboard */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-400/20">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-white">Sicilian Defense</h3>
              <p className="text-sm text-purple-200">A Dynamic Opening</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <Chessboard 
                position={game.fen()}
                arePiecesDraggable={false}
                boardWidth={320}
                customBoardStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 32px rgba(0, 0, 0, 0.2)'
                }}
                customDarkSquareStyle={{ backgroundColor: '#8B4513' }}
                customLightSquareStyle={{ backgroundColor: '#DEB887' }}
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-200">Position:</span>
                <span className="text-white font-mono">Sicilian Defense</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-200">Evaluation:</span>
                <span className="text-purple-200 font-mono">+0.2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
