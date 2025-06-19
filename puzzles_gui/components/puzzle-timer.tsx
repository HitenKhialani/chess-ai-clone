"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PuzzleTimerProps {
  difficulty: number
  onTimeUp: () => void
}

export function PuzzleTimer({ difficulty, onTimeUp }: PuzzleTimerProps) {
  const getTimeLimit = (difficulty: number) => {
    if (difficulty < 1000) return 180 // 3 minutes for easy
    if (difficulty < 1500) return 120 // 2 minutes for medium
    return 90 // 1.5 minutes for hard
  }

  const timeLimit = getTimeLimit(difficulty)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    setTimeLeft(timeLimit)
    setIsActive(true)
  }, [timeLimit])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false)
            onTimeUp()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (timeLeft / timeLimit) * 100
  const isUrgent = timeLeft <= 30

  return (
    <div className="flex items-center space-x-3">
      <Clock className={`h-5 w-5 ${isUrgent ? "text-red-400" : "text-purple-400"}`} />
      <div className="flex items-center space-x-2">
        <span className={`font-mono font-bold ${isUrgent ? "text-red-400" : "text-white"}`}>
          {formatTime(timeLeft)}
        </span>
        <div className="w-20">
          <Progress value={progressPercentage} className={`h-2 ${isUrgent ? "bg-red-900" : "bg-purple-900"}`} />
        </div>
      </div>
    </div>
  )
}
