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
          className={`bg-[var(--card)] border-gray-700 hover:bg-[var(--secondary)]/50 transition-colors ${
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
                  <h3 className="font-bold text-lg text-[var(--card-foreground)]">{chapter.title}</h3>
                  {chapter.isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {chapter.isLocked && <Lock className="h-5 w-5 text-gray-500" />}
                </div>
                <p className="text-[var(--muted-foreground)] text-sm mb-4">{chapter.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
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
              <ChevronRight className="h-5 w-5 text-[var(--muted-foreground)]" />
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
} 