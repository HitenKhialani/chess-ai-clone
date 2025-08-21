"use client"

import { PuzzleRush } from '@/components/puzzle-rush'
import { useRouter } from 'next/navigation'

export default function PuzzlesPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/puzzles');
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Puzzles</h1>
      <div className="w-full max-w-lg mx-auto">
        <PuzzleRush onBack={handleBack} />
      </div>
    </div>
  )
} 