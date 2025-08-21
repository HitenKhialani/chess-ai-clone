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
    <main className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* page header */}
        <div className="text-center mb-12">
          <div className="mb-4"></div>
          <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">Play Chess</h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Challenge AI opponents and test your skills
          </p>
        </div>
        {/* cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {aiOpponents.filter(opponent => opponent.slug !== 'stockfish').map((opponent) => (
            <div
              key={opponent.slug}
              className="glass-effect rounded-xl p-8 border border-[var(--accent)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00F5D4]/10 group puzzle-card flex flex-col h-full"
            >
              {/* title + icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20 backdrop-blur-sm border border-[#00F5D4]/30 puzzle-icon">
                  <opponent.icon className="h-6 w-6 text-[#00F5D4]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--card-foreground)]">
                    {opponent.name}
                  </h3>
                </div>
              </div>
              
              {/* detailed description */}
              <p className="text-sm text-[var(--muted-foreground)] mb-6 flex-grow">
                {opponent.description}
                  {opponent.slug === 'beginner' && ' Great for absolute beginners to learn the rules and basic moves.'}
                  {opponent.slug === 'intermediate' && ' Ideal for players who want to practice tactics and improve their game.'}
                  {opponent.slug === 'advanced' && ' Test your skills against a tough AI that punishes mistakes.'}
                  {opponent.slug === 'moreadvanced' && ' Face a bot that plays at near grandmaster level for a real challenge.'}
              </p>
              
              {/* difficulty badge - separate line */}
              <div className="mb-4">
                <Badge className="bg-[#00F5D4]/20 text-[#00F5D4] border-[#00F5D4]/30">
                  {opponent.difficulty}
                </Badge>
              </div>
              
              {/* ELO and Depth - separate line */}
              <div className="mb-6">
                <div className="text-sm text-[var(--muted-foreground)]">
                  ELO: <span className="text-[var(--card-foreground)] font-semibold">{opponent.eloRange}</span>
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Depth: <span className="text-[var(--card-foreground)] font-semibold">{opponent.depthRange}</span>
                </div>
              </div>
              
              {/* play button */}
              <div className="mt-auto pt-4">
                <Link href={`/play/${opponent.slug}`} className="w-full">
                  <Button className="bg-gradient-to-r from-[#00F5D4] to-[#57CC99] hover:from-[#00F5D4]/90 hover:to-[#57CC99]/90 w-full text-[var(--card-foreground)] font-bold rounded-lg shadow-lg hover:shadow-[#00F5D4]/25 transition-all duration-300">
                    Play Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
