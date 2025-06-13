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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Play Chess
          </h1>
          <p className="text-lg text-gray-400">
            Challenge AI opponents and test your skills
          </p>
        </div>

        {/* cards grid */}
        <div className="w-full flex flex-wrap justify-center gap-8">
          {aiOpponents.filter(opponent => opponent.slug !== 'stockfish').map((opponent) => (
            <Card
              key={opponent.slug}
              className="bg-[#1f2937] border-[#374151] hover:border-[#4f46e5]/50 transition-all duration-300 flex flex-col w-full max-w-xs min-h-[320px]"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* title + icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2 rounded-lg bg-[#13151a] ${opponent.color}`}>
                    <opponent.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {opponent.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {opponent.description}
                    </p>
                  </div>
                </div>
                {/* difficulty + rating */}
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${opponent.color} bg-[#13151a]`}>
                    {opponent.difficulty}
                  </Badge>
                  <div className="text-sm text-gray-400">
                    ELO: <span className="text-white">{opponent.eloRange}</span> | Depth: <span className="text-white">{opponent.depthRange}</span>
                  </div>
                </div>
                <div className="flex-grow" />
                {/* play button */}
                <div className="mt-4">
                  <Link href={`/play/${opponent.slug}`} className="w-full">
                    <Button className="bg-[#4f46e5] hover:bg-[#4338ca] w-full">
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
