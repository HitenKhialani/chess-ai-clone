"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Puzzle, Target, Users, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Get instant feedback on your moves with Stockfish 16 engine analysis and personalized improvement suggestions.",
    badge: "3200+ ELO",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Learning",
    description: "Master openings, middlegames, and endgames with lessons from world-class grandmasters and theory.",
    badge: "500+ Lessons",
  },
  {
    icon: Puzzle,
    title: "Tactical Puzzles",
    description: "Solve thousands of puzzles ranging from beginner to master level with detailed explanations.",
    badge: "10K+ Puzzles",
  },
  {
    icon: Target,
    title: "Custom Positions",
    description: "Create any chess position and get AI analysis with multiple grandmaster perspectives.",
    badge: "Unlimited",
  },
  {
    icon: Users,
    title: "Grandmaster Insights",
    description: "Learn how Magnus, Hikaru, and other top GMs would play in any position with style analysis.",
    badge: "20+ GMs",
  },
  {
    icon: TrendingUp,
    title: "Rating Improvement",
    description: "Track your progress with detailed statistics and personalized training plans to boost your rating.",
    badge: "Proven Results",
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything You Need to Master Chess
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From beginner to grandmaster, our AI-powered platform provides comprehensive tools for chess improvement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
