import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Lock, CheckCircle2 } from "lucide-react"
import { PuzzleBoard } from './puzzle-board'
import { ChapterDetail } from './chapter-detail'

interface Position {
  fen: string
  moves: string[]
  explanation: string
}

interface ChapterContent {
  theory: string[]
  keyIdeas: string[]
}

interface ChapterProps {
  title: string
  description: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  content?: ChapterContent
  positions?: Position[]
  onComplete?: () => void
}

export function CourseChapter({
  title,
  description,
  duration,
  isCompleted,
  isLocked,
  content = {
    theory: [],
    keyIdeas: []
  },
  positions = [],
  onComplete
}: ChapterProps) {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)
  const [completedPositions, setCompletedPositions] = useState<boolean[]>(positions.map(() => false))
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handlePositionComplete = (index: number) => {
    const newCompleted = [...completedPositions]
    newCompleted[index] = true
    setCompletedPositions(newCompleted)

    if (newCompleted.every(Boolean) && onComplete) {
      onComplete()
    }
  }

  const handlePositionFail = () => {
    // Optional: Add feedback or tracking for failed attempts
  }

  return (
    <>
      <Card className={`bg-gray-800 border-gray-700 ${isLocked ? 'opacity-75' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-white">{title}</h3>
                {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {isLocked && <Lock className="h-5 w-5 text-gray-500" />}
              </div>
              <p className="text-gray-300 text-sm mb-4">{description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            </div>
            {!isLocked && (
              <Button
                variant={isCompleted ? "outline" : "default"}
                onClick={() => setIsDetailOpen(true)}
              >
                {isCompleted ? "Review" : "Continue Learning"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ChapterDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={title}
        description={description}
        content={content}
        positions={positions}
      />

      {!isLocked && positions.length > 0 && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white">Practice Position {currentPositionIndex + 1}/{positions.length}</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPositionIndex(Math.max(0, currentPositionIndex - 1))}
                disabled={currentPositionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPositionIndex(Math.min(positions.length - 1, currentPositionIndex + 1))}
                disabled={currentPositionIndex === positions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-gray-300 mb-4">{positions[currentPositionIndex].explanation}</p>
            <PuzzleBoard
              fen={positions[currentPositionIndex].fen}
              moves={positions[currentPositionIndex].moves}
              onComplete={() => handlePositionComplete(currentPositionIndex)}
              onFail={handlePositionFail}
            />
          </div>
        </div>
      )}
    </>
  )
} 