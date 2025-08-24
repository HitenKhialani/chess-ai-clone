"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { 
  Crown
} from 'lucide-react'

// Define a type for puzzle counts (Mate in 1/2/3)
type PuzzleCounts = {
  mateIn1: number;
  mateIn2: number;
  mateIn3: number;
};

// Puzzle type configuration
type PuzzleType = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  gradient: string;
  count: number;
  href: string;
};

// Initial puzzle counts
const initialCounts: PuzzleCounts = {
  mateIn1: 7,
  mateIn2: 7,
  mateIn3: 7,
};

export default function PuzzlesPage() {
  const [puzzleCounts] = useState<PuzzleCounts>(initialCounts);
  const [isLoading] = useState(false);

  const renderPuzzleCount = (count: number) => {
    return isLoading ? "Loading..." : `${count} puzzles`;
  };

  // Puzzle configurations (Mate in 1/2/3)
  const puzzleTypes: PuzzleType[] = [
    {
      id: 'mate-in-1',
      title: 'Mate in 1',
      description: 'Easy puzzles to practice checkmating in one move. Perfect for beginners.',
      icon: Crown,
      difficulty: 'Beginner',
      color: 'from-[#00F5D4] to-[#57CC99]',
      gradient: 'bg-gradient-to-br from-[#00F5D4]/20 to-[#57CC99]/20',
      count: puzzleCounts.mateIn1,
      href: '/puzzles/mate-in-1'
    },
    {
      id: 'mate-in-2',
      title: 'Mate in 2',
      description: 'Intermediate puzzles where you must find a forced checkmate in two moves.',
      icon: Crown,
      difficulty: 'Intermediate',
      color: 'from-[#F59E0B] to-[#F97316]',
      gradient: 'bg-gradient-to-br from-[#F59E0B]/20 to-[#F97316]/20',
      count: puzzleCounts.mateIn2,
      href: '/puzzles/mate-in-2'
    },
    {
      id: 'mate-in-3',
      title: 'Mate in 3',
      description: 'Advanced puzzles requiring precise calculation to force mate in three moves.',
      icon: Crown,
      difficulty: 'Advanced',
      color: 'from-[#EF4444] to-[#DC2626]',
      gradient: 'bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20',
      count: puzzleCounts.mateIn3,
      href: '/puzzles/mate-in-3'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-[var(--accent)]/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-[var(--destructive)]/20 text-red-400 border-red-500/30';
      default:
        return 'bg-[var(--card)]0/20 text-[var(--muted-foreground)] border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4"></div>
                  <h1 className="text-5xl font-bold mb-4 text-[var(--text-primary)]">
          Chess Puzzles
        </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Challenge yourself with puzzles of varying themes and difficulties. 
            Master tactical patterns and improve your chess skills.
          </p>
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading card
            Array.from({ length: 1 }).map((_, index) => (
              <Card key={index} className="relative h-full overflow-hidden bg-[var(--card)]/5 backdrop-blur-xl border border-[var(--border)]/10 animate-pulse">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gray-600/50 w-12 h-12"></div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-600/50 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-600/50 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-600/50 rounded w-full"></div>
                    <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-4 bg-gray-600/50 rounded"></div>
                    <div className="w-16 h-4 bg-gray-600/50 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            puzzleTypes.map((puzzle) => {
              const IconComponent = puzzle.icon;
              return (
                <Link key={puzzle.id} href={puzzle.href} className="group">
                  <Card className="puzzle-card relative h-full overflow-hidden glass-effect border border-[#00F5D4]/30 hover:border-[#00F5D4]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:shadow-[#00F5D4]/25">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 ${puzzle.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${puzzle.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}></div>
                    
                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${puzzle.color} shadow-lg puzzle-icon`}>
                            <IconComponent className="w-6 h-6 text-[var(--card-foreground)]" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-[var(--card-foreground)] group-hover:text-[#00F5D4] transition-colors duration-300">
                              {puzzle.title}
                            </CardTitle>
                          </div>
                        </div>
                        <Badge className={`${getDifficultyColor(puzzle.difficulty)} border backdrop-blur-sm`}>
                          {puzzle.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-[var(--muted-foreground)] leading-relaxed">
                        {puzzle.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 pt-0">
                      <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2 text-[var(--muted-foreground)] group-hover:text-[#00F5D4] transition-colors duration-300">
                        <span className="text-sm font-medium">
                          {`${puzzle.count} puzzles`}
                        </span>
                      </div>
                        <div className="flex items-center gap-1 text-[var(--muted-foreground)] group-hover:text-[#00F5D4] transition-colors duration-300">
                          <span className="text-sm font-medium">Start</span>
                          <div className="w-4 h-4 rounded-full border border-current group-hover:bg-[#00F5D4] group-hover:border-[#00F5D4] transition-all duration-300 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-current rounded-full group-hover:scale-0 transition-transform duration-300"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-[#00F5D4]/30 transition-all duration-500"></div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[var(--muted-foreground)] border border-[var(--border)]/20">
            <span className="text-sm font-medium">Choose a puzzle type to begin your training</span>
          </div>
        </div>
      </div>
    </div>
  )
}
