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

// Set axios base URL for backend API calls
axios.defaults.baseURL = 'http://localhost:5000';

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
      <b>Where:</b> ${impact}<br/><br/>
      As Magnus, I always look for practical solutions and keep the pressure on my opponent. Sometimes the simplest move is the strongest. Stay flexible and keep your options open.`,

    "Hikaru Nakamura": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}<br/><br/>
      Yo, it's Hikaru! I love dynamic, tactical positions and always look for ways to create chaos on the board. Don't be afraid to play aggressively and trust your instincts! PogChamp!`,

    "Fabiano Caruana": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}<br/><br/>
      As Fabiano, I rely on deep calculation and thorough opening preparation. Precision is key—always look for the most accurate continuation and don't settle for less.`,

    "Viswanathan Anand": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}<br/><br/>
      This is Vishy! I believe in harmony and rapid development. A well-coordinated position is the foundation for a successful attack. Play with confidence and clarity.`,

    "Gukesh": (move, reason, timing, impact) =>
      `<b>Move:</b> <span style='color:#a78bfa'>${move}</span><br/>
      <b>Why:</b> ${reason}<br/>
      <b>When:</b> ${timing}<br/>
      <b>Where:</b> ${impact}<br/><br/>
      Hi, I'm Gukesh! I play with youthful energy and creativity. Don't be afraid to try new ideas and keep your opponent guessing. Chess is about constant improvement—enjoy the journey!`
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
          let reason = '';
          let timing = '';
          let impact = '';
          
          // Reason
          if (moveObj.flags && moveObj.flags.includes('c')) {
            reason = 'This move captures material, gaining an immediate advantage.';
          } else if (moveObj.flags && (moveObj.flags.includes('k') || moveObj.flags.includes('q'))) {
            reason = 'Castling for king safety and rook activation.';
          } else if (moveObj.san && moveObj.san.includes('+')) {
            reason = 'This move gives check, putting pressure on the opponent.';
          } else if (moveObj.san && moveObj.san.match(/[a-h]8|[a-h]1/)) {
            reason = 'Promoting a pawn to a queen, increasing your chances in the endgame.';
          } else {
            reason = 'Improves piece activity and controls key squares.';
          }
          
          // Timing
          if (moveObj.flags && moveObj.flags.includes('c')) {
            timing = 'Play this when you can win material or disrupt your opponent\'s plans.';
          } else if (moveObj.flags && (moveObj.flags.includes('k') || moveObj.flags.includes('q'))) {
            timing = 'Castle early to safeguard your king.';
          } else if (moveObj.san && moveObj.san.includes('+')) {
            timing = 'Use checks to force your opponent to respond and seize the initiative.';
          } else if (moveObj.san && moveObj.san.match(/[a-h]8|[a-h]1/)) {
            timing = 'Push your pawn when you\'re close to promotion.';
          } else {
            timing = 'Look for moments to improve your worst-placed piece.';
          }
          
          // Impact
          if (moveObj.flags && moveObj.flags.includes('c')) {
            impact = 'This can shift the balance of material in your favor.';
          } else if (moveObj.flags && (moveObj.flags.includes('k') || moveObj.flags.includes('q'))) {
            impact = 'Your king becomes safer and your rooks are connected.';
          } else if (moveObj.san && moveObj.san.includes('+')) {
            impact = 'Creates immediate threats and may lead to tactical opportunities.';
          } else if (moveObj.san && moveObj.san.match(/[a-h]8|[a-h]1/)) {
            impact = 'A new queen can dominate the board and decide the game.';
          } else {
            impact = 'Gradually improves your position and restricts your opponent.';
          }
          
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
      console.log(`Attempting to load PGN with ID: ${pgnId}`);
      const response = await axios.get(`/api/pgns/${pgnId}`);
      const selectedPgnContent = response.data.content;
      console.log("Received PGN content for loading:", selectedPgnContent);
      console.log(`Frontend: PGN content length received: ${selectedPgnContent ? selectedPgnContent.length : 0}`);

      // Validate PGN with pgn-parser first
      let parsed;
      try {
        parsed = pgnParser.parse(selectedPgnContent, { startRule: 'games' });
      } catch (err) {
        console.error('PGN failed to parse with @mliebelt/pgn-parser:', err);
        alert('Failed to load PGN: PGN is not valid.');
        return;
      }
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        console.error('PGN failed to parse with @mliebelt/pgn-parser: No games found.');
        alert('Failed to load PGN: PGN is not valid.');
        return;
      }

      // Use the sanitizer to clean the PGN
      let sanitizedPgn;
      try {
        sanitizedPgn = sanitizePGN(selectedPgnContent);
      } catch (sanitizeError) {
        console.error('PGN sanitization failed:', sanitizeError);
        alert('Failed to load PGN: Invalid PGN format.');
        return;
      }

      // Load the sanitized PGN into chess.js
      const newGame = new Chess();
      try {
        newGame.loadPgn(sanitizedPgn);
      } catch (loadError) {
        console.error("Chess.js failed to load PGN:", loadError);
        throw new Error("Failed to load PGN: Chess.js could not parse the PGN content.");
      }
      
      const moves = newGame.history();
      setMoveStack(moves);
      setRedoStack([]);
      // useEffect will handle setting game, fen, pgn
    } catch (error) {
      console.error('Error loading PGN in handleLoadPgn:', error);
      alert('Failed to load PGN. Please try again.');
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

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Game Analysis</h1>
          <p className="text-xl text-muted-foreground">
            Upload your game, analyze positions, and learn from the masters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Chess Board</CardTitle>
                <CardDescription>Make moves or upload a PGN to analyze</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Undo/Redo/Reset/Analyze with GM Buttons */}
            <div className="flex flex-col lg:flex-row justify-center gap-8 mt-4">
              <div className="flex gap-2 justify-center w-full">
                <Button onClick={handleUndo} disabled={moveStack.length === 0}>Undo</Button>
                <Button onClick={handleRedo} disabled={redoStack.length === 0}>Redo</Button>
                <Button className="bg-[#23263a] text-white hover:bg-[#4f46e5]" onClick={resetAnalysis}>Reset Board</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="bg-[#23263a] text-[#818cf8] border border-[#818cf8] hover:bg-[#4f46e5] hover:text-white"
                      variant="outline"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Analyze with GM
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white">
                    {grandmasters.map((gm) => (
                      <DropdownMenuItem key={gm} onClick={() => handleGMSelect(gm)} className="hover:bg-slate-700 cursor-pointer">
                        {gm}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Game Controls</CardTitle>
                <CardDescription>Upload PGN or analyze current position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Paste your PGN here..."
                    value={pgn}
                    onChange={handlePgnUpload}
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter filename"
                        value={pgnFilename}
                        onChange={(e) => setPgnFilename(e.target.value)}
                      />
                      <Button onClick={handleSavePgn}>
                        <Database className="mr-2 h-4 w-4" />
                        Save PGN
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Database className="mr-2 h-4 w-4" />
                            Load Saved PGN
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {savedPgns.map((pgn) => (
                            <DropdownMenuItem
                              key={pgn.id}
                              onClick={() => {
                                console.log("DropdownMenuItem clicked for PGN:", pgn);
                                handleLoadPgn(pgn.id);
                              }}
                            >
                              {pgn.name} ({new Date(pgn.created_at).toLocaleDateString()})
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-white mb-1">Analyze Game</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold px-6 py-2 rounded-lg">
                          Choose Grandmaster
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleGMSelect('Hikaru Nakamura')}>What would Hikaru do in this situation?</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGMSelect('Magnus Carlsen')}>What would Magnus do in this situation?</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGMSelect('Viswanathan Anand')}>What would Viswanathan Anand do in this situation?</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGMSelect('Gukesh')}>What would Gukesh do in this situation?</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* Chatbot UI */}
                {chatbotActive && (
                  <div className="mt-6 bg-[#181f2a] rounded-lg p-4 max-h-64 overflow-y-auto border border-[#23263a]">
                    <div className="font-semibold text-[#a78bfa] mb-2">{selectedGM}:</div>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="mb-2 text-white">
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
                  <div className="mt-6 bg-[#181f2a] rounded-lg p-4 border border-[#23263a]">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-[#a78bfa] mr-2">Suggested Move Analysis:</h3>
                      <button
                        type="button"
                        aria-label="Speak analysis"
                        onClick={speakText}
                        className="ml-2 p-1 rounded hover:bg-[#23263a]"
                        style={{ lineHeight: 0 }}
                        disabled={!voiceEnabled}
                        title={voiceEnabled ? "Speak analysis" : "Enable voice to use"}
                      >
                        <Volume2 className={`w-5 h-5 ${voiceEnabled ? "text-[#a78bfa]" : "text-gray-500"}`} />
                      </button>
                    </div>
                    <div id="analysis-result" className="text-white" dangerouslySetInnerHTML={{ __html: explanationText }} />
                  </div>
                )}

                {selectedGM && (
                  <GrandmasterInfo grandmasterName={selectedGM} />
                )}
              </CardContent>
            </Card>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Analysis Features</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Brain className="h-8 w-8 mb-2" />
                    <CardTitle>AI Analysis</CardTitle>
                    <CardDescription>Get instant computer analysis</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 mb-2" />
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>View detailed game statistics</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <CardTitle>Mistakes</CardTitle>
                    <CardDescription>Find and learn from mistakes</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
