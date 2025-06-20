"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GMPuzzleBoard } from "@/components/gm-puzzle-board"
import { toast } from "sonner"

export default function PuzzlesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [puzzle, setPuzzle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [totalPuzzles, setTotalPuzzles] = useState<number>(10)

  // Fetch total puzzle count on mount
  useEffect(() => {
    fetch('/api/puzzles/pgn/count')
      .then(res => res.json())
      .then(data => setTotalPuzzles(data.count))
      .catch(() => setTotalPuzzles(10))
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
    if (currentIndex + 1 < totalPuzzles) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCompleted(true)
      toast.success('You solved the puzzle section! Explore more parts of this website.')
    }
  }

  const handleRetry = () => {
    loadPuzzle(currentIndex)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Mate'n Rush</h1>
      <div className="flex justify-center mb-4 gap-2">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Puzzle {completed ? totalPuzzles : currentIndex + 1} of {totalPuzzles}</span>
            {completed && <span className="text-green-600 font-bold">Completed!</span>}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${((completed ? totalPuzzles : currentIndex + 1) / totalPuzzles) * 100}%` }}></div>
          </div>
        </div>
      </div>
      <div className="max-w-xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Mate'n Rush</CardTitle>
            <CardDescription>
              Race against the board to deliver checkmate in 5 or 6 moves as White! Outsmart the bot and claim your victory in style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </div>
            ) : error ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 text-lg font-semibold">{error}</p>
                <Button onClick={handleRetry} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-semibold shadow-md transition-all">Retry Loading Puzzle</Button>
              </div>
            ) : puzzle && !completed ? (
              <div className="flex flex-col items-center gap-4">
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
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-green-400">Congratulations!</h2>
                <p className="text-purple-200">You solved all {totalPuzzles} puzzles! 🎉</p>
                <Button onClick={() => { setCurrentIndex(0); setCompleted(false); }} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-semibold shadow-md transition-all">
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
