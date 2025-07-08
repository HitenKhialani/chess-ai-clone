"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { coursesData } from "@/app/learn/courses/data"
import { ProgressBar } from "@/components/ui/ProgressBar"
import dynamic from "next/dynamic"
import { Chess } from "chess.js"

const Chessboard = dynamic(() => import("react-chessboard").then((m) => m.Chessboard), { ssr: false })

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)
  const [moveIndex, setMoveIndex] = useState(0)
  const [userFen, setUserFen] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [success, setSuccess] = useState(false)
  const [boardKey, setBoardKey] = useState(0) // for resetting board

  const slug = typeof params.slug === "string" ? params.slug : ""
  const chapterIndex = typeof params.chapterIndex === "string" ? parseInt(params.chapterIndex) : 0
  
  const course = coursesData[slug]
  if (!course || !course.chapters[chapterIndex]) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href={`/learn/courses/${slug}`} className="flex items-center text-blue-400 hover:text-blue-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Link>
          <h1 className="text-2xl font-bold">Chapter not found</h1>
        </div>
      </div>
    )
  }

  const chapter = course.chapters[chapterIndex]
  const positions = chapter.positions || []
  const position = positions[currentPositionIndex]
  const expectedMoves = position?.moves || []
  const initialFen = position?.fen || ""

  // Set up chess.js instance for move validation
  const [game, setGame] = useState(() => new Chess(initialFen))

  // Reset board and state when position changes
  function resetBoard() {
    setGame(new Chess(initialFen))
    setUserFen(initialFen)
    setMoveIndex(0)
    setFeedback("")
    setSuccess(false)
    setBoardKey(prev => prev + 1)
  }

  // Handle user move
  function onPieceDrop(sourceSquare, targetSquare) {
    if (success) return false
    const moveSan = expectedMoves[moveIndex]
    const tempGame = new Chess(game.fen())
    const move = tempGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" })
    if (!move) {
      setFeedback("Invalid move. Try again.")
      return false
    }
    // Compare SAN
    if (move.san === moveSan) {
      setGame(tempGame)
      setUserFen(tempGame.fen())
      setMoveIndex(moveIndex + 1)
      setFeedback("Correct!")
      if (moveIndex + 1 === expectedMoves.length) {
        setSuccess(true)
        setFeedback("Lesson complete! Well done.")
      }
      return true
    } else {
      setFeedback(`Incorrect move. Expected: ${moveSan}`)
      return false
    }
  }

  // Reset board when position or chapter changes
  React.useEffect(() => {
    resetBoard()
    // eslint-disable-next-line
  }, [currentPositionIndex, chapterIndex])

  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">{chapter.title}</h1>
          <div className="flex gap-2 items-center mb-2">
            <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded-full text-xs font-semibold">{chapter.duration}</span>
            <ProgressBar progress={chapter.isCompleted ? 100 : 0} />
            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${chapter.isCompleted ? 'bg-green-600 text-white' : 'bg-[var(--accent)]/20 text-[var(--accent)]'}`}>{chapter.isCompleted ? 'Completed' : 'In Progress'}</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Chessboard */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="bg-[var(--card)] border border-[var(--accent)] rounded-xl p-4 mb-4">
              <Chessboard
                key={boardKey}
                position={userFen || initialFen}
                onPieceDrop={onPieceDrop}
                boardWidth={320}
                arePiecesDraggable={!success}
                customSquareStyles={{}}
              />
            </div>
            <div className={`mt-2 text-sm font-semibold ${success ? 'text-green-400' : feedback.startsWith('Correct') ? 'text-[var(--accent)]' : feedback ? 'text-red-400' : ''}`}>{feedback}</div>
            <button className="btn border border-[var(--accent)] hover:glow-accent mt-2" onClick={resetBoard}>Reset Board</button>
          </div>
          {/* Lesson Text */}
          <div className="flex-1 bg-[var(--card)] border border-[var(--shadow)] rounded-xl p-4">
            <div className="text-[var(--primary-text)] mb-2 font-semibold">Theory</div>
            <ul className="list-disc ml-6 text-[var(--secondary-text)] mb-4">
              {chapter.content?.theory?.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
            <div className="text-[var(--primary-text)] mb-2 font-semibold">Key Ideas</div>
            <ul className="list-disc ml-6 text-[var(--secondary-text)]">
              {chapter.content?.keyIdeas?.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}