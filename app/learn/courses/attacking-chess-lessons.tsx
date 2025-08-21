import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Play } from "lucide-react";
import Link from "next/link";

export default function AttackingChessLessonsList() {
  const lessons = [
    {
      id: 1,
      title: "Classic Checkmates – Direct Attacks",
      description: "Learn classic attacking patterns like the back-rank mate, smothered mate, and basic two-piece checkmates.",
      duration: "40 min",
      level: "Easy",
      concept: "Master classic checkmating patterns and direct attacks.",
      link: "/learn/courses/attacking-chess-lesson-1"
    },
    {
      id: 2,
      title: "Sacrifices to Destroy Defense",
      description: "Master the art of sacrificing material to break open the king and overwhelm defenses.",
      duration: "40 min",
      level: "Intermediate",
      concept: "Learn when and how to sacrifice material for initiative.",
      link: "/learn/courses/attacking-chess-lesson-2"
    },
    {
      id: 3,
      title: "Attack with Pawns – The Pawn Storm",
      description: "Use pawn storms to open files, coordinate attacks, and create crushing threats.",
      duration: "40 min",
      level: "Advanced",
      concept: "Master the art of pawn storms and coordinated attacks.",
      link: "/learn/courses/attacking-chess-lesson-3"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Lessons</h2>
        <p className="text-[var(--secondary-text)]">
          Follow these lessons in order to master attacking chess
        </p>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--destructive)] text-[var(--card-foreground)] rounded-full flex items-center justify-center font-bold">
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
          Complete all lessons to master attacking chess
        </p>
        <Link href="/learn/courses/attacking-chess-lesson-1">
          <Button size="lg" className="px-8">
            Start First Lesson
          </Button>
        </Link>
      </div>
    </div>
  );
} 