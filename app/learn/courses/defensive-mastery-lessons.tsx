import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import Link from "next/link";

export default function DefensiveMasteryLessonsList() {
  const lessons = [
    {
      id: 1,
      title: "Defensive Fundamentals",
      description: "Learn the fundamental principles of solid defense and position maintenance.",
      duration: "40 min",
      level: "Easy",
      concept: "Master the fundamentals of solid defense and position maintenance.",
      link: "/learn/courses/defensive-mastery-lesson-1"
    },
    {
      id: 2,
      title: "Counterattacking Defense",
      description: "Master the art of counterattacking defense to turn defense into offense.",
      duration: "40 min",
      level: "Intermediate",
      concept: "Learn counterattacking defense and offensive opportunities.",
      link: "/learn/courses/defensive-mastery-lesson-2"
    },
    {
      id: 3,
      title: "Advanced Defensive Techniques",
      description: "Explore advanced defensive techniques for complex and challenging positions.",
      duration: "40 min",
      level: "Advanced",
      concept: "Master advanced defensive techniques and complex positions.",
      link: "/learn/courses/defensive-mastery-lesson-3"
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Lessons</h2>
        <p className="text-[var(--secondary-text)]">
          Follow these lessons in order to master Defensive Mastery
        </p>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-8 h-8 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {lesson.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words">{lesson.title}</CardTitle>
                    <CardDescription className="mt-1 break-words">
                      {lesson.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {lesson.duration}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {lesson.level}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-[var(--secondary-text)] mb-3">
                    <strong>Concept:</strong> {lesson.concept}
                  </p>
                </div>
                <Link href={lesson.link}>
                  <Button size="sm" className="flex items-center w-full sm:w-auto">
                    <Play className="w-4 h-4 mr-2" />
                    Start Lesson
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-[var(--secondary-text)] mb-4">
          Complete all lessons to master Defensive Mastery
        </p>
        <Link href="/learn/courses/defensive-mastery-lesson-1">
          <Button size="lg" className="px-8">
            Start First Lesson
          </Button>
        </Link>
      </div>
    </div>
  );
} 