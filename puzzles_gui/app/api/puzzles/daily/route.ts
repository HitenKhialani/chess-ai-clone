import { NextResponse } from "next/server"

export async function GET() {
  // In production, this would fetch from a database or generate based on date seed
  const today = new Date().toISOString().split("T")[0]

  const dailyPuzzle = {
    id: `daily-${today}`,
    fen: "r2qkb1r/pp2nppp/3p4/2pP4/2P1P3/2N2N2/PP1B1PPP/R2QK2R w KQkq - 0 8",
    solution: ["Nxe7+", "Qxe7", "Qh5+"],
    theme: "Double Attack",
    difficulty: 1650,
    description: "Find the winning combination for White",
    source: "GM Game - Kasparov vs Karpov, 1984",
    date: today,
    solvers: Math.floor(Math.random() * 2000) + 500,
    averageTime: Math.floor(Math.random() * 180) + 60,
  }

  return NextResponse.json({ puzzle: dailyPuzzle })
}
