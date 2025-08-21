import { useState, useCallback, useEffect, useRef } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, Square } from 'chess.js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  RotateCcw, 
  Eye, 
  Trophy, 
  Target,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

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
  const [boardWidth, setBoardWidth] = useState(320)
  const [timer, setTimer] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setBoardWidth(Math.min(containerWidth, 480));
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!completed && !failed && !showSolution) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [completed, failed, showSolution]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get valid moves for a piece
  const getValidMoves = (square: Square) => {
    const moves = game.moves({ square, verbose: true });
    return moves.map(move => move.to);
  };

  // Get custom square styles for highlighting
  const getCustomSquareStyles = () => {
    const styles: any = {};
    
    // Highlight selected piece
    if (selectedPiece) {
      styles[selectedPiece] = {
        backgroundColor: 'rgba(147, 51, 234, 0.4)',
        borderRadius: '4px'
      };
      
      // Highlight valid moves with solid blue circles
      const validMoves = getValidMoves(selectedPiece);
      validMoves.forEach(square => {
        styles[square] = {
          backgroundImage: 'radial-gradient(circle, rgba(34, 211, 238, 0.8) 0%, rgba(34, 211, 238, 0.8) 40%, transparent 40%)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      });
    }
    
    return styles;
  };

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
    setTimer(0)
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
    
    // Create a new game instance to avoid mutating the current state
    const newGame = new Chess(game.fen());
    
    const moveObj: any = { from: source, to: target };
    
    // Check if this is a pawn promotion move
    const piece = newGame.get(source);
    const isPromotion = piece && 
                       piece.type === 'p' && 
                       ((piece.color === 'w' && target[1] === '8') || 
                        (piece.color === 'b' && target[1] === '1'));
    if (isPromotion) {
      moveObj.promotion = 'q'; // Default to queen for puzzles
    }
    
    // Try to make the move
    const move = newGame.move(moveObj);
    if (!move) return false;
    
    // Normalize moves to ignore trailing + and #
    const normalize = (m: string) => m.replace(/[+#]/g, '');
    const expectedMove = safeMoves[moveIndex];
    
    if (!expectedMove || normalize(move.san) !== normalize(expectedMove)) {
      setFailed(true);
      toast.error('Incorrect move. Try again!');
      setTimeout(() => {
        resetPuzzle();
      }, 1500);
      return false;
    }
    
    // Update game state
    setGame(newGame);
    const newMoveIndex = moveIndex + 1;
    setMoveIndex(newMoveIndex);
    
    // Check if puzzle is solved after this move
    if (newMoveIndex >= safeMoves.length) {
      setCompleted(true);
      toast.success('Puzzle solved successfully!');
      setTimeout(() => onSuccess(), 1200);
      return true;
    }
    
    // If there are more moves in the solution, make the bot's move
    if (newMoveIndex < safeMoves.length) {
      const botMove = safeMoves[newMoveIndex];
      if (botMove) {
        const botGame = new Chess(newGame.fen());
        const botMoveResult = botGame.move(botMove);
        if (botMoveResult) {
          setGame(botGame);
          setMoveIndex(newMoveIndex + 1);
          setUserTurn(botGame.turn() === 'w');
          
          // Check if puzzle is solved after bot move
          if (newMoveIndex + 1 >= safeMoves.length) {
            setCompleted(true);
            toast.success('Puzzle solved successfully!');
            setTimeout(() => onSuccess(), 1200);
            return true;
          }
        }
      }
    }
    
    return true;
  }, [userTurn, completed, failed, game, moveIndex, safeMoves, resetPuzzle, onSuccess])

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
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="glass-effect rounded-xl p-6 mb-6 border border-[var(--border)]/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Progress and Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20">
              <Target className="w-5 h-5 text-[#00F5D4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--card-foreground)]">Puzzle {puzzleIndex + 1} of {totalPuzzles}</h2>
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timer)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-sm text-[var(--muted-foreground)] mb-2">
              <span>Progress</span>
              <span>{Math.round(((puzzleIndex + 1) / totalPuzzles) * 100)}%</span>
            </div>
            <div className="w-full bg-[var(--secondary)]/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#00F5D4] to-[#57CC99] h-2 rounded-full transition-all duration-500"
                style={{ width: `${((puzzleIndex + 1) / totalPuzzles) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={resetPuzzle} 
              variant="outline" 
              className="glass-effect border-[var(--border)]/20 hover:border-[#00F5D4]/50 hover:bg-[#00F5D4]/10 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleShowSolution} 
              className="bg-gradient-to-r from-[#00F5D4] to-[#57CC99] hover:from-[#00F5D4]/90 hover:to-[#57CC99]/90 transition-all duration-300 shadow-lg hover:shadow-[#00F5D4]/25"
            >
              <Eye className="w-4 h-4 mr-2" />
              Show Solution
            </Button>
          </div>
        </div>
      </div>

      {/* Chess Board Section */}
      <div className="glass-effect rounded-xl p-6 border border-[var(--border)]/10 mb-6">
        <div className="flex justify-center">
          <div className="relative">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={boardWidth}
              arePiecesDraggable={!completed && !failed && userTurn}
              boardOrientation="white"
              customDarkSquareStyle={{ 
                backgroundColor: 'var(--board-dark)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
              customLightSquareStyle={{ 
                backgroundColor: 'var(--board-light)',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
              }}
              customBoardStyle={{ 
                borderRadius: '12px', 
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                overflow: 'hidden'
              }}
              onSquareClick={(square) => {
                // Optional: Add click handling for better UX
                if (selectedPiece) {
                  // If a piece is selected, try to move it
                  onDrop(selectedPiece, square);
                  setSelectedPiece(null);
                } else {
                  // Select the piece if it's the user's turn
                  const piece = game.get(square);
                  if (piece && piece.color === (game.turn() === 'w' ? 'w' : 'b') && userTurn) {
                    setSelectedPiece(square);
                  }
                }
              }}
              customSquareStyles={getCustomSquareStyles()}
            />
            
            {/* Status Overlay */}
            {completed && (
              <div className="absolute inset-0 bg-[var(--accent)]/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="glass-effect rounded-lg p-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <div className="text-green-400 font-bold text-lg">Puzzle Solved!</div>
                  <div className="text-green-300 text-sm">Loading next puzzle...</div>
                </div>
              </div>
            )}
            
            {failed && (
              <div className="absolute inset-0 bg-[var(--destructive)]/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="glass-effect rounded-lg p-4 text-center">
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                  <div className="text-red-400 font-bold text-lg">Incorrect Move</div>
                  <div className="text-red-300 text-sm">Resetting puzzle...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status and Solution Section */}
      <div className="glass-effect rounded-xl p-6 border border-[var(--border)]/10">
        {!completed && !failed && !showSolution && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#00F5D4] animate-pulse"></div>
              <span className="text-[var(--card-foreground)] font-medium">
                Your move as {game.turn() === 'w' ? 'White' : 'Black'}
              </span>
            </div>
            <p className="text-[var(--muted-foreground)] text-sm">
              Find the best move to solve this puzzle
            </p>
          </div>
        )}

        {showSolution && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20">
              <Trophy className="w-5 h-5 text-[#00F5D4]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--card-foreground)]">Solution</h3>
            </div>
            
            <div className="glass-effect rounded-lg p-4 border border-[#00F5D4]/20">
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const moves = safeMoves;
                  let notation = [];
                  for (let i = 0; i < moves.length; i += 2) {
                    const moveNum = Math.floor(i / 2) + 1;
                    const whiteMove = moves[i] || '';
                    const blackMove = moves[i + 1] || '';
                    notation.push(
                      <div key={i} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs bg-[#00F5D4]/20 border-[#00F5D4]/30 text-[#00F5D4]">
                          {moveNum}
                        </Badge>
                        <span className="text-purple-300 font-mono font-semibold">{whiteMove}</span>
                        {blackMove && (
                          <>
                            <span className="text-[var(--muted-foreground)]">...</span>
                            <span className="text-purple-300 font-mono font-semibold">{blackMove}</span>
                          </>
                        )}
                      </div>
                    );
                  }
                  return notation;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 