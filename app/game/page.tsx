"use client"

import { useState, useEffect, useCallback } from "react"
import { Chessboard } from "react-chessboard"
import { Chess, Square, Move } from "chess.js"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Brain, RotateCcw, Zap, Crown, Target, ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
  DialogClose
} from "@/components/ui/dialog"

type Difficulty = "beginner" | "intermediate" | "advanced"

interface ChessMove {
  from: string
  to: string
  promotion?: string
}

interface CapturedPiece {
  type: string;
  color: "w" | "b";
}

interface GameOverDialogProps {
  isOpen: boolean
  onClose: () => void
  onRematch: () => void
  onNewGame: () => void
  result: string
  playerColor: "white" | "black"
  winner: "white" | "black" | null
  playerRating: number
  accuracy: number
  opponent: string
}

function GameOverDialog({ isOpen, onClose, onRematch, onNewGame, result, playerColor, winner, playerRating, accuracy, opponent }: GameOverDialogProps) {
  const dialogStyles = {
    display: isOpen ? 'flex' : 'none',
  };

  const getTitle = () => {
    if (result === "checkmate") {
      return winner ? `Checkmate! ${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!` : "Checkmate!"
    }
    return result === "draw" ? "Game Over - Draw!" : "Game Over"
  }

  const getMessage = () => {
    if (result === "checkmate") {
      if (winner === playerColor) {
        return "Congratulations! You've checkmated the AI!"
      } else {
        return "The AI has checkmated you! Better luck next time!"
      }
    }
    return result === "draw" 
      ? "The game has ended in a draw." 
      : "The game is over."
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]" 
      style={dialogStyles}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-700 flex flex-col items-center relative">
        <h2 className="text-3xl font-extrabold mb-2 text-purple-400 text-center">{getTitle()}</h2>
        <p className="text-gray-300 mb-4 text-center">{getMessage()}</p>
        <div className="w-full flex flex-col gap-2 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-400">Opponent:</span>
            <span className="font-bold text-white">{opponent}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-400">Your Rating:</span>
            <span className="font-bold text-white">{playerRating}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-400">Accuracy:</span>
            <span className="font-bold text-purple-300">{accuracy}%</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            onClick={onRematch}
            className="bg-purple-600 hover:bg-purple-700 text-white flex-1 font-semibold"
          >
            Rematch
          </Button>
          <Button 
            onClick={onNewGame}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 font-semibold"
          >
            New Game
          </Button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// AI Logic
const pieceValues: Record<string, number> = {
  p: 1,  // pawn
  n: 3,  // knight
  b: 3,  // bishop
  r: 5,  // rook
  q: 9,  // queen
  k: 100 // king
}

const evaluatePosition = (game: Chess): number => {
  let score = 0
  const board = game.board()

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (!piece) continue

      let pieceScore = pieceValues[piece.type]

      // Simple bonus for pieces in center (very basic positional play)
      if (r >= 3 && r <= 4 && c >= 3 && c <= 4 && piece.type !== 'k') {
        pieceScore += 0.1
      }

      score += piece.color === 'w' ? pieceScore : -pieceScore
    }
  }

  return score
}

const minimax = (game: Chess, depth: number, maximizingPlayer: boolean): number => {
  if (depth === 0) {
    return evaluatePosition(game)
  }

  const moves = game.moves({ verbose: true })

  if (moves.length === 0) {
    if (game.isCheck()) {
      return maximizingPlayer ? -1000 : 1000
    }
    return 0 // stalemate
  }

  if (maximizingPlayer) {
    let maxEval = Number.NEGATIVE_INFINITY
    for (const move of moves) {
      game.move(move)
      const score = minimax(game, depth - 1, false)
      game.undo()
      maxEval = Math.max(maxEval, score)
    }
    return maxEval
  } else {
    let minEval = Number.POSITIVE_INFINITY
    for (const move of moves) {
      game.move(move)
      const score = minimax(game, depth - 1, true)
      game.undo()
      minEval = Math.min(minEval, score)
    }
    return minEval
  }
}

const generateAIMove = (game: Chess, difficulty: Difficulty) => {
  const possibleMoves = game.moves({ verbose: true })
  if (possibleMoves.length === 0) return null

  if (difficulty === "beginner") {
    // 30% chance to make a random move (beginner mistake)
    if (Math.random() < 0.3) {
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
    }

    // Look for captures first (beginner tends to focus on captures)
    const captureMoves = possibleMoves.filter(move => move.san.includes('x'))
    if (captureMoves.length > 0 && Math.random() < 0.7) {
      return captureMoves[Math.floor(Math.random() * captureMoves.length)]
    }

    // Simple evaluation with shallow depth (beginner level)
    let bestMove = possibleMoves[0]
    let bestScore = Number.NEGATIVE_INFINITY

    for (const move of possibleMoves) {
      game.move(move)
      // Very shallow search (depth 2) for beginner level
      const score = minimax(game, 2, false) + Math.random() * 0.5 // Add randomness
      game.undo()

      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  } else if (difficulty === "intermediate") {
    const captures = possibleMoves.filter(move => move.san.includes("x"))
    return captures.length > 0 && Math.random() > 0.5 
      ? captures[Math.floor(Math.random() * captures.length)]
      : possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  } else {
    const captures = possibleMoves.filter(move => move.san.includes("x"))
    const checks = possibleMoves.filter(move => move.san.includes("+"))
    const goodMoves = [...captures, ...checks]
    return goodMoves.length > 0 && Math.random() > 0.3
      ? goodMoves[Math.floor(Math.random() * goodMoves.length)]
      : possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  }
}

const isPlayerTurn = (game: Chess, playerColor: "white" | "black") => {
  const currentTurn = game.turn()
  return (playerColor === "white" && currentTurn === "w") || 
         (playerColor === "black" && currentTurn === "b")
}

const getLegalMovesForSquare = (game: Chess, square: Square) => {
  const moves = game.moves({ square, verbose: true })
  return {
    moves: moves.map(move => move.to),
    highlights: {
      [square]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      ...moves.reduce((acc, move) => ({
        ...acc,
        [move.to]: {
          background: "radial-gradient(circle, rgba(0, 123, 255, 0.8) 25%, transparent 25%)"
        }
      }), {})
    }
  }
}

export default function GamePage() {
  const searchParams = useSearchParams()
  const [game, setGame] = useState<Chess>(new Chess())
  const [fen, setFen] = useState(new Chess().fen())
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white")
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [legalMoves, setLegalMoves] = useState<string[]>([])
  const [highlightSquares, setHighlightSquares] = useState({})
  const [isThinking, setIsThinking] = useState(false)
  const [playerRating, setPlayerRating] = useState(1500)
  const [accuracy, setAccuracy] = useState(85)
  const [currentEvaluation, setCurrentEvaluation] = useState(0.0)
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(false)
  const [gameResult, setGameResult] = useState<"checkmate" | "draw" | "">("")
  const [winner, setWinner] = useState<"white" | "black" | null>(null)

  const opponent = searchParams?.get("opponent") || "intermediate-bot"
  const style = searchParams?.get("style") || null
  const quick = searchParams?.get("quick") || null
  const difficulty = opponent.includes("beginner") ? "beginner" : 
                    opponent.includes("intermediate") ? "intermediate" : "advanced"

  // Initialize game
  useEffect(() => {
    const newGame = new Chess()
    setGame(newGame)
    setFen(newGame.fen())
    setMoveHistory([])
    setCurrentMoveIndex(-1)
    // If player is black, make first move as white
    if (playerColor === "black") {
      setTimeout(() => makeAIMove(newGame), 500)
    }
  }, [playerColor, opponent])

  const goToMove = (index: number) => {
    const newGame = new Chess()
    const moves = moveHistory // Use moveHistory instead of game.history()
    
    // Play all moves up to the target index
    for (let i = 0; i <= index; i++) {
      try {
        // Try to make the move, handle any errors gracefully
        const result = newGame.move(moves[i])
        if (!result) {
          console.error(`Invalid move at index ${i}: ${moves[i]}`)
          break
        }
      } catch (error) {
        console.error(`Error making move at index ${i}: ${moves[i]}`, error)
        break
      }
    }
    
    setFen(newGame.fen())
    setCurrentMoveIndex(index)
  }

  const goToPreviousMove = () => {
    if (currentMoveIndex > -1) {
      goToMove(currentMoveIndex - 1)
    }
  }

  const goToNextMove = () => {
    if (currentMoveIndex < moveHistory.length - 1) {
      goToMove(currentMoveIndex + 1)
    }
  }

  const handleGameOver = () => {
    // Create a fresh game instance to ensure we're checking the latest state
    const currentGame = new Chess(game.fen());
    
    console.log("Checking game state:", {
      isCheckmate: currentGame.isCheckmate(),
      isDraw: currentGame.isDraw(),
      turn: currentGame.turn(),
      fen: currentGame.fen()
    });

    if (currentGame.isCheckmate()) {
      console.log("Checkmate detected! Opening dialog...");
      setGameResult("checkmate");
      setWinner(currentGame.turn() === "w" ? "black" : "white");
      setIsGameOverDialogOpen(true);
      return true;
    } else if (currentGame.isDraw()) {
      console.log("Draw detected! Opening dialog...");
      setGameResult("draw");
      setIsGameOverDialogOpen(true);
      return true;
    }
    return false;
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setGameResult("");
    setIsGameOverDialogOpen(false);
    setAnalysis("");
    setHighlightSquares({});
    setSelectedSquare(null);
    if (playerColor === "black") {
      setTimeout(() => makeAIMove(newGame), 500);
    }
  };

  const makeAIMove = async (currentGame: Chess = game!) => {
    try {
      console.log("AI move starting, game state:", {
        isGameOver: currentGame.isGameOver(),
        turn: currentGame.turn()
      });

      if (currentGame.isGameOver()) {
        handleGameOver();
        return;
      }

      setIsThinking(true);
      const aiMove = generateAIMove(currentGame, difficulty);

      if (aiMove) {
        console.log("AI move generated:", aiMove);
        const gameCopy = new Chess(currentGame.fen());
        gameCopy.move(aiMove);
        
        // Update game state
        setGame(gameCopy);
        setFen(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        setCurrentMoveIndex(gameCopy.history().length - 1);

        // Check for checkmate using the updated game copy
        if (gameCopy.isCheckmate()) {
          console.log("Checkmate detected after AI move!");
          setGameResult("checkmate");
          setWinner(gameCopy.turn() === "w" ? "black" : "white");
          setIsGameOverDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Error in AI move:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const onSquareClick = (square: Square) => {
    // Don't allow moves if viewing history
    if (currentMoveIndex !== moveHistory.length - 1) return

    // Don't allow moves during AI's turn
    if (!isPlayerTurn(game, playerColor)) return

    if (selectedSquare === null) {
      const piece = game.get(square)
      if (piece && piece.color === game.turn()) {
        const { moves, highlights } = getLegalMovesForSquare(game, square)
        setSelectedSquare(square)
        setLegalMoves(moves)
        setHighlightSquares(highlights)
      }
    } else {
      if (legalMoves.includes(square)) {
        const move = {
          from: selectedSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity
        }
        const gameCopy = new Chess(game.fen())
        const result = gameCopy.move(move)
        if (result) {
          setGame(gameCopy)
          setFen(gameCopy.fen())
          setMoveHistory(gameCopy.history())
          setCurrentMoveIndex(gameCopy.history().length - 1)
          
          const isGameOver = handleGameOver()
          if (!isGameOver) {
            setTimeout(() => makeAIMove(gameCopy), 300)
          }
        }
      }
      setSelectedSquare(null)
      setLegalMoves([])
      setHighlightSquares({})
    }
  }

  const onPieceDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (currentMoveIndex !== moveHistory.length - 1) return false;
    if (!isPlayerTurn(game, playerColor)) return false;

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    };

    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        console.log("Move made, updating game state...");
        
        // Update game state
        setGame(gameCopy);
        setFen(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        setCurrentMoveIndex(gameCopy.history().length - 1);

        // Check for checkmate using the updated game copy
        if (gameCopy.isCheckmate()) {
          console.log("Checkmate detected after player move!");
          setGameResult("checkmate");
          setWinner(gameCopy.turn() === "w" ? "black" : "white");
          setIsGameOverDialogOpen(true);
          return true;
        }

        if (!gameCopy.isGameOver()) {
          setTimeout(() => makeAIMove(gameCopy), 300);
        }
        return true;
      }
    } catch (error) {
      console.error("Error making move:", error);
    }
    return false;
  };

  const analyzePosition = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fen: game.fen() }),
      })

      const data = await response.json()
      setAnalysis(data.analysis || "Analysis not available")
    } catch (error) {
      console.error("Error analyzing position:", error)
      setAnalysis("Error analyzing position")
    } finally {
      setLoading(false)
    }
  }

  const flipBoard = () => {
    setPlayerColor(playerColor === "white" ? "black" : "white")
  }

  const gameStatus = () => {
    if (game.isCheckmate()) return "Checkmate!"
    if (game.isDraw()) return "Draw!"
    if (game.isCheck()) return "Check!"
    return isPlayerTurn(game, playerColor) ? "Your turn" : "AI is thinking..."
  }

  const getOpponentName = () => {
    switch (difficulty) {
      case "beginner":
        return "Beginner Bot"
      case "intermediate":
        return "Intermediate Bot"
      case "advanced":
        return "Advanced Bot"
      default:
        return "AI Opponent"
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{getOpponentName()}</CardTitle>
                    <CardDescription>{gameStatus()}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Target className="w-4 h-4 mr-1" />
                      Rating: {playerRating}
                    </Badge>
                    <Badge variant="outline">
                      <Brain className="w-4 h-4 mr-1" />
                      Accuracy: {accuracy}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-square max-w-[600px] mx-auto"
                  >
                    <Chessboard
                      position={fen}
                      onSquareClick={onSquareClick}
                      onPieceDrop={onPieceDrop}
                      boardOrientation={playerColor}
                      customSquareStyles={highlightSquares}
                      animationDuration={200}
                    />
                  </motion.div>
                  {isThinking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="mr-2 h-4 w-4" /> New Game
              </Button>
              <Button onClick={flipBoard} variant="outline" size="sm">
                Flip Board
              </Button>
              <Button onClick={goToPreviousMove} disabled={currentMoveIndex === -1} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={goToNextMove} disabled={currentMoveIndex >= moveHistory.length - 1} variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button onClick={analyzePosition} disabled={loading} size="sm">
                <Brain className="mr-2 h-4 w-4" /> Analyze Position
              </Button>
            </div>
          </div>

          <div>
            <Tabs defaultValue="moves">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="moves">
                  <Zap className="mr-2 h-4 w-4" /> Moves
                </TabsTrigger>
                <TabsTrigger value="analysis">
                  <Brain className="mr-2 h-4 w-4" /> Analysis
                </TabsTrigger>
              </TabsList>
              <TabsContent value="moves">
                <Card>
                  <CardHeader>
                    <CardTitle>Move History</CardTitle>
                    <CardDescription>Click on a move to view the position</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {moveHistory.map((move, index) => (
                        <Button
                          key={index}
                          variant={index === currentMoveIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToMove(index)}
                        >
                          {index % 2 === 0 ? `${Math.floor(index / 2) + 1}.` : ""} {move}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Position Analysis</CardTitle>
                    <CardDescription>AI evaluation of the current position</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : analysis ? (
                      <p className="text-sm">{analysis}</p>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">Click "Analyze Position" to get AI insights</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Game Stats</CardTitle>
                <CardDescription>Current game performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Evaluation</span>
                    <span className="text-sm text-muted-foreground">
                      {currentEvaluation > 0 ? "+" : ""}{currentEvaluation.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={50 + (currentEvaluation * 5)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Accuracy</span>
                    <span className="text-sm text-muted-foreground">{accuracy}%</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <GameOverDialog
          isOpen={isGameOverDialogOpen}
          onClose={resetGame}
          onRematch={resetGame}
          onNewGame={resetGame}
          result={gameResult}
          playerColor={playerColor}
          winner={winner}
          playerRating={playerRating}
          accuracy={accuracy}
          opponent={getOpponentName()}
        />
      </div>
    </div>
  )
}
