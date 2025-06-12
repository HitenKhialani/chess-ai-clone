import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Lock, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Chapter {
  title: string
  description: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
}

interface ChapterListProps {
  chapters: Chapter[]
  courseSlug: string
}

export function ChapterList({ chapters, courseSlug }: ChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => (
        <Card 
          key={index}
          className={`bg-gray-800 border-gray-700 hover:bg-gray-700/50 transition-colors ${
            chapter.isLocked ? 'opacity-75' : ''
          }`}
        >
          <Link 
            href={chapter.isLocked ? '#' : `/learn/courses/${courseSlug}/chapters/${index}`}
            className="block p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-semibold text-blue-400">
                    {index + 1}.
                  </span>
                  <h3 className="font-semibold text-lg text-white">{chapter.title}</h3>
                  {chapter.isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {chapter.isLocked && <Lock className="h-5 w-5 text-gray-500" />}
                </div>
                <p className="text-gray-300 text-sm mb-4">{chapter.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{chapter.duration}</span>
                  </div>
                  {chapter.isCompleted && (
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
} 