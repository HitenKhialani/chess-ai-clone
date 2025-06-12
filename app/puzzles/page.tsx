"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Puzzle, Target, Zap, Crown, Trophy, Clock, Star, ChevronRight, Brain, Sword, Swords, Flag } from "lucide-react"
import Link from "next/link"

const puzzleCategories = [
  {
    title: "Tactical Patterns",
    description: "Master common tactical patterns and combinations",
    icon: Swords,
    categories: [
      { name: "Pin", count: "150+", difficulty: "Beginner" },
      { name: "Fork", count: "200+", difficulty: "Beginner" },
      { name: "Skewer", count: "125+", difficulty: "Intermediate" },
      { name: "Double Attack", count: "175+", difficulty: "Intermediate" },
      { name: "Discovered Attack", count: "100+", difficulty: "Advanced" },
    ],
    href: "/puzzles/tactics"
  },
  {
    title: "Endgame Studies",
    description: "Practice critical endgame positions and techniques",
    icon: Flag,
    categories: [
      { name: "Pawn Endings", count: "100+", difficulty: "Beginner" },
      { name: "Rook Endings", count: "150+", difficulty: "Intermediate" },
      { name: "Queen vs Pawn", count: "75+", difficulty: "Advanced" },
      { name: "Minor Piece", count: "125+", difficulty: "Advanced" },
      { name: "Technical Wins", count: "100+", difficulty: "Expert" },
    ],
    href: "/puzzles/endgame"
  },
  {
    title: "Opening Traps",
    description: "Learn to spot and avoid common opening traps",
    icon: Target,
    categories: [
      { name: "Sicilian", count: "50+", difficulty: "Intermediate" },
      { name: "King's Indian", count: "40+", difficulty: "Advanced" },
      { name: "French", count: "45+", difficulty: "Intermediate" },
      { name: "Ruy Lopez", count: "60+", difficulty: "Advanced" },
      { name: "Queen's Gambit", count: "55+", difficulty: "Expert" },
    ],
    href: "/puzzles/openings"
  },
  {
    title: "Middlegame Strategy",
    description: "Improve your positional understanding and planning",
    icon: Brain,
    categories: [
      { name: "Pawn Structure", count: "80+", difficulty: "Intermediate" },
      { name: "Piece Activity", count: "90+", difficulty: "Advanced" },
      { name: "King Safety", count: "70+", difficulty: "Advanced" },
      { name: "Center Control", count: "85+", difficulty: "Expert" },
      { name: "Prophylaxis", count: "60+", difficulty: "Expert" },
    ],
    href: "/puzzles/strategy"
  },
  {
    title: "Grandmaster Puzzles",
    description: "Challenge yourself with puzzles from GM games",
    icon: Crown,
    categories: [
      { name: "Magnus Carlsen", count: "30+", difficulty: "Expert" },
      { name: "Garry Kasparov", count: "25+", difficulty: "Expert" },
      { name: "Bobby Fischer", count: "20+", difficulty: "Expert" },
      { name: "Mikhail Tal", count: "25+", difficulty: "Expert" },
      { name: "Anatoly Karpov", count: "20+", difficulty: "Expert" },
    ],
    href: "/puzzles/grandmaster"
  },
  {
    title: "Daily Challenges",
    description: "New puzzles every day based on your rating",
    icon: Zap,
    categories: [
      { name: "Today's Puzzle", count: "1", difficulty: "Varies" },
      { name: "Weekly Theme", count: "7", difficulty: "Varies" },
      { name: "Monthly Challenge", count: "30", difficulty: "Varies" },
      { name: "Rating Boosters", count: "10+", difficulty: "Varies" },
      { name: "Custom Sets", count: "∞", difficulty: "Custom" },
    ],
    href: "/puzzles/daily"
  },
]

const dailyPuzzles = [
  {
    id: 1,
    title: "Mate in 2",
    difficulty: "Intermediate",
    rating: 1650,
    theme: "Back Rank Mate",
    solved: false,
  },
  {
    id: 2,
    title: "Win Material",
    difficulty: "Beginner",
    rating: 1200,
    theme: "Fork",
    solved: true,
  },
  {
    id: 3,
    title: "Tactical Shot",
    difficulty: "Advanced",
    rating: 2100,
    theme: "Deflection",
    solved: false,
  },
]

const userStats = {
  puzzlesSolved: 1247,
  currentStreak: 12,
  bestStreak: 28,
  accuracy: 87,
  rating: 1680,
}

export default function PuzzlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            Chess Puzzles
          </h1>
          <p className="mx-auto max-w-[700px] text-white md:text-xl">
            Enhance your tactical vision and strategic understanding with our comprehensive collection of chess puzzles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {puzzleCategories.map((category) => (
            <Link key={category.title} href={category.href}>
              <Card className="h-full bg-[#1a1a1a] border-[#3F51B5] hover:border-[#00BFCF] transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#3F51B5] bg-opacity-20 rounded-full">
                      <category.icon className="h-6 w-6 text-[#00BFCF]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {category.title}
                      </h3>
                      <p className="text-sm text-white">{category.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {category.categories.map((subCategory) => (
                      <div
                        key={subCategory.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <span className="text-sm text-white">{subCategory.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-[#a78bfa] bg-opacity-20 text-[#a78bfa]">
                            {subCategory.count}
                          </Badge>
                          <Badge variant="outline" className="border-white/30 text-white">
                            {subCategory.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
