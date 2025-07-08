"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { Brain, Crown, Zap } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const [game] = useState(new Chess("rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3"))

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit bg-purple-100 text-purple-800">
                <Crown className="mr-1 h-3 w-3" />
                AI-Powered Chess Training
              </Badge>

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Endgame</span>
              </h1>

              <p className="text-xl text-purple-200 sm:text-2xl">Where AI Learning Begins</p>

              <p className="max-w-lg text-lg text-gray-300">
                Master chess with AI-powered analysis, personalized training, and insights from the world's greatest
                grandmasters. Elevate your game from beginner to master.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/play">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Training
                </Button>
              </Link>

              <Link href="/analysis">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-400 text-purple-200 hover:bg-purple-800 px-8 py-3"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Analyze Position
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">3200+</div>
                <div className="text-sm text-purple-200">Stockfish Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-sm text-purple-200">GM Styles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-purple-200">Master Games</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Interactive Chessboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-purple-400/20">
              <CardContent className="p-6">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-white">Live Analysis</h3>
                  <p className="text-sm text-purple-200">Italian Game Opening</p>
                </div>

                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <Chessboard position={game.fen()} arePiecesDraggable={false} boardWidth={320} />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Best Move:</span>
                    <span className="text-white font-mono">Nf3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Evaluation:</span>
                    <span className="text-purple-200 font-mono">+0.3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
