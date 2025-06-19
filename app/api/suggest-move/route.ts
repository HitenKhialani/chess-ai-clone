import { NextResponse } from "next/server"
import { Chess } from "chess.js"

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

// Simple evaluation function for pieces
const pieceValues: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
}

function evaluatePosition(chess: Chess) {
  let score = 0
  const board = chess.board()
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j]
      if (piece) {
        const value = pieceValues[piece.type as PieceType] * (piece.color === 'w' ? 1 : -1)
        score += value
      }
    }
  }
  return score
}

function findBestMove(chess: Chess, difficulty: string) {
  const moves = chess.moves({ verbose: true })
  let bestMove = null
  let bestScore = chess.turn() === 'w' ? -Infinity : Infinity
  
  // For beginner bot, only look at the immediate position
  for (const move of moves) {
    const testChess = new Chess(chess.fen())
    testChess.move(move)
    const score = evaluatePosition(testChess)
    
    if (chess.turn() === 'w') {
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    } else {
      if (score < bestScore) {
        bestScore = score
        bestMove = move
      }
    }
  }
  
  return bestMove || moves[Math.floor(Math.random() * moves.length)]
}

export async function POST(request: Request) {
  try {
    const { fen, difficulty = 'beginner' } = await request.json()
    const chess = new Chess(fen)

    if (chess.isGameOver()) {
      return NextResponse.json({ error: "Game is over" }, { status: 400 })
    }

    const bestMove = findBestMove(chess, difficulty)
    
    if (!bestMove) {
      return NextResponse.json({ error: "No valid moves" }, { status: 400 })
    }

    return NextResponse.json({
      move: {
        from: bestMove.from,
        to: bestMove.to,
        promotion: bestMove.promotion
      },
      score: evaluatePosition(chess)
    })
  } catch (error) {
    console.error("Error in suggest-move API:", error)
    return NextResponse.json({ error: "Failed to suggest move" }, { status: 500 })
  }
}
