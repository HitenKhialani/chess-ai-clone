import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { PuzzleBoard } from './puzzle-board'

interface Position {
  fen: string
  moves: string[]
  explanation: string
}

interface ChapterDetailProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  content?: {
    theory: string[]
    keyIdeas: string[]
  }
  positions: Position[]
}

export function ChapterDetail({
  isOpen,
  onClose,
  title,
  description,
  content = {
    theory: [],
    keyIdeas: []
  },
  positions
}: ChapterDetailProps) {
  const [currentSection, setCurrentSection] = useState<'theory' | 'practice'>('theory')
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{title}</DialogTitle>
          <p className="text-gray-400 mt-2">{description}</p>
        </DialogHeader>

        <div className="flex gap-4 mt-4 mb-6">
          <Button
            variant={currentSection === 'theory' ? 'default' : 'outline'}
            onClick={() => setCurrentSection('theory')}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Theory
          </Button>
          <Button
            variant={currentSection === 'practice' ? 'default' : 'outline'}
            onClick={() => setCurrentSection('practice')}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            Practice
          </Button>
        </div>

        {currentSection === 'theory' ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
              <div className="space-y-2">
                {content.theory.map((point, index) => (
                  <p key={index} className="text-gray-300">• {point}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Ideas</h3>
              <div className="flex flex-wrap gap-2">
                {content.keyIdeas.map((idea, index) => (
                  <Badge key={index} variant="secondary">
                    {idea}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Practice Positions</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPositionIndex(Math.max(0, currentPositionIndex - 1))}
                  disabled={currentPositionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-400">
                  {currentPositionIndex + 1} / {positions.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPositionIndex(Math.min(positions.length - 1, currentPositionIndex + 1))}
                  disabled={currentPositionIndex === positions.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <PuzzleBoard
                fen={positions[currentPositionIndex].fen}
                moves={positions[currentPositionIndex].moves}
                onComplete={() => {}}
                onFail={() => {}}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 