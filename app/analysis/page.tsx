"use client"

import { useState, useRef } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Upload, Crown, Zap, TrendingUp, AlertCircle, Search, Database } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import axios from "axios"
import { StockfishWrapper } from "../lib/stockfish"

export default function AnalysisPage() {
  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState(game.fen())
  const [pgn, setPgn] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [chatbotActive, setChatbotActive] = useState(false)
  const [selectedGM, setSelectedGM] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{from: string, text: string}>>([])
  const [suggestedMove, setSuggestedMove] = useState<{ from: string, to: string } | null>(null)
  const [explanationText, setExplanationText] = useState<string>('')
  const [analysisCount, setAnalysisCount] = useState(0)
  const boardRef = useRef<any>(null)

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
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      })

      if (move === null) return false

      setFen(game.fen())
      setPgn(game.pgn())
      return true
    } catch (error) {
      return false
    }
  }

  function handlePgnUpload(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const uploadedPgn = event.target.value
    try {
      const newGame = new Chess()
      newGame.loadPgn(uploadedPgn)
      setGame(newGame)
      setFen(newGame.fen())
      setPgn(uploadedPgn)
    } catch (error) {
      console.error("Invalid PGN format")
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
        // Animate move on the board
        setTimeout(() => {
          try {
            const chess = new Chess(fen);
            chess.move(suggestedMove);
            setFen(chess.fen());
            setAnalysisCount(prev => prev + 1);
          } catch (e) {
            console.error("Error animating move:", e);
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

                {explanationText && (
                  <div className="mt-6 bg-[#181f2a] rounded-lg p-4 border border-[#23263a]">
                    <h3 className="font-semibold text-[#a78bfa] mb-2">Suggested Move Analysis:</h3>
                    <div className="text-white" dangerouslySetInnerHTML={{ __html: explanationText }} />
                  </div>
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
