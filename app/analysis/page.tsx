"use client"

import { useState, useRef, useEffect } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Upload, Crown, Zap, TrendingUp, AlertCircle, Search, Database, Volume2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import axios from "axios"
import { StockfishWrapper } from "../lib/stockfish"
import pgnParser from '@mliebelt/pgn-parser'
import { sanitizePGN, isValidPGN } from "@/lib/pgnSanitizer"
import { GrandmasterInfo } from '@/components/GrandmasterInfo'
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Define a type for moves in the stack
type MoveRecord = string; // Storing SAN notation for moves

type SavedPgnMetadata = { id: number; name: string; created_at: string };

export default function AnalysisPage() {
  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState(game.fen())
  const [pgn, setPgn] = useState("")
  // New state variables for undo/redo stack
  const [moveStack, setMoveStack] = useState<MoveRecord[]>([]);
  const [redoStack, setRedoStack] = useState<MoveRecord[]>([]);
  const [analysis, setAnalysis] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [chatbotActive, setChatbotActive] = useState(false)
  const [selectedGM, setSelectedGM] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{from: string, text: string}>>([])
  const [suggestedMove, setSuggestedMove] = useState<{ from: string, to: string } | null>(null)
  const [explanationText, setExplanationText] = useState<string>('')
  const [analysisCount, setAnalysisCount] = useState(0)
  const [pgnFilename, setPgnFilename] = useState("")
  const boardRef = useRef<any>(null)
  const [savedPgns, setSavedPgns] = useState<SavedPgnMetadata[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [bestMoveCount, setBestMoveCount] = useState<number>(0);
  const [loadingBestMoves, setLoadingBestMoves] = useState<boolean>(true);
  const router = useRouter();

  const grandmasters = [
    "Magnus Carlsen",
    "Hikaru Nakamura",
    "Fabiano Caruana",
    "Viswanathan Anand",
    "Gukesh",
  ]

  const grandmastersMap: Record<string, string> = {
    "Magnus Carlsen": "Carlsen,Magnus",
    "Viswanathan Anand": "Anand, Viswanathan",
    "Hikaru Nakamura": "Nakamura, Hikaru",
    "Fabiano Caruana": "Caruana,F",
    "Gukesh": "Caruana,F" // Gukesh mapped to Caruana's PGN
  };

  const gmStockfishDepth: Record<string, number> = {
    "Magnus Carlsen": 11,
    "Hikaru Nakamura": 10,
    "Fabiano Caruana": 9,
    "Viswanathan Anand": 9,
    "Gukesh": 9
  };

  const gmExplanationStyle: Record<string, (move: string, reason: string, timing: string, impact: string) => string> = {
    "Magnus Carlsen": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}`,

    "Hikaru Nakamura": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}`,

    "Fabiano Caruana": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}`,

    "Viswanathan Anand": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}`,

    "Gukesh": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}`
  };

  // Helper for detailed move explanations
  const getDetailedExplanation = (moveObj: any, currentFen: string, historyLength: number) => {
    const chess = new Chess(currentFen);
    const piece = chess.get(moveObj.from); // Get piece from the 'from' square
    const pieceType = piece ? piece.type : '';
    
    let phase = 'middlegame';
    // Use historyLength from moveStack, not from the temporary chess instance
    if (historyLength < 10) phase = 'opening';
    else if (historyLength > 30 || (chess.board().flat().filter(p => p).length < 14)) phase = 'endgame';

    // Default explanations
    let reason = 'This is a solid move that improves your position.';
    let timing = 'Now is a good time to consolidate and prepare for future plans.';
    let impact = 'This move gradually improves your position and restricts your opponent.';

    const pieceNames: {[key: string]: string} = {p:'pawn', n:'knight', b:'bishop', r:'rook', q:'queen', k:'king'};

    // --- FLAGS-BASED (High Priority) ---
    if (moveObj.flags.includes('c')) {
      const capturedPieceName = pieceNames[moveObj.captured] || 'piece';
      reason = `Captures the opponent's ${capturedPieceName} on ${moveObj.to}, winning material.`;
      timing = 'Captures are best when they win material without significant compensation, or to remove a key defender.';
      impact = 'Reduces the opponent\'s fighting force and can simplify the position to your advantage.';
    } else if (moveObj.flags.includes('k') || moveObj.flags.includes('q')) {
      reason = 'Castling improves king safety and connects the rooks.';
      timing = 'It\'s usually best to castle early in the opening to protect your king from central attacks.';
      impact = 'Greatly improves king safety and prepares the rooks to enter the game.';
    } else if (moveObj.flags.includes('p')) {
      reason = `Promotes a pawn to a ${pieceNames[moveObj.promotion] || 'queen'}, the most powerful piece on the board.`;
      timing = 'Pawn promotion is often the decisive moment in an endgame.';
      impact = 'Creates an overwhelming material advantage that usually leads to a quick victory.';
    } 
    // --- CONTEXT-BASED ---
    else if (phase === 'opening') {
        if (['e4', 'd4', 'c4', 'Nf3'].includes(moveObj.san)) {
            reason = 'A strong opening move that fights for central control and opens lines for other pieces.';
            timing = 'In the first few moves, controlling the center is the highest priority.';
            impact = 'Establishes a solid foundation for the rest of the game.';
        } else if (pieceType === 'n' || pieceType === 'b') {
            reason = `A good developing move, bringing the ${pieceNames[pieceType]} into the game to control key squares.`;
            timing = 'Develop your knights and bishops early to prepare for castling and control the center.';
            impact = 'Increases your piece activity and prepares you for the middlegame.';
        }
    } else if (phase === 'middlegame') {
        if (pieceType === 'r' && (moveObj.to[0] === 'd' || moveObj.to[0] === 'e' || moveObj.to[0] === 'c')) {
             reason = `Moving the rook to the ${moveObj.to[0]}-file places it on a key open or semi-open file where it can exert pressure.`;
             timing = 'Once minor pieces are developed, rooks should be moved to contest important files.';
             impact = 'The rook becomes much more active and can support attacks or defend key points.';
        } else if (pieceType === 'q') {
            reason = 'Repositioning the queen to a more active and safer square to improve its influence over the board.';
            timing = 'In the middlegame, the queen is a powerful attacking piece, but must also be kept safe.';
            impact = 'Prepares for potential attacks and puts more pressure on the opponent\'s position.';
        } else {
             reason = 'This move improves the coordination of your pieces and prepares for future plans.';
            timing = 'Look for moments to improve your worst-placed piece or create threats against the opponent.';
            impact = 'Gradually builds pressure and restricts the opponent\'s options.';
        }
    } else if (phase === 'endgame') {
        if (pieceType === 'k') {
             reason = 'Activating the king, a key principle in the endgame. The king becomes a powerful fighting piece.';
             timing = 'When most major pieces are off the board, the king should move towards the center to participate in the action.';
             impact = 'The king can support passed pawns, attack enemy pawns, and control important squares.';
        } else if (pieceType === 'p') {
             reason = 'This pawn push creates a passed pawn or supports an existing one, which is often the main winning plan.';
             timing = 'In the endgame, creating and pushing passed pawns is crucial.';
             impact = 'A passed pawn is a major threat that can tie down the opponent\'s pieces or lead to promotion.';
        }
    }

    return { reason, timing, impact };
  };

  function onDrop(sourceSquare: string, targetSquare: string) {
    // Create a temporary game instance to attempt the move
    // We get the FEN from the current `game` state, which is already synced with `moveStack` via useEffect
    const tempGameForMoveValidation = new Chess(game.fen());
    try {
      const move = tempGameForMoveValidation.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      })

      if (move === null) return false

      // If move is successful, update the moveStack
      setMoveStack(prev => [...prev, move.san]);
      setRedoStack([]); // Clear redo stack on new move

      // The useEffect will handle updating game, fen, pgn
      return true
    } catch (error) {
      console.error("Invalid move in onDrop (AnalysisPage):", error);
      return false
    }
  }

  function handlePgnUpload(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const uploadedPgn = event.target.value
    try {
      // First, try to sanitize the PGN
      const sanitizedPgn = sanitizePGN(uploadedPgn);
      
      const newGameTemp = new Chess() // Temporary instance to load PGN
      newGameTemp.loadPgn(sanitizedPgn)
      
      const moves = newGameTemp.history(); // Get all moves in SAN
      setMoveStack(moves);
      setRedoStack([]); // Clear redo stack on new PGN upload
      // useEffect will handle setting game, fen, pgn
    } catch (error) {
      console.error("Invalid PGN format:", error)
      alert("Invalid PGN format. Please check your PGN and try again.");
    }
  }

  function handleAnalyze() {
    // Placeholder for analysis logic
    setAnalysis("Analysis in progress...")
  }

  function handleSearch() {
    // Placeholder for database search
    setSearchResults([
      "Similar position found in Carlsen vs Nakamura, 2020",
      "Match found in World Championship 2021"
    ])
  }

  // Add reset function
  const resetAnalysis = () => {
    setSuggestedMove(null);
    setExplanationText('');
    setChatMessages([]);
    setAnalysisCount(0);
    setMoveStack([]); // Clear move stack
    setRedoStack([]); // Clear redo stack
  };

  async function handleSavePgn() {
    if (!pgn) {
      alert('No PGN to save');
      return;
    }

    try {
      // Sanitize the PGN before saving
      let sanitizedPgn;
      try {
        sanitizedPgn = sanitizePGN(pgn);
      } catch (sanitizeError) {
        console.error('PGN sanitization failed:', sanitizeError);
        alert('Invalid PGN format. Please check your PGN and try again.');
        return;
      }

      let exportPgn = sanitizedPgn;
      let result = '*';
      if (game.isCheckmate()) {
        result = game.turn() === 'w' ? '0-1' : '1-0';
      } else if (
        game.isDraw() ||
        game.isStalemate() ||
        game.isThreefoldRepetition() ||
        game.isInsufficientMaterial()
      ) {
        result = '1/2-1/2';
      }
      // Replace or insert the [Result] tag
      if (exportPgn.match(/\[Result\s+".*?"\]/)) {
        exportPgn = exportPgn.replace(/\[Result\s+".*?"\]/, `[Result "${result}"]`);
      } else {
        // Insert after last header
        const lastHeaderIdx = exportPgn.lastIndexOf(']');
        if (lastHeaderIdx !== -1) {
          exportPgn = exportPgn.slice(0, lastHeaderIdx + 1) + `\n[Result "${result}"]` + exportPgn.slice(lastHeaderIdx + 1);
        }
      }
      // Remove any result at the end of the moves section
      exportPgn = exportPgn.replace(/(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');
      // Remove any extra blank lines at the end
      exportPgn = exportPgn.replace(/\n+$/g, '');
      // Add result as a new line after the moves
      exportPgn = exportPgn.replace(/\n{3,}/g, '\n\n').trim();
      exportPgn += `\n${result}\n`;
      
      const response = await axios.post('/api/pgns', {
        name: pgnFilename || 'Untitled Game',
        content: exportPgn
      });

      if (response.data) {
        alert('PGN saved successfully!');
        setPgnFilename('');
        fetchSavedPgns(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to save PGN:', error);
      alert('Failed to save PGN. Please try again.');
    }
  }

  // Undo function
  const handleUndo = () => {
    setMoveStack(prev => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      const lastMove = newStack.pop();
      if (lastMove) {
        setRedoStack(r => [lastMove, ...r]);
      }
      return newStack;
    });
  };

  // Redo function
  const handleRedo = () => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const [nextMove, ...rest] = prev;
      setMoveStack(m => [...m, nextMove]);
      return rest;
    });
  };

  // Modify handleGMSelect to support multiple analyses
  const handleGMSelect = async (gmDisplayName: string) => {
    setSelectedGM(gmDisplayName);
    setChatbotActive(true);
    
    if (analysisCount === 0) {
      setChatMessages([{ from: gmDisplayName as string, text: `Let's analyze this position together!` }]);
    } else {
      setChatMessages(prev => [...prev, { from: gmDisplayName as string, text: `Let's analyze the current position!` }]);
    }

    let explanation: string = '';
    let suggestedMove: any = null;
    
    try {
      const depth = gmStockfishDepth[gmDisplayName] || 9;
      let stockfish: StockfishWrapper | null = null;
      
      if (typeof window !== 'undefined') {
        stockfish = new StockfishWrapper();
        stockfish.setDepth(depth);
        const { bestMove, score } = await stockfish.getBestMove(fen);
        
        // Convert UCI move to SAN
        const chess = new Chess(fen);
        const moveObj = chess.move({ from: bestMove.slice(0,2), to: bestMove.slice(2,4), promotion: 'q' });
        
        if (moveObj) {
          suggestedMove = moveObj;
          // Explanation details
          const { reason, timing, impact } = getDetailedExplanation(moveObj, fen, moveStack.length);
          
          // Style
          const styleFn = gmExplanationStyle[gmDisplayName] || gmExplanationStyle["Magnus Carlsen"];
          explanation = styleFn(moveObj.san, reason, timing, impact);
        }
      }

      if (suggestedMove && suggestedMove.san) {
        setSuggestedMove(suggestedMove);
        // Animate move on the board by updating moveStack
        setTimeout(() => {
          try {
            setMoveStack(prev => {
              const newStack = [...prev, suggestedMove.san];
              setAnalysisCount(prevCount => prevCount + 1); // Increment analysis count here
              return newStack;
            });
          } catch (e) {
            console.error("Error updating moveStack with animated move:", e);
          }
        }, 500);
        setExplanationText(explanation);
        setChatMessages(prev => [...prev, { from: gmDisplayName as string, text: `My suggestion: <b>${suggestedMove.san}</b>!` }]);
      } else {
        setChatMessages(prev => [...prev, { from: gmDisplayName as string, text: `I couldn't analyze this position. Please try a different position.` }]);
      }
    } catch (error) {
      console.error("Failed to analyze position:", error);
      setChatMessages(prev => [...prev, { from: gmDisplayName as string, text: `I couldn't analyze this position. Please try again.` }]);
    }
  };

  // Effect to update game, fen, and pgn from moveStack
  useEffect(() => {
    console.log('moveStack updated, reconstructing game...', JSON.stringify(moveStack));
    const tempGame = new Chess();
    // moveStack here is an array of SAN strings (e.g., ["e4", "e5", "Nf3"])
    for (const moveSan of moveStack) { // Iterate directly over SAN strings
      try {
        tempGame.move(moveSan);
      } catch (error) {
        console.error("Error replaying move from moveStack in AnalysisPage:", moveSan, error);
        break; // Stop if an invalid move is found
      }
    }
    setGame(tempGame);
    setFen(tempGame.fen());
    setPgn(tempGame.pgn());
  }, [moveStack]); // Re-run when moveStack changes

  const fetchSavedPgns = async () => {
    try {
      const response = await axios.get('/api/pgns');
      console.log("Fetched saved PGNs metadata:", response.data);
      setSavedPgns(response.data);
    } catch (error) {
      console.error('Error fetching saved PGNs metadata:', error);
    }
  };

  useEffect(() => {
    fetchSavedPgns(); // Fetch PGNs metadata on component mount
  }, []);

  const handleLoadPgn = async (pgnId: number) => {
    try {
      const response = await axios.get(`/api/pgns/${pgnId}`);
      const pgnContent = response.data.content;
  
      if (!pgnContent) {
        alert('PGN content is empty.');
        return;
      }
      
      // Sanitize the PGN content before loading
      const sanitizedPgn = sanitizePGN(pgnContent);

      const newGameTemp = new Chess();
      newGameTemp.loadPgn(sanitizedPgn);
      
      const moves = newGameTemp.history();
      setMoveStack(moves);
      setRedoStack([]);
      
      alert('PGN loaded successfully!');
    } catch (error) {
      console.error('Error loading PGN:', error);
      alert('Failed to load PGN.');
    }
  };

  // speakText now uses browser's SpeechSynthesisUtterance
  function speakText() {
    if (!voiceEnabled) return;
    const text = document.getElementById('analysis-result')?.innerText;
    console.log('TTS text:', text);
    if (!text || text.trim() === "") {
      alert('No analysis text found to speak.');
      return;
    }
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    // Fetch best move count as in dashboard
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoadingBestMoves(true);
    fetch('/api/users/game-reports', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((games) => {
        const uniqueGameReports = Array.from(
          new Map((Array.isArray(games) ? games : []).map(g => [JSON.stringify(g.game_report), g])).values()
        );
        const totalBestMoves = uniqueGameReports.reduce((sum, game) => {
          if (!Array.isArray(game.game_report)) return sum;
          return sum + game.game_report.filter((move: any) => move.type === 'Best').length;
        }, 0);
        setBestMoveCount(totalBestMoves);
      })
      .finally(() => setLoadingBestMoves(false));
  }, []);

  return (
    <main className="min-h-screen krishna-gradient relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Game Analysis</h1>
          <p className="text-xl text-rgb(200, 200, 200)">
            Upload your game, analyze positions, and learn from the masters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center">
          <div className="h-full">
            <Card className="krishna-card border-rgb(153, 0, 255)/30 card-shadow text-white purple-glow h-[700px] max-h-[80vh] flex flex-col">
              <CardHeader>
                <CardTitle>Chess Board</CardTitle>
                <CardDescription className="text-[var(--primary-text)]">Make moves or upload a PGN to analyze</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="aspect-square">
                  <Chessboard 
                    position={fen}
                    onPieceDrop={onDrop}
                    customBoardStyle={{
                      borderRadius: "8px",
                    }}
                    ref={boardRef}
                  />
                </div>
                {/* Undo/Redo/Reset/Analyze with GM Buttons */}
                <div className="flex flex-col lg:flex-row justify-center gap-8 mt-4">
                  <div className="flex gap-2 justify-center w-full">
                    <Button onClick={handleUndo} disabled={moveStack.length === 0} className="bg-[var(--accent)] text-white border border-[var(--border)] hover:bg-[#B5532A]">Undo</Button>
                    <Button onClick={handleRedo} disabled={redoStack.length === 0} className="bg-[var(--accent)] text-white border border-[var(--border)] hover:bg-[#B5532A]">Redo</Button>
                    <Button className="bg-[var(--accent)] text-white border border-[var(--border)] hover:bg-[#B5532A] btn-glow" onClick={resetAnalysis}>Reset Board</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="bg-[var(--accent)] text-white border border-[var(--border)] hover:bg-[#B5532A]" variant="outline">
                          <Zap className="mr-2 h-4 w-4" />
                          Analyze with GM
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-[var(--card)] border border-[var(--accent)] text-[var(--primary-text)] shadow-lg">
                        {grandmasters.map((gm) => (
                          <DropdownMenuItem
                            key={gm}
                            onClick={() => {
                              if ((gm === 'Viswanathan Anand' && bestMoveCount > 50) || (gm === 'Hikaru Nakamura' && bestMoveCount >= 31) || (gm !== 'Viswanathan Anand' && gm !== 'Hikaru Nakamura')) {
                                handleGMSelect(gm);
                              }
                            }}
                            disabled={
                              (gm === 'Viswanathan Anand' && bestMoveCount <= 50) ||
                              (gm === 'Hikaru Nakamura' && bestMoveCount < 31)
                            }
                            className={`hover:bg-rgb(153, 0, 255)/20 cursor-pointer flex items-center justify-between
                              ${(gm === 'Viswanathan Anand' && bestMoveCount <= 50) || (gm === 'Hikaru Nakamura' && bestMoveCount < 31) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span>{gm}</span>
                            {gm === 'Viswanathan Anand' && bestMoveCount <= 50 && (
                              <span className="ml-2 text-xs text-red-400">only available if best moves count is greater than 50</span>
                            )}
                            {gm === 'Hikaru Nakamura' && bestMoveCount < 31 && (
                              <span className="ml-2 text-xs text-red-400">only available if best moves count is greater than 30</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-full">
            <Card className="card bg-[var(--card)] border-[var(--border)] shadow-lg text-[var(--primary-text)] h-full">
              <CardHeader>
                <CardTitle>Game Controls</CardTitle>
                <CardDescription className="text-[var(--primary-text)]">Upload PGN or analyze current position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Paste your PGN here..."
                    value={pgn}
                    onChange={handlePgnUpload}
                    rows={10}
                    className="card border border-[var(--accent)] text-[var(--primary-text)] placeholder:text-[var(--secondary-text)] resize-none overflow-hidden"
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter filename"
                        value={pgnFilename}
                        onChange={(e) => setPgnFilename(e.target.value)}
                        className="flex-grow card border border-[var(--accent)] text-[var(--primary-text)] placeholder:text-[var(--secondary-text)]"
                      />
                      <Button onClick={handleSavePgn} className="btn border border-[var(--accent)] text-[var(--primary-text)] hover:glow-accent bg-[var(--card)]">
                        <Database className="mr-2 h-4 w-4 text-[var(--accent)]" />
                        Save PGN
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full card border border-[var(--accent)] text-[var(--primary-text)] hover:bg-[var(--accent)]">
                            <Database className="mr-2 h-4 w-4 text-[var(--accent)]" /> Load Saved PGN
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full bg-[var(--card)] border border-[var(--accent)] text-[var(--primary-text)] shadow-lg">
                          {savedPgns.length > 0 ? (
                            savedPgns.map((p) => (
                              <DropdownMenuItem key={p.id} onSelect={() => handleLoadPgn(p.id)} className="text-[var(--primary-text)] hover:bg-[var(--accent)]">
                                {p.name} ({new Date(p.created_at).toLocaleDateString()})
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled className="text-[var(--secondary-text)]">No saved PGNs</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-[var(--primary-text)] mb-1">Analyze Game</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="btn border border-[var(--accent)] text-[var(--primary-text)] hover:glow-accent bg-[var(--card)] font-bold px-6 py-2 rounded-lg">
                          Choose Grandmaster
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="card border border-[var(--accent)]">
                        <DropdownMenuItem
                          onClick={() => bestMoveCount >= 31 ? handleGMSelect('Hikaru Nakamura') : undefined}
                          disabled={bestMoveCount < 31}
                          className={`flex items-center justify-between text-[var(--primary-text)] hover:bg-[var(--accent)] ${bestMoveCount < 31 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          What would Hikaru do in this situation?
                          {bestMoveCount < 31 && (
                            <span className="ml-2 text-xs text-red-400">only available if best moves count is greater than 30</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleGMSelect('Magnus Carlsen')}
                          className="text-[var(--primary-text)] hover:bg-[var(--accent)]"
                        >What would Magnus do in this situation?</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => bestMoveCount > 50 ? handleGMSelect('Viswanathan Anand') : undefined}
                          disabled={bestMoveCount <= 50}
                          className={`flex items-center justify-between text-[var(--primary-text)] hover:bg-[var(--accent)] ${bestMoveCount <= 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          What would Viswanathan Anand do in this situation?
                          {bestMoveCount <= 50 && (
                            <span className="ml-2 text-xs text-red-400">only available if best moves count is greater than 50</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGMSelect('Gukesh')} className="text-[var(--primary-text)] hover:bg-[var(--accent)]">What would Gukesh do in this situation?</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* Chatbot UI */}
                {chatbotActive && (
                  <div className="mt-6 card rounded-lg p-4 max-h-64 overflow-y-auto border border-[var(--accent)]">
                    <div className="font-semibold text-[var(--accent)] mb-2">{selectedGM}:</div>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="mb-2 text-[var(--primary-text)]">
                        <span className="block text-sm" dangerouslySetInnerHTML={{ __html: msg.text }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Voice toggle above analysis section */}
                <div className="flex items-center gap-2 mb-2">
                  <Switch id="voice-toggle" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                  <label htmlFor="voice-toggle" className="text-white select-none">Enable Voice</label>
                </div>

                {explanationText && (
                  <div className="mt-6 krishna-card rounded-lg p-4 border border-rgb(153, 0, 255)/30">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-rgb(153, 0, 255) mr-2">Suggested Move Analysis:</h3>
                      <button
                        type="button"
                        aria-label="Speak analysis"
                        onClick={speakText}
                        className="ml-2 p-1 rounded hover:bg-rgb(153, 0, 255)/20"
                        style={{ lineHeight: 0 }}
                        disabled={!voiceEnabled}
                        title={voiceEnabled ? "Speak analysis" : "Enable voice to use"}
                      >
                        <Volume2 className={`w-5 h-5 ${voiceEnabled ? "text-rgb(153, 0, 255)" : "text-gray-500"}`} />
                      </button>
                    </div>
                    <div id="analysis-result" className="text-[var(--primary-text)]" dangerouslySetInnerHTML={{ __html: explanationText }} />
                  </div>
                )}

                {selectedGM && (
                  <GrandmasterInfo grandmasterName={selectedGM} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
