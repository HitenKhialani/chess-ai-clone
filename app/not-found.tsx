import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center relative overflow-hidden">
      <div className="text-center relative z-10">
        {/* Crown Icon */}
        <div className="flex justify-center mb-8">
          <Crown className="h-24 w-24 text-[var(--accent)] animate-bounce" />
        </div>
        
        {/* Error Message */}
        <p className="text-base font-semibold text-[var(--accent)]">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--primary-text)] sm:text-5xl">
          Checkmate! Page Not Found
        </h1>
        <p className="mt-6 text-base leading-7 text-[var(--secondary-text)]">
          Sorry, we couldn't find the page you're looking for. It seems this move led to an invalid position.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/">
            <Button className="btn border border-[var(--accent)] text-[var(--primary-text)] hover:glow-accent bg-[var(--card)]">Back to Home</Button>
          </Link>
          <Link 
            href="/play" 
            className="text-sm font-semibold text-[var(--accent)] hover:text-[var(--primary-text)] transition-colors"
          >
            Play Chess <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        {/* Chess Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <dt className="text-base leading-7 text-[var(--secondary-text)]">Stockfish Rating</dt>
            <dd className="text-2xl font-bold leading-9 text-[var(--accent)]">3200+</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-base leading-7 text-[var(--secondary-text)]">GM Styles</dt>
            <dd className="text-2xl font-bold leading-9 text-[var(--accent)]">20+</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-base leading-7 text-[var(--secondary-text)]">Master Games</dt>
            <dd className="text-2xl font-bold leading-9 text-[var(--accent)]">10K+</dd>
          </div>
        </div>
      </div>
    </main>
  )
} 