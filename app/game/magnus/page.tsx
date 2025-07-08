"use client"


import { type ReactElement } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Crown, RotateCcw, Clock } from "lucide-react"
import type { LucideProps } from 'lucide-react'

// Chess piece types and colors
type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"



type PieceColor = "white" | "black"
type Square = { piece: PieceType; color: PieceColor } | null

// Game state types
interface Move {
  from: [number, number]
  to: [number, number]
  piece: PieceType
  color: PieceColor
  captured?: PieceType
  notation: string
}

interface GameState {
  board: Square[][]
  currentPlayer: PieceColor
  selectedSquare: [number, number] | null
  validMoves: [number, number][]
  moveHistory: Move[]
  gameStatus: "playing" | "check" | "checkmate" | "stalemate"
  winner: PieceColor | null
}

// Chess piece Unicode symbols
const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
}

// Initial chess board setup
const initialBoard: Square[][] = [
  [
    { piece: "rook", color: "black" },
    { piece: "knight", color: "black" },
    { piece: "bishop", color: "black" },
    { piece: "queen", color: "black" },
    { piece: "king", color: "black" },
    { piece: "bishop", color: "black" },
    { piece: "knight", color: "black" },
    { piece: "rook", color: "black" },
  ],
  Array(8).fill({ piece: "pawn", color: "black" }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ piece: "pawn", color: "white" }),
  [
    { piece: "rook", color: "white" },
    { piece: "knight", color: "white" },
    { piece: "bishop", color: "white" },
    { piece: "queen", color: "white" },
    { piece: "king", color: "white" },
    { piece: "bishop", color: "white" },
    { piece: "knight", color: "white" },
    { piece: "rook", color: "white" },
  ],
]

// Piece values for AI evaluation
const pieceValues: Record<PieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
}

// Position bonus tables for better AI play
const pawnTable = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
]

const knightTable = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
]


// Fix type issues for move coordinates
interface MoveCoordinates {
  mr: number;
  mc: number;
}

// Component types
interface BoardProps {
  board: Square[][];
  onSquareClick: (row: number, col: number) => void;
}

const Board = ({ board, onSquareClick }: BoardProps): ReactElement => {
  const getPieceSymbol = (piece: PieceType, color: PieceColor): string => {
    return pieceSymbols[color][piece];
  };

  return (
    <div className="grid grid-cols-8 gap-0 border border-gray-700">
      {board.map((row, r) =>
        row.map((square, c) => (
          <div
            key={`${r}-${c}`}
            className={`w-16 h-16 flex items-center justify-center ${
              (r + c) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-400'
            }`}
            onClick={() => onSquareClick(r, c)}
          >
            {square && (
              <span className="text-4xl">{getPieceSymbol(square.piece, square.color)}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};



export default function MagnusGame() {
  const [gameState, setGameState] = useState<GameState>({

    board: initialBoard.map((row) => [...row]),
    currentPlayer: "white",
    selectedSquare: null,
    validMoves: [],
    moveHistory: [],
    gameStatus: "playing",
    winner: null,
  })

  const [isThinking, setIsThinking] = useState(false)



  const [gameTime, setGameTime] = useState(0)


  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Check if a square is under attack
  const isSquareUnderAttack = useCallback(
    (board: Square[][], row: number, col: number, byColor: PieceColor): boolean => {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c]
          if (piece && piece.color === byColor) {
            const moves = getValidMovesForPiece(board, r, c, piece.piece, piece.color, false)
            if (moves.some(([mr, mc]) => mr === row && mc === col)) {
              return true
            }
          }
        }
      }
      return false
    },
    [],
  )

  // Get valid moves for a piece


  const getValidMovesForPiece = useCallback(

    (
      board: Square[][],
      row: number,
      col: number,
      piece: PieceType,
      color: PieceColor,
      checkForCheck = true,
    ): [number, number][] => {
      const moves: [number, number][] = []
      const directions: Record<string, [number, number][]> = {
        rook: [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ],
        bishop: [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ],
        queen: [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ],
        king: [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ],
      }

      const isValidSquare = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8
      const isEmpty = (r: number, c: number) => !board[r][c]



      const isEnemy = (r: number, c: number) => board[r][c] && board[r][c]!.color !== color


      switch (piece) {
        case "pawn":
          const direction = color === "white" ? -1 : 1
          const startRow = color === "white" ? 6 : 1

          // Forward moves
          if (isValidSquare(row + direction, col) && isEmpty(row + direction, col)) {
            moves.push([row + direction, col])
            if (row === startRow && isEmpty(row + 2 * direction, col)) {
              moves.push([row + 2 * direction, col])
            }
          }

          // Captures
          for (const dc of [-1, 1]) {
            if (isValidSquare(row + direction, col + dc) && isEnemy(row + direction, col + dc)) {
              moves.push([row + direction, col + dc])
            }
          }
          break

        case "knight":
          const knightMoves = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1],
          ]
          for (const [dr, dc] of knightMoves) {
            const newRow = row + dr
            const newCol = col + dc
            if (isValidSquare(newRow, newCol) && (isEmpty(newRow, newCol) || isEnemy(newRow, newCol))) {
              moves.push([newRow, newCol])
            }
          }
          break

        case "rook":
        case "bishop":
        case "queen":
          for (const [dr, dc] of directions[piece]) {
            for (let i = 1; i < 8; i++) {
              const newRow = row + dr * i
              const newCol = col + dc * i
              if (!isValidSquare(newRow, newCol)) break
              if (isEmpty(newRow, newCol)) {
                moves.push([newRow, newCol])
              } else {
                if (isEnemy(newRow, newCol)) {
                  moves.push([newRow, newCol])
                }
                break
              }
            }
          }
          break

        case "king":
          for (const [dr, dc] of directions.king) {
            const newRow = row + dr
            const newCol = col + dc
            if (isValidSquare(newRow, newCol) && (isEmpty(newRow, newCol) || isEnemy(newRow, newCol))) {
              moves.push([newRow, newCol])
            }
          }
          break
      }

      // Filter out moves that would put own king in check
      if (checkForCheck) {
        return moves.filter(([toRow, toCol]) => {
          const newBoard = board.map((row) => [...row])
          newBoard[toRow][toCol] = newBoard[row][col]
          newBoard[row][col] = null

          // Find king position
          let kingRow = -1,
            kingCol = -1
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (newBoard[r][c]?.piece === "king" && newBoard[r][c]?.color === color) {
                kingRow = r
                kingCol = c
                break
              }
            }
          }

          return !isSquareUnderAttack(newBoard, kingRow, kingCol, color === "white" ? "black" : "white")
        })
      }

      return moves
    },
    [isSquareUnderAttack],
  )

  // Check if king is in check
  const isInCheck = useCallback(
    (board: Square[][], color: PieceColor): boolean => {
      let kingRow = -1,
        kingCol = -1
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (board[r][c]?.piece === "king" && board[r][c]?.color === color) {
            kingRow = r
            kingCol = c
            break
          }
        }
      }
      return isSquareUnderAttack(board, kingRow, kingCol, color === "white" ? "black" : "white")
    },
    [isSquareUnderAttack],
  )

  // Get all valid moves for a color
  const getAllValidMoves = useCallback(
    (board: Square[][], color: PieceColor): Move[] => {
      const moves: Move[] = []
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c]
          if (piece && piece.color === color) {
            const validMoves = getValidMovesForPiece(board, r, c, piece.piece, piece.color)
            for (const [toRow, toCol] of validMoves) {
              moves.push({
                from: [r, c],
                to: [toRow, toCol],
                piece: piece.piece,
                color: piece.color,
                captured: board[toRow][toCol]?.piece,
                notation: `${piece.piece !== "pawn" ? piece.piece.charAt(0).toUpperCase() : ""}${String.fromCharCode(97 + c)}${8 - r}${board[toRow][toCol] ? "x" : "-"}${String.fromCharCode(97 + toCol)}${8 - toRow}`,
              })
            }
          }
        }
      }
      return moves
    },
    [getValidMovesForPiece],
  )

  // Evaluate board position for AI
  const evaluateBoard = useCallback((board: Square[][], color: PieceColor): number => {
    let score = 0

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c]
        if (!piece) continue

        let pieceScore = pieceValues[piece.piece]

        // Add positional bonuses
        if (piece.piece === "pawn") {
          pieceScore += piece.color === "white" ? pawnTable[r][c] : pawnTable[7 - r][c]
        } else if (piece.piece === "knight") {
          pieceScore += piece.color === "white" ? knightTable[r][c] : knightTable[7 - r][c]
        }

        // Center control bonus
        if (r >= 3 && r <= 4 && c >= 3 && c <= 4) {
          pieceScore += 20
        }

        score += piece.color === color ? pieceScore : -pieceScore
      }
    }

    return score
  }, [])

  // Minimax algorithm with alpha-beta pruning
  const minimax = useCallback(
    (
      board: Square[][],
      depth: number,
      alpha: number,
      beta: number,
      maximizingPlayer: boolean,
      color: PieceColor,
    ): number => {
      if (depth === 0) {
        return evaluateBoard(board, color)
      }

      const moves = getAllValidMoves(board, maximizingPlayer ? color : color === "white" ? "black" : "white")

      if (moves.length === 0) {
        const inCheck = isInCheck(board, maximizingPlayer ? color : color === "white" ? "black" : "white")
        return inCheck ? (maximizingPlayer ? -10000 : 10000) : 0
      }

      if (maximizingPlayer) {
        let maxEval = Number.NEGATIVE_INFINITY
        for (const move of moves) {
          const newBoard = board.map((row) => [...row])
          newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]]
          newBoard[move.from[0]][move.from[1]] = null

          const score = minimax(newBoard, depth - 1, alpha, beta, false, color)
          maxEval = Math.max(maxEval, score)
          alpha = Math.max(alpha, score)
          if (beta <= alpha) break
        }
        return maxEval
      } else {
        let minEval = Number.POSITIVE_INFINITY
        for (const move of moves) {
          const newBoard = board.map((row) => [...row])
          newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]]
          newBoard[move.from[0]][move.from[1]] = null

          const score = minimax(newBoard, depth - 1, alpha, beta, true, color)
          minEval = Math.min(minEval, score)
          beta = Math.min(beta, score)
          if (beta <= alpha) break
        }
        return minEval
      }
    },
    [evaluateBoard, getAllValidMoves, isInCheck],
  )

  // AI move calculation
  const calculateAIMove = useCallback(async (): Promise<Move | null> => {
    const moves = getAllValidMoves(gameState.board, "black")
    if (moves.length === 0) return null

    let bestMove = moves[0]
    let bestScore = Number.NEGATIVE_INFINITY

    // Use deeper search for Magnus-like play
    const depth = 4

    for (const move of moves) {
      const newBoard = gameState.board.map((row) => [...row])
      newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]]
      newBoard[move.from[0]][move.from[1]] = null

      const score = minimax(newBoard, depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, "black")

      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }, [gameState.board, getAllValidMoves, minimax])

  // Make AI move
  useEffect(() => {
    if (gameState.currentPlayer === "black" && gameState.gameStatus === "playing") {
      setIsThinking(true)

      // Add thinking delay for realism
      setTimeout(
        async () => {
          const aiMove = await calculateAIMove()
          if (aiMove) {
            makeMove(aiMove.from[0], aiMove.from[1], aiMove.to[0], aiMove.to[1])
          }
          setIsThinking(false)
        },
        1000 + Math.random() * 2000,
      ) // 1-3 seconds thinking time
    }
  }, [gameState.currentPlayer, gameState.gameStatus])

  // Make a move
  const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = gameState.board.map((row) => [...row])
    const piece = newBoard[fromRow][fromCol]
    if (!piece) return

    const capturedPiece = newBoard[toRow][toCol]
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = null

    const move: Move = {
      from: [fromRow, fromCol],
      to: [toRow, toCol],
      piece: piece.piece,
      color: piece.color,
      captured: capturedPiece?.piece,
      notation: `${piece.piece !== "pawn" ? piece.piece.charAt(0).toUpperCase() : ""}${String.fromCharCode(97 + fromCol)}${8 - fromRow}${capturedPiece ? "x" : "-"}${String.fromCharCode(97 + toCol)}${8 - toRow}`,
    }

    const nextPlayer = gameState.currentPlayer === "white" ? "black" : "white"
    const inCheck = isInCheck(newBoard, nextPlayer)
    const validMoves = getAllValidMoves(newBoard, nextPlayer)

    let gameStatus: GameState["gameStatus"] = "playing"
    let winner: PieceColor | null = null

    if (validMoves.length === 0) {
      if (inCheck) {
        gameStatus = "checkmate"
        winner = gameState.currentPlayer
      } else {
        gameStatus = "stalemate"
      }
    } else if (inCheck) {
      gameStatus = "check"
    }

    setGameState({
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedSquare: null,
      validMoves: [],
      moveHistory: [...gameState.moveHistory, move],
      gameStatus,
      winner,
    })
  }

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (gameState.currentPlayer !== "white" || gameState.gameStatus !== "playing") return

    const piece = gameState.board[row][col]

    if (gameState.selectedSquare) {
      const [selectedRow, selectedCol] = gameState.selectedSquare

      // Check if this is a valid move
      if (gameState.validMoves.some(([r, c]) => r === row && c === col)) {
        makeMove(selectedRow, selectedCol, row, col)
      } else if (piece && piece.color === "white") {
        // Select new piece
        const validMoves = getValidMovesForPiece(gameState.board, row, col, piece.piece, piece.color)
        setGameState({
          ...gameState,
          selectedSquare: [row, col],
          validMoves,
        })
      } else {
        // Deselect
        setGameState({
          ...gameState,
          selectedSquare: null,
          validMoves: [],
        })
      }
    } else if (piece && piece.color === "white") {
      // Select piece
      const validMoves = getValidMovesForPiece(gameState.board, row, col, piece.piece, piece.color)
      setGameState({
        ...gameState,
        selectedSquare: [row, col],
        validMoves,
      })
    }
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      board: initialBoard.map((row) => [...row]),
      currentPlayer: "white",
      selectedSquare: null,
      validMoves: [],
      moveHistory: [],
      gameStatus: "playing",
      winner: null,
    })
    setGameTime(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-400" />
            Chess vs Magnus AI
          </h1>
          <p className="text-slate-400">Challenge the AI that plays like Magnus Carlsen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Game Time</span>
              </div>
              <div className="text-2xl font-mono">{formatTime(gameTime)}</div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="font-semibold mb-3">Players</h3>
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-2 p-2 rounded ${gameState.currentPlayer === "white" ? "bg-slate-700" : ""}`}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span>You (White)</span>
                </div>
                <div
                  className={`flex items-center gap-2 p-2 rounded ${gameState.currentPlayer === "black" ? "bg-slate-700" : ""}`}
                >
                  <div className="w-3 h-3 bg-slate-900 rounded-full border border-slate-600"></div>
                  <span>Magnus AI (Black)</span>
                  {isThinking && <span className="text-yellow-400 text-sm">Thinking...</span>}
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="font-semibold mb-3">Game Status</h3>
              <div className="space-y-2">
                <div
                  className={`px-3 py-1 rounded text-sm ${
                    gameState.gameStatus === "playing"
                      ? "bg-green-600"
                      : gameState.gameStatus === "check"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }`}
                >
                  {gameState.gameStatus === "playing"
                    ? "In Progress"
                    : gameState.gameStatus === "check"
                      ? "Check!"
                      : gameState.gameStatus === "checkmate"
                        ? `Checkmate! ${gameState.winner} wins`
                        : "Stalemate"}
                </div>
                <Button onClick={resetGame} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </div>
            </Card>
          </div>

          {/* Chess Board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="bg-slate-700 p-4 rounded-lg shadow-2xl">

              <Board board={gameState.board} onSquareClick={handleSquareClick} />

              <div className="grid grid-cols-8 gap-0 border-2 border-slate-600">
                {gameState.board.map((row, rowIndex) =>
                  row.map((square, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0
                    const isSelected =
                      gameState.selectedSquare &&
                      gameState.selectedSquare[0] === rowIndex &&
                      gameState.selectedSquare[1] === colIndex
                    const isValidMove = gameState.validMoves.some(([r, c]) => r === rowIndex && c === colIndex)

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-16 h-16 flex items-center justify-center text-3xl cursor-pointer
                          transition-all duration-200 hover:brightness-110
                          ${isLight ? "bg-stone-300" : "bg-stone-600"}
                          ${isSelected ? "ring-4 ring-blue-400" : ""}
                          ${isValidMove ? "ring-2 ring-green-400" : ""}
                        `}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {square && (
                          <span
                            className={`${square.color === "white" ? "text-gray-800 drop-shadow-sm font-bold" : "text-gray-100 drop-shadow-sm font-bold"}`}
                          >
                            {pieceSymbols[square.color][square.piece]}
                          </span>
                        )}
                        {isValidMove && !square && <div className="w-4 h-4 bg-green-400 rounded-full opacity-60"></div>}
                      </div>
                    )
                  }),
                )}
              </div>

            </div>
          </div>

          {/* Move History */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-4 h-96">
              <h3 className="font-semibold mb-3">Move History</h3>
              <div className="space-y-1 overflow-y-auto h-80">
                {gameState.moveHistory.map((move, index) => (
                  <div key={index} className="text-sm p-2 bg-slate-700 rounded flex justify-between">
                    <span>{Math.floor(index / 2) + 1}.</span>
                    <span className={move.color === "white" ? "text-white" : "text-slate-300"}>{move.notation}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 