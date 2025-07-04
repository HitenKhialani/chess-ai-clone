'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ThumbsUp, AlertCircle, Target, Shield, Sword } from "lucide-react"
import Link from "next/link"
import { PuzzleBoard } from "@/components/puzzle-board"
import { Toaster } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample middlegame positions
const middlegamePositions = {
  pawnStructure: {
    isolatedPawn: {
      fen: "r2qk2r/pp2ppbp/2n3p1/2p5/3P4/2N1BN2/PP2BPPP/R2Q1RK1 w kq - 0 1",
      moves: ["Ne4", "Nxe4", "dxe4"],
      type: "Isolated Pawn",
      rating: 1700,
      description: "White creates an isolated d-pawn and uses it as a springboard for attack.",
      concept: "IQP Position",
      key_ideas: [
        "Use the isolated pawn to control central squares",
        "Place pieces in front of isolated pawns",
        "Attack on the kingside while opponent focuses on the weak pawn"
      ]
    },
    pawnChain: {
      fen: "rnbqk2r/pp2bppp/4pn2/2pp4/3P4/2N1BN2/PP2BPPP/R2QK2R w KQkq - 0 1",
      moves: ["e4", "dxe4", "Nxe4"],
      type: "Pawn Chain",
      rating: 1600,
      description: "Classic pawn chain structure leading to a dynamic middlegame.",
      concept: "Chain Dynamics",
      key_ideas: [
        "Attack at the base of the pawn chain",
        "Control squares in front of the chain",
        "Prepare breaks to disrupt the structure"
      ]
    }
  },
  piecePlay: {
    outpost: {
      fen: "r1bq1rk1/pp2ppbp/2n3p1/2p5/3Pn3/2N1BN2/PP2BPPP/R2Q1RK1 w - - 0 1",
      moves: ["Nxe4", "Bxe4", "d5"],
      type: "Knight Outpost",
      rating: 1800,
      description: "Establish and utilize a strong knight outpost in the center.",
      concept: "Piece Coordination",
      key_ideas: [
        "Create and use strong outposts for pieces",
        "Support outposts with pawns",
        "Prevent opponent's counterplay"
      ]
    },
    bishopPair: {
      fen: "rn1qk2r/pbppbppp/1p2pn2/8/2PP4/2N2N2/PP2BPPP/R1BQK2R w KQkq - 0 1",
      moves: ["d5", "exd5", "Nxd5"],
      type: "Bishop Pair",
      rating: 1900,
      description: "Exploit the advantage of the bishop pair in an open position.",
      concept: "Two Bishops",
      key_ideas: [
        "Open the position to utilize both bishops",
        "Control long diagonals",
        "Create weaknesses in opponent's camp"
      ]
    }
  },
  kingSafety: {
    attackPreparation: {
      fen: "r2q1rk1/pp2ppbp/2n3p1/2p5/3P4/2N1BN2/PP2BPPP/R2Q1RK1 w - - 0 1",
      moves: ["h4", "h5", "Qd2"],
      type: "King Attack",
      rating: 2000,
      description: "Prepare and execute a kingside attack with proper piece coordination.",
      concept: "Attack Building",
      key_ideas: [
        "Create pawn breaks near enemy king",
        "Coordinate pieces for the attack",
        "Time the attack correctly"
      ]
    },
    defense: {
      fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/1b1P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1",
      moves: ["a3", "Bxc3", "bxc3"],
      type: "Prophylaxis",
      rating: 1900,
      description: "Defend against threats and prepare counterplay.",
      concept: "Active Defense",
      key_ideas: [
        "Anticipate and prevent opponent's ideas",
        "Maintain piece coordination while defending",
        "Look for counterattacking chances"
      ]
    }
  }
}

export default function StrategyPage() {
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
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Middlegame Strategy</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Master essential middlegame concepts and strategic patterns. Learn to create and execute plans based on pawn structures, piece placement, and king safety.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Section */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <Tabs defaultValue="pawnStructure" className="space-y-4">
                  <TabsList className="bg-[#121212] border-b border-[#3F51B5]">
                    <TabsTrigger 
                      value="pawnStructure"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Pawn Structure
                    </TabsTrigger>
                    <TabsTrigger 
                      value="piecePlay"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Piece Play
                    </TabsTrigger>
                    <TabsTrigger 
                      value="kingSafety"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      King Safety
                    </TabsTrigger>
                  </TabsList>

                  {Object.entries(middlegamePositions).map(([category, positions]) => (
                    <TabsContent key={category} value={category}>
                      <div className="space-y-8">
                        {Object.entries(positions).map(([key, position]) => (
                          <div key={key} className="space-y-4">
                            {/* Position Info */}
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[#00BFCF] border-[#00BFCF]">
                                {position.type}
                              </Badge>
                              <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                                Rating: {position.rating}
                              </Badge>
                              <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                                {position.concept}
                              </Badge>
                            </div>

                            {/* Description */}
                            <p className="text-[#CFFAFE]">{position.description}</p>

                            {/* Puzzle Board */}
                            <PuzzleBoard
                              fen={position.fen}
                              moves={position.moves}
                              onComplete={() => {
                                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
                                if (token && position && position.fen) {
                                  fetch(`${backendUrl}/api/users/solve-puzzle`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ puzzle_id: position.fen, category: 'Strategy' }),
                                  });
                                }
                                console.log('Position completed')
                              }}
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
                        ))}
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
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Strategic Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Themes Mastered</span>
                    <span className="text-[#00BFCF] font-semibold">12/30</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Current Rating</span>
                    <span className="text-[#00BFCF] font-semibold">1850</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Mastery */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Theme Mastery</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Pawn Structures</span>
                    <Target className="h-5 w-5 text-[#00BFCF]" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Piece Coordination</span>
                    <Sword className="h-5 w-5 text-[#00BFCF]" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">King Safety</span>
                    <Shield className="h-5 w-5 text-[#00BFCF]" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Strategic Planning</span>
                    <div className="h-5 w-5 rounded-full border-2 border-[#3F51B5]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Strategic Principles</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Identify and exploit weaknesses in the opponent's position</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Improve your pieces before starting an attack</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Don't rush - build up your position methodically</p>
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