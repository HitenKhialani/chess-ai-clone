"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PuzzleStats } from "@/components/puzzle-stats"
import { PuzzleTimer } from "@/components/puzzle-timer"
import { PuzzleRush } from "@/components/puzzle-rush"
import { DailyPuzzle } from "@/components/daily-puzzle"
import { Leaderboard } from "@/components/leaderboard"
import { Trophy, Zap, Target, Crown, Clock, Star } from "lucide-react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"

interface Puzzle {
  id: string
  fen: string
  solution: string[]
  theme: string
  difficulty: number
  rating: number
  description: string
  source: "auto-generated" | "database"
}

const puzzleCategories = [
  { id: "tactics", name: "Tactics Trainer", icon: Target, color: "bg-purple-500" },
  { id: "endgames", name: "Endgame Mastery", icon: Crown, color: "bg-blue-500" },
  { id: "middlegame", name: "Middlegame Magic", icon: Star, color: "bg-green-500" },
  { id: "grandmaster", name: "GM Challenges", icon: Trophy, color: "bg-yellow-500" },
  { id: "rush", name: "Puzzle Rush", icon: Zap, color: "bg-red-500" },
  { id: "daily", name: "Daily Puzzle", icon: Clock, color: "bg-indigo-500" },
]

export default function PuzzlesPage() {
  const [activeCategory, setActiveCategory] = useState("tactics")
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [userRating, setUserRating] = useState(1200)
  const [streak, setStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [game, setGame] = useState(new Chess())
  const [moveIndex, setMoveIndex] = useState(0)

  useEffect(() => {
    loadPuzzle(activeCategory)
  }, [activeCategory])

  const loadPuzzle = async (category: string) => {
    setIsLoading(true)
    // Simulate API call to generate puzzle with Stockfish
    setTimeout(() => {
      const mockPuzzle: Puzzle = {
        id: `${category}-${Date.now()}`,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
        solution: ["Ng5", "d5", "exd5", "Nxd5"],
        theme: category === "tactics" ? "Fork" : category === "endgames" ? "King & Pawn" : "Positional",
        difficulty: Math.floor(Math.random() * 2000) + 800,
        rating: Math.floor(Math.random() * 2000) + 800,
        description: `Find the best move for White`,
        source: "auto-generated",
      }
      setCurrentPuzzle(mockPuzzle)
      const newGame = new Chess(mockPuzzle.fen)
      setGame(newGame)
      setMoveIndex(0)
      setIsLoading(false)
    }, 1000)
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (!currentPuzzle) return false

    const gameCopy = new Chess(game.fen())
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    })

    if (move === null) {
      return false
    }

    const expectedMove = currentPuzzle.solution[moveIndex]
    if (move.san === expectedMove) {
      setMoveIndex(moveIndex + 1)
      setGame(gameCopy)

      if (moveIndex + 1 < currentPuzzle.solution.length) {
        // AI move
        setTimeout(() => {
          const gameCopy2 = new Chess(gameCopy.fen())
          gameCopy2.move(currentPuzzle.solution[moveIndex+1])
          setGame(gameCopy2)
          setMoveIndex(moveIndex + 2)
        }, 500);
      } else {
        // Puzzle solved
        handlePuzzleSolved(true, 0)
      }
      return true
    } else {
      // wrong move
      handlePuzzleSolved(false, 0)
      // reset board to puzzle start
      setTimeout(() => {
        loadPuzzle(activeCategory)
      }, 1000);
      return false
    }
  }

  const handlePuzzleSolved = (correct: boolean, timeSpent: number) => {
    if (correct) {
      const ratingChange = Math.floor(Math.random() * 20) + 5
      setUserRating((prev) => prev + ratingChange)
      setStreak((prev) => prev + 1)
    } else {
      const ratingChange = Math.floor(Math.random() * 15) + 5
      setUserRating((prev) => prev - ratingChange)
      setStreak(0)
    }

    // Load next puzzle after a short delay
    setTimeout(() => loadPuzzle(activeCategory), 2000)
  }

  if (activeCategory === "rush") {
    return <PuzzleRush onBack={() => setActiveCategory("tactics")} />
  }

  if (activeCategory === "daily") {
    return <DailyPuzzle onBack={() => setActiveCategory("tactics")} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#4f46e5] dark:via-[#7c3aed] dark:to-[#111827]">
      {/* Header */}
      <div className="border-b border-purple-700/50 bg-black/20 backdrop-blur-sm mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">Endgame</span>
              </div>
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                Puzzles
              </Badge>
            </div>
            <PuzzleStats rating={userRating} streak={streak} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Selection */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Chess Puzzles</h1>
          <p className="text-purple-200 mb-6">Master chess with AI-powered puzzle training</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {puzzleCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    activeCategory === category.id
                      ? "ring-2 ring-purple-400 bg-purple-800/50"
                      : "bg-black/30 hover:bg-black/40"
                  } border-purple-700/50`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-white">{category.name}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Main Puzzle Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chess Board */}
          <div className="lg:col-span-2">
            <Card className="bg-black/30 border-purple-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    <span>{puzzleCategories.find((c) => c.id === activeCategory)?.name}</span>
                  </CardTitle>
                  {currentPuzzle && (
                    <PuzzleTimer difficulty={currentPuzzle.difficulty} onTimeUp={() => handlePuzzleSolved(false, 0)} />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="aspect-square bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                      <p className="text-purple-200">Generating puzzle with Stockfish...</p>
                    </div>
                  </div>
                ) : currentPuzzle ? (
                  <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Puzzle Info & Controls */}
          <div className="space-y-6">
            {/* Puzzle Details */}
            {currentPuzzle && (
              <Card className="bg-black/30 border-purple-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Puzzle Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-purple-200 mb-2">{currentPuzzle.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                        {currentPuzzle.theme}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-200">
                        {currentPuzzle.difficulty} Elo
                      </Badge>
                      <Badge variant="secondary" className="bg-green-600/20 text-green-200">
                        {currentPuzzle.source}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Your Rating</span>
                      <span className="text-white font-medium">{userRating}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Current Streak</span>
                      <span className="text-white font-medium">{streak}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-black/30 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => loadPuzzle(activeCategory)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  New Puzzle
                </Button>
                <Button
                  onClick={() => setActiveCategory("rush")}
                  variant="outline"
                  className="w-full border-purple-600 text-purple-200 hover:bg-purple-600/20"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Puzzle Rush
                </Button>
                <Button
                  onClick={() => setActiveCategory("daily")}
                  variant="outline"
                  className="w-full border-purple-600 text-purple-200 hover:bg-purple-600/20"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Daily Challenge
                </Button>
              </CardContent>
            </Card>

            {/* Mini Leaderboard */}
            <Leaderboard compact />
          </div>
        </div>
      </div>
    </div>
  )
}
