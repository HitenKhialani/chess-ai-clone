'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ThumbsUp, AlertCircle, Crown } from "lucide-react"
import Link from "next/link"
import { PuzzleBoard } from "@/components/puzzle-board"
import { Toaster } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample endgame positions
const endgamePositions = {
  pawnEndings: {
    fen: "8/3k4/8/8/3K4/8/4P3/8 w - - 0 1",
    moves: ["e4", "Ke6", "e5", "Kf7", "Ke5"],
    type: "Pawn",
    rating: 1400,
    description: "White to move and win. Use the opposition to promote the pawn.",
    solution: "White uses the opposition principle to force Black's king away and promote the pawn.",
    concept: "Opposition",
    key_ideas: [
      "The opposition is a key concept in pawn endings",
      "When kings face each other with one square in between, the side to move is at a disadvantage",
      "Use the opposition to force the enemy king away from your pawn's promotion path"
    ]
  },
  rookEndings: {
    fen: "8/8/8/8/5k2/8/3R4/3K4 w - - 0 1",
    moves: ["Rd4+", "Ke5", "Rd5+", "Kf4", "Kd2"],
    type: "Rook",
    rating: 1600,
    description: "White to move and win. Cut off the black king using the rook.",
    solution: "White uses the rook to restrict Black's king, demonstrating the power of the rook in endgames.",
    concept: "Rook Opposition",
    key_ideas: [
      "Use the rook to cut off the enemy king",
      "Keep your king active in rook endings",
      "The rook is most effective when placed behind passed pawns"
    ]
  },
  queenEndings: {
    fen: "8/8/8/4k3/8/3K4/6Q1/8 w - - 0 1",
    moves: ["Qe4+", "Kd6", "Qd4+", "Ke6", "Ke4"],
    type: "Queen",
    rating: 1800,
    description: "White to move and checkmate in 5 moves.",
    solution: "White uses the queen to force the black king into a mating net.",
    concept: "Queen Checkmate",
    key_ideas: [
      "The queen and king can force checkmate alone",
      "Use checks to drive the enemy king to the edge",
      "Keep your king close to support the queen"
    ]
  }
}

export default function EndgamePage() {
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
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Endgame Studies</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Master essential endgame techniques and principles. Understanding these fundamental positions is crucial for improving your overall chess strength.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Section */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <Tabs defaultValue="pawnEndings" className="space-y-4">
                  <TabsList className="bg-[#121212] border-b border-[#3F51B5]">
                    <TabsTrigger 
                      value="pawnEndings"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Pawn Endings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="rookEndings"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Rook Endings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="queenEndings"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Queen Endings
                    </TabsTrigger>
                  </TabsList>

                  {Object.entries(endgamePositions).map(([key, position]) => (
                    <TabsContent key={key} value={key}>
                      <div className="space-y-4">
                        {/* Position Info */}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[#00BFCF] border-[#00BFCF]">
                            {position.type} Endgame
                          </Badge>
                          <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                            Rating: {position.rating}
                          </Badge>
                          <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                            Concept: {position.concept}
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-[#CFFAFE]">{position.description}</p>

                        {/* Puzzle Board */}
                        <PuzzleBoard
                          fen={position.fen}
                          moves={position.moves}
                          onComplete={() => console.log('Position completed')}
                          onFail={() => console.log('Position failed')}
                        />

                        {/* Key Ideas */}
                        <div className="mt-6 p-4 bg-[#121212] rounded-lg">
                          <h3 className="text-[#FFFFFF] font-semibold mb-2">Key Ideas:</h3>
                          <ul className="space-y-2">
                            {position.key_ideas.map((idea, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                                <span className="text-[#CFFAFE]">{idea}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
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
                    <span className="text-[#CFFAFE]">Positions Mastered</span>
                    <span className="text-[#00BFCF] font-semibold">18/50</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Current Level</span>
                    <span className="text-[#00BFCF] font-semibold">Intermediate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Path */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Learning Path</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Basic Pawn Endings</span>
                    <Crown className="h-5 w-5 text-[#00BFCF]" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Rook vs Pawn</span>
                    <Crown className="h-5 w-5 text-[#00BFCF]" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Queen vs Rook</span>
                    <div className="h-5 w-5 rounded-full border-2 border-[#3F51B5]"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Technical Wins</span>
                    <div className="h-5 w-5 rounded-full border-2 border-[#3F51B5]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Endgame Principles</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Activate your king in endgames - it becomes a strong piece</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Create passed pawns and prevent opponent's passed pawns</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Centralize your pieces, especially in positions with few pieces</p>
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