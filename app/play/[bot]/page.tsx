'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2, Crown } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { MoveHistory } from '@/components/move-history';
import { StockfishWrapper } from '@/app/lib/stockfish';
import { BotMessagePanel, BotMessage, generateMessage } from '@/components/bot-message-panel';
import { Switch } from '@/components/ui/switch';
import { Volume2 } from 'lucide-react';

const Chessboard = dynamic(
  () => import('react-chessboard').then((m) => m.Chessboard),
  { ssr: false }
);

interface Move {
  moveNumber: number;
  userMove?: string;
  aiMove?: string;
  fen?: string;
}

// MovePair type for stack
interface MovePair {
  userMove: string;
  aiMove?: string;
}

const botSettings: Record<string, { depth: number; depthRange: string; eloRange: string; rating: number; accuracy: number; name: string; skill: number; description: string }> = {
  beginner: { depth: 2, depthRange: '1–2', eloRange: '400–800', rating: 600, accuracy: 85, name: 'Beginner Bot', skill: 0, description: "A gentle introduction to chess AI. Plays with limited depth and skill." },
  intermediate: { depth: 5, depthRange: '3–5', eloRange: '800–1600', rating: 1200, accuracy: 90, name: 'Intermediate Bot', skill: 5, description: "A balanced opponent for developing players. Offers a good challenge." },
  advanced: { depth: 8, depthRange: '6–8', eloRange: '1600–2300', rating: 2000, accuracy: 95, name: 'Advanced Bot', skill: 10, description: "A formidable opponent for experienced players. Plays with deeper analysis." },
  moreadvanced: { depth: 10, depthRange: '9–10', eloRange: '2300–3000', rating: 2650, accuracy: 98, name: 'More Advanced Bot', skill: 15, description: "A very strong opponent for advanced players. Approaches master level." },
  master: { depth: 12, depthRange: '11+', eloRange: '3000+', rating: 3200, accuracy: 99, name: 'Master Bot', skill: 20, description: "The ultimate challenge. Plays at grandmaster level." },
};

export default function BotPlayPage() {
  const params = useParams<{ bot: string }>();
  const bot = Array.isArray(params?.bot) ? params.bot[0] : params?.bot;

  if (!bot || !(bot in botSettings)) {
    notFound();
  }

  const { depth, depthRange, eloRange, rating, accuracy, name, skill, description } = botSettings[bot];

  const engineRef = useRef<Worker | null>(null);
  const [game, setGame] = useState(new Chess());
  const [isThinking, setIsThinking] = useState(false);
  const [evalScore, setEvalScore] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [showCheckmate, setShowCheckmate] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastGameResult, setLastGameResult] = useState<'white' | 'black' | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const stockfishRef = useRef<StockfishWrapper | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [moveCount, setMoveCount] = useState(0);
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [moveStack, setMoveStack] = useState<MovePair[]>([]); // Each entry is a pair of moves
  const [redoStack, setRedoStack] = useState<MovePair[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // New useEffect to manage game state based on moveStack
  useEffect(() => {
    console.log('moveStack updated, reconstructing game...', JSON.stringify(moveStack));
    const newGame = new Chess(getFenFromMoveStack(moveStack));
    setGame(newGame);
    updateMoveHistoryForDisplay(moveStack);

    // Trigger bot message after user move
    // If it's AI's turn and there are moves in the stack (not initial load)
    if (newGame.turn() === 'b' && moveStack.length > 0) {
      // Check if the last move in stack was a user move and AI hasn't responded yet
      const lastPair = moveStack[moveStack.length - 1];
      if (lastPair && lastPair.userMove && !lastPair.aiMove) {
        handleUserMove(newGame); // Generate bot message after user move
        // Trigger AI move if it's AI's turn and AI hasn't moved for the last pair
        setTimeout(() => {
          makeEngineMove(newGame.fen(), (aiMoveSan) => {
            if (aiMoveSan) { // Only update if AI move was successful
              setMoveStack(innerPrev => {
                const lastInnerPair = innerPrev[innerPrev.length - 1];
                const updatedInnerPrev = innerPrev.slice(0, innerPrev.length - 1);
                const newPair: MovePair = { ...lastInnerPair, aiMove: aiMoveSan };
                const finalStack = [...updatedInnerPrev, newPair];
                console.log('moveStack after AI move update:', JSON.stringify(finalStack));
                return finalStack;
              });
            } else {
              console.error("AI move failed, not updating moveStack.");
            }
          });
        }, 300); // Small delay for better UX
      }
    }

  }, [moveStack]); // Dependency array: re-run when moveStack changes

  // Initialize Stockfish worker and set skill level once
  useEffect(() => {
    engineRef.current = new Worker('/engine/stockfish.js');
    engineRef.current.postMessage('uci');
    engineRef.current.postMessage('isready');
    engineRef.current.postMessage(`setoption name Skill Level value ${skill}`);

    return () => engineRef.current?.terminate();
  }, [skill]);

  // Initialize Stockfish for analysis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      stockfishRef.current = new StockfishWrapper();
    }
    return () => {
      stockfishRef.current?.quit();
    };
  }, []);

  // Update move count and last move (for bot messages)
  useEffect(() => {
    if (game.history().length > 0) {
      setMoveCount(game.history().length);
      setLastMove(game.history()[game.history().length - 1]);
    }
  }, [game]);

  // Check if user is attacking (for bot messages)
  useEffect(() => {
    // This logic runs on every game state change, after AI has moved
    if (game.turn() === 'w') { // User's turn
      const aiPieces = game.board().flat().filter(p => p && p.color === 'b');
      const userPieces = game.board().flat().filter(p => p && p.color === 'w');
      setIsAttacking(userPieces.length < aiPieces.length);
    } else {
      // Reset isAttacking when it's AI's turn to avoid stale state
      setIsAttacking(false);
    }
  }, [game]);

  // Simple function to update move history for display
  const updateMoveHistoryForDisplay = (currentMoveStack: MovePair[]) => {
    console.log('updateMoveHistoryForDisplay called with moveStack:', JSON.stringify(currentMoveStack));
    const newMoveHistory: Move[] = [];
    const chess = new Chess(); // Use a fresh Chess instance to build FENs progressively

    for (let i = 0; i < currentMoveStack.length; i++) {
      const pair = currentMoveStack[i];
      // Apply user move
      if (pair.userMove) {
        chess.move(pair.userMove);
      }
      // Apply AI move if it exists for this pair
      if (pair.aiMove) {
        chess.move(pair.aiMove);
      }

      newMoveHistory.push({
        moveNumber: i + 1, // Move number based on the pair index
        userMove: pair.userMove,
        aiMove: pair.aiMove,
        fen: chess.fen() // FEN after both user and AI move (if AI has moved)
      });
    }

    setMoveHistory(prev => {
      console.log('Previous moveHistory:', prev);
      console.log('New moveHistory to set:', newMoveHistory);
      if (JSON.stringify(prev) !== JSON.stringify(newMoveHistory)) {
        return newMoveHistory;
      }
      return prev;
    });
  };

  // Helper: get FEN after replaying all moves in stack
  const getFenFromMoveStack = (stack: MovePair[]) => {
    const chess = new Chess();
    for (const pair of stack) {
      try {
        if (pair.userMove) {
          chess.move(pair.userMove);
        }
        if (pair.aiMove) {
          chess.move(pair.aiMove);
        }
      } catch (error) {
        console.error("Error replaying move in getFenFromMoveStack:", error);
        console.error("Invalid move:", pair);
        console.error("Current FEN before invalid move:", chess.fen());
        // Optionally, you can break here or return a specific error FEN
        break; // Stop processing further moves if one fails
      }
    }
    return chess.fen();
  };

  // Helper: get move history array from stack
  const getHistoryFromMoveStack = (stack: MovePair[]) => {
    const chess = new Chess();
    const history: string[] = [];
    for (const pair of stack) {
      if (pair.userMove) { chess.move(pair.userMove); history.push(pair.userMove); }
      if (pair.aiMove) { chess.move(pair.aiMove); history.push(pair.aiMove); }
    }
    return history;
  };

  // --- USER MOVE HANDLING (Bot messages) ---
  const handleUserMove = (newGame: Chess) => {
    // Generate a new bot message after every user move
    const msg: BotMessage = {
      id: Date.now(),
      text: generateMessage(
        name,
        newGame.history().length > 0 ? newGame.history()[newGame.history().length - 1] : null,
        newGame.isCheck(),
        (() => {
          const aiPieces = newGame.board().flat().filter(p => p && p.color === 'b');
          const userPieces = newGame.board().flat().filter(p => p && p.color === 'w');
          return userPieces.length < aiPieces.length;
        })(),
        evalScore
      ),
      timestamp: new Date(),
    };
    setBotMessages(prev => [...prev, msg]);
  };

  // --- AI MOVE HANDLING ---
  const makeEngineMove = (fen: string, onAIMoveSan: (san: string) => void) => {
    setIsThinking(true);
    engineRef.current?.postMessage(`position fen ${fen}`);
    engineRef.current?.postMessage(`go depth ${depth}`);
    const handler = (event: MessageEvent) => {
      const line = String(event.data);
      if (line.startsWith('bestmove')) {
        const best = line.split(' ')[1];
        console.log('Engine proposed bestmove:', best);
        engineRef.current?.removeEventListener('message', handler);
        
        const tempGame = new Chess(fen);
        const legalMoves = tempGame.moves({ verbose: true });
          const isLegal = legalMoves.some(m => m.from === best.slice(0, 2) && m.to === best.slice(2, 4));

        if (isLegal) {
          const move = tempGame.move({ from: best.slice(0, 2), to: best.slice(2, 4) });
          if (move) {
            console.log('AI move determined (SAN):', move.san);
            onAIMoveSan(move.san);
          } else {
            console.error('AI move failed even after legality check (tempGame):', best, 'FEN:', fen);
            onAIMoveSan(''); // Indicate failure
          }
        } else {
          console.warn('Engine proposed illegal move:', best, 'FEN used for engine:', fen);
          onAIMoveSan(''); // Indicate failure
        }
        setIsThinking(false);
      }
      if (line.startsWith('info depth') && line.includes('score cp')) {
        const match = line.match(/score cp (-?\d+)/);
        if (match) setEvalScore(Number(match[1]) / 100);
      }
    };
    engineRef.current?.addEventListener('message', handler);
  };

  // Analysis function (re-added)
  const analyzePosition = async () => {
    if (!stockfishRef.current || game.isGameOver()) {
      return;
    }

    // Only analyze when it's white's turn (user's turn)
    if (game.turn() !== 'w') {
      setAnalysisResult("Analysis is only available when it's White's turn to move.");
      setShowAnalysis(true);
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(true);

    try {
      const currentFen = game.fen();
      const result = await stockfishRef.current.getBestMove(currentFen);

      if (result.bestMove) {
        // Convert move notation to readable format
        const from = result.bestMove.slice(0, 2);
        const to = result.bestMove.slice(2, 4);
        const promotion = result.bestMove.length > 4 ? result.bestMove.slice(4) : '';

        // Get piece information
        const piece = game.get(from as Square);
        const pieceNames: { [key: string]: string } = {
          'p': 'Pawn', 'r': 'Rook', 'n': 'Knight',
          'b': 'Bishop', 'q': 'Queen', 'k': 'King'
        };

        const pieceName = piece ? pieceNames[piece.type.toLowerCase()] || 'Piece' : 'Piece';
        const scoreText = result.score > 0 ? `+${result.score.toFixed(2)}` : result.score.toFixed(2);

        let moveDescription = `${pieceName} from ${from.toUpperCase()} to ${to.toUpperCase()}`;
        if (promotion) {
          const promotionPiece = pieceNames[promotion.toLowerCase()] || promotion.toUpperCase();
          moveDescription += ` (promote to ${promotionPiece})`;
        }

        setAnalysisResult(
          `🤖 **Engine Suggestion for White:**\n\n` +
          `**Best Move:** ${moveDescription}\n` +
          `**Move Notation:** ${result.bestMove}\n` +
          `**Position Evaluation:** ${scoreText} (from White's perspective)\n\n` +
          `💡 This is the engine's top recommendation. You can choose to play this move or continue with your own strategy!`
        );
      } else {
        setAnalysisResult("Unable to find a suitable move suggestion at this time.");
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult("An error occurred while analyzing the position. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- USER INTERACTION HANDLERS ---
  const getLegalMovesForSquare = (square: Square) => {
    return game.moves({ square, verbose: true }).map((m: any) => m.to as Square);
  };

  const handleSquareClick = (square: Square) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setLegalMoves(getLegalMovesForSquare(square));
        return;
      }
      console.log('Attempting user move (click):', { from: selectedSquare, to: square, promotion: 'q' });
      console.log('FEN before user move (click):', game.fen());
      const tempGameForMove = new Chess(game.fen());
      const move = tempGameForMove.move({ from: selectedSquare, to: square, promotion: 'q' });
      if (move) {
        console.log('User move successful (click):', move.san);
        const userMove = move.san;

        setMoveStack(prev => {
          const newStack: MovePair[] = [...prev, { userMove, aiMove: undefined }];
          setRedoStack([]); // Clear redo stack on new user move
          console.log('moveStack after user move:', JSON.stringify(newStack));
          return newStack;
        });

        setSelectedSquare(null);
        setLegalMoves([]);

      } else {
        console.error('Failed to make user move (click):', { from: selectedSquare, to: square, promotion: 'q' });
        console.error('Current FEN after failed move (click):', game.fen());
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        const moves = getLegalMovesForSquare(square);
        if (moves.length > 0) {
          setSelectedSquare(square);
          setLegalMoves(moves);
        }
      }
    }
  };

  const onDrop = (src: string, dst: string, piece: any) => {
    console.log('onPieceDrop triggered:', src, dst, piece);
    console.log('Attempting user move (drop):', { from: src, to: dst, promotion: 'q' });
    console.log('FEN before user move (drop):', game.fen());
    const tempGameForMove = new Chess(game.fen());
    const move = tempGameForMove.move({ from: src, to: dst, promotion: 'q' });

    if (!move) {
      console.error('Failed to make user move (drop):', { from: src, to: dst, promotion: 'q' });
      console.error('Current FEN after failed move (drop):', game.fen());
      return false;
    }
    console.log('User move successful (drop):', move.san);
    const userMove = move.san;

    setMoveStack(prev => {
      const newStack: MovePair[] = [...prev, { userMove, aiMove: undefined }];
      setRedoStack([]); // Clear redo stack on new user move
      console.log('moveStack after user move:', JSON.stringify(newStack));
      return newStack;
    });

    setSelectedSquare(null);
    setLegalMoves([]);

    return true; // Indicate successful drop for react-chessboard
  };

  // --- UNDO/REDO LOGIC ---
  const handleUndo = () => {
    setMoveStack(prev => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      const popped = newStack.pop();
      setRedoStack(r => popped ? [popped, ...r] : r);
      console.log('moveStack after undo:', JSON.stringify(newStack));
      // The game state and history will be updated by the useEffect watching moveStack
      return newStack;
    });
  };

  const handleRedo = () => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const [movePair, ...rest] = prev;
      console.log('Redoing move pair:', JSON.stringify(movePair));
      setMoveStack(ms => { // This will trigger the useEffect
        const newStack = [...ms, movePair];
        console.log('moveStack after redo:', JSON.stringify(newStack));
        return newStack;
      });
      return rest;
    });
  };

  // --- RESET GAME ---
  const resetGame = () => {
    setGame(new Chess()); // Reset game directly
    setIsThinking(false);
    setEvalScore(0);
    setSelectedSquare(null);
    setLegalMoves([]);
    setShowCheckmate(false);
    setWinner(null);
    setLastGameResult(null);
    setMoveHistory([]);
    setIsAnalyzing(false);
    setAnalysisResult('');
    setShowAnalysis(false);
    setBotMessages([]);
    setMoveStack([]); // Clear moveStack to reset history
    setRedoStack([]);
  };

  // --- GAME END HANDLING ---
  useEffect(() => {
    if (game.isCheckmate()) {
      setShowCheckmate(true);
      const winnerColor = game.turn() === 'w' ? 'Black' : 'White';
      setWinner(winnerColor);
      setLastGameResult(game.turn() === 'w' ? 'black' : 'white');
    }
  }, [game]);

  // --- CUSTOM STYLES ---
  const getKingSquare = () => {
    if (!game) return null;
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = board[r][c];
        if (square && square.type === 'k' && square.color === game.turn() && game.isCheck()) {
          return `${String.fromCharCode(97 + c)}${8 - r}`;
        }
      }
    }
    return null;
  };

  const checkKingSquare = getKingSquare();

  const customSquareStyles = {
    ...(selectedSquare
      ? {
          [selectedSquare as Square]: { background: 'rgba(255,255,0,0.4)' },
          ...Object.fromEntries(
            legalMoves.map(sq => [sq as Square, { background: 'radial-gradient(circle, rgba(0, 191, 207, 0.8) 25%, transparent 25%)' }])
          ),
        }
      : {}),
    ...(checkKingSquare ? { [checkKingSquare as Square]: { background: 'rgba(255,0,0,0.6)' } } : {}),
  };

  function speakAnalysis() {
    if (!voiceEnabled) return;
    const text = document.getElementById('position-analysis-result')?.innerText;
    if (!text || text.trim() === "") {
      alert('No analysis text found to speak.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-400" />
            Chess vs {name}
          </h1>
          <p className="text-slate-400">Challenge the AI that plays like {name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8">
          {/* Bot Message Panel */}
          <div>
            <BotMessagePanel
              botName={name}
              messages={botMessages}
            />
          </div>

          {/* Chess Board */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="relative">
                  <Chessboard
                    position={game.fen()}
                    onPieceDrop={(src, dst, piece) => {
                      console.log('onPieceDrop triggered:', src, dst, piece);
                      return onDrop(src, dst, piece);
                    }}
                    onSquareClick={(square) => {
                      console.log('onSquareClick triggered:', square);
                      handleSquareClick(square);
                    }}
                    boardWidth={isMobile ? 320 : 480}
                    arePiecesDraggable={!isThinking}
                    boardOrientation="white"
                    customBoardStyle={{ borderRadius: 16, boxShadow: '0 4px 32px #0004' }}
                    customSquareStyles={customSquareStyles}
                    animationDuration={150}
                  />
                  {isThinking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Move History Panel */}
          <div>
            <MoveHistory moves={moveHistory} className="lg:sticky lg:top-8" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#818cf8]">{name}</h1>
            <p className="text-white/60">{description}</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-right">
              <div className="text-sm text-white/60">Depth</div>
              <div className="text-lg font-semibold text-[#818cf8]">{depth}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Skill Level</div>
              <div className="text-lg font-semibold text-[#818cf8]">{skill}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-8">
          <div className="flex gap-2 justify-center mt-4 w-full">
            <Button onClick={handleUndo} disabled={moveStack.length === 0}>Undo</Button>
            <Button onClick={handleRedo} disabled={redoStack.length === 0}>Redo</Button>
            <Button className="bg-[#23263a] text-white hover:bg-[#4f46e5]" onClick={resetGame}>New Game</Button>
            <Button
              className="bg-[#23263a] text-[#818cf8] border border-[#818cf8] hover:bg-[#4f46e5] hover:text-white"
              variant="outline"
              onClick={analyzePosition}
              disabled={isAnalyzing || isThinking}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Position
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Voice toggle above Position Analysis card */}
        {showAnalysis && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Switch id="voice-toggle" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
              <label htmlFor="voice-toggle" className="text-white select-none">Enable Voice</label>
            </div>
            <div className="flex justify-center lg:justify-start mt-4">
              <Card className="w-full max-w-md bg-[#181f2a] border border-[#818cf8]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#818cf8] flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Position Analysis
                    <button
                      type="button"
                      aria-label="Speak analysis"
                      onClick={speakAnalysis}
                      className="ml-2 p-1 rounded hover:bg-[#23263a]"
                      style={{ lineHeight: 0 }}
                      disabled={!voiceEnabled}
                      title={voiceEnabled ? "Speak analysis" : "Enable voice to use"}
                    >
                      <Volume2 className={`w-5 h-5 ${voiceEnabled ? "text-[#a78bfa]" : "text-gray-500"}`} />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-[#818cf8]" />
                      <span className="ml-2 text-gray-300">Analyzing position...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <pre id="position-analysis-result" className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                        {analysisResult}
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAnalysis(false)}
                        className="mt-3 w-full border-[#818cf8] text-[#818cf8] hover:bg-[#818cf8] hover:text-white"
                      >
                        Close Analysis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Dialog open={showCheckmate} onOpenChange={setShowCheckmate}>
        <DialogContent className="max-w-md w-full rounded-2xl p-8 bg-[#181f2a] border border-[#818cf8] text-center">
          <DialogHeader>
            <DialogTitle className={`text-3xl font-bold mb-2 ${lastGameResult === 'white' ? 'text-[#a78bfa]' : 'text-[#818cf8]'}`}>{`Checkmate! ${winner} wins!`}</DialogTitle>
            <DialogDescription className="text-lg mb-4">
              {lastGameResult === 'white'
                ? "Congratulations! You've checkmated the AI!"
                : 'The AI has checkmated you! Better luck next time!'}
            </DialogDescription>
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="flex justify-between w-full text-sm">
                <span className="font-semibold text-[#818cf8]">Opponent:</span>
                <span className="font-bold text-white">{name}</span>
              </div>
              <div className="flex justify-between w-full text-sm">
                <span className="font-semibold text-[#818cf8]">Your Rating:</span>
                <span className="font-bold text-white">{rating}</span>
              </div>
              <div className="flex justify-between w-full text-sm">
                <span className="font-semibent text-[#818cf8]">Accuracy:</span>
                <span className="font-bold text-[#a78bfa]">{accuracy}%</span>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-4 justify-center mt-4">
            <Button className="bg-[#a78bfa] hover:bg-[#818cf8] text-white font-bold px-6 py-2 rounded-lg" onClick={() => { resetGame(); setShowCheckmate(false); }}>New Game</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}