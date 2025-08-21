"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Lightbulb, X } from 'lucide-react'

interface MoveExplanationTooltipProps {
  children: React.ReactNode
  moveData: {
    move: string
    position: string
    moveType: string
    evaluation: string
    moveNumber: number
    playerColor: 'white' | 'black'
    fenBefore?: string
    fenAfter?: string
  }
  className?: string
  onExplanationClick: (explanation: string, moveData: any) => void
}

export default function MoveExplanationTooltip({ children, moveData, className = '', onExplanationClick }: MoveExplanationTooltipProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)

  const fetchExplanation = async () => {
    if (hasRequested) return // Don't fetch again if already requested
    
    setIsLoading(true)
    setHasRequested(true)
    
    try {
      const response = await fetch('/api/explain-move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...moveData,
          fenBefore: moveData.fenBefore,
          fenAfter: moveData.fenAfter
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onExplanationClick(data.explanation, moveData)
      } else {
        onExplanationClick('Unable to generate explanation', moveData)
      }
    } catch (error) {
      onExplanationClick('Failed to load explanation', moveData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    if (!hasRequested) {
      fetchExplanation()
    } else {
      // If already fetched, just show the explanation
      onExplanationClick('', moveData)
    }
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
    >
      <span 
        className="cursor-pointer hover:bg-accent/40 transition-colors duration-200"
        onClick={handleClick}
      >
        {children}
        {isLoading && (
          <Loader2 className="inline ml-1 h-3 w-3 animate-spin text-[var(--primary)]" />
        )}
      </span>
    </div>
  )
} 