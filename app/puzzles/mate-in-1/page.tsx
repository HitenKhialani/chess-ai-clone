"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GMPuzzleBoard } from "@/components/gm-puzzle-board"
import { toast } from "sonner"
import Link from 'next/link'
import { Chess } from "chess.js"
import React from "react"
import { 
  Crown, 
  Target, 
  Trophy, 
  Clock,
  CheckCircle,
  ArrowLeft,
  Brain,
  XCircle
} from 'lucide-react'

export default function PuzzlesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [puzzle, setPuzzle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [totalPuzzles, setTotalPuzzles] = useState<number>(7)
  const [showingSolution, setShowingSolution] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [solutionMove, setSolutionMove] = useState("")

  // Fetch total puzzle count on mount
  useEffect(() => {
    // In a real app, you might fetch this from an API
    setTotalPuzzles(7);
  }, [])

  const loadPuzzle = async (idx: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/puzzles/pgn/by-index/${idx}`)
      if (!response.ok) throw new Error('No puzzle found for this index.')
      const data = await response.json()
      setPuzzle(data)
    } catch (err: any) {
      // If loading fails, try the next puzzle
      if (idx + 1 < totalPuzzles) {
        setCurrentIndex(idx + 1)
      } else {
        setError('No more puzzles available.')
        setPuzzle(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!completed) loadPuzzle(currentIndex)
  }, [currentIndex, completed, totalPuzzles])

  const handleNextPuzzle = () => {
    // Record solved puzzle
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    if (token && puzzle && puzzle.id) {
      fetch(`${backendUrl}/api/users/solve-puzzle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ puzzle_id: puzzle.id, category: 'Mate in 1' }),
      });
    }
    if (currentIndex + 1 < totalPuzzles) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCompleted(true)
      toast.success('You solved all the mate in 1 puzzles!')
    }
  }

  const handleRetry = () => {
    loadPuzzle(currentIndex)
  }

  const handleShowSolution = () => {
    if (puzzle && (puzzle.moves || puzzle.solutionMoves)) {
      const moves = puzzle.moves || puzzle.solutionMoves;
      setSolutionMove(moves[0]);
    }
    setShowExplanation(true);
    setShowingSolution(true);
  };
  
  const handleHideSolution = () => {
    setShowExplanation(false);
    setShowingSolution(false);
    setSolutionMove("");
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/puzzles" className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Puzzles</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div>
                              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00F5D4] to-[#57CC99] bg-clip-text text-transparent">
                  Mate in 1 Puzzles
                </h1>
              <p className="text-[var(--muted-foreground)] mt-1">Easy puzzles to practice checkmating in one move</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chess Board Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="glass-effect rounded-xl p-8 border border-[var(--border)]/10">
                <div className="flex items-center justify-center h-96">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F5D4]"></div>
                    <p className="text-[var(--muted-foreground)]">Loading puzzle...</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="glass-effect rounded-xl p-8 border border-[var(--border)]/10">
                <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
                  <div className="p-3 rounded-full bg-[var(--destructive)]/20 border border-red-500/30">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 text-lg font-semibold">{error}</p>
                  <Button 
                    onClick={handleRetry} 
                    className="bg-gradient-to-r from-[#00F5D4] to-[#57CC99] hover:from-[#00F5D4]/90 hover:to-[#57CC99]/90 text-[var(--card-foreground)] rounded-lg px-6 py-2 font-bold shadow-lg hover:shadow-[#00F5D4]/25 transition-all duration-300"
                  >
                    Retry Loading Puzzle
                  </Button>
                </div>
              </div>
            ) : puzzle && !completed ? (
              <GMPuzzleBoard
                key={currentIndex + (showingSolution ? '-solution' : '')}
                fen={puzzle.fen}
                solutionMoves={puzzle.moves || puzzle.solutionMoves}
                onSuccess={handleNextPuzzle}
                onFail={handleRetry}
                puzzleIndex={currentIndex}
                totalPuzzles={totalPuzzles}
              />
            ) : completed ? (
              <div className="glass-effect rounded-xl p-8 border border-[var(--border)]/10">
                <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-green-400 mb-2">Congratulations!</h2>
                    <p className="text-[var(--muted-foreground)] text-lg">You solved all {totalPuzzles} puzzles! 🎉</p>
                  </div>
                  <Button 
                    onClick={() => { setCurrentIndex(0); setCompleted(false); }} 
                    className="bg-gradient-to-r from-[#00F5D4] to-[#57CC99] hover:from-[#00F5D4]/90 hover:to-[#57CC99]/90 text-[var(--card-foreground)] rounded-lg px-8 py-3 font-bold shadow-lg hover:shadow-[#00F5D4]/25 transition-all duration-300"
                  >
                    Restart Puzzles
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Side Panel - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-xl p-6 border border-[var(--border)]/10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20">
              <Target className="w-5 h-5 text-[#00F5D4]" />
            </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--card-foreground)]">Back Rank Mate</h3>
                  <Badge className="bg-[var(--accent)]/20 text-green-400 border-green-500/30 mt-1">
                    Beginner
                  </Badge>
                </div>
              </div>
              
              <p className="text-[var(--muted-foreground)] mb-4 text-sm leading-relaxed">
                Find the mate in 1 move. The enemy king is trapped on the back rank.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  <span>MATE IN-1</span>
                </div>
                <span>•</span>
                <span>100 pts</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>4:41</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-[var(--muted-foreground)] mb-2">
                  <span>Progress</span>
                  <span>{completed ? totalPuzzles : currentIndex + 1} of {totalPuzzles}</span>
                </div>
                <div className="w-full bg-[var(--secondary)]/50 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-[#00F5D4] to-[#57CC99] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((completed ? totalPuzzles : currentIndex + 1) / totalPuzzles) * 100}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-[var(--card)]/50 border border-gray-700/50">
                    <div className="text-2xl font-bold text-[#00F5D4]">0</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Total Score</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[var(--card)]/50 border border-gray-700/50">
                    <div className="text-2xl font-bold text-[#00F5D4]">{completed ? totalPuzzles : currentIndex + 1}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Current Puzzle</div>
                  </div>
                </div>
              </div>

              {/* Solution Explanation */}
              {showExplanation && (
                <div className="glass-effect rounded-lg p-4 border border-[#00F5D4]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-[#00F5D4]" />
                    <h4 className="font-bold text-[var(--card-foreground)]">Solution</h4>
                  </div>
                  <div className="mb-2">
                    <span className="font-mono font-bold text-xl text-[#00F5D4]">{solutionMove}</span>
                  </div>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    This is a classic back rank mate. The king is trapped by its own pawns and is checkmated by the queen on the back rank.
                  </p>
                </div>
              )}
            </div>

            {/* Motivational Quote */}
            <div className="glass-effect rounded-xl p-6 border border-[var(--border)]/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20">
                  <Brain className="w-5 h-5 text-[#00F5D4]" />
                </div>
                <h4 className="font-bold text-[var(--card-foreground)]">Motivation</h4>
              </div>
              <blockquote className="text-[#00F5D4] font-bold text-lg mb-2">
                "Every master was once a beginner. Every pro was once an amateur."
              </blockquote>
              <p className="text-[var(--muted-foreground)] text-sm">
                Keep practicing and you'll see improvement in your tactical vision!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 