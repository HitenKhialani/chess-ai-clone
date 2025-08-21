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
  moveExplanations?: string[]
  onComplete: () => void
  onFail: () => void
}

export function PuzzleBoard({ fen, moves = [], moveExplanations = [], onComplete, onFail }: PuzzleBoardProps) {
  const [game, setGame] = useState(new Chess(fen))
  const [moveIndex, setMoveIndex] = useState(0)
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(0)
  const [userToMove, setUserToMove] = useState(true)
  const [showingSolution, setShowingSolution] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [boardWidth, setBoardWidth] = useState(600)
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null)

  // Ensure moves is always an array
  const safetyMoves = useMemo(() => Array.isArray(moves) ? moves : [], [moves])

  // Determine which color is to move from the FEN
  const initialTurn = useMemo(() => (fen.split(' ')[1] === 'w' ? 'w' : 'b'), [fen]);
  const [boardOrientation] = useState<'white' | 'black'>(initialTurn === 'w' ? 'white' : 'black');

  // Helper: is it user's turn?
  const isUserTurn = useMemo(() => {
    if (initialTurn === 'w') return moveIndex % 2 === 0;
    return moveIndex % 2 === 1;
  }, [moveIndex, initialTurn]);

  // Responsive board
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth
      let width
      if (containerWidth < 480) {
        width = Math.min(320, containerWidth - 32)
      } else if (containerWidth < 768) {
        width = Math.min(400, containerWidth - 48)
      } else {
        width = Math.min(480, containerWidth - 64)
      }
      setBoardWidth(width)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset the puzzle to the start of a chess game (not the opening FEN)
  const resetPuzzle = useCallback(() => {
    setGame(new Chess()) // always reset to standard chess start
    setMoveIndex(0)
    setUserToMove(true)
    setCompleted(false)
    setSelectedPiece(null)
    setShowingSolution(false)
  }, [])

  // Animate solution (always from the start of a chess game)
  const animateSolution = useCallback(async () => {
    setShowingSolution(true)
    const solutionGame = new Chess()
    setGame(new Chess())
    setMoveIndex(0)
    setUserToMove(true)
    for (let i = 0; i < safetyMoves.length; i++) {
      await new Promise(res => setTimeout(res, 600))
      solutionGame.move(safetyMoves[i])
      setGame(new Chess(solutionGame.fen()))
      setMoveIndex(i + 1)
    }
    setCompleted(true)
    setShowingSolution(false)
  }, [safetyMoves])

  // Helper to get FEN after N moves (always from standard position)
  const getFenAfterMoves = useCallback((movesArr: string[], idx: number) => {
    const chess = new Chess(); // Always start from standard position
    for (let i = 0; i <= idx; i++) {
      chess.move(movesArr[i]);
    }
    return chess.fen();
  }, []);

  // Handle piece selection
  const onSquareClick = useCallback((square: Square) => {
    if (!isUserTurn || completed || showingSolution) return
    const piece = game.get(square)
    if (selectedPiece === null) {
      if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
        setSelectedPiece(square)
      }
    } else {
      try {
        const moveObj: any = { from: selectedPiece, to: square };
        // Check if this is a pawn promotion move
        const piece = game.get(selectedPiece as any);
        const isPromotion = piece && 
                           piece.type === 'p' && 
                           ((piece.color === 'w' && square[1] === '8') || 
                            (piece.color === 'b' && square[1] === '1'));
        if (isPromotion) {
          moveObj.promotion = 'q'; // Default to queen for puzzles
        }
        const move = game.move(moveObj)
        if (move === null) {
          if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b')) {
            setSelectedPiece(square)
          } else {
            setSelectedPiece(null)
          }
          return
        }
        if (move.san === safetyMoves[moveIndex]) {
          setGame(new Chess(game.fen()))
          setMoveIndex(moveIndex + 1)
          setUserToMove(false)
          setSelectedPiece(null)
          setTimeout(() => {
            if (moveIndex + 1 < safetyMoves.length) {
              const nextGame = new Chess(game.fen())
              nextGame.move(safetyMoves[moveIndex + 1])
              setGame(nextGame)
              setMoveIndex(moveIndex + 2)
              setUserToMove(true)
            } else {
              setCompleted(true)
              toast.success('Puzzle completed successfully!')
              onComplete()
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
  }, [game, moveIndex, safetyMoves, isUserTurn, completed, selectedPiece, onComplete, onFail, resetPuzzle, showingSolution])

  // Handle piece movement via drag and drop
  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square) => {
    if (!isUserTurn || completed || showingSolution) return false
    try {
      const moveObj: any = { from: sourceSquare, to: targetSquare };
      // Check if this is a pawn promotion move
      const piece = game.get(sourceSquare as any);
      const isPromotion = piece && 
                         piece.type === 'p' && 
                         ((piece.color === 'w' && targetSquare[1] === '8') || 
                          (piece.color === 'b' && targetSquare[1] === '1'));
      if (isPromotion) {
        moveObj.promotion = 'q'; // Default to queen for puzzles
      }
      const move = game.move(moveObj)
      if (move === null) return false
      if (move.san === safetyMoves[moveIndex]) {
        setGame(new Chess(game.fen()))
        setMoveIndex(moveIndex + 1)
        setUserToMove(false)
        setTimeout(() => {
          if (moveIndex + 1 < safetyMoves.length) {
            const nextGame = new Chess(game.fen())
            nextGame.move(safetyMoves[moveIndex + 1])
            setGame(nextGame)
            setMoveIndex(moveIndex + 2)
            setUserToMove(true)
          } else {
            setCompleted(true)
            toast.success('Puzzle completed successfully!')
            onComplete()
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
  }, [game, moveIndex, safetyMoves, isUserTurn, completed, onComplete, onFail, resetPuzzle, showingSolution])

  // Sync selectedMoveIndex with moveIndex during review/animation
  useEffect(() => {
    setSelectedMoveIndex(moveIndex)
    // Animate board to current moveIndex
    if (moveIndex >= 0 && moveIndex < moves.length) {
      setGame(new Chess(getFenAfterMoves(moves, moveIndex)))
    } else if (moveIndex === 0) {
      setGame(new Chess())
    }
  }, [moveIndex, moves, getFenAfterMoves])

  // When a move is clicked, animate board to that move
  const handleMoveClick = (idx: number) => {
    setSelectedMoveIndex(idx);
    setGame(new Chess(getFenAfterMoves(moves, idx)));
  };

  return (
    <div className="space-y-4 w-full max-w-[480px] mx-auto puzzle-board-container" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2" style={{ fontSize: '1rem' }}>
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
          <Button size="sm" onClick={resetPuzzle} style={{ fontSize: '1rem' }}>
            Reset
          </Button>
          <Button size="sm" onClick={animateSolution} disabled={showingSolution} style={{ fontSize: '1rem' }}>
            {showingSolution ? "Reviewing..." : "Review Opening"}
          </Button>
        </div>
      </div>

      <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg puzzle-board-wrapper" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: 'var(--board-dark)' }}
          customLightSquareStyle={{ backgroundColor: 'var(--board-light)' }}
          customSquareStyles={{
            ...(selectedPiece && game.moves({ square: selectedPiece, verbose: true })
              .reduce((styles: any, move) => {
                styles[move.to] = {
                  background: 'radial-gradient(circle, rgba(0, 191, 207, 0.3) 25%, transparent 25%)',
                }
                return styles
              }, {}))
          }}
          boardOrientation={boardOrientation}
          arePiecesDraggable={!completed && !showingSolution}
          customBoardStyle={{ borderRadius: 12, boxShadow: '0 2px 16px #0002' }}
        />
      </div>

      {/* Clickable move notations */}
      {moves && moves.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2" style={{ fontSize: '1rem' }}>
          {moves.map((move, idx) => (
            <button
              key={idx}
              className={`px-2 py-1 rounded border text-sm font-mono transition-colors ${selectedMoveIndex === idx ? 'bg-[var(--card)]0 text-[var(--accent-foreground)] border-[var(--primary)]' : 'bg-gray-600 text-gray-200 border-gray-500 hover:bg-blue-400 hover:text-[var(--accent-foreground)]'}`}
              onClick={() => handleMoveClick(idx)}
              style={{ cursor: 'pointer', fontSize: '1rem' }}
            >
              {idx + 1}. {move}
            </button>
          ))}
        </div>
      )}

      {/* Move explanation section styled as in screenshot */}
      {moveExplanations && moveExplanations[selectedMoveIndex] && (
        <div className="mt-2 p-4 rounded border border-[var(--primary)] bg-blue-900/40 text-[var(--card-foreground)]" style={{ fontSize: '1rem' }}>
          <div className="font-semibold text-blue-300 mb-1">Last Move Explanation:</div>
          <div>
            <span className="font-bold">{`${selectedMoveIndex + 1}. ${moves[selectedMoveIndex]}:`}</span> {moveExplanations[selectedMoveIndex]}
          </div>
        </div>
      )}

      {showingSolution && (
        <div className="mt-4 p-4 bg-[var(--card)] rounded-lg" style={{ fontSize: '1rem' }}>
          <h4 className="font-medium text-[var(--card-foreground)] mb-2">Solution:</h4>
          <div className="text-[var(--card-foreground)] font-mono text-base">
            {safetyMoves.join(' ')}
          </div>
        </div>
      )}
    </div>
  )
}