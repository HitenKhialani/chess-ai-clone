"use client"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Flame, Trophy } from "lucide-react"

interface PuzzleStatsProps {
  rating: number
  streak: number
  todaysSolved?: number
}

export function PuzzleStats({ rating, streak, todaysSolved = 0 }: PuzzleStatsProps) {
  const getRatingColor = (rating: number) => {
    if (rating < 1000) return "text-gray-400"
    if (rating < 1200) return "text-green-400"
    if (rating < 1500) return "text-blue-400"
    if (rating < 1800) return "text-purple-400"
    return "text-yellow-400"
  }

  const getRatingBadge = (rating: number) => {
    if (rating < 1000) return "Beginner"
    if (rating < 1200) return "Novice"
    if (rating < 1500) return "Intermediate"
    if (rating < 1800) return "Advanced"
    if (rating < 2000) return "Expert"
    return "Master"
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-5 w-5 text-purple-400" />
        <div className="text-right">
          <div className={`font-bold ${getRatingColor(rating)}`}>{rating}</div>
          <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-200">
            {getRatingBadge(rating)}
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Flame className="h-5 w-5 text-orange-400" />
        <div className="text-right">
          <div className="font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-purple-200">streak</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <div className="text-right">
          <div className="font-bold text-yellow-400">{todaysSolved}</div>
          <div className="text-xs text-purple-200">today</div>
        </div>
      </div>
    </div>
  )
}
