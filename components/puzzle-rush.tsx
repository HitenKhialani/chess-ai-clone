"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ChessBoard from "@/components/chess-board"
import { ArrowLeft, Zap, Clock, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useUser } from "./UserProvider"
import { toast } from "sonner"

interface Puzzle {
  id: string;
  fen: string;
  moves: string[];
  theme: string;
  difficulty: number;
}

interface PuzzleRushProps {
  onBack: () => void
}

export function PuzzleRush({ onBack }: PuzzleRushProps) {
  const [gameState, setGameState] = useState<"waiting" | "playing" | "finished">("waiting")
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const { refetchUser } = useUser();

  useEffect(() => {
    // Fetch puzzles from the backend
    const fetchPuzzles = async () => {
      try {
        // Assuming an endpoint that returns puzzles for the rush
        const response = await fetch('/api/puzzles/random?limit=20');
        const data = await response.json();
        setPuzzles(data);
      } catch (error) {
        console.error("Failed to fetch puzzles:", error);
      }
    };
    fetchPuzzles();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setGameState("finished")
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState, timeLeft])

  const startGame = () => {
    setGameState("playing")
    setTimeLeft(180)
    setScore(0)
    setStreak(0)
    setCurrentPuzzleIndex(0)
    setLives(3)
  }

  const handlePuzzleSolved = async (correct: boolean) => {
    if (correct) {
        const puzzle = puzzles[currentPuzzleIndex];
        setScore((prev) => prev + (10 + streak * 2));
        setStreak((prev) => prev + 1);
        setCurrentPuzzleIndex((prev) => (prev + 1) % puzzles.length);

        const token = localStorage.getItem('token');
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

        if (token && puzzle) {
            try {
                const response = await fetch(`${backendUrl}/api/users/solve-puzzle`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ puzzle_id: puzzle.fen, category: 'MateNRush' }),
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success(`Puzzle solved! You gained ${data.coinsGained} coin(s).`);
                    refetchUser();
                } else {
                    toast.error(data.msg || "Failed to record puzzle.");
                }
            } catch (error) {
                toast.error("An error occurred while recording the puzzle.");
            }
        }
    } else {
      setStreak(0)
      setLives((prev) => {
        const newLives = prev - 1
        if (newLives <= 0) {
          setGameState("finished")
        }
        return newLives
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (gameState === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
        <div className="container mx-auto max-w-2xl">
          <Button onClick={onBack} variant="ghost" className="mb-6 text-purple-200 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Puzzles
          </Button>

          <Card className="bg-[var(--card)] border-[var(--accent)] card-shadow text-[var(--card-foreground)]">
            <CardHeader className="text-center text-[var(--secondary)]">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-white">Puzzle Rush</CardTitle>
              <p className="text-purple-200">Solve as many puzzles as you can in 3 minutes!</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-white font-bold">3:00</div>
                  <div className="text-purple-200 text-sm">Time Limit</div>
                </div>
                <div>
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-white font-bold">∞</div>
                  <div className="text-purple-200 text-sm">Puzzles</div>
                </div>
                <div>
                  <div className="text-red-400 text-2xl font-bold mx-auto mb-2">❤️</div>
                  <div className="text-white font-bold">3</div>
                  <div className="text-purple-200 text-sm">Lives</div>
                </div>
              </div>

              <div className="bg-purple-900/30 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2">Rules:</h3>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• Solve puzzles as quickly as possible</li>
                  <li>• Each correct answer increases your streak multiplier</li>
                  <li>• Wrong answers cost you a life</li>
                  <li>• Game ends when time runs out or you lose all lives</li>
                </ul>
              </div>

              <Button onClick={startGame} className="w-full bg-[var(--primary)] hover:bg-[var(--secondary)] text-white btn-glow">
                <Zap className="h-5 w-5 mr-2" />
                Start Puzzle Rush
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-[var(--card)] border-[var(--accent)] card-shadow text-[var(--card-foreground)]">
            <CardHeader className="text-center text-[var(--secondary)]">
              <CardTitle className="text-3xl text-white mb-4">Game Over!</CardTitle>
              <div className="text-6xl font-bold text-yellow-400 mb-2">{score}</div>
              <p className="text-purple-200">Final Score</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{Math.floor(score / 10)}</div>
                  <div className="text-purple-200 text-sm">Puzzles Solved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{streak}</div>
                  <div className="text-purple-200 text-sm">Best Streak</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={startGame} className="flex-1 bg-[var(--primary)] hover:bg-[var(--secondary)]">
                  Play Again
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 border-[var(--accent)] text-[var(--secondary)] hover:bg-[var(--accent)]/20"
                >
                  Back to Puzzles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Zap className="h-8 w-8 text-red-400" />
            <h1 className="text-2xl font-bold text-white">Puzzle Rush</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{score}</div>
              <div className="text-purple-200 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{streak}</div>
              <div className="text-purple-200 text-sm">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{"❤️".repeat(lives)}</div>
              <div className="text-purple-200 text-sm">Lives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{formatTime(timeLeft)}</div>
              <div className="text-purple-200 text-sm">Time</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={(timeLeft / 180) * 100} className="h-3 bg-purple-900" />
        </div>

        {/* Game Board */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[var(--card)] border-[var(--accent)] card-shadow text-[var(--card-foreground)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Puzzle #{currentPuzzleIndex + 1}</CardTitle>
                  {puzzles.length > 0 &&
                    <Badge variant="secondary" className="bg-red-600/20 text-red-200">
                      {puzzles[currentPuzzleIndex].theme}
                    </Badge>
                  }
                </div>
              </CardHeader>
              <CardContent>
                {puzzles.length > 0 ? (
                  <ChessBoard
                    fen={puzzles[currentPuzzleIndex].fen}
                    solution={puzzles[currentPuzzleIndex].moves}
                    onSolved={handlePuzzleSolved}
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center text-white">Loading puzzles...</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-[var(--card)] border-[var(--accent)] card-shadow text-[var(--card-foreground)]">
              <CardHeader>
                <CardTitle className="text-white">Rush Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Score</span>
                  <span className="text-white font-medium">{score}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Streak</span>
                  <span className="text-white font-medium">{streak}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Lives</span>
                  <span className="text-white font-medium">{lives}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Time Left</span>
                  <span className="text-white font-medium">{formatTime(timeLeft)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 