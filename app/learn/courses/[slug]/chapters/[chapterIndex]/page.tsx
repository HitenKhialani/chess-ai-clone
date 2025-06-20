"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PuzzleBoard } from "@/components/puzzle-board"
import { coursesData } from "@/app/data/courses"

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState<'theory' | 'practice'>('theory')
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)

  const slug = typeof params.slug === "string" ? params.slug : ""
  const chapterIndex = typeof params.chapterIndex === "string" ? parseInt(params.chapterIndex) : 0
  
  const course = coursesData[slug]
  if (!course || !course.chapters[chapterIndex]) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
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
  const nextChapter = course.chapters[chapterIndex + 1]
  const positions = chapter.positions || []

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/learn/courses/${slug}`} className="flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Link>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-blue-400">
                {chapterIndex + 1}.
              </span>
              <h1 className="text-3xl font-bold">{chapter.title}</h1>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{chapter.duration}</span>
              </div>
              {chapter.isCompleted && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Completed
                </Badge>
              )}
            </div>
            <p className="text-gray-300">{chapter.description}</p>
          </div>

          <div className="flex gap-4">
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
              Practice Board
            </Button>
          </div>

          {currentSection === 'theory' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Key Concepts</h2>
                <div className="space-y-3">
                  {chapter.content?.theory.map((point: string, index: number) => (
                    <p key={index} className="text-gray-300">• {point}</p>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Key Ideas</h2>
                <div className="flex flex-wrap gap-2">
                  {chapter.content?.keyIdeas.map((idea: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {idea}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {positions.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Practice Position {currentPositionIndex + 1}/{positions.length}</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPositionIndex(Math.max(0, currentPositionIndex - 1))}
                        disabled={currentPositionIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPositionIndex(Math.min(positions.length - 1, currentPositionIndex + 1))}
                        disabled={currentPositionIndex === positions.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6">
                    <p className="text-gray-300 mb-6">{positions[currentPositionIndex].explanation}</p>
                    <div className="flex justify-center">
                      <PuzzleBoard
                        fen={positions[currentPositionIndex].fen}
                        moves={positions[currentPositionIndex].moves}
                        onComplete={() => {}}
                        onFail={() => {}}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">No practice positions available for this chapter.</p>
              )}
            </div>
          )}

          <div className="flex justify-between pt-8 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => router.push(`/learn/courses/${slug}`)}
            >
              Back to Course
            </Button>
            {nextChapter && !nextChapter.isLocked && (
              <Button
                onClick={() => router.push(`/learn/courses/${slug}/chapters/${chapterIndex + 1}`)}
              >
                Next Chapter
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 