"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, X } from 'lucide-react'

interface MoveExplanationPanelProps {
  explanation: string
  moveData: {
    move: string
    moveType: string
    evaluation: string
    moveNumber: number
    playerColor: 'white' | 'black'
  } | null
  onClose: () => void
}

export default function MoveExplanationPanel({ explanation, moveData, onClose }: MoveExplanationPanelProps) {
  if (!moveData) return null

  return (
    <Card className="w-full shadow-lg border-2 border-[var(--border)] bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              <Lightbulb className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-sm font-semibold text-[var(--card-foreground)]">
                  AI Analysis: {moveData.move}
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  moveData.moveType === 'Brilliant' ? 'bg-[var(--secondary)] text-cyan-800' :
                  moveData.moveType === 'Correct' ? 'bg-[var(--secondary)] text-green-800' :
                  moveData.moveType === 'Mistake' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-[var(--secondary)] text-red-800'
                }`}>
                  {moveData.moveType}
                </span>
                <span className="text-xs text-gray-500">
                  Eval: {moveData.evaluation}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  Move {moveData.moveNumber} ({moveData.playerColor})
                </span>
              </div>
              <div className="text-sm text-[var(--card-foreground)] leading-relaxed">
                {explanation}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
            aria-label="Close explanation"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
} 