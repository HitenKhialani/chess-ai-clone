"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from 'next/link'

export default function PuzzlesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Puzzles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/puzzles/mate-in-1">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Mate in 1</CardTitle>
              <CardDescription>
                Easy puzzles to practice checkmating in one move.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>7 puzzles</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/puzzles/pin">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Pin</CardTitle>
              <CardDescription>
                Practice pin tactics to win material or create threats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>10 puzzles</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
