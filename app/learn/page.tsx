"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Crown, ChevronRight, Play, Clock, Star, Target, Brain, Sword, Shield, Zap } from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic';
import { useState } from 'react';

const openings = [
  {
    name: "Ruy Lopez",
    description: "A classic opening that develops pieces naturally and fights for the center",
    moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bb5"],
    difficulty: "Intermediate",
    popularity: 95,
    winRate: 52,
  },
  {
    name: "Sicilian Defense",
    description: "A sharp, aggressive defense that leads to complex tactical positions",
    moves: ["1.e4 c5"],
    difficulty: "Advanced",
    popularity: 90,
    winRate: 48,
  },
  {
    name: "Italian Game",
    description: "A solid opening that emphasizes quick development and central control",
    moves: ["1.e4 e5", "2.Nf3 Nc6", "3.Bc4"],
    difficulty: "Beginner",
    popularity: 85,
    winRate: 50,
  },
  {
    name: "French Defense",
    description: "A solid defense that leads to closed, strategic positions",
    moves: ["1.e4 e6"],
    difficulty: "Intermediate",
    popularity: 80,
    winRate: 49,
  },
  {
    name: "King's Indian Defense",
    description: "A hypermodern opening that allows White to establish a large center",
    moves: ["1.d4 Nf6", "2.c4 g6"],
    difficulty: "Advanced",
    popularity: 75,
    winRate: 51,
  },
  {
    name: "London System",
    description: "A solid system-based opening that's easy to learn and hard to refute",
    moves: ["1.d4 d5", "2.Bf4"],
    difficulty: "Beginner",
    popularity: 70,
    winRate: 53,
  },
]

const middlegameTopics = [
  {
    name: "Pawn Structures",
    description: "Understanding pawn chains and weaknesses",
    lessons: 6,
    duration: "45 min",
    difficulty: "Intermediate",
  },
  {
    name: "Piece Coordination",
    description: "Making your pieces work together",
    lessons: 8,
    duration: "60 min",
    difficulty: "Beginner",
  },
  {
    name: "Tactical Motifs",
    description: "Pins, forks, skewers, and more",
    lessons: 12,
    duration: "90 min",
    difficulty: "All Levels",
  },
  {
    name: "Positional Play",
    description: "Long-term planning and strategy",
    lessons: 10,
    duration: "75 min",
    difficulty: "Advanced",
  },
]

const endgameTopics = [
  {
    name: "King and Pawn Endgames",
    description: "Essential endgame knowledge",
    lessons: 8,
    duration: "50 min",
    difficulty: "Beginner",
  },
  {
    name: "Rook Endgames",
    description: "The most common endgame type",
    lessons: 12,
    duration: "80 min",
    difficulty: "Intermediate",
  },
  {
    name: "Queen vs Pawn",
    description: "Precise technique required",
    lessons: 6,
    duration: "40 min",
    difficulty: "Advanced",
  },
  {
    name: "Minor Piece Endgames",
    description: "Bishop and knight endgames",
    lessons: 10,
    duration: "65 min",
    difficulty: "Intermediate",
  },
]

const courses = [
  {
    title: "Opening Fundamentals",
    description: "Learn the key principles of chess openings and how to apply them",
    duration: "2 hours",
    level: "Beginner",
    lessons: 8,
    progress: 75,
    icon: BookOpen,
    chapters: [
      "Understanding Opening Principles",
      "Control of the Center",
      "Piece Development",
      "King Safety",
      "Pawn Structure Basics",
      "Common Opening Traps",
      "Opening Repertoire Building",
      "Practice Positions"
    ]
  },
  {
    title: "Tactical Patterns",
    description: "Master common tactical patterns and combinations",
    duration: "3 hours",
    level: "Intermediate",
    lessons: 12,
    progress: 50,
    icon: Target,
    chapters: [
      "Pins and Skewers",
      "Double Attacks",
      "Discovered Attacks",
      "Back Rank Tactics",
      "Removing the Defender",
      "Overloading Pieces",
      "Deflection Tactics",
      "Interference Tactics",
      "Clearance Sacrifices",
      "Mating Patterns",
      "Tactical Exercises",
      "Complex Combinations"
    ]
  },
  {
    title: "Endgame Essentials",
    description: "Study essential endgame positions and techniques",
    duration: "2.5 hours",
    level: "Advanced",
    lessons: 10,
    progress: 25,
    icon: Crown,
    chapters: [
      "King and Pawn Endings",
      "Opposition Technique",
      "Rook Endgames",
      "Queen vs Pawn",
      "Minor Piece Endgames",
      "Fortress Positions",
      "Zugzwang",
      "Endgame Studies",
      "Practical Endgames",
      "Complex Endgames"
    ]
  },
  {
    title: "Strategic Planning",
    description: "Develop your strategic thinking and planning skills",
    duration: "4 hours",
    level: "Advanced",
    lessons: 15,
    progress: 0,
    icon: Brain,
    chapters: [
      "Pawn Structure Analysis",
      "Piece Placement",
      "Center Control",
      "Prophylaxis",
      "Attacking Plans",
      "Defense Techniques",
      "Positional Sacrifices",
      "Minority Attack",
      "Isolated Pawns",
      "Backward Pawns",
      "Space Advantage",
      "Color Complexes",
      "Strategic Exchanges",
      "Long-term Planning",
      "Strategic Exercises"
    ]
  },
  {
    title: "Attacking Chess",
    description: "Learn how to build and execute attacking plans",
    duration: "3.5 hours",
    level: "Intermediate",
    lessons: 12,
    progress: 0,
    icon: Sword,
    chapters: [
      "King Safety Assessment",
      "Piece Coordination",
      "Pawn Storms",
      "Sacrificial Attacks",
      "Attack on Castled King",
      "Open File Strategy",
      "Attacking with Opposite Castling",
      "Attacking Weak Color Complexes",
      "Initiative in Attack",
      "Defense Against Attack",
      "Famous Attacking Games",
      "Attack Practice"
    ]
  },
  {
    title: "Defense Mastery",
    description: "Master the art of defense and counterplay",
    duration: "3 hours",
    level: "Advanced",
    lessons: 10,
    progress: 0,
    icon: Shield,
    chapters: [
      "Defensive Principles",
      "Prophylactic Thinking",
      "Resource Finding",
      "Counterattack Opportunities",
      "Fortress Building",
      "Emergency Defense",
      "Equal Position Defense",
      "Worse Position Defense",
      "Famous Defensive Games",
      "Defense Exercises"
    ]
  },
  {
    title: "Calculation Training",
    description: "Improve your calculation abilities and visualization",
    duration: "4 hours",
    level: "Intermediate",
    lessons: 12,
    progress: 0,
    icon: Zap,
    chapters: [
      "Calculation Method",
      "Candidate Moves",
      "Tree of Analysis",
      "Forcing Moves",
      "Quiet Positions",
      "Complex Variations",
      "Time Management",
      "Pattern Recognition",
      "Practical Decision Making",
      "Calculation Exercises",
      "Visualization Training",
      "Complex Problems"
    ]
  }
]

const MiniChessboard = dynamic(
  () => import('react-chessboard').then((m) => m.Chessboard),
  { ssr: false }
);

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Chess Learning Center</h1>
        <p className="text-xl text-muted-foreground">
          Master chess with structured courses and interactive lessons
        </p>
      </div>

      <Tabs defaultValue="courses" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="openings">
            <Play className="w-4 h-4 mr-2" />
            Openings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Card key={course.title}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <course.icon className="w-5 h-5 text-primary" />
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                    <Badge variant={course.level === "Beginner" ? "default" : course.level === "Intermediate" ? "secondary" : "outline"}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div>{course.lessons} lessons</div>
                  </div>
                  <Progress value={course.progress} className="mb-4" />
                  <Link href={`/learn/courses/${course.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button className="w-full">
                      {course.progress > 0 ? "Continue Learning" : "Start Course"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Course Content:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {course.chapters.slice(0, 4).map((chapter, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {chapter}
                        </li>
                      ))}
                      {course.chapters.length > 4 && (
                        <li className="text-primary text-xs mt-1">
                          +{course.chapters.length - 4} more chapters
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="openings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openings.map((opening) => (
              <Card key={opening.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{opening.name}</CardTitle>
                    <Badge variant={opening.difficulty === "Beginner" ? "default" : opening.difficulty === "Intermediate" ? "secondary" : "outline"}>
                      {opening.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{opening.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Popularity: {opening.popularity}%
                    </div>
                    <div>Win Rate: {opening.winRate}%</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    <div className="font-medium mb-1">Main Line:</div>
                    <div className="font-mono">{opening.moves.join(" ")}</div>
                  </div>
                  <Link href={`/learn/openings/${opening.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button className="w-full">
                      Learn Opening
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
