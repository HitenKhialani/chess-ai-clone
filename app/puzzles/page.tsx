"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from 'next/link'

// Define a type for puzzle counts
type PuzzleCounts = {
  tactics: number;
  endgame: number;
  fork: number;
  random: number;
  mateIn1: number;
  pin: number;
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

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20 pb-16 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl font-bold mb-2 text-[var(--primary-text)]">Puzzles</h1>
        <p className="text-lg text-[var(--secondary-text)] mb-8">
          Challenge yourself with puzzles of varying themes and difficulties.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mate in 1 */}
          <Link href="/puzzles/mate-in-1" className="text-left">
            <Card className="card border border-[var(--accent)] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-[var(--primary-text)]">Mate in 1</CardTitle>
                <CardDescription className="text-[var(--secondary-text)]">
                  Easy puzzles to practice checkmating in one move.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[var(--secondary-text)]">7 puzzles</p>
              </CardContent>
            </Card>
          </Link>
          {/* Pin */}
          <Link href="/puzzles/pin" className="text-left">
            <Card className="card border border-[var(--accent)] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-[var(--primary-text)]">Pin</CardTitle>
                <CardDescription className="text-[var(--secondary-text)]">
                  Practice pin tactics to win material or create threats.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[var(--secondary-text)]">10 puzzles</p>
              </CardContent>
            </Card>
          </Link>
          {/* Tactics */}
          <Link href="/puzzles/tactics" className="text-left">
            <Card className="card border border-[var(--accent)] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-[var(--primary-text)]">Tactics</CardTitle>
                <CardDescription className="text-[var(--secondary-text)]">
                  Practice tactics to win material or create threats.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[var(--secondary-text)]">{renderPuzzleCount(puzzleCounts.tactics)}</p>
              </CardContent>
            </Card>
          </Link>
          {/* Endgame */}
          <Link href="/puzzles/endgame" className="text-left">
            <Card className="card border border-[var(--accent)] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-[var(--primary-text)]">Endgame</CardTitle>
                <CardDescription className="text-[var(--secondary-text)]">
                  Practice endgames to win material or create threats.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[var(--secondary-text)]">{renderPuzzleCount(puzzleCounts.endgame)}</p>
              </CardContent>
            </Card>
          </Link>
          {/* Fork */}
          <Link href="/puzzles/fork" className="text-left">
            <Card className="card border border-[var(--accent)] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-[var(--primary-text)]">Fork</CardTitle>
                <CardDescription className="text-[var(--secondary-text)]">
                  Practice forks to win material or create threats.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[var(--secondary-text)]">{renderPuzzleCount(puzzleCounts.fork)}</p>
              </CardContent>
            </Card>
          </Link>
          {/* Random Puzzles */}
          <Link href="/puzzles/random" className="text-left">
            <Card className="card border border-[var(--accent)] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-[var(--primary-text)]">Random Puzzles</CardTitle>
                <CardDescription className="text-[var(--secondary-text)]">
                  A random assortment of puzzles to test your skills.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[var(--secondary-text)]">{renderPuzzleCount(puzzleCounts.random)}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
