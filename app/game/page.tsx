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
import { MoveHistory } from "@/components/move-history"
import { updateDrawHistory, checkDrawCondition, type DrawState } from "@/components/drawLogic"
import { BrillianceSummaryPopup } from '@/components/BrillianceSummaryPopup'

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



interface MoveHistoryEntry {
  moveNumber: number;
  userMove?: string;
  aiMove?: string;
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
  const [moveHistoryTable, setMoveHistoryTable] = useState<MoveHistoryEntry[]>([])
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
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string, to: string, color: string } | null>(null)
  const [drawReason, setDrawReason] = useState<string>("")
  const [drawState, setDrawState] = useState<DrawState>({})
  
  // Brilliance stats
  const [brillianceStats, setBrillianceStats] = useState<{
    brilliantMoves: number;
    correctMoves: number;
    mistakes: number;
    blunders: number;
  } | null>(null);
  const [isCalculatingStats, setIsCalculatingStats] = useState<boolean>(false);

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
    setMoveHistoryTable([])
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
    
    console.log("=== HANDLE GAME OVER CALLED ===");
    console.log("Checking game state:", {
      isCheckmate: currentGame.isCheckmate(),
      isDraw: currentGame.isDraw(),
      turn: currentGame.turn(),
      fen: currentGame.fen(),
      isGameOver: currentGame.isGameOver()
    });
    console.log("Current game result:", gameResult);
    console.log("Current isGameOverDialogOpen:", isGameOverDialogOpen);

    if (currentGame.isCheckmate()) {
      console.log("Checkmate detected! Opening dialog...");
      setGameResult("checkmate");
      setWinner(currentGame.turn() === "w" ? "black" : "white");
      console.log("Setting isGameOverDialogOpen to true");
      setIsGameOverDialogOpen(true);
      console.log("Dialog should now be open");
      calculateBrillianceStats();
      return true;
    } else {
      // Use enhanced draw detection
      const drawCheck = checkDrawCondition(currentGame, drawState);
      if (drawCheck.isDraw) {
        console.log("Draw detected! Opening dialog...", drawCheck.reason);
        setGameResult("draw");
        setDrawReason(drawCheck.reason);
        setIsGameOverDialogOpen(true);
        calculateBrillianceStats();
        return true;
      }
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
    setDrawReason("");
    setDrawState({});
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
        console.log("Game is over, calling handleGameOver");
        handleGameOver();
        return;
      }

      setIsThinking(true);
      const aiMove = generateAIMove(currentGame, difficulty);

      if (aiMove) {
        console.log("AI move generated:", aiMove);
        const gameCopy = new Chess(currentGame.fen());
        gameCopy.move(aiMove);

        // Update draw state
        const newDrawState = { ...drawState };
        updateDrawHistory(gameCopy, newDrawState);
        setDrawState(newDrawState);

        // Update game state
        setGame(gameCopy);
        setFen(gameCopy.fen());
        const newHistory = gameCopy.history();
        setMoveHistory(newHistory);
        setCurrentMoveIndex(newHistory.length - 1);

        // Check for game over using the updated game copy
        if (gameCopy.isCheckmate()) {
          console.log("Checkmate detected after AI move!");
          setGameResult("checkmate");
          setWinner(gameCopy.turn() === "w" ? "black" : "white");
          console.log("Setting isGameOverDialogOpen to true after AI move");
          setIsGameOverDialogOpen(true);
          console.log("Dialog should now be open after AI move");
          calculateBrillianceStats();
        } else {
          const drawCheck = checkDrawCondition(gameCopy, newDrawState);
          if (drawCheck.isDraw) {
            console.log("Draw detected after AI move!", drawCheck.reason);
            setGameResult("draw");
            setDrawReason(drawCheck.reason);
            setIsGameOverDialogOpen(true);
          }
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
        // Check if this is a pawn promotion move
        const piece = game.get(selectedSquare);
        const isPromotion = piece && 
                           piece.type === 'p' && 
                           ((piece.color === 'w' && square[1] === '8') || 
                            (piece.color === 'b' && square[1] === '1'));
        
        if (isPromotion) {
          setPendingPromotion({ from: selectedSquare, to: square, color: game.turn() });
          setSelectedSquare(null)
          setLegalMoves([])
          setHighlightSquares({})
          return;
        }

        // Normal move (no promotion)
        const move = {
          from: selectedSquare,
          to: square
        }
        const gameCopy = new Chess(game.fen())
        const result = gameCopy.move(move)
        if (result) {
          setGame(gameCopy)
          setFen(gameCopy.fen())
          const newHistory = gameCopy.history();
          setMoveHistory(newHistory)
          setCurrentMoveIndex(newHistory.length - 1)

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

    // Check if this is a pawn promotion move
    const piece = game.get(sourceSquare);
    const isPromotion = piece && 
                       piece.type === 'p' && 
                       ((piece.color === 'w' && targetSquare[1] === '8') || 
                        (piece.color === 'b' && targetSquare[1] === '1'));
    
    if (isPromotion) {
      setPendingPromotion({ from: sourceSquare, to: targetSquare, color: game.turn() });
      return false;
    }

    // Normal move (no promotion)
    const move = {
      from: sourceSquare,
      to: targetSquare
    };

    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        console.log("Move made, updating game state...");

        // Update draw state
        const newDrawState = { ...drawState };
        updateDrawHistory(gameCopy, newDrawState);
        setDrawState(newDrawState);

        // Update game state
        setGame(gameCopy);
        setFen(gameCopy.fen());
        const newHistory = gameCopy.history();
        setMoveHistory(newHistory);
        setCurrentMoveIndex(newHistory.length - 1);

        // Check for game over using the updated game copy
        if (gameCopy.isCheckmate()) {
          console.log("Checkmate detected after player move!");
          setGameResult("checkmate");
          setWinner(gameCopy.turn() === "w" ? "black" : "white");
          console.log("Setting isGameOverDialogOpen to true after player move");
          setIsGameOverDialogOpen(true);
          console.log("Dialog should now be open after player move");
          return true;
        } else {
          const drawCheck = checkDrawCondition(gameCopy, newDrawState);
          if (drawCheck.isDraw) {
            console.log("Draw detected after player move!", drawCheck.reason);
            setGameResult("draw");
            setDrawReason(drawCheck.reason);
            setIsGameOverDialogOpen(true);
            return true;
          }
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

  const calculateBrillianceStats = async () => {
    setIsCalculatingStats(true);
    try {
      if (moveHistory.length === 0) {
        setIsCalculatingStats(false);
        return;
      }
      
      // For now, we'll use simple heuristics since we don't have the full analysis
      // In a real implementation, you'd want to analyze the moves with Stockfish
      const totalMoves = moveHistory.length;
      const brilliantMoves = Math.floor(Math.random() * 3) + 1; // Random for demo
      const correctMoves = Math.floor(totalMoves * 0.7); // 70% correct
      const mistakes = Math.floor(totalMoves * 0.2); // 20% mistakes
      const blunders = Math.floor(totalMoves * 0.1); // 10% blunders
      
      setBrillianceStats({
        brilliantMoves,
        correctMoves,
        mistakes,
        blunders,
      });
    } catch (error) {
      console.error('Error calculating brilliance stats:', error);
    } finally {
      setIsCalculatingStats(false);
    }
  };

  const flipBoard = () => {
    setPlayerColor(playerColor === "white" ? "black" : "white")
  }

  // Handle promotion selection
  const handlePromotion = (piece: string) => {
    if (!pendingPromotion) return;
    
    const move = {
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: piece,
    };

    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        // Update draw state
        const newDrawState = { ...drawState };
        updateDrawHistory(gameCopy, newDrawState);
        setDrawState(newDrawState);

        setGame(gameCopy);
        setFen(gameCopy.fen());
        const newHistory = gameCopy.history();
        setMoveHistory(newHistory);
        setCurrentMoveIndex(newHistory.length - 1);

        // Check for game over
        if (gameCopy.isCheckmate()) {
          setGameResult("checkmate");
          setWinner(gameCopy.turn() === "w" ? "black" : "white");
          setIsGameOverDialogOpen(true);
        } else {
          const drawCheck = checkDrawCondition(gameCopy, newDrawState);
          if (drawCheck.isDraw) {
            setGameResult("draw");
            setDrawReason(drawCheck.reason);
            setIsGameOverDialogOpen(true);
          } else if (!gameCopy.isGameOver()) {
            setTimeout(() => makeAIMove(gameCopy), 300);
          }
        }
      }
    } catch (error) {
      console.error("Error making promotion move:", error);
    }

    setPendingPromotion(null);
  };

  const gameStatus = () => {
    if (game.isCheckmate()) return "Checkmate!"
    if (game.isDraw()) {
      const drawCheck = checkDrawCondition(game, drawState);
      if (drawCheck.isDraw) {
        return `Draw by ${drawCheck.reason}!`;
      }
      return "Draw!";
    }
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--card-foreground)] p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="p-3 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg md:text-xl">{getOpponentName()}</CardTitle>
                    <CardDescription className="text-sm">{gameStatus()}</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Rating: {playerRating}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      Accuracy: {accuracy}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2 md:p-6">
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-square max-w-full md:max-w-[600px] mx-auto"
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
                      <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-1 md:gap-2 justify-center mt-3 md:mt-4">
              <Button onClick={resetGame} variant="outline" size="sm" className="text-xs">
                <RotateCcw className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> 
                <span className="hidden sm:inline">New Game</span>
                <span className="sm:hidden">New</span>
              </Button>
              <Button onClick={flipBoard} variant="outline" size="sm" className="text-xs">
                <span className="hidden sm:inline">Flip Board</span>
                <span className="sm:hidden">Flip</span>
              </Button>
              <Button onClick={goToPreviousMove} disabled={currentMoveIndex === -1} variant="outline" size="sm">
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button onClick={goToNextMove} disabled={currentMoveIndex >= moveHistory.length - 1} variant="outline" size="sm">
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button onClick={analyzePosition} disabled={loading} size="sm" className="text-xs">
                <Brain className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> 
                <span className="hidden sm:inline">Analyze</span>
                <span className="sm:hidden">Analyze</span>
              </Button>
            </div>
          </div>

          <div className="order-first lg:order-last">
            <Tabs defaultValue="moves">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="moves" className="text-xs">
                  <Zap className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Moves
                </TabsTrigger>
                <TabsTrigger value="analysis" className="text-xs">
                  <Brain className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Analysis
                </TabsTrigger>
              </TabsList>
              <TabsContent value="moves">
                <MoveHistory moves={moveHistoryTable} />
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

        <BrillianceSummaryPopup
          open={isGameOverDialogOpen}
          onOpenChange={setIsGameOverDialogOpen}
          isCalculating={isCalculatingStats}
          brillianceStats={brillianceStats}
          winner={winner}
          lastGameResult={winner === playerColor ? 'white' : winner === null ? null : 'black'}
          drawReason={drawReason}
          opponentName={getOpponentName()}
          onAnalyzeGame={() => {
            setIsGameOverDialogOpen(false);
            const gameResult = gameResult === 'checkmate' ? (winner === playerColor ? 'white' : 'black') : 'draw';
            window.open(`/review?moves=${encodeURIComponent(JSON.stringify(moveHistory))}&result=${gameResult}`, '_blank');
          }}
          onPlayAgain={resetGame}
        />

        {/* Enhanced Promotion Dialog */}
        <Dialog open={!!pendingPromotion} onOpenChange={(open) => { if (!open) setPendingPromotion(null); }}>
          <DialogContent className="max-w-lg w-full rounded-2xl p-8 bg-[var(--card)] border border-[var(--border)] text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2 text-[var(--primary-text)]">
                🏆 Choose Your Promotion Piece
              </DialogTitle>
              <DialogDescription className="text-lg mb-6 text-[var(--accent)]">
                Your pawn has reached the end! Select which piece to promote to:
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-3 my-6">
              {[
                { piece: 'q', name: 'Queen', icon: '♛', desc: 'Most powerful' },
                { piece: 'r', name: 'Rook', icon: '♜', desc: 'Castle power' },
                { piece: 'b', name: 'Bishop', icon: '♝', desc: 'Diagonal master' },
                { piece: 'n', name: 'Knight', icon: '♞', desc: 'L-shaped jumper' }
              ].map(({ piece, name, icon, desc }) => (
                <button
                  key={piece}
                  className={`group relative flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    piece === 'q' ? 'bg-[var(--accent)] hover:bg-[var(--accent)] hover:opacity-80 border-purple-500 hover:border-purple-400' :
                    piece === 'r' ? 'bg-[var(--primary)] hover:bg-[var(--primary)] border-[var(--primary)] hover:border-blue-400' :
                    piece === 'b' ? 'bg-[var(--accent)] hover:bg-[var(--accent)] hover:opacity-80 border-green-500 hover:border-green-400' :
                    'bg-[var(--primary)] hover:bg-[var(--primary)] hover:opacity-80 border-orange-500 hover:border-orange-400'
                  }`}
                  onClick={() => handlePromotion(piece)}
                  aria-label={`Promote to ${name}`}
                >
                  <span className="text-5xl mb-2 text-[var(--card-foreground)] group-hover:scale-110 transition-transform duration-200">
                    {icon}
                  </span>
                  <span className="text-sm font-bold text-[var(--card-foreground)] mb-1">
                    {name}
                  </span>
                  <span className="text-xs text-[var(--card-foreground)]/80">
                    {desc}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-[var(--accent)]/10 rounded-lg border border-[var(--accent)]/20">
              <p className="text-sm text-[var(--accent)] font-medium">
                💡 <strong>Tip:</strong> Queen is usually the best choice, but sometimes other pieces can be more tactical!
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
