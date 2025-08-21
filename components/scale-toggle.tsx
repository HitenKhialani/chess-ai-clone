"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut } from 'lucide-react'

export function ScaleToggle() {
  const [isScaled, setIsScaled] = useState(true)

  useEffect(() => {
    // Apply or remove the scale-container class from body
    const body = document.body
    if (isScaled) {
      body.classList.add('scale-container')
    } else {
      body.classList.remove('scale-container')
    }
  }, [isScaled])

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => setIsScaled(!isScaled)}
        variant="outline"
        size="sm"
        className="bg-[var(--card)] border-[var(--border)] text-[var(--primary-text)] hover:bg-[var(--accent)]/20"
        style={{ fontSize: '1rem' }}
      >
        {isScaled ? (
          <>
            <ZoomIn className="h-4 w-4 mr-2" />
            Normal Size
          </>
        ) : (
          <>
            <ZoomOut className="h-4 w-4 mr-2" />
            75% Scale
          </>
        )}
      </Button>
    </div>
  )
} 