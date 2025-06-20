"use client"

import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { ChapterList } from "@/components/chapter-list"
import { coursesData } from "@/app/data/courses"

export default function CourseDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : ""
  const course = coursesData[slug]

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/learn" className="flex items-center text-blue-400 hover:text-blue-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Center
          </Link>
          <h1 className="text-2xl font-bold">Course not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/learn" className="flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning Center
        </Link>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {course.level}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessons} lessons</span>
              </div>
            </div>
            <p className="text-gray-300">{course.description}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Course Progress</h2>
              <span className="text-sm text-gray-400">{course.progress}% Complete</span>
            </div>
            <Progress value={course.progress} className="mb-8" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">Course Content</h2>
            <ChapterList chapters={course.chapters} courseSlug={slug} />
          </div>
        </div>
      </div>
    </div>
  )
} 