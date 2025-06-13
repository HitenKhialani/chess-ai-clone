"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { PuzzleBoard } from "@/components/puzzle-board"
import { Toaster } from "sonner"

interface Opening {
  name: string
  description: string
  history: string
  keyIdeas: string[]
  mainLines: string[]
  fen: string
  moves: string[]
  difficulty: string
  popularity: number
  winRate: number
}

type OpeningsData = {
  [key: string]: Opening
}

// Opening data with detailed information
const openingsData: OpeningsData = {
  "ruy-lopez": {
    name: "Ruy Lopez",
    description: "The Ruy Lopez is one of the oldest and most popular openings in chess. Named after the Spanish priest Ruy López de Segura who analyzed it in 1561, it begins with 1.e4 e5 2.Nf3 Nc6 3.Bb5. This opening is known for its strategic complexity and rich positional play.",
    history: "The opening became particularly popular in the late 19th century and remains one of the most commonly played openings at all levels of chess. It has been a favorite of many world champions, including Kasparov and Carlsen.",
    keyIdeas: [
      "White attacks the knight defending e5, potentially weakening Black's central control",
      "The bishop on b5 can be exchanged for the knight, doubling Black's pawns",
      "White often castles kingside and builds pressure on the center",
      "Black has many solid defensive setups, including the Berlin and Chigorin variations"
    ],
    mainLines: [
      "Main Line: 3...a6 4.Ba4 Nf6 5.0-0",
      "Berlin Defense: 3...Nf6",
      "Classical Defense: 3...Bc5",
      "Morphy Defense: 3...a6 4.Ba4 Nf6"
    ],
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    difficulty: "Intermediate",
    popularity: 95,
    winRate: 52
  },
  "sicilian-defense": {
    name: "Sicilian Defense",
    description: "The Sicilian Defense is the most popular response to White's 1.e4. It is an aggressive defense that immediately fights for the center with a flank pawn. This leads to sharp, complex positions with many tactical opportunities.",
    history: "While the opening has been known since the 16th century, it gained prominence in the 20th century when players like Mikhail Tal demonstrated its attacking potential.",
    keyIdeas: [
      "Black immediately contests the center with a flank pawn",
      "Creates imbalanced positions with many tactical opportunities",
      "Black often gains counterplay on the queenside",
      "White typically tries to exploit their central space advantage"
    ],
    mainLines: [
      "Open Sicilian: 2.Nf3 d6 3.d4",
      "Najdorf Variation: 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6",
      "Dragon Variation: 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6",
      "Scheveningen Variation: 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6"
    ],
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: ["e4", "c5"],
    difficulty: "Advanced",
    popularity: 90,
    winRate: 48
  },
  "italian-game": {
    name: "Italian Game",
    description: "The Italian Game is one of the oldest recorded chess openings, dating back to the 16th century. It begins with 1.e4 e5 2.Nf3 Nc6 3.Bc4, aiming to control the center and target Black's vulnerable f7 square.",
    history: "Also known as the Giuoco Piano ('Quiet Game' in Italian), this opening was extensively analyzed by Italian players in the 16th and 17th centuries. It remains popular at all levels due to its straightforward strategic ideas.",
    keyIdeas: [
      "Quick development of pieces to active squares",
      "Control of the center with pawns and pieces",
      "Potential attack on Black's f7 square",
      "Balanced positions with chances for both sides"
    ],
    mainLines: [
      "Giuoco Piano: 3...Bc5",
      "Giuoco Pianissimo: 4.d3",
      "Evans Gambit: 4.b4",
      "Hungarian Defense: 3...Be7"
    ],
    fen: "r1bqk1nr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    difficulty: "Beginner",
    popularity: 85,
    winRate: 50
  },
  "french-defense": {
    name: "French Defense",
    description: "The French Defense is a solid chess opening for Black that begins with 1.e4 e6. It creates a strong pawn chain but temporarily restricts the light-squared bishop.",
    history: "Named after a match between London and Paris in 1834, it became popular due to its solid nature and counterattacking possibilities. It was extensively analyzed by Mikhail Botvinnik and other Soviet players.",
    keyIdeas: [
      "Black establishes a strong pawn chain with ...e6 and ...d5",
      "Counterattack in the center with ...c5",
      "The light-squared bishop can be problematic",
      "Black often plays for queenside expansion"
    ],
    mainLines: [
      "Advance Variation: 2.d4 d5 3.e5",
      "Exchange Variation: 2.d4 d5 3.exd5",
      "Tarrasch Variation: 2.d4 d5 3.Nd2",
      "Winawer Variation: 2.d4 d5 3.Nc3 Bb4"
    ],
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: ["e4", "e6"],
    difficulty: "Intermediate",
    popularity: 80,
    winRate: 49
  },
  "kings-indian-defense": {
    name: "King's Indian Defense",
    description: "The King's Indian Defense is a hypermodern opening where Black allows White to establish a broad pawn center, only to attack it later with pieces and pawn breaks.",
    history: "Popularized in the 1940s and 1950s by players like Bronstein and Geller, it became a major weapon for players seeking dynamic play. Bobby Fischer also used it with great success.",
    keyIdeas: [
      "Black develops flexibly while allowing White central control",
      "Preparation for ...e5 or ...c5 pawn breaks",
      "Kingside attacking chances with ...f5",
      "Complex positions with chances for both sides"
    ],
    mainLines: [
      "Classical Variation: 3.Nc3 Bg7 4.e4 d6 5.Be2",
      "Sämisch Variation: 3.Nc3 Bg7 4.e4 d6 5.f3",
      "Four Pawns Attack: 3.Nc3 Bg7 4.e4 d6 5.f4",
      "Averbakh Variation: 3.Nc3 Bg7 4.e4 d6 5.Be2 0-0 6.Bg5"
    ],
    fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
    moves: ["d4", "Nf6", "c4", "g6"],
    difficulty: "Advanced",
    popularity: 75,
    winRate: 51
  },
  "london-system": {
    name: "London System",
    description: "The London System is a solid opening system for White that can be played against almost any Black setup. It features quick development and a reliable pawn structure.",
    history: "While the opening has existed for a long time, it gained significant popularity in recent years due to its reliability and ease of learning. Many modern grandmasters, including Magnus Carlsen, have employed it successfully.",
    keyIdeas: [
      "Quick development with Bf4 and e3",
      "Solid pawn structure that's hard to break down",
      "Flexible piece placement",
      "Can be played against various Black setups"
    ],
    mainLines: [
      "Main Line: 1.d4 d5 2.Bf4 Nf6 3.e3",
      "Early c3: 1.d4 d5 2.Bf4 Nf6 3.c3",
      "Jobava London: 1.d4 d5 2.Bf4 Nf6 3.Nc3",
      "Modern Line: 1.d4 Nf6 2.Bf4"
    ],
    fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 0 2",
    moves: ["d4", "d5", "Bf4"],
    difficulty: "Beginner",
    popularity: 70,
    winRate: 53
  }
}

export default function OpeningDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : ""
  const opening = openingsData[slug as keyof typeof openingsData]

  if (!opening) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/learn" className="flex items-center text-blue-400 hover:text-blue-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Center
          </Link>
          <h1 className="text-2xl font-bold">Opening not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <Link href="/learn" className="flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning Center
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{opening.name}</h1>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {opening.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Popularity: {opening.popularity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Win Rate: {opening.winRate}%</span>
                </div>
              </div>
              <p className="text-gray-300">{opening.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">History</h2>
              <p className="text-gray-300">{opening.history}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Key Ideas</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {opening.keyIdeas.map((idea: string, index: number) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Main Lines</h2>
              <ul className="space-y-2 text-gray-300">
                {opening.mainLines.map((line: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Interactive Board</h2>
                <div className="w-full max-w-[500px] mx-auto">
                  <PuzzleBoard
                    fen={opening.fen}
                    moves={opening.moves}
                    onComplete={() => {}}
                    onFail={() => {}}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  Try playing through the main line moves to understand the opening better.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 