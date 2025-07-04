"use client"

import { useState, useEffect, useCallback } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Brain, ChevronRight, RotateCcw, Zap, ChevronLeft } from "lucide-react"
import { updateDrawHistory, checkDrawCondition } from './drawLogic'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type BoardOrientation = "white" | "black"

export default function ChessTrainer() {
  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState("")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [analysis, setAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [orientation, setOrientation] = useState<BoardOrientation>("white")
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [drawState, setDrawState] = useState({})
  const [drawInfo, setDrawInfo] = useState<{ isDraw: boolean, reason: string }>({ isDraw: false, reason: '' })
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string, to: string, color: string } | null>(null)
  const [promotionPiece, setPromotionPiece] = useState<string | null>(null)

  useEffect(() => {
    setFen(game.fen())
    setMoveHistory(game.history())
    setCurrentMoveIndex(game.history().length - 1)
  }, [game])

  const makeMove = useCallback(
    (move: any) => {
      try {
        const result = new Chess(fen)
        const moveResult = result.move(move)

        if (moveResult) {
          setGame(result)
          // Update draw state and check for draw
          const newDrawState = { ...drawState };
          updateDrawHistory(result, newDrawState);
          setDrawState(newDrawState);
          const draw = checkDrawCondition(result, newDrawState);
          setDrawInfo(draw);
          return true
        }
      } catch (e) {
        return false
      }
      return false
    },
    [fen, drawState],
  )

  const goToMove = (index: number) => {
    const newGame = new Chess()
    const moves = game.history()
    
    // Play all moves up to the target index
    for (let i = 0; i <= index; i++) {
      newGame.move(moves[i])
    }
    
    setFen(newGame.fen())
    setCurrentMoveIndex(index)
    // Update draw state and check for draw
    const newDrawState = { ...drawState };
    updateDrawHistory(newGame, newDrawState);
    setDrawState(newDrawState);
    const draw = checkDrawCondition(newGame, newDrawState);
    setDrawInfo(draw);
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

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (drawInfo.isDraw || pendingPromotion) return false;
    // Detect if this is a pawn move to last rank
    const moveObj = { from: sourceSquare, to: targetSquare };
    const moves = game.moves({ verbose: true });
    const promotionMove = moves.find(m => m.from === sourceSquare && m.to === targetSquare && m.promotion);
    if (promotionMove) {
      setPendingPromotion({ from: sourceSquare, to: targetSquare, color: game.turn() });
      return false;
    }
    // Normal move
    const move = makeMove({ ...moveObj, promotion: "q" });
    if (!move) return false;
    setTimeout(() => { makeAIMove(); }, 300);
    return true;
  }

  const makeAIMove = async () => {
    if (game.isGameOver() || game.isDraw() || drawInfo.isDraw) return

    setLoading(true)
    try {
      const response = await fetch("/api/suggest-move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fen: game.fen() }),
      })

      const data = await response.json()

      if (data.move) {
        makeMove(data.move)
      }
    } catch (error) {
      console.error("Error getting AI move:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const resetGame = () => {
    setGame(new Chess())
    setAnalysis("")
    setCurrentMoveIndex(-1)
  }

  const flipBoard = () => {
    setOrientation(orientation === "white" ? "black" : "white")
  }

  const gameStatus = () => {
    if (drawInfo.isDraw) return `Draw! (${drawInfo.reason})`;
    if (game.isCheckmate()) return "Checkmate!"
    if (game.isDraw()) return "Draw!"
    if (game.isCheck()) return "Check!"
    return game.turn() === "w" ? "White to move" : "Black to move"
  }

  // Finalize promotion after user selects piece
  const handlePromotion = (piece: string) => {
    if (!pendingPromotion) return;
    const move = makeMove({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: piece,
    });
    setPendingPromotion(null);
    setPromotionPiece(null);
    if (move) setTimeout(() => { makeAIMove(); }, 300);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Chess Board</CardTitle>
            <CardDescription>{gameStatus()}</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[600px] mx-auto"
            >
              <Chessboard position={fen} onPieceDrop={onDrop} boardOrientation={orientation} animationDuration={200} />
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 justify-center">
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
          </CardFooter>
        </Card>
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
      </div>

      {/* Draw modal/alert */}
      {drawInfo.isDraw && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-[#d4845c]">Game Drawn</h2>
            <p className="mb-4 text-lg">{drawInfo.reason}</p>
            <Button onClick={resetGame} variant="outline">Start New Game</Button>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      <Dialog open={!!pendingPromotion} onOpenChange={open => { if (!open) setPendingPromotion(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Promotion Piece</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center gap-4 my-4">
            {['q', 'r', 'b', 'n'].map(piece => (
              <button
                key={piece}
                className="flex flex-col items-center p-2 border rounded-lg hover:bg-gray-100 focus:bg-gray-200"
                onClick={() => handlePromotion(piece)}
                aria-label={`Promote to ${piece}`}
              >
                <span className="text-3xl">
                  {piece === 'q' ? '♕' : piece === 'r' ? '♖' : piece === 'b' ? '♗' : '♘'}
                </span>
                <span className="mt-1 text-xs font-semibold capitalize">{piece === 'q' ? 'Queen' : piece === 'r' ? 'Rook' : piece === 'b' ? 'Bishop' : 'Knight'}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
