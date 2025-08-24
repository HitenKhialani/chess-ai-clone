'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ThemeShowcase } from '@/components/theme-showcase';
import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { MessageSquare, BookOpen } from 'lucide-react';

const Chessboard = dynamic(
  () => import('react-chessboard').then((m) => m.Chessboard),
  { ssr: false }
);

export default function HomePage() {
  // Prepare a static but real position like before (Sicilian Defense)
  const [fen, setFen] = useState<string | null>(null);

  useEffect(() => {
    const chess = new Chess();
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
    setFen(chess.fen());
  }, []);
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 parallax-bg">
        <div className="particle absolute left-10 top-10" />
        <div className="particle absolute left-1/3 top-1/2" />
        <div className="particle absolute right-12 bottom-16" />
      </div>

      {/* Hero */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-[var(--accent)] text-[var(--primary-text)] bg-[var(--card)]">
                AI-Powered Chess Training
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight text-cosmic">Endgame Chess Universe</h1>
              <p className="mt-3 text-base sm:text-lg text-[var(--secondary-text)] max-w-xl">
                Master chess with AI analysis, personalized drills, and grandmaster lessons.
                Level up from beginner to master with a beautiful, modern experience.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/learn">
                  <Button variant="hero" className="px-6 py-3 text-base font-semibold">Start Training</Button>
                </Link>
                <Link href="/analysis">
                  <Button variant="glass" className="px-6 py-3 text-base font-semibold">Analyze a Game</Button>
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center md:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">3200+</div>
                  <div className="text-[var(--secondary-text)] text-xs sm:text-sm">Stockfish ELO</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">20+</div>
                  <div className="text-[var(--secondary-text)] text-xs sm:text-sm">GM Styles</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--primary-text)]">10K+</div>
                  <div className="text-[var(--secondary-text)] text-xs sm:text-sm">Master Games</div>
                </div>
              </div>
            </div>
            <div className="relative h-[420px] chess-glow hero-glow rounded-2xl flex items-center justify-center overflow-hidden p-4">
              <div className="w-full max-w-[360px]">
                <div className="text-center mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-[var(--primary-text)]">Sicilian Defense</h3>
                  <p className="text-xs text-[var(--secondary-text)]">A Dynamic Opening</p>
                </div>
                {typeof window !== 'undefined' && fen && (
                  <div className="rounded-lg overflow-hidden shadow-2xl mx-auto" style={{ width: 320 }}>
                    <Chessboard
                      position={fen}
                      arePiecesDraggable={false}
                      boardWidth={320}
                      customBoardStyle={{
                        borderRadius: '8px',
                        boxShadow: '0 4px 32px rgba(0, 245, 212, 0.3)'
                      }}
                      customDarkSquareStyle={{ backgroundColor: '#8B4513' }}
                      customLightSquareStyle={{ backgroundColor: '#DEB887' }}
                    />
                  </div>
                )}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--secondary-text)]">Position:</span>
                    <span className="text-[var(--primary-text)] font-mono">Sicilian Defense</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--secondary-text)]">Evaluation:</span>
                    <span className="text-[var(--secondary-text)] font-mono">+0.2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Analysis feature (info-only, no image, no export button) */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-[var(--accent)] text-[var(--primary-text)] bg-[var(--card)]">
              MVP Feature #1
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-cosmic">Game Analysis</h2>
            <p className="mt-2 text-2xl font-black text-[var(--primary-text)]">Beyond Chess.com & Lichess</p>
            <p className="mt-3 text-[var(--secondary-text)] max-w-3xl mx-auto">
              Revolutionary AI-powered analysis that classifies every move with precision. Get insights that even grandmasters would envy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Accuracy Analysis */}
            <div className="rounded-xl p-6 bg-[var(--card)] border border-[var(--accent)]">
              <h3 className="font-semibold text-[var(--primary-text)] mb-4">Accuracy Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--secondary-text)]">White Accuracy</span>
                    <span className="text-[var(--secondary-text)]">87.3%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-[var(--border)]">
                    <div className="h-2 rounded bg-[#7dd3fc]" style={{ width: '87.3%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--secondary-text)]">Black Accuracy</span>
                    <span className="text-[var(--secondary-text)]">92.1%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-[var(--border)]">
                    <div className="h-2 rounded bg-[#f0abfc]" style={{ width: '92.1%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="rounded-xl p-6 bg-[var(--card)] border border-[var(--accent)]">
              <h3 className="font-semibold text-[var(--primary-text)] mb-4">Performance Insights</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-center">
                  <div className="text-2xl font-bold text-[var(--primary-text)]">94%</div>
                  <div className="text-xs text-[var(--secondary-text)]">Opening Accuracy</div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-center">
                  <div className="text-2xl font-bold text-[var(--primary-text)]">2.3s</div>
                  <div className="text-xs text-[var(--secondary-text)]">Avg Think Time</div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-center">
                  <div className="text-2xl font-bold text-[var(--primary-text)]">3</div>
                  <div className="text-xs text-[var(--secondary-text)]">Brilliant Moves</div>
                </div>
                <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] text-center">
                  <div className="text-2xl font-bold text-[var(--primary-text)]">+1.2</div>
                  <div className="text-xs text-[var(--secondary-text)]">Rating Change</div>
                </div>
              </div>
            </div>
          </div>

          {/* Move Classification + PDF note */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="rounded-xl p-6 bg-[var(--card)] border border-[var(--accent)]">
              <h3 className="font-semibold text-[var(--primary-text)] mb-4">Move Classification</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between"><span className="text-[var(--primary-text)]">Qf3+</span><span className="text-emerald-400">Brilliant</span></li>
                <li className="flex items-center justify-between"><span className="text-[var(--primary-text)]">Nf6</span><span className="text-[var(--secondary-text)]">Correct</span></li>
                <li className="flex items-center justify-between"><span className="text-[var(--primary-text)]">Bxf7+?</span><span className="text-amber-400">Mistake</span></li>
                <li className="flex items-center justify-between"><span className="text-[var(--primary-text)]">Kh1??</span><span className="text-rose-400">Blunder</span></li>
              </ul>
            </div>
            <div className="rounded-xl p-6 bg-[var(--card)] border border-[var(--accent)] flex flex-col justify-center">
              <h3 className="font-semibold text-[var(--primary-text)] mb-2">Exportable Reports</h3>
              <p className="text-[var(--secondary-text)]">
                Share your insights easily. Export your full game review as a beautifully formatted PDF report including accuracy, key moments, and move classifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Highlights: Simplo and Learning */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Simplo highlight */}
            <div className="rounded-xl p-6 bg-[var(--card)] border border-[var(--accent)] hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20 border border-[#00F5D4]/30">
                  <MessageSquare className="h-5 w-5 text-[#00F5D4]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--primary-text)]">Simplo AI Coach</h3>
              </div>
              <p className="text-sm text-[var(--secondary-text)]">Chat with an AI chess coach for quick tips, explanations, and ideas while you study or analyze.</p>
              <div className="mt-4">
                <Link href="/simplo">
                  <Button className="bg-gradient-to-r from-[#00F5D4] to-[#57CC99] hover:from-[#00F5D4]/90 hover:to-[#57CC99]/90 text-[var(--card-foreground)] font-semibold">Open Simplo</Button>
                </Link>
              </div>
            </div>

            {/* Learning highlight */}
            <div className="rounded-xl p-6 bg-[var(--card)] border border-[var(--accent)] hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20 border border-[#00F5D4]/30">
                  <BookOpen className="h-5 w-5 text-[#00F5D4]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--primary-text)]">Learning Hub</h3>
              </div>
              <p className="text-sm text-[var(--secondary-text)]">Curated lessons and structured courses. Study fundamentals, openings, and endgames with clarity.</p>
              <div className="mt-4">
                <Link href="/learn">
                  <Button variant="outline" className="border-[var(--accent)] text-[var(--primary-text)]">Explore Learning</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Play vs AI (same bots as /play) */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--primary-text)]">Play vs AI</h2>
          <p className="mt-2 text-[var(--secondary-text)]">Challenge the same bots from Play. Pick your level and start instantly.</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Beginner Bot', slug: 'beginner', difficulty: 'Easy', elo: '400–800', depth: '1–2', desc: 'Perfect for learning the basics. Great for absolute beginners.' },
              { name: 'Intermediate Bot', slug: 'intermediate', difficulty: 'Medium', elo: '800–1600', depth: '3–5', desc: 'Challenging but fair. Practice tactics and improve your game.' },
              { name: 'Advanced Bot', slug: 'advanced', difficulty: 'Hard', elo: '1600–2300', depth: '6–8', desc: 'Strong tactical play. Punishes mistakes.' },
              { name: 'More Advanced Bot', slug: 'moreadvanced', difficulty: 'Very Hard', elo: '2300–3000', depth: '9–10', desc: 'Near grandmaster level for a real challenge.' },
            ].map((b) => (
              <div key={b.slug} className="rounded-xl p-6 bg-[var(--card)] border border-[var(--accent)] hover-lift text-left flex flex-col">
                <div className="text-sm text-[var(--secondary-text)] mb-1">{b.difficulty}</div>
                <h3 className="text-xl font-bold text-[var(--primary-text)]">{b.name}</h3>
                <p className="mt-2 text-sm text-[var(--secondary-text)] flex-1">{b.desc}</p>
                <div className="mt-4 text-sm text-[var(--secondary-text)] space-y-1">
                  <div>ELO: <span className="text-[var(--primary-text)] font-semibold">{b.elo}</span></div>
                  <div>Depth: <span className="text-[var(--primary-text)] font-semibold">{b.depth}</span></div>
                </div>
                <Link href={`/play/${b.slug}`} className="inline-block mt-4"><Button variant="glass" className="w-full">Play Now</Button></Link>
              </div>
            ))}
          </div>
          <Link href="/play" className="inline-block mt-6"><Button variant="glass">View all AI Opponents</Button></Link>
        </div>
      </section>

      {/* Theme selection */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-[var(--accent)] text-[var(--primary-text)] bg-[var(--card)]">
              Customization
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-cosmic">Choose Your Universe</h2>
            <p className="mt-2 text-[var(--secondary-text)] max-w-2xl mx-auto">
              Transform your chess experience with multiple themes. Each creates a different atmosphere and mood.
            </p>
          </div>
          <ThemeShowcase />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl p-8 md:p-12 text-center cosmic-glow bg-[var(--card)] border border-[var(--accent)]">
            <h2 className="text-3xl md:text-4xl font-extrabold text-cosmic">Join the Chess Revolution</h2>
            <p className="mt-3 text-[var(--secondary-text)] max-w-2xl mx-auto">
              Train smarter, analyze deeper, and play with style. It’s free to get started.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login">
                <Button variant="hero" className="px-6 py-3 text-base font-semibold">
                  Join Free
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="glass" className="px-6 py-3 text-base font-semibold">
                  Explore Endgame
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
