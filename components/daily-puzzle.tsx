"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChessBoard } from "@/components/chess-board"
import { ArrowLeft, Calendar, Star, Users } from "lucide-react"

interface DailyPuzzleProps {
  onBack: () => void
}

export function DailyPuzzle({ onBack }: DailyPuzzleProps) {
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  const todaysPuzzle = {
    id: "daily-2024-01-15",
    fen: "r2qkb1r/pp2nppp/3p4/2pP4/2P1P3/2N2N2/PP1B1PPP/R2QK2R w KQkq - 0 8",
    solution: ["Nxe7+", "Qxe7", "Qh5+"],
    theme: "Double Attack",
    difficulty: 1650,
    description: "Find the winning combination for White",
    source: "GM Game - Kasparov vs Karpov, 1984",
    solvers: 1247,
    averageTime: 145,
  }

  const handlePuzzleSolved = (correct: boolean, time: number) => {
    setAttempts((prev) => prev + 1)
    setTimeSpent(time)

    if (correct) {
      setSolved(true)
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="container mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 text-purple-200 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Puzzles
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Daily Puzzle</h1>
          </div>
          <p className="text-purple-200">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chess Board */}
          <div className="lg:col-span-2">
            <Card className="bg-black/30 border-purple-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Star className="h-5 w-5 text-indigo-400" />
                    <span>Daily Challenge</span>
                  </CardTitle>
                  <Badge variant="secondary" className="bg-indigo-600/20 text-indigo-200">
                    {todaysPuzzle.difficulty} Elo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {solved ? (
                  <div className="space-y-4">
                    <div className="bg-green-600/20 border border-green-600/50 p-6 rounded-lg text-center">
                      <div className="text-4xl mb-2">🎉</div>
                      <h3 className="text-xl font-bold text-green-200 mb-2">Puzzle Solved!</h3>
                      <p className="text-green-300">
                        Completed in {attempts} attempt{attempts !== 1 ? "s" : ""}• Time: {formatTime(timeSpent)}
                      </p>
                    </div>
                    <ChessBoard fen={todaysPuzzle.fen} solution={todaysPuzzle.solution} onSolved={handlePuzzleSolved} />
                  </div>
                ) : (
                  <ChessBoard fen={todaysPuzzle.fen} solution={todaysPuzzle.solution} onSolved={handlePuzzleSolved} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Puzzle Info */}
          <div className="space-y-6">
            {/* Puzzle Details */}
            <Card className="bg-black/30 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white">Puzzle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-purple-200 mb-3">{todaysPuzzle.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                      {todaysPuzzle.theme}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-200">
                      {todaysPuzzle.difficulty} Elo
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-700/50">
                  <p className="text-sm text-purple-300 italic">{todaysPuzzle.source}</p>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-black/30 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-400" />
                  <span>Community Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Solvers Today</span>
                    <span className="text-white font-bold">{todaysPuzzle.solvers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Average Time</span>
                    <span className="text-white font-bold">{formatTime(todaysPuzzle.averageTime * 1000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Your Attempts</span>
                    <span className="text-white font-bold">{attempts}</span>
                  </div>
                </div>

                {solved && (
                  <div className="pt-4 border-t border-purple-700/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {timeSpent < todaysPuzzle.averageTime * 1000 ? "Above Average!" : "Well Done!"}
                      </div>
                      <p className="text-sm text-purple-200">
                        {timeSpent < todaysPuzzle.averageTime * 1000
                          ? "You solved it faster than average!"
                          : "Keep practicing to improve your speed!"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Streak Info */}
            <Card className="bg-black/30 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white">Daily Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">7</div>
                  <p className="text-purple-200 mb-4">Day Streak</p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full ${i < 7 ? "bg-green-500" : "bg-gray-600"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-purple-300 mt-2">Solve daily puzzles to maintain your streak!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 