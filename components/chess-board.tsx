"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface ChessBoardProps {
  fen: string
  solution: string[]
  onSolved: (correct: boolean, timeSpent: number) => void
}

export function ChessBoard({ fen, solution, onSolved }: ChessBoardProps) {
  const [currentPosition, setCurrentPosition] = useState(fen)
  const [moveIndex, setMoveIndex] = useState(0)
  const [gameState, setGameState] = useState<"playing" | "correct" | "incorrect">("playing")
  const [startTime] = useState(Date.now())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [lastMove, setLastMove] = useState<string | null>(null)

  // Convert FEN to board representation
  const fenToBoard = (fen: string) => {
    const [position] = fen.split(" ")
    const rows = position.split("/")
    const board: (string | null)[][] = []

    rows.forEach((row) => {
      const boardRow: (string | null)[] = []
      for (const char of row) {
        if (isNaN(Number.parseInt(char))) {
          boardRow.push(char)
        } else {
          for (let i = 0; i < Number.parseInt(char); i++) {
            boardRow.push(null)
          }
        }
      }
      board.push(boardRow)
    })

    return board
  }

  const board = fenToBoard(currentPosition)

  const getPieceSymbol = (piece: string | null) => {
    if (!piece) return ""

    const symbols: { [key: string]: string } = {
      K: "\u2654",
      Q: "\u2655",
      R: "\u2656",
      B: "\u2657",
      N: "\u2658",
      P: "\u2659",
      k: "\u265a",
      q: "\u265b",
      r: "\u265c",
      b: "\u265d",
      n: "\u265e",
      p: "\u265f",
    }

    return symbols[piece] || piece
  }

  const handleSquareClick = (row: number, col: number) => {
    const square = String.fromCharCode(97 + col) + (8 - row)

    if (selectedSquare) {
      const move = selectedSquare + square
      checkMove(move)
      setSelectedSquare(null)
    } else if (board[row][col]) {
      setSelectedSquare(square)
    }
  }

  const checkMove = (move: string) => {
    const expectedMove = solution[moveIndex]

    if (move === expectedMove || move.toLowerCase() === expectedMove.toLowerCase()) {
      setLastMove(move)

      if (moveIndex === solution.length - 1) {
        // Puzzle solved!
        setGameState("correct")
        const timeSpent = Date.now() - startTime
        setTimeout(() => onSolved(true, timeSpent), 2000)
      } else {
        setMoveIndex((prev) => prev + 1)
        // Simulate opponent move or next position
        setTimeout(() => {
          // In a real implementation, you'd update the position based on the move
        }, 500)
      }
    } else {
      setGameState("incorrect")
      setTimeout(() => {
        setGameState("playing")
        const timeSpent = Date.now() - startTime
        onSolved(false, timeSpent)
      }, 2000)
    }
  }

  const resetPuzzle = () => {
    setCurrentPosition(fen)
    setMoveIndex(0)
    setGameState("playing")
    setSelectedSquare(null)
    setLastMove(null)
  }

  return (
    <div className="space-y-4">
      {/* Game State Indicator */}
      {gameState !== "playing" && (
        <div
          className={`p-4 rounded-lg text-center ${
            gameState === "correct"
              ? "bg-green-600/20 border border-green-600/50"
              : "bg-red-600/20 border border-red-600/50"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            {gameState === "correct" ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-green-200 font-medium">Excellent! Puzzle solved!</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-400" />
                <span className="text-red-200 font-medium">Not quite right. Try again!</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chess Board */}
      <div className="aspect-square max-w-lg mx-auto">
        <div className="grid grid-cols-8 gap-0 border-2 border-purple-600/50 rounded-lg overflow-hidden">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const square = String.fromCharCode(97 + colIndex) + (8 - rowIndex)
              const isSelected = selectedSquare === square
              const isLastMove = lastMove?.includes(square)

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    aspect-square flex items-center justify-center text-4xl cursor-pointer
                    transition-all duration-200 hover:brightness-110
                    ${isLight ? "bg-amber-100" : "bg-amber-800"}
                    ${isSelected ? "ring-4 ring-purple-400" : ""}
                    ${isLastMove ? "bg-green-400/50" : ""}
                  `}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  <span
                    className={`select-none ${piece && piece === piece.toUpperCase() ? "text-white" : "text-black"}`}
                  >
                    {getPieceSymbol(piece)}
                  </span>
                </div>
              )
            }),
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={resetPuzzle}
          variant="outline"
          className="border-purple-600 text-purple-200 hover:bg-purple-600/20"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Move Hint */}
      <div className="text-center">
        <p className="text-purple-200 text-sm">
          Move {moveIndex + 1} of {solution.length}
          {moveIndex === 0 && (
            <span className="block mt-1 text-purple-300">
              Hint: Look for {solution[0].length > 2 ? "a tactical shot" : "the best move"}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
