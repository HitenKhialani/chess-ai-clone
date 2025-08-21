import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import Link from "next/link";

export default function SicilianDefenseMasteryLessonsList() {
  const lessons = [
    {
      id: 1,
      title: "Najdorf Variation – Dynamic Counterplay",
      description: "Master the Najdorf Variation with its dynamic counterplay and complex strategic themes.",
      duration: "40 min",
      level: "Easy",
      concept: "Learn the dynamic Najdorf Variation and counterplay strategies.",
      link: "/learn/courses/sicilian-defense-mastery-lesson-1"
    },
    {
      id: 2,
      title: "Dragon Variation – Sharp Tactical Play",
      description: "Explore the sharp Dragon Variation with its tactical opportunities and attacking themes.",
      duration: "40 min",
      level: "Intermediate",
      concept: "Master the sharp Dragon Variation and tactical play.",
      link: "/learn/courses/sicilian-defense-mastery-lesson-2"
    },
    {
      id: 3,
      title: "Accelerated Dragon – Fast Development",
      description: "Learn the Accelerated Dragon with its fast development and flexible pawn structure.",
      duration: "40 min",
      level: "Advanced",
      concept: "Understand the Accelerated Dragon and fast development strategies.",
      link: "/learn/courses/sicilian-defense-mastery-lesson-3"
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Lessons</h2>
        <p className="text-[var(--secondary-text)]">
          Follow these lessons in order to master the Sicilian Defense
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
          Complete all lessons to master the Sicilian Defense
        </p>
        <Link href="/learn/courses/sicilian-defense-mastery-lesson-1">
          <Button size="lg" className="px-8">
            Start First Lesson
          </Button>
        </Link>
      </div>
    </div>
  );
} 