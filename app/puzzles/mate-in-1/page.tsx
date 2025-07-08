"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GMPuzzleBoard } from "@/components/gm-puzzle-board"
import { toast } from "sonner"
import Link from 'next/link'
import { Chess } from "chess.js"
import React from "react"

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--background)] py-8 px-2">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Chessboard Card */}
        <div className="flex-1 flex flex-col items-center">
          <div className="rounded-xl shadow-2xl bg-[#192133] border border-[#232a3b] p-4 mb-4" style={{ minWidth: 340 }}>
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
              <div className="h-[320px] sm:h-[400px] flex flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">Congratulations!</h2>
                <p className="text-purple-200">You solved all {totalPuzzles} puzzles! 🎉</p>
                <Button onClick={() => { setCurrentIndex(0); setCompleted(false); }} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-semibold shadow-md transition-all">
                  Restart Puzzles
                </Button>
              </div>
            ) : null}
          </div>
          {/* Control Buttons */}
          {!completed && (
            <div className="flex gap-4 justify-center w-full mb-4">
              <Button onClick={handleRetry} className="bg-gray-200 dark:bg-[#23263a] hover:bg-gray-300 dark:hover:bg-[#23263a]/80 text-gray-800 dark:text-gray-200 rounded-lg px-6 py-2 font-semibold shadow transition-all">Reset</Button>
              <Button
                onClick={showingSolution ? handleHideSolution : handleShowSolution}
                className={`rounded-lg px-6 py-2 font-semibold shadow transition-all ${showingSolution ? 'bg-yellow-300 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100' : 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-600'}`}
                >
                {showingSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>
              <Button onClick={handleNextPuzzle} className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-semibold shadow transition-all">Next Puzzle</Button>
            </div>
          )}
        </div>
        {/* Puzzle Info/Progress Card */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-[#192133] border border-[#232a3b] rounded-xl shadow-xl p-6 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-[var(--primary-text)] dark:text-purple-200">Back Rank Mate</span>
              <span className="ml-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 text-xs font-bold">beginner</span>
            </div>
            <div className="text-gray-700 dark:text-gray-300 mb-2 text-sm">Find the mate in 1 move. The enemy king is trapped on the back rank.</div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>♟️ MATE IN-1</span>
              <span>•</span>
              <span>100 pts</span>
              <span>•</span>
              <span>4:41</span>
            </div>
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{completed ? totalPuzzles : currentIndex + 1} of {totalPuzzles}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-[#23263a] rounded-full h-2">
                <div className="bg-purple-400 dark:bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((completed ? totalPuzzles : currentIndex + 1) / totalPuzzles) * 100}%` }}></div>
              </div>
            </div>
            <div className="flex justify-end text-xs mt-2">
              <div>
                <div className="font-bold text-lg text-purple-300">{completed ? totalPuzzles : currentIndex + 1}</div>
                <div className="text-gray-400">Current Puzzle</div>
              </div>
            </div>
            {/* Solution Explanation */}
            {showExplanation && (
              <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-[#2d2250] text-purple-900 dark:text-purple-100 shadow">
                <div className="font-bold mb-2">Solution</div>
                <div className="mb-1"><span className="font-mono font-bold text-lg">{solutionMove}</span></div>
                <div>This is a classic back rank mate. The king is trapped by its own pawns and is checkmated by the queen on the back rank.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Motivational Quote Section */}
      <div className="w-full flex justify-center mt-8">
        <div className="bg-white/80 dark:bg-[#23263a]/80 rounded-lg shadow p-4 max-w-2xl w-full text-center text-lg font-sans">
          <span className="font-bold text-purple-700 dark:text-purple-200">"Every master was once a beginner. Every pro was once an amateur."</span>
          <br />
          <span className="text-gray-700 dark:text-gray-300 text-base">Keep practicing and you'll see improvement in your tactical vision!</span>
        </div>
      </div>
    </div>
  )
} 