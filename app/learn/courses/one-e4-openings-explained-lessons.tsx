import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Play } from "lucide-react";
import Link from "next/link";

export default function OneE4OpeningsExplainedLessonsList() {
  const lessons = [
    {
      id: 1,
      title: "Italian Game – Attack the Center",
      description: "Learn the fundamentals of rapid piece development and central control. This classical opening teaches beginners the importance of space, coordination, and king safety while setting up direct tactical possibilities.",
      duration: "40 min",
      level: "Easy",
      concept: "Master the Italian Game and its fundamental principles.",
      link: "/learn/courses/one-e4-openings-explained-lesson-1"
    },
    {
      id: 2,
      title: "Scotch Game – Open the Center Quickly",
      description: "Discover how to challenge Black's center early and create open lines for your pieces. This direct and aggressive opening creates open lines for bishops and queens, challenging Black's central control.",
      duration: "40 min",
      level: "Intermediate",
      concept: "Learn the Scotch Game and its dynamic opening concepts.",
      link: "/learn/courses/one-e4-openings-explained-lesson-2"
    },
    {
      id: 3,
      title: "King's Gambit – Sacrifice for Attack",
      description: "Explore the sharp King's Gambit where White sacrifices a pawn on move two to launch a powerful kingside attack. This opening emphasizes fast development, open lines, and tactical sharpness.",
      duration: "40 min",
      level: "Advanced",
      concept: "Master the King's Gambit and its tactical opportunities.",
      link: "/learn/courses/one-e4-openings-explained-lesson-3"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Lessons</h2>
        <p className="text-[var(--secondary-text)]">
          Follow these lessons in order to master One e4 Openings
        </p>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center font-bold">
                    {lesson.id}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {lesson.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
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
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[var(--secondary-text)] mb-3">
                    <strong>Concept:</strong> {lesson.concept}
                  </p>
                </div>
                <Link href={lesson.link}>
                  <Button size="sm" className="flex items-center">
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
          Complete all lessons to master One e4 Openings
        </p>
        <Link href="/learn/courses/one-e4-openings-explained-lesson-1">
          <Button size="lg" className="px-8">
            Start First Lesson
          </Button>
        </Link>
      </div>
    </div>
  );
} 