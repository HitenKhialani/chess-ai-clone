"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { 
  Crown, 
  Target, 
  Zap, 
  Brain,
  Loader2
} from 'lucide-react'

// Define a type for puzzle counts
type PuzzleCounts = {
  tactics: number;
  endgame: number;
  fork: number;
  random: number;
  mateIn1: number;
  pin: number;
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

// Initial puzzle counts can be set to a loading state, e.g., -1 or null
const initialCounts: PuzzleCounts = {
  tactics: 0,
  endgame: 0,
  fork: 0,
  random: 0,
  mateIn1: 7, // This seems to be static
  pin: 10,     // This also seems to be static
};

export default function PuzzlesPage() {
  const [puzzleCounts, setPuzzleCounts] = useState<PuzzleCounts>(initialCounts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllPuzzleCounts = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        
        // Use Promise.all to fetch all counts in parallel
        const responses = await Promise.all([
          fetch(`${backendUrl}/api/puzzles/tactics/count`).then(res => res.json()),
          fetch(`${backendUrl}/api/puzzles/endgame/count`).then(res => res.json()),
          fetch(`${backendUrl}/api/puzzles/fork/count`).then(res => res.json()),
          fetch(`${backendUrl}/api/puzzles/random/count`).then(res => res.json()),
        ]);

        const [tacticsData, endgameData, forkData, randomData] = responses;

        setPuzzleCounts(prevCounts => ({
          ...prevCounts,
          tactics: tacticsData.count || 0,
          endgame: endgameData.count || 0,
          fork: forkData.count || 0,
          random: randomData.count || 0,
        }));
      } catch (error) {
        console.error("Failed to fetch puzzle counts:", error);
        // Keep initial counts on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPuzzleCounts();
  }, []);

  const renderPuzzleCount = (count: number) => {
    return isLoading ? "Loading..." : `${count} puzzles`;
  };

  // Puzzle configurations
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
      id: 'pin',
      title: 'Pin Tactics',
      description: 'Practice pin tactics to win material or create threats.',
      icon: Target,
      difficulty: 'Beginner',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      count: puzzleCounts.pin,
      href: '/puzzles/pin'
    },
    {
      id: 'tactics',
      title: 'Tactical Puzzles',
      description: 'Sharpen your tactical vision with complex combinations.',
      icon: Brain,
      difficulty: 'Intermediate',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      count: puzzleCounts.tactics,
      href: '/puzzles/tactics'
    },
    {
      id: 'endgame',
      title: 'Endgame Mastery',
      description: 'Practice endgames to convert winning positions.',
      icon: Crown,
      difficulty: 'Advanced',
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
      count: puzzleCounts.endgame,
      href: '/puzzles/endgame'
    },
    {
      id: 'fork',
      title: 'Fork Tactics',
      description: 'Master fork tactics to attack multiple pieces simultaneously.',
      icon: Zap,
      difficulty: 'Intermediate',
          color: 'from-[#00F5D4] to-[#57CC99]',
    gradient: 'bg-gradient-to-br from-[#00F5D4]/20 to-[#57CC99]/20',
      count: puzzleCounts.fork,
      href: '/puzzles/fork'
    },
    {
      id: 'random',
      title: 'Random Puzzles',
      description: 'A diverse mix of puzzles to test your overall skills.',
      icon: Brain,
      difficulty: 'Advanced',
      color: 'from-gray-500 to-slate-500',
      gradient: 'bg-gradient-to-br from-gray-500/20 to-slate-500/20',
      count: puzzleCounts.random,
      href: '/puzzles/random'
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
            // Skeleton loading cards
            Array.from({ length: 6 }).map((_, index) => (
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
