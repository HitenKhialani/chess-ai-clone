import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="grid min-h-[80vh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Crown Icon */}
        <div className="flex justify-center mb-8">
          <Crown className="h-24 w-24 text-[#00BFCF] animate-bounce" />
        </div>
        
        {/* Error Message */}
        <p className="text-base font-semibold text-[#00BFCF]">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#FFFFFF] sm:text-5xl">
          Checkmate! Page Not Found
        </h1>
        <p className="mt-6 text-base leading-7 text-[#CFFAFE]">
          Sorry, we couldn't find the page you're looking for. It seems this move led to an invalid position.
        </p>
        
        {/* Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/">
            <Button className="bg-[#3F51B5] hover:bg-[#3F51B5]/80 text-white">
              Back to Home
            </Button>
          </Link>
          <Link 
            href="/play" 
            className="text-sm font-semibold text-[#00BFCF] hover:text-[#00BFCF]/80"
          >
            Play Chess <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        {/* Chess Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <dt className="text-base leading-7 text-[#CFFAFE]">Stockfish Rating</dt>
            <dd className="text-2xl font-bold leading-9 text-[#00BFCF]">3200+</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-base leading-7 text-[#CFFAFE]">GM Styles</dt>
            <dd className="text-2xl font-bold leading-9 text-[#00BFCF]">20+</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-base leading-7 text-[#CFFAFE]">Master Games</dt>
            <dd className="text-2xl font-bold leading-9 text-[#00BFCF]">10K+</dd>
          </div>
        </div>
      </div>
    </main>
  )
} 