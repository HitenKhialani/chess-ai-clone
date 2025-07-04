"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GMPuzzleBoard } from "@/components/gm-puzzle-board"
import { toast } from "sonner"
import Link from 'next/link'

export default function PuzzlesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [puzzle, setPuzzle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [totalPuzzles, setTotalPuzzles] = useState<number>(7)

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Mate in 1</h1>
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-semibold">Puzzle {completed ? totalPuzzles : currentIndex + 1} of {totalPuzzles}</span>
          {completed && <span className="text-green-500 font-bold">Completed!</span>}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((completed ? totalPuzzles : currentIndex + 1) / totalPuzzles) * 100}%` }}></div>
        </div>
        <Card className="w-full">
          <CardHeader className="text-center p-4">
            <CardTitle className="text-lg sm:text-xl">Mate in 1</CardTitle>
            <CardDescription className="text-sm">
              Find the checkmate in a single move.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            {loading ? (
              <div className="h-[320px] sm:h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </div>
            ) : error ? (
              <div className="h-[320px] sm:h-[400px] flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-red-400 text-lg font-semibold">{error}</p>
                <Button onClick={handleRetry} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-semibold shadow-md transition-all">Retry Loading Puzzle</Button>
              </div>
            ) : puzzle && !completed ? (
              <div className="flex flex-col items-center">
                <GMPuzzleBoard
                  key={currentIndex}
                  fen={puzzle.fen}
                  solutionMoves={puzzle.moves || puzzle.solutionMoves}
                  onSuccess={handleNextPuzzle}
                  onFail={handleRetry}
                  puzzleIndex={currentIndex}
                  totalPuzzles={totalPuzzles}
                />
              </div>
            ) : completed ? (
              <div className="h-[320px] sm:h-[400px] flex flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">Congratulations!</h2>
                <p className="text-purple-200">You solved all {totalPuzzles} puzzles! 🎉</p>
                <Button onClick={() => { setCurrentIndex(0); setCompleted(false); }} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-semibold shadow-md transition-all">
                  Restart Puzzles
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 