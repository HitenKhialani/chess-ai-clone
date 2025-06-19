import { useState, useCallback, useEffect, useMemo } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, Square } from 'chess.js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

interface PuzzleBoardProps {
  fen: string
  moves?: string[]
  onComplete: () => void
  onFail: () => void
}

export function PuzzleBoard({ fen, moves = [], onComplete, onFail }: PuzzleBoardProps) {
  const [game, setGame] = useState(new Chess(fen))
  const [moveIndex, setMoveIndex] = useState(0)
  const [userToMove, setUserToMove] = useState(true)
  const [showSolution, setShowSolution] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [boardWidth, setBoardWidth] = useState(600)
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null)

  // Ensure moves is always an array
  const safetyMoves = useMemo(() => Array.isArray(moves) ? moves : [], [moves])

  // Handle window resize for responsive board
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth
      let width

      if (containerWidth < 480) { // Mobile
        width = Math.min(320, containerWidth - 32) // Smaller on mobile
      } else if (containerWidth < 768) { // Tablet
        width = Math.min(400, containerWidth - 48)
      } else { // Desktop
        width = Math.min(480, containerWidth - 64)
      }
      
      setBoardWidth(width)
    }
    
    handleResize() // Initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset the puzzle
  const resetPuzzle = useCallback(() => {
    setGame(new Chess(fen))
    setMoveIndex(0)
    setUserToMove(true)
    setShowSolution(false)
    setCompleted(false)
    setSelectedPiece(null)
  }, [fen])

  // Custom styles for the dots on possible moves
  const customDotStyle = {
    background: 'radial-gradient(circle, rgba(0, 191, 207, 0.9) 25%, transparent 25%)',
    width: '25%',
    height: '25%',
    borderRadius: '50%',
    position: 'absolute',
    top: '37.5%',
    left: '37.5%',
  }

  // Handle piece selection
  const onSquareClick = useCallback((square: Square) => {
    if (!userToMove || completed) return

    const piece = game.get(square)
    
    if (selectedPiece === null) {
      // If no piece is selected and clicked square has a piece of correct color
      if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
        setSelectedPiece(square)
      }
    } else {
      // If a piece is already selected, try to make the move
      try {
        const move = game.move({
          from: selectedPiece,
          to: square,
          promotion: 'q', // Always promote to queen for simplicity
        })

        if (move === null) {
          // If the move is invalid but clicked on own piece, select that piece instead
          if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
            setSelectedPiece(square)
          } else {
            setSelectedPiece(null)
          }
          return
        }

        // Check if the move matches the expected move
        if (move.san === safetyMoves[moveIndex]) {
          setGame(new Chess(game.fen()))
          setMoveIndex(moveIndex + 1)
          setUserToMove(false)
          setSelectedPiece(null)

          // Make computer's move after a delay
          setTimeout(() => {
            if (moveIndex + 1 < safetyMoves.length) {
              const nextGame = new Chess(game.fen())
              nextGame.move(safetyMoves[moveIndex + 1])
              setGame(nextGame)
              setMoveIndex(moveIndex + 2)
              setUserToMove(true)
            } else {
              setCompleted(true)
              onComplete()
              toast.success('Puzzle completed successfully!')
            }
          }, 500)
        } else {
          onFail()
          toast.error('Incorrect move. Try again!')
          setTimeout(resetPuzzle, 500)
        }
      } catch (error) {
        setSelectedPiece(null)
      }
    }
  }, [game, moveIndex, safetyMoves, userToMove, completed, selectedPiece, onComplete, onFail, resetPuzzle])

  // Handle piece movement via drag and drop
  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square) => {
    if (!userToMove || completed) return false

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      })

      if (move === null) return false

      // Check if the move matches the expected move
      if (move.san === safetyMoves[moveIndex]) {
        setGame(new Chess(game.fen()))
        setMoveIndex(moveIndex + 1)
        setUserToMove(false)

        // Make computer's move after a delay
        setTimeout(() => {
          if (moveIndex + 1 < safetyMoves.length) {
            const nextGame = new Chess(game.fen())
            nextGame.move(safetyMoves[moveIndex + 1])
            setGame(nextGame)
            setMoveIndex(moveIndex + 2)
            setUserToMove(true)
          } else {
            setCompleted(true)
            onComplete()
            toast.success('Puzzle completed successfully!')
          }
        }, 500)

        return true
      } else {
        onFail()
        toast.error('Incorrect move. Try again!')
        setTimeout(resetPuzzle, 500)
        return false
      }
    } catch (error) {
      return false
    }
  }, [game, moveIndex, safetyMoves, userToMove, completed, onComplete, onFail, resetPuzzle])

  return (
    <div className="space-y-4 w-full max-w-[480px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[#00BFCF] border-[#00BFCF] text-sm whitespace-nowrap">
            {userToMove ? "Your Move" : "Opponent's Move"}
          </Badge>
          {completed && (
            <Badge variant="outline" className="text-green-500 border-green-500 text-sm">
              Completed!
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-[#00BFCF] border-[#00BFCF]"
            onClick={resetPuzzle}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          {moves && moves.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-[#00BFCF] border-[#00BFCF]"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? "Hide Solution" : "Show Solution"}
            </Button>
          )}
        </div>
      </div>

      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: '#8B4513' }}
          customLightSquareStyle={{ backgroundColor: '#DEB887' }}
          customSquareStyles={{
            ...(selectedPiece && game.moves({ square: selectedPiece, verbose: true })
              .reduce((styles: any, move) => {
                styles[move.to] = {
                  background: 'radial-gradient(circle, rgba(0, 191, 207, 0.3) 25%, transparent 25%)',
                }
                return styles
              }, {}))
          }}
          boardOrientation={game.turn() === 'w' ? 'white' : 'black'}
        />
      </div>

      {showSolution && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h4 className="font-medium text-white mb-2">Solution:</h4>
          <div className="flex flex-wrap gap-2">
            {moves.map((move, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {index + 1}. {move}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 