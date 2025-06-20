'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ThumbsUp, AlertCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { PuzzleBoard } from "@/components/puzzle-board"
import { Toaster } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample opening traps
const openingTraps = {
  sicilian: {
    fen: "rnbqkbnr/pp2pppp/2p5/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 0 1",
    moves: ["Nf3", "Bg4", "Ne5", "Bxd1", "Nxf7"],
    type: "Sicilian",
    rating: 1600,
    description: "Black falls for a common trap in the Sicilian Defense.",
    solution: "White sacrifices the queen to achieve a winning position.",
    variation: "Dragon Variation",
    key_ideas: [
      "Be careful of piece coordination in the opening",
      "Don't get tempted by material gains without considering consequences",
      "Watch out for tactical themes even in the opening phase"
    ]
  },
  ruyLopez: {
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1",
    moves: ["a6", "Ba4", "b5", "Bb3", "Na5"],
    type: "Ruy Lopez",
    rating: 1700,
    description: "The classic Ruy Lopez opening with the main line variations.",
    solution: "Black plays the standard moves to challenge White's bishop.",
    variation: "Main Line",
    key_ideas: [
      "Control the center with pawns and pieces",
      "Develop pieces to active squares",
      "Create tension in the center for future tactical opportunities"
    ]
  },
  italian: {
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1",
    moves: ["Bc5", "c3", "Nf6", "d4", "exd4"],
    type: "Italian Game",
    rating: 1500,
    description: "The Italian Game with its typical attacking ideas.",
    solution: "White builds a strong pawn center while developing pieces.",
    variation: "Giuoco Piano",
    key_ideas: [
      "Develop bishops to active squares early",
      "Control the center squares e4 and d4",
      "Prepare for kingside attacking chances"
    ]
  }
}

export default function OpeningsPage() {
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
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Opening Traps</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Learn to recognize and avoid common opening traps while mastering fundamental opening principles. Understanding these patterns will help you start your games with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Section */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <Tabs defaultValue="sicilian" className="space-y-4">
                  <TabsList className="bg-[#121212] border-b border-[#3F51B5]">
                    <TabsTrigger 
                      value="sicilian"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Sicilian
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ruyLopez"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Ruy Lopez
                    </TabsTrigger>
                    <TabsTrigger 
                      value="italian"
                      className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                    >
                      Italian Game
                    </TabsTrigger>
                  </TabsList>

                  {Object.entries(openingTraps).map(([key, position]) => (
                    <TabsContent key={key} value={key}>
                      <div className="space-y-4">
                        {/* Position Info */}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[#00BFCF] border-[#00BFCF]">
                            {position.type}
                          </Badge>
                          <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                            Rating: {position.rating}
                          </Badge>
                          <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                            {position.variation}
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
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Opening Repertoire</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Lines Learned</span>
                    <span className="text-[#00BFCF] font-semibold">15/40</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '37.5%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Mastery Level</span>
                    <span className="text-[#00BFCF] font-semibold">Advanced</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Theory */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Opening Theory</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Basic Principles</span>
                    <BookOpen className="h-5 w-5 text-[#00BFCF]" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Common Patterns</span>
                    <BookOpen className="h-5 w-5 text-[#00BFCF]" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">Advanced Strategy</span>
                    <div className="h-5 w-5 rounded-full border-2 border-[#3F51B5]"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121212]">
                    <span className="text-[#CFFAFE]">GM Repertoire</span>
                    <div className="h-5 w-5 rounded-full border-2 border-[#3F51B5]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Opening Principles</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Control the center with pawns and pieces</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Develop your minor pieces before major pieces</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-[#00BFCF] mt-1" />
                    <p className="text-[#CFFAFE]">Don't move the same piece multiple times in the opening</p>
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