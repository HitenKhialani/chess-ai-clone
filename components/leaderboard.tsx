"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardProps {
  compact?: boolean
}

export function Leaderboard({ compact = false }: LeaderboardProps) {
  const leaderboardData = [
    { rank: 1, name: "ChessMaster2024", rating: 2156, solved: 1247, streak: 23 },
    { rank: 2, name: "TacticalGenius", rating: 2089, solved: 1156, streak: 18 },
    { rank: 3, name: "EndgameExpert", rating: 2034, solved: 1089, streak: 15 },
    { rank: 4, name: "PuzzleWizard", rating: 1987, solved: 967, streak: 12 },
    { rank: 5, name: "StrategicMind", rating: 1923, solved: 834, streak: 9 },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-purple-200 font-bold">#{rank}</span>
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
      <div className="bg-wallpaper" />
      <Card className="bg-[var(--card)] border-[var(--accent)] card-shadow text-[var(--card-foreground)] max-w-xl mx-auto mt-12">
        <CardHeader>
          <CardTitle className="text-[var(--secondary)] flex items-center space-x-2 text-glow">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span>{compact ? "Top Players" : "Global Leaderboard"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.slice(0, compact ? 3 : 5).map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${player.rank <= 3 ? 'border-2 border-[var(--accent)] btn-glow' : ''} bg-[var(--card)]/90 hover:bg-[var(--card)] transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 flex justify-center">{getRankIcon(player.rank)}</div>
                  <div>
                    <div className="text-[var(--tab-inactive)] font-medium">{player.name}</div>
                    {!compact && (
                      <div className="text-sm text-[var(--secondary)]">
                        {player.solved} solved • {player.streak} streak
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-[var(--primary)]/20 text-[var(--secondary)]">
                  {player.rating}
                </Badge>
              </div>
            ))}
          </div>
          {compact && (
            <div className="mt-4 text-center">
              <button className="text-[var(--secondary)] hover:text-[var(--tab-active)] text-sm">View Full Leaderboard →</button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 