import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import Link from "next/link";

export default function RookEndgameTechniquesLessonsList() {
  const lessons = [
    {
      id: 1,
      title: "Lucena Position – Build the Bridge",
      description: "Master the Lucena technique: build a bridge to shield checks and promote.",
      duration: "40 min",
      level: "Easy",
      concept: "Build-the-bridge method to convert R+P vs R when the king leads the pawn.",
      link: "/learn/courses/rook-endgame-techniques-lesson-1"
    },
    {
      id: 2,
      title: "Vancura Defense – Save with Checks",
      description: "Defend R+P vs R with the Vancura setup and precise checking technique.",
      duration: "40 min",
      level: "Intermediate",
      concept: "Side-checking from the 3rd/6th rank to hold drawn positions vs passed rook pawn.",
      link: "/learn/courses/rook-endgame-techniques-lesson-2"
    },
    {
      id: 3,
      title: "Carlsen-Style Endgame Squeeze",
      description: "Convert tiny advantages with active king, rook activity, and patient squeezing.",
      duration: "40 min",
      level: "Advanced",
      concept: "Improve slowly: create zugzwang nets, push weaknesses, and activate the king.",
      link: "/learn/courses/rook-endgame-techniques-lesson-3"
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Lessons</h2>
        <p className="text-[var(--secondary-text)]">
          Follow these lessons in order to master Rook Endgame Techniques
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
          Complete all lessons to master Rook Endgame Techniques
        </p>
        <Link href="/learn/courses/rook-endgame-techniques-lesson-1">
          <Button size="lg" className="px-8">
            Start First Lesson
          </Button>
        </Link>
      </div>
    </div>
  );
}
