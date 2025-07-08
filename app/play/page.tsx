'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Brain, Zap, Crown } from 'lucide-react';

/* ---------------------------------- */
/* 1. Define each bot + slug (URL)    */
/* ---------------------------------- */
const aiOpponents = [
  {
    name: 'Beginner Bot',
    slug: 'beginner',
    eloRange: '400–800',
    depthRange: '1–2',
    description: 'Perfect for learning the basics',
    icon: Target,
    difficulty: 'Easy',
    color: 'green',
  },
  {
    name: 'Intermediate Bot',
    slug: 'intermediate',
    eloRange: '800–1600',
    depthRange: '3–5',
    description: 'Challenging but fair gameplay',
    icon: Brain,
    difficulty: 'Medium',
    color: 'yellow',
  },
  {
    name: 'Advanced Bot',
    slug: 'advanced',
    eloRange: '1600–2300',
    depthRange: '6–8',
    description: 'Strong tactical play',
    icon: Zap,
    difficulty: 'Hard',
    color: 'orange',
  },
  {
    name: 'More Advanced Bot',
    slug: 'moreadvanced',
    eloRange: '2300–3000',
    depthRange: '9–10',
    description: 'Plays at near grandmaster level',
    icon: Crown,
    difficulty: 'Very Hard',
    color: 'purple',
  },
  {
    name: 'Stockfish Master',
    slug: 'stockfish',
    eloRange: '3000+',
    depthRange: '11+',
    description: 'Ultimate chess challenge',
    icon: Crown,
    difficulty: 'Extreme',
    color: 'red',
  },
];

/* ---------------------------------- */
/* 2. Home "Play" page                */
/* ---------------------------------- */
export default function PlayPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 bg-[var(--background)] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-[var(--primary-text)]">Play Chess</h1>
          <p className="text-lg text-[var(--secondary-text)]">
            Challenge AI opponents and test your skills
          </p>
        </div>
        {/* cards grid */}
        <div className="w-full flex flex-wrap justify-center gap-8">
          {aiOpponents.filter(opponent => opponent.slug !== 'stockfish').map((opponent) => (
            <Card
              key={opponent.slug}
              className="krishna-card border-[var(--accent)]/30 hover:border-[var(--accent)]/70 transition-all duration-300 flex flex-col w-full max-w-xs min-h-[320px] card-shadow"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* title + icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-[var(--accent)]/20">
                    <opponent.icon className="h-6 w-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--primary-text)]">
                      {opponent.name}
                    </h3>
                  </div>
                </div>
                {/* detailed description */}
                <p className="text-sm text-[var(--secondary-text)] mb-3">
                  {opponent.description}
                  {opponent.slug === 'beginner' && ' Great for absolute beginners to learn the rules and basic moves.'}
                  {opponent.slug === 'intermediate' && ' Ideal for players who want to practice tactics and improve their game.'}
                  {opponent.slug === 'advanced' && ' Test your skills against a tough AI that punishes mistakes.'}
                  {opponent.slug === 'moreadvanced' && ' Face a bot that plays at near grandmaster level for a real challenge.'}
                </p>
                {/* difficulty + rating */}
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-[var(--accent)] text-white">
                    {opponent.difficulty}
                  </Badge>
                  <div className="text-sm text-[var(--secondary-text)]">
                    ELO: <span className="text-[var(--primary-text)]">{opponent.eloRange}</span> | Depth: <span className="text-[var(--primary-text)]">{opponent.depthRange}</span>
                  </div>
                </div>
                <div className="flex-grow" />
                {/* play button */}
                <div className="mt-4">
                  <Link href={`/play/${opponent.slug}`} className="w-full">
                    <Button className="bg-[var(--accent)] hover:bg-[var(--accent)]/80 w-full text-white btn-glow">
                      Play Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
