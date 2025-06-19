'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, ThumbsUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { PuzzleBoard } from "@/components/puzzle-board"
import { Toaster } from "sonner"

// Sample puzzle data - in production this would come from a database
const samplePuzzle = {
  fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
  moves: ["d4", "exd4", "e5", "Ne4", "Qxd4"],
  type: "Pin",
  rating: 1500,
  description: "Find the pin tactic that wins material",
  solution: "The bishop on c4 pins the f7 pawn to the king, allowing White to win material."
}

export default function TacticsPage() {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <Toaster />
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/puzzles" className="text-[#00BFCF] hover:text-[#00BFCF]/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Tactical Patterns</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Master essential tactical patterns through carefully selected positions. Each puzzle is designed to reinforce pattern recognition and calculation skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Puzzle Section */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                {/* Puzzle Info */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-[#00BFCF] border-[#00BFCF]">
                    {samplePuzzle.type}
                  </Badge>
                  <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                    Rating: {samplePuzzle.rating}
                  </Badge>
                </div>

                {/* Puzzle Board */}
                <PuzzleBoard
                  fen={samplePuzzle.fen}
                  moves={samplePuzzle.moves}
                  onComplete={() => console.log('Puzzle completed')}
                  onFail={() => console.log('Puzzle failed')}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Puzzles Solved</span>
                    <span className="text-[#00BFCF] font-semibold">24/150</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Current Streak</span>
                    <span className="text-[#00BFCF] font-semibold">7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#121212] rounded-lg">
                    <div className="text-[#00BFCF] text-2xl font-bold">85%</div>
                    <div className="text-[#CFFAFE] text-sm">Accuracy</div>
                  </div>
                  <div className="p-4 bg-[#121212] rounded-lg">
                    <div className="text-[#00BFCF] text-2xl font-bold">1650</div>
                    <div className="text-[#CFFAFE] text-sm">Puzzle Rating</div>
                  </div>
                  <div className="p-4 bg-[#121212] rounded-lg">
                    <div className="text-[#00BFCF] text-2xl font-bold">42</div>
                    <div className="text-[#CFFAFE] text-sm">Best Streak</div>
                  </div>
                  <div className="p-4 bg-[#121212] rounded-lg">
                    <div className="text-[#00BFCF] text-2xl font-bold">312</div>
                    <div className="text-[#CFFAFE] text-sm">Total Solved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Pin Tactics Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Look for pieces that can be pinned against more valuable pieces or the king</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Consider which pieces can create absolute pins (against the king) vs relative pins</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Watch out for defensive resources that can break the pin</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 