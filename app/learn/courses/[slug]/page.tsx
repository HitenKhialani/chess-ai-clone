"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import CourseDetailLayout from "@/components/CourseDetailLayout"
import { courses } from "@/app/data/courses"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ChessBoard from "@/components/chess-board"
import { Chess } from "chess.js"
import dynamic from "next/dynamic"
import RookEndgameTechniquesOverview from "../rook-endgame-techniques-overview"
import RookEndgameTechniquesLessonsList from "../rook-endgame-techniques-lessons"
import OneE4OpeningsExplainedOverview from "../one-e4-openings-explained-overview"
import OneE4OpeningsExplainedLessonsList from "../one-e4-openings-explained-lessons"
import OneD4OpeningsOverview from "../one-d4-openings-overview"
import OneD4OpeningsLessonsList from "../one-d4-openings-lessons"
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
import BeginnersOverview from "../beginners-overview"
import BeginnersLessonsList from "../beginners-lessons"

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
    const progress = quizSelected.filter(ans => ans !== null).length
    const progressPercentage = (progress / course.quiz.length) * 100
    
    return (
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--primary-text)] mb-2">Course Quiz</h2>
          <p className="text-[var(--secondary-text)] mb-4">Test your knowledge with these interactive questions</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-[var(--secondary)] rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-[var(--secondary-text)]">
            {progress} of {course.quiz.length} questions answered
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {course.quiz.map((q, i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              {/* Question Header */}
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] text-[var(--card-foreground)] rounded-full flex items-center justify-center font-bold text-sm mr-3">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-[var(--primary-text)]">{q.question}</h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((opt, optIndex) => {
                  const isSelected = quizSelected[i] === opt
                  const isCorrect = quizShowResult && opt === q.answer
                  const isWrong = quizShowResult && isSelected && opt !== q.answer
                  
                  return (
                    <label 
                      key={optIndex}
                      className={`block cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-[var(--accent)] ring-opacity-50' 
                          : 'hover:bg-[var(--shadow)]'
                      } ${
                        isCorrect 
                          ? 'bg-green-900/30 border-green-500' 
                          : isWrong 
                          ? 'bg-red-900/30 border-red-500' 
                          : ''
                      } border border-[var(--border)] rounded-lg p-4 hover:border-[var(--accent)]`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center transition-all duration-200 ${
                          isSelected 
                            ? 'border-[var(--accent)] bg-[var(--accent)]' 
                            : 'border-[var(--secondary-text)]'
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 bg-[var(--card)] rounded-full"></div>
                          )}
                        </div>
                        <span className={`text-[var(--primary-text)] ${
                          isCorrect 
                            ? 'text-green-400 font-semibold' 
                            : isWrong 
                            ? 'text-red-400' 
                            : ''
                        }`}>
                          {opt}
                        </span>
                        {quizShowResult && isCorrect && (
                          <div className="ml-auto text-green-400">
                            ✓ Correct
                          </div>
                        )}
                        {quizShowResult && isWrong && (
                          <div className="ml-auto text-red-400">
                            ✗ Wrong
                          </div>
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name={`quiz${i}`} 
                        value={opt} 
                        checked={isSelected} 
                        onChange={() => setQuizSelected(sel => sel.map((s, idx) => idx === i ? opt : s))} 
                        disabled={quizShowResult}
                        className="sr-only"
                      />
                    </label>
                  )
                })}
              </div>

              {/* Explanation */}
              {quizShowResult && (
                <div className="mt-4 p-4 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg">
                  <div className="flex items-center text-[var(--accent)] mb-2">
                    <div className="w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center mr-2">
                      <span className="text-[var(--card-foreground)] text-xs">i</span>
                    </div>
                    <span className="font-semibold">Explanation</span>
                  </div>
                  <p className="text-[var(--secondary-text)] text-sm">
                    The correct answer is: <span className="text-green-400 font-semibold">{q.answer}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!quizShowResult && (
          <div className="text-center mt-8">
            <button 
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                progress === course.quiz.length
                  ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] hover:from-[var(--accent-soft)] hover:to-[var(--accent)] text-[var(--card-foreground)] shadow-lg hover:shadow-xl'
                  : 'bg-[var(--shadow)] text-[var(--secondary-text)] cursor-not-allowed'
              }`}
              onClick={() => setQuizShowResult(true)}
              disabled={progress !== course.quiz.length}
            >
              {progress === course.quiz.length ? 'Submit Quiz' : `Answer ${course.quiz.length - progress} more questions`}
            </button>
          </div>
        )}

        {/* Results */}
        {quizShowResult && (
          <div className="text-center mt-8 p-8 bg-[var(--card)] rounded-xl border border-[var(--border)]">
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {score === course.quiz.length ? '🎉' : score >= course.quiz.length * 0.8 ? '🎯' : '📚'}
              </div>
              <h3 className="text-2xl font-bold text-[var(--primary-text)] mb-2">
                {score === course.quiz.length 
                  ? 'Perfect Score!' 
                  : score >= course.quiz.length * 0.8 
                  ? 'Great Job!' 
                  : 'Keep Learning!'}
              </h3>
              <p className="text-[var(--secondary-text)] mb-4">
                {score === course.quiz.length 
                  ? 'You mastered all the concepts!' 
                  : score >= course.quiz.length * 0.8 
                  ? 'You have a solid understanding!' 
                  : 'Review the lessons and try again!'}
              </p>
            </div>
            
            {/* Score Display */}
            <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)] rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-[var(--card-foreground)] mb-2">
                {score} / {course.quiz.length}
              </div>
              <div className="text-[var(--card-foreground)]/90">
                {Math.round((score / course.quiz.length) * 100)}% Score
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setQuizSelected(Array(course.quiz.length).fill(null))
                  setQuizShowResult(false)
                }}
                className="px-6 py-3 bg-[var(--shadow)] hover:bg-[var(--border)] text-[var(--primary-text)] rounded-lg transition-all duration-200"
              >
                Retake Quiz
              </button>
              <button 
                onClick={() => window.location.href = '/learn/courses/beginners-lesson-1'}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-[var(--accent)] hover:from-green-600 hover:to-[var(--accent-soft)] text-[var(--card-foreground)] rounded-lg transition-all duration-200"
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}
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
          {/* Course Icon with Fallback */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-soft)] flex items-center justify-center shadow-lg">
            {course.icon ? (
              <img src={course.icon} alt={`${course.title} icon`} className="w-12 h-12 rounded-lg" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-[var(--card)]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--card-foreground)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--primary-text)] mb-2">{course.title}</h1>
            <div className="text-[var(--secondary-text)] mb-3">{course.subtitle}</div>
            <div className="flex gap-3">
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-[var(--card-foreground)] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {course.difficulty}
              </span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded-full text-xs font-semibold border border-[var(--accent)]/30">
                {course.estimatedTime}
              </span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-[var(--card)] border border-[var(--border)]">
            <TabsTrigger value="overview" className="text-[var(--primary-text)] data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--card-foreground)]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-[var(--primary-text)] data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--card-foreground)]">
              Lessons
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-[var(--primary-text)] data-[state=active]:bg-[var(--accent)] data-[state=active]:text-[var(--card-foreground)]">
              Quiz
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {slug === "rook-endgame-techniques" ? (
              <RookEndgameTechniquesOverview />
            ) : slug === "one-e4-openings-explained" ? (
              <OneE4OpeningsExplainedOverview />
            ) : slug === "one-d4-openings" ? (
              <OneD4OpeningsOverview />
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
            ) : slug === "beginners" ? (
              <BeginnersOverview />
            ) : (
              <div>
                <div className="mb-4 text-lg text-[var(--primary-text)]">{course.description}</div>
                <div className="mb-2 font-semibold text-[var(--primary-text)]">You will learn:</div>
                <ul className="list-disc ml-6 text-[var(--secondary-text)]">
                  {course.youWillLearn.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </TabsContent>
          <TabsContent value="lessons">
            {slug === "rook-endgame-techniques" ? (
              <RookEndgameTechniquesLessonsList />
            ) : slug === "one-e4-openings-explained" ? (
              <OneE4OpeningsExplainedLessonsList />
            ) : slug === "one-d4-openings" ? (
              <OneD4OpeningsLessonsList />
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
            ) : slug === "beginners" ? (
              <BeginnersLessonsList />
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