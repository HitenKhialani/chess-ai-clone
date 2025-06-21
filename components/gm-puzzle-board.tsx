import { useState, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, Square } from 'chess.js'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface GMPuzzleBoardProps {
  fen: string
  solutionMoves: string[]
  onSuccess: () => void
  onFail: () => void
  puzzleIndex: number
  totalPuzzles: number
}

export function GMPuzzleBoard({ fen, solutionMoves, onSuccess, onFail, puzzleIndex, totalPuzzles }: GMPuzzleBoardProps) {
  const safeFen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const safeMoves = Array.isArray(solutionMoves) ? solutionMoves : [];
  // Determine if the first move in the solution is White's move
  const initialTurn = safeFen.split(' ')[1] === 'w';
  const initialMoveIndex = 0;
  const [game, setGame] = useState(new Chess(safeFen))
  const [moveIndex, setMoveIndex] = useState(initialMoveIndex)
  const [userTurn, setUserTurn] = useState(initialTurn)
  const [completed, setCompleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [solutionText, setSolutionText] = useState('')
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null)
  const [loading, setLoading] = useState(false)
  const [fullSolution, setFullSolution] = useState<string[]>([])

  console.log('GMPuzzleBoard FEN:', safeFen, 'solutionMoves:', safeMoves);

  // Reset puzzle
  const resetPuzzle = useCallback(() => {
    setGame(new Chess(safeFen))
    setMoveIndex(initialMoveIndex)
    setUserTurn(initialTurn)
    setCompleted(false)
    setFailed(false)
    setShowSolution(false)
    setSolutionText('')
    setSelectedPiece(null)
  }, [safeFen, initialMoveIndex, initialTurn])

  // Helper to make the bot's move(s) if it's Black's turn
  const makeBotMoves = useCallback((currentGame: Chess, currentMoveIndex: number) => {
    let g = new Chess(currentGame.fen());
    let idx = currentMoveIndex;
    let turn = g.turn();
    let madeMove = false;
    while (idx < safeMoves.length && turn === 'b') {
      const move = g.move(safeMoves[idx]);
      if (!move) break;
      idx++;
      turn = g.turn();
      madeMove = true;
    }
    return { g, idx, madeMove };
  }, [safeMoves]);

  // Handle user move
  const onDrop = useCallback((source: Square, target: Square) => {
    if (!userTurn || completed || failed) return false
    const piece = game.get(source);
    let moveObj: any = { from: source, to: target };
    if (piece && piece.type === 'p' && ((piece.color === 'w' && target[1] === '8') || (piece.color === 'b' && target[1] === '1'))) {
      moveObj.promotion = 'q';
    }
    const move = game.move(moveObj);
    if (!move) return false
    // Normalize moves to ignore trailing + and #
    const normalize = (m: string) => m.replace(/[+#]/g, '');
    const expectedMove = safeMoves[moveIndex]
    if (normalize(move.san) !== normalize(expectedMove)) {
      setFailed(true)
      toast.error('Incorrect move. Try again!')
      setTimeout(() => {
        setFailed(false)
        resetPuzzle()
        onFail()
      }, 1200)
      return false
    }
    let newGame = new Chess(game.fen());
    let newMoveIndex = moveIndex + 1;
    let newUserTurn = !userTurn;
    // Auto-play Black's move(s) if next in solution
    while (newMoveIndex < safeMoves.length && newGame.turn() === 'b') {
      const autoMove = newGame.move(safeMoves[newMoveIndex]);
      if (!autoMove) break;
      newMoveIndex++;
      newUserTurn = newGame.turn() === 'w';
    }
    setGame(newGame);
    setMoveIndex(newMoveIndex);
    setUserTurn(newUserTurn);
    // If puzzle is solved
    if (newMoveIndex === safeMoves.length) {
      setCompleted(true)
      toast.success('Puzzle solved successfully!')
      setTimeout(() => onSuccess(), 1200)
      return true
    }
    return true
  }, [userTurn, completed, failed, game, moveIndex, safeMoves, resetPuzzle, onFail, onSuccess])

  // Show solution handler
  const handleShowSolution = async () => {
    setShowSolution(true)
    if (safeMoves.length > 0) {
      setSolutionText(safeMoves.join(' '))
      toast.info('Solution: ' + safeMoves.join(' '), { duration: 6000 })
    } else {
      // Fetch Stockfish solution from backend
      setLoading(true)
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/stockfish/solution?fen=${encodeURIComponent(safeFen)}&moves=5`)
        if (res.ok) {
          const data = await res.json()
          setFullSolution(data.solution)
          setSolutionText(data.solution.join(' '))
          toast.info('Stockfish Solution: ' + data.solution.join(' '), { duration: 6000 })
        } else {
          setSolutionText('No solution found.')
          toast.error('No solution found.')
        }
      } catch (err) {
        setSolutionText('Error fetching solution.')
        toast.error('Error fetching solution.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4 w-full max-w-[480px] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Puzzle {puzzleIndex + 1} of {totalPuzzles}</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={resetPuzzle} variant="outline">Reset</Button>
          <Button size="sm" onClick={handleShowSolution} variant="secondary">Show Solution</Button>
        </div>
      </div>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardWidth={400}
        arePiecesDraggable={!completed && !failed && userTurn}
        boardOrientation="white"
        customDarkSquareStyle={{ backgroundColor: 'var(--board-dark)' }}
        customLightSquareStyle={{ backgroundColor: 'var(--board-light)' }}
        customBoardStyle={{ borderRadius: 12, boxShadow: '0 2px 16px #0002' }}
      />
      <div className="flex flex-col items-center mt-2">
        {completed && (
          <div className="text-green-600 font-semibold text-lg">Puzzle solved! Loading next...</div>
        )}
        {failed && (
          <div className="text-red-500 font-semibold text-lg">Incorrect move. Try again!</div>
        )}
        {!completed && !failed && !showSolution && (
          <div className="text-blue-700 font-medium">Your move as White. Finish the game in 5 moves!</div>
        )}
        {showSolution && (
          <div className="text-white font-medium">
            Solution:
            <ol className="list-decimal ml-6 mt-1">
              {safeMoves.map((move, idx) => (
                <li key={idx}>{move}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
} 