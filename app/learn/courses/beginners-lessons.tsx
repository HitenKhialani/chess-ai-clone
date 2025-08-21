import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Play } from "lucide-react";
import Link from "next/link";

export default function BeginnersLessonsList() {
  const lessons = [
    {
      id: 1,
      title: "How Pieces Move",
      description: "Learn the movement patterns of all chess pieces including pawns, knights, bishops, rooks, queens, and kings.",
      duration: "30 min",
      level: "Beginner",
      concept: "Learn the movement patterns of all chess pieces.",
      link: "/learn/courses/beginners-lesson-1"
    },
    {
      id: 2,
      title: "Understanding Chess Notation",
      description: "Master algebraic notation to read and write chess moves, understand piece abbreviations, and recognize special moves.",
      duration: "30 min",
      level: "Beginner",
      concept: "Master algebraic notation to read and write chess moves.",
      link: "/learn/courses/beginners-lesson-2"
    },
    {
      id: 3,
      title: "Basic Rules & Objectives",
      description: "Learn the essential rules of chess including check, checkmate, stalemate, and various draw conditions.",
      duration: "30 min",
      level: "Beginner",
      concept: "Master the core rules and understand how to win at chess.",
      link: "/learn/courses/beginners-lesson-3"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Lessons</h2>
        <p className="text-[var(--secondary-text)]">
          Follow these lessons in order to build a strong foundation in chess
        </p>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--primary)] text-[var(--card-foreground)] rounded-full flex items-center justify-center font-bold">
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
          Complete all lessons to master the fundamentals of chess
        </p>
        <Link href="/learn/courses/beginners-lesson-1">
          <Button size="lg" className="px-8">
            Start First Lesson
          </Button>
        </Link>
      </div>
    </div>
  );
} 