import { NextResponse } from "next/server"

export async function GET() {
  // Mock leaderboard data - in production, fetch from database
  const leaderboard = [
    { rank: 1, name: "ChessMaster2024", rating: 2156, solved: 1247, streak: 23, country: "US" },
    { rank: 2, name: "TacticalGenius", rating: 2089, solved: 1156, streak: 18, country: "RU" },
    { rank: 3, name: "EndgameExpert", rating: 2034, solved: 1089, streak: 15, country: "IN" },
    { rank: 4, name: "PuzzleWizard", rating: 1987, solved: 967, streak: 12, country: "DE" },
    { rank: 5, name: "StrategicMind", rating: 1923, solved: 834, streak: 9, country: "BR" },
    { rank: 6, name: "ChessNinja", rating: 1876, solved: 756, streak: 7, country: "FR" },
    { rank: 7, name: "TacticMaster", rating: 1834, solved: 689, streak: 5, country: "ES" },
    { rank: 8, name: "PuzzleSolver", rating: 1789, solved: 623, streak: 4, country: "IT" },
    { rank: 9, name: "ChessGuru", rating: 1745, solved: 567, streak: 3, country: "CA" },
    { rank: 10, name: "PositionPlayer", rating: 1698, solved: 512, streak: 2, country: "AU" },
  ]

  return NextResponse.json({ leaderboard })
}
