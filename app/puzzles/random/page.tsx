"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GMPuzzleBoard } from "@/components/gm-puzzle-board"
import { toast } from "sonner"
import { useUser } from "@/components/UserProvider"

export default function PuzzlesPage() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('randomPuzzleIndex');
      return savedIndex ? parseInt(savedIndex, 10) : 0;
    }
    return 0;
  });
  const [puzzle, setPuzzle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [totalPuzzles, setTotalPuzzles] = useState<number>(0)
  const { refetchUser } = useUser();

  // Save index to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('randomPuzzleIndex', currentIndex.toString());
    }
  }, [currentIndex]);

  // Fetch total puzzle count on mount
  useEffect(() => {
    fetch('/api/puzzles/random/count')
      .then(res => res.json())
      .then(data => setTotalPuzzles(data.count))
      .catch(() => setTotalPuzzles(0))
  }, [])

  const loadPuzzle = async (idx: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/puzzles/random/by-index/${idx}`)
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
        setCompleted(true)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!completed && totalPuzzles > 0) loadPuzzle(currentIndex)
  }, [currentIndex, completed, totalPuzzles])

  const handleNextPuzzle = async () => {
    // Record solved puzzle
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    if (token && puzzle && puzzle.fen) {
      try {
        const response = await fetch(`${backendUrl}/api/users/solve-puzzle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ puzzle_id: puzzle.fen, category: 'Random' }),
        });
        const data = await response.json();
        if(response.ok) {
          toast.success(`Puzzle solved! You gained ${data.coinsGained} coin(s).`);
          refetchUser(); // Refetch user to update coin balance
        }
      } catch (error) {
        toast.error("Failed to record puzzle.");
      }
    }
    if (currentIndex + 1 < totalPuzzles) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCompleted(true)
      toast.success('You solved all the random puzzles! Explore more parts of this website.')
    }
  }

  const handleRetry = () => {
    loadPuzzle(currentIndex)
  }

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompleted(false);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Random Puzzles</h1>
      <div className="flex justify-center mb-4 gap-2">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Puzzle {completed ? totalPuzzles : currentIndex + 1} of {totalPuzzles}</span>
            {completed && <span className="text-green-600 font-bold">Completed!</span>}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(totalPuzzles > 0 ? (completed ? totalPuzzles : currentIndex + 1) / totalPuzzles : 0) * 100}%` }}></div>
          </div>
        </div>
      </div>
      <div className="max-w-xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Random Puzzles</CardTitle>
            <CardDescription>
              Practice with a random set of puzzles to test your skills.
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
                <Button onClick={handleRestart} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-semibold shadow-md transition-all">
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