import { type NextRequest, NextResponse } from "next/server"

// Mock Stockfish integration - in production, you'd use actual Stockfish engine
interface PuzzleRequest {
  category: string
  difficulty: number
  theme?: string
}

interface GeneratedPuzzle {
  id: string
  fen: string
  solution: string[]
  theme: string
  difficulty: number
  description: string
  source: "auto-generated"
}

export async function POST(request: NextRequest) {
  try {
    const { category, difficulty, theme }: PuzzleRequest = await request.json()

    // Simulate Stockfish puzzle generation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock puzzle database based on category
    const puzzleTemplates = {
      tactics: [
        {
          fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
          solution: ["Ng5", "h6", "Nxf7"],
          theme: "Fork",
          description: "White can win material with a knight fork",
        },
        {
          fen: "r1bq1rk1/ppp2ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7",
          solution: ["Bxf7+", "Kh8", "Ng5"],
          theme: "Discovered Attack",
          description: "Find the winning discovered attack",
        },
      ],
      endgames: [
        {
          fen: "8/8/8/8/8/3K4/3P4/3k4 w - - 0 1",
          solution: ["Kd4", "Kd2", "Ke5"],
          theme: "King and Pawn",
          description: "Win with precise king and pawn technique",
        },
      ],
      middlegame: [
        {
          fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4",
          solution: ["d4", "exd4", "e5"],
          theme: "Central Break",
          description: "Break open the center with a pawn advance",
        },
      ],
    }

    const templates = puzzleTemplates[category as keyof typeof puzzleTemplates] || puzzleTemplates.tactics
    const template = templates[Math.floor(Math.random() * templates.length)]

    const puzzle: GeneratedPuzzle = {
      id: `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fen: template.fen,
      solution: template.solution,
      theme: template.theme,
      difficulty: difficulty + Math.floor(Math.random() * 200) - 100, // Add some variance
      description: template.description,
      source: "auto-generated",
    }

    return NextResponse.json({ puzzle })
  } catch (error) {
    console.error("Error generating puzzle:", error)
    return NextResponse.json({ error: "Failed to generate puzzle" }, { status: 500 })
  }
}
