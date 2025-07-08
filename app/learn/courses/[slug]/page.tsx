"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import CourseDetailLayout from "@/components/CourseDetailLayout"
import { courses } from "@/app/data/courses"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChessBoard } from "@/components/chess-board"
import { Chess } from "chess.js"
import dynamic from "next/dynamic"
import RookEndgameTechniquesOverview from "../rook-endgame-techniques-overview"
import OneE4OpeningsExplainedOverview from "../one-e4-openings-explained-overview"
import OneE4OpeningsExplainedLessonsList from "../one-e4-openings-explained-lessons"
import OneD4RepertoireOverview from "../one-d4-repertoire-overview"
import OneD4RepertoireLessonsList from "../one-d4-repertoire-lessons"
import EnglishOpeningOverview from "../english-opening-overview"
import EnglishOpeningLessonsList from "../english-opening-lessons"
import SicilianDefenseMasteryOverview from "../sicilian-defense-mastery-overview"
import SicilianDefenseMasteryLessonsList from "../sicilian-defense-mastery-lessons"
import FrenchDefenseEssentialsOverview from "../french-defense-essentials-overview"
import FrenchDefenseEssentialsLessonsList from "../french-defense-essentials-lessons"
import IndianDefensesOverview from "../indian-defenses-overview"
import IndianDefensesLessonsList from "../indian-defenses-lessons"
import BishopVsKnightEndgamesOverview from "../bishop-vs-knight-endgames-overview"
import BishopVsKnightEndgamesLessonsList from "../bishop-vs-knight-endgames-lessons"
import QueenEndgamesOverview from "../queen-endgames-overview"
import QueenEndgamesLessonsList from "../queen-endgames-lessons"
import AttackingChessOverview from "../attacking-chess-overview"
import AttackingChessLessonsList from "../attacking-chess-lessons"
import DefensiveMasteryOverview from "../defensive-mastery-overview"
import DefensiveMasteryLessonsList from "../defensive-mastery-lessons"
import StrategicPlanningOverview from "../strategic-planning-overview"
import StrategicPlanningLessonsList from "../strategic-planning-lessons"

const ReactChessboard = dynamic(() => import("react-chessboard").then(m => m.Chessboard), { ssr: false })

export default function CourseDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : ""
  const course = courses.find(c => c.slug === slug)
  const [openLesson, setOpenLesson] = useState<number|null>(null)
  const [lessonComplete, setLessonComplete] = useState(Array(course?.lessons.length).fill(false))
  const [practiceFeedback, setPracticeFeedback] = useState(Array(course?.practice.length).fill(""))
  const [practiceSolved, setPracticeSolved] = useState(Array(course?.practice.length).fill(false))
  const [quizSelected, setQuizSelected] = useState(Array(course?.quiz.length).fill(null))
  const [quizShowResult, setQuizShowResult] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  // For PGN navigation
  const [variationMoveIdx, setVariationMoveIdx] = useState(Array(course?.variations.length).fill(0))
  const [reviewMoveIdx, setReviewMoveIdx] = useState(Array(course?.reviewGames.length).fill(0))

  if (!course) {
    return <div className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] p-4 md:p-8"><div className="max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Course not found</h1></div></div>
  }

  // Helper for PGN to moves
  function getMovesFromPGN(pgn: string) {
    try {
      const chess = new Chess();
      chess.reset();
      chess.loadPgn(pgn);
      return chess.history({ verbose: true });
    } catch {
      return [];
    }
  }

  // LESSONS TAB
  function LessonsTab() {
    return (
      <div className="space-y-4">
        {course.lessons.map((lesson, i) => (
          <div key={i} className="bg-[var(--card)] border border-[var(--shadow)] rounded-lg p-4 mb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">Lesson {i+1}: {lesson.title}</div>
                <div className="text-xs text-[var(--accent)] font-semibold inline-block mr-2">{lesson.level}</div>
                {lesson.concept && <span className="text-xs text-[var(--secondary-text)]">{lesson.concept}</span>}
              </div>
              <button className="btn" onClick={() => setOpenLesson(openLesson === i ? null : i)}>{openLesson === i ? "Close" : "Open"}</button>
            </div>
            {openLesson === i && (
              <div className="mt-4">
                {lesson.fen && lesson.solution && lesson.solution.length > 0 && (
                  <ReactChessboard position={lesson.fen} boardWidth={400} />
                )}
                {lesson.writeup && <div className="mt-2 text-[var(--secondary-text)]">{lesson.writeup}</div>}
                {lesson.task && <div className="mt-2 font-semibold">Task: {lesson.task}</div>}
                <button className="btn mt-2" onClick={() => setLessonComplete(arr => arr.map((v, idx) => idx === i ? true : v))}>{lessonComplete[i] ? "Completed" : "Mark Complete"}</button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // VARIATIONS TAB
  function VariationsTab() {
    return (
      <div className="space-y-4">
        {course.variations.map((variation, i) => {
          const moves = getMovesFromPGN(variation.moves)
          const chess = new Chess()
          for (let j = 0; j < variationMoveIdx[i]; j++) chess.move(moves[j])
          return (
            <div key={i} className="bg-[var(--card)] border border-[var(--shadow)] rounded-lg p-4 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">{variation.name}</div>
                  <span className="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded ml-2">{variation.type}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setVariationMoveIdx(arr => arr.map((v, idx) => idx === i ? Math.max(0, v-1) : v))}>Prev</button>
                  <button onClick={() => setVariationMoveIdx(arr => arr.map((v, idx) => idx === i ? Math.min(moves.length, v+1) : v))}>Next</button>
                </div>
              </div>
              <ReactChessboard position={chess.fen()} boardWidth={400} />
              <div className="mt-2 text-xs">Move: {variationMoveIdx[i]} / {moves.length}</div>
              <div className="mt-2"><pre className="bg-[var(--card)] p-2 rounded text-xs overflow-x-auto">{variation.moves}</pre></div>
            </div>
          )
        })}
      </div>
    )
  }

  // PRACTICE TAB
  function PracticeTab() {
    return (
      <div className="space-y-4">
        {course.practice.map((puzzle, i) => {
          const [game, setGame] = useState(new Chess(puzzle.fen))
          const onDrop = (source: string, target: string) => {
            if (!puzzle.solution?.length) return false
            const move = game.move({ from: source, to: target, promotion: "q" })
            if (!move) return false
            const expected = puzzle.solution?.[game.history().length - 1]
            if (move.san === expected) {
              if (game.history().length === puzzle.solution?.length) {
                setPracticeFeedback(arr => arr.map((v, idx) => idx === i ? "Correct! Puzzle solved." : v))
                setPracticeSolved(arr => arr.map((v, idx) => idx === i ? true : v))
              } else {
                setPracticeFeedback(arr => arr.map((v, idx) => idx === i ? "Correct! Continue..." : v))
              }
              return true
            } else {
              setPracticeFeedback(arr => arr.map((v, idx) => idx === i ? "Incorrect. Try again." : v))
              game.undo()
              return false
            }
          }
          const reset = () => {
            setGame(new Chess(puzzle.fen))
            setPracticeFeedback(arr => arr.map((v, idx) => idx === i ? "" : v))
          }
          return (
            <div key={i} className="bg-[var(--card)] border border-[var(--shadow)] rounded-lg p-4 mb-2">
              <div className="font-bold text-lg">{puzzle.title}</div>
              <ReactChessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={400} />
              <div className="mt-2">{practiceFeedback[i]}</div>
              <button className="btn mt-2" onClick={reset}>Reset</button>
              <div className="mt-2">{practiceSolved[i] ? "Completed" : "In Progress"}</div>
              <div className="mt-2">Goal: {puzzle.goal}</div>
            </div>
          )
        })}
      </div>
    )
  }

  // QUIZ TAB
  function QuizTab() {
    const score = quizSelected.filter((ans, i) => ans === course.quiz[i].answer).length
    return (
      <div className="space-y-4">
        {course.quiz.map((q, i) => (
          <div key={i} className="bg-[var(--card)] border border-[var(--shadow)] rounded-lg p-4 mb-2">
            <div className="font-bold mb-2">Q{i+1}: {q.question}</div>
            <ul className="list-disc ml-6">
              {q.options.map(opt => (
                <li key={opt}>
                  <label className="cursor-pointer">
                    <input type="radio" name={`quiz${i}`} value={opt} checked={quizSelected[i] === opt} onChange={() => setQuizSelected(sel => sel.map((s, idx) => idx === i ? opt : s))} disabled={quizShowResult} />
                    <span className={quizShowResult ? (opt === q.answer ? 'text-green-600 font-bold' : (quizSelected[i] === opt ? 'text-red-600' : '')) : ''}> {opt}</span>
                  </label>
                </li>
              ))}
            </ul>
            {quizShowResult && <div className="mt-1 text-sm text-gray-400">Correct: {q.answer}</div>}
          </div>
        ))}
        {!quizShowResult && <button className="btn border border-[var(--accent)] hover:glow-accent" onClick={() => setQuizShowResult(true)}>Submit</button>}
        {quizShowResult && <div className="mt-4 font-bold">Score: {score} / {course.quiz.length}</div>}
      </div>
    )
  }

  // REVIEW GAMES TAB
  function ReviewTab() {
    return (
      <div className="space-y-4">
        {course.reviewGames.map((game, i) => {
          const moves = getMovesFromPGN(game.pgn)
          const chess = new Chess()
          for (let j = 0; j < reviewMoveIdx[i]; j++) chess.move(moves[j])
          return (
            <div key={i} className="bg-[var(--card)] border border-[var(--shadow)] rounded-lg p-4 mb-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg">{game.title}</div>
                <div className="flex gap-2">
                  <button onClick={() => setReviewMoveIdx(arr => arr.map((v, idx) => idx === i ? Math.max(0, v-1) : v))}>Prev</button>
                  <button onClick={() => setReviewMoveIdx(arr => arr.map((v, idx) => idx === i ? Math.min(moves.length, v+1) : v))}>Next</button>
                </div>
              </div>
              <ReactChessboard position={chess.fen()} boardWidth={400} />
              <div className="mt-2 text-xs">Move: {reviewMoveIdx[i]} / {moves.length}</div>
              <div className="mt-2"><pre className="bg-[var(--card)] p-2 rounded text-xs overflow-x-auto">{game.pgn}</pre></div>
              {game.commentary && <div className="mt-2 text-[var(--secondary-text)]">{game.commentary}</div>}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-4">
          <img src={course.icon || '/public/placeholder-logo.png'} className="w-16 h-16 rounded" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--primary-text)]">{course.title}</h1>
            <div className="text-[var(--secondary-text)]">{course.subtitle}</div>
            <div className="flex gap-2 mt-2">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">{course.difficulty}</span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-1 rounded text-xs font-semibold">{course.estimatedTime}</span>
            </div>
          </div>
        </div>
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {slug === "rook-endgame-techniques" ? (
              <RookEndgameTechniquesOverview />
            ) : slug === "one-e4-openings-explained" ? (
              <OneE4OpeningsExplainedOverview />
            ) : slug === "one-d4-repertoire" ? (
              <OneD4RepertoireOverview />
            ) : slug === "english-opening" ? (
              <EnglishOpeningOverview />
            ) : slug === "sicilian-defense-mastery" ? (
              <SicilianDefenseMasteryOverview />
            ) : slug === "french-defense-essentials" ? (
              <FrenchDefenseEssentialsOverview />
            ) : slug === "indian-defenses" ? (
              <IndianDefensesOverview />
            ) : slug === "bishop-vs-knight-endgames" ? (
              <BishopVsKnightEndgamesOverview />
            ) : slug === "queen-endgames" ? (
              <QueenEndgamesOverview />
            ) : slug === "attacking-chess" ? (
              <AttackingChessOverview />
            ) : slug === "defensive-mastery" ? (
              <DefensiveMasteryOverview />
            ) : slug === "strategic-planning" ? (
              <StrategicPlanningOverview />
            ) : (
              <div>
                <div className="mb-4 text-lg text-[var(--primary-text)]">{course.description}</div>
                <div className="mb-2 font-semibold">You will learn:</div>
                <ul className="list-disc ml-6 text-[var(--secondary-text)]">
                  {course.youWillLearn.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </TabsContent>
          <TabsContent value="lessons">
            {slug === "rook-endgame-techniques" ? (
              <div className="max-w-2xl w-full mx-auto space-y-4">
                {[
                  {
                    number: 1,
                    title: 'Lucena Position – Build the Bridge',
                    difficulty: 'Easy',
                    href: '/learn/courses/rook-endgame-techniques-lesson-1',
                  },
                  {
                    number: 2,
                    title: 'Vancura Defense – Save with Checks',
                    difficulty: 'Intermediate',
                    href: '/learn/courses/rook-endgame-techniques-lesson-2',
                  },
                  {
                    number: 3,
                    title: 'Carlsen-Style Endgame Squeeze',
                    difficulty: 'Advanced',
                    href: '/learn/courses/rook-endgame-techniques-lesson-3',
                  },
                ].map((lesson) => (
                  <a
                    key={lesson.number}
                    href={lesson.href}
                    className="flex items-center justify-between bg-[var(--card)] border border-[var(--shadow)] rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div>
                      <div className="text-lg font-semibold">Lesson {lesson.number}</div>
                      <div className="font-bold text-xl mb-1">{lesson.title}</div>
                      <span className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        {lesson.difficulty}
                      </span>
                    </div>
                    <span className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors text-2xl font-bold">
                      &gt;
                    </span>
                  </a>
                ))}
              </div>
            ) : slug === "one-e4-openings-explained" ? (
              <OneE4OpeningsExplainedLessonsList />
            ) : slug === "one-d4-repertoire" ? (
              <OneD4RepertoireLessonsList />
            ) : slug === "english-opening" ? (
              <EnglishOpeningLessonsList />
            ) : slug === "sicilian-defense-mastery" ? (
              <SicilianDefenseMasteryLessonsList />
            ) : slug === "french-defense-essentials" ? (
              <FrenchDefenseEssentialsLessonsList />
            ) : slug === "indian-defenses" ? (
              <IndianDefensesLessonsList />
            ) : slug === "bishop-vs-knight-endgames" ? (
              <BishopVsKnightEndgamesLessonsList />
            ) : slug === "queen-endgames" ? (
              <QueenEndgamesLessonsList />
            ) : slug === "attacking-chess" ? (
              <AttackingChessLessonsList />
            ) : slug === "defensive-mastery" ? (
              <DefensiveMasteryLessonsList />
            ) : slug === "strategic-planning" ? (
              <StrategicPlanningLessonsList />
            ) : (
              <LessonsTab />
            )}
          </TabsContent>
          <TabsContent value="quiz"><QuizTab /></TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

// Modular MCQ Quiz component
function QuizTab({ quiz }) {
  const [selected, setSelected] = useState(Array(quiz.length).fill(null))
  const [showResult, setShowResult] = useState(false)
  const score = selected.filter((ans, i) => ans === quiz[i].answer).length
  return (
    <div>
      {quiz.map((q, i) => (
        <div key={i} className="mb-6">
          <div className="font-bold mb-2">Q{i+1}: {q.question}</div>
          <ul className="list-disc ml-6">
            {q.options.map(opt => (
              <li key={opt}>
                <label className="cursor-pointer">
                  <input type="radio" name={`q${i}`} value={opt} disabled={showResult}
                    checked={selected[i] === opt}
                    onChange={() => setSelected(sel => sel.map((s, idx) => idx === i ? opt : s))} />
                  <span className={showResult ? (opt === q.answer ? 'text-green-600 font-bold' : (selected[i] === opt ? 'text-red-600' : '')) : ''}> {opt}</span>
                </label>
              </li>
            ))}
          </ul>
          {showResult && <div className="mt-1 text-sm text-gray-400">Correct: {q.answer}</div>}
        </div>
      ))}
      {!showResult && <button className="btn border border-[var(--accent)] hover:glow-accent" onClick={() => setShowResult(true)}>Submit</button>}
      {showResult && <div className="mt-4 font-bold">Score: {score} / {quiz.length}</div>}
    </div>
  )
}

// Modular PGN Player for Variations/Review
function PGNPlayer({ pgn }) {
  const [game] = useState(new Chess())
  const [moves, setMoves] = useState([])
  const [moveIndex, setMoveIndex] = useState(0)
  // Parse PGN and set moves
  useState(() => {
    game.reset()
    game.loadPgn(pgn)
    setMoves(game.history({ verbose: true }))
    setMoveIndex(0)
  }, [pgn])
  const goTo = idx => {
    game.reset()
    for (let i = 0; i < idx; i++) game.move(moves[i])
    setMoveIndex(idx)
  }
  return (
    <div>
      <ReactChessboard position={game.fen()} boardWidth={320} />
      <div className="flex gap-2 mt-2">
        <button onClick={() => goTo(Math.max(0, moveIndex-1))}>Prev</button>
        <button onClick={() => goTo(Math.min(moves.length, moveIndex+1))}>Next</button>
      </div>
      <div className="mt-2 text-xs">Move: {moveIndex} / {moves.length}</div>
    </div>
  )
}

// Lessons/Practice Tab (puzzle logic)
function PuzzleTab({ puzzles }) {
  const [idx, setIdx] = useState(0)
  const [solved, setSolved] = useState(Array(puzzles.length).fill(false))
  const [feedback, setFeedback] = useState("")
  const [moveIdx, setMoveIdx] = useState(0)
  const [game, setGame] = useState(() => new Chess(puzzles[idx].fen))
  const solution = puzzles[idx].solution
  const onDrop = (source, target) => {
    const move = game.move({ from: source, to: target, promotion: "q" })
    if (!move) return false
    if (move.san === solution[moveIdx]) {
      setMoveIdx(moveIdx+1)
      if (moveIdx+1 === solution.length) {
        setFeedback("Nice job!")
        setSolved(s => s.map((v, i) => i === idx ? true : v))
      }
      return true
    } else {
      setFeedback("Try again!")
      return false
    }
  }
  const reset = () => {
    setGame(new Chess(puzzles[idx].fen))
    setMoveIdx(0)
    setFeedback("")
  }
  return (
    <div>
      <div className="mb-2 font-bold">{puzzles[idx].title}</div>
      <ReactChessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={320} />
      <div className="mt-2">{feedback}</div>
      <button onClick={reset} className="btn mt-2">Reset</button>
      <div className="mt-2">{solved[idx] ? "Completed" : "In Progress"}</div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setIdx(Math.max(0, idx-1))} disabled={idx===0}>Prev</button>
        <button onClick={() => setIdx(Math.min(puzzles.length-1, idx+1))} disabled={idx===puzzles.length-1}>Next</button>
      </div>
    </div>
  )
} 