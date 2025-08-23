"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { analyzeMovesLocally } from "@/app/lib/stockfish";
// New enhanced cards
import EnhancedGameSummaryCard from "@/components/EnhancedGameSummaryCard";
import MoveInsightsCard from "@/components/MoveInsightsCard";
import GraphsCard from "@/components/GraphsCard";
import LearningImprovementCard from "@/components/LearningImprovementCard";
import PuzzleCard from "@/components/ExportShareCard";

// Legacy cards (kept for backward compatibility)
import GameSummaryCard from "@/components/GameSummaryCard";
import LessonRecommendationCard from "@/components/LessonRecommendationCard";
import MistakeReplayCard from "@/components/MistakeReplayCard";
import EvaluationGraphCard from "@/components/EvaluationGraphCard";
import AccuracyScoreCard from "@/components/AccuracyScoreCard";
import NextActionsCard from "@/components/NextActionsCard";
import SideBySideComparisonCard from "@/components/SideBySideComparisonCard";
import VoiceExplanationCard from "@/components/VoiceExplanationCard";
import WhatWouldMagnusDoCard from "@/components/WhatWouldMagnusDoCard";
import ShareSummaryCard from "@/components/ShareSummaryCard";
import { motion, AnimatePresence } from "framer-motion";
import { Info, RotateCcw, AlertTriangle, Trophy, CheckCircle, XCircle, FileText, Lightbulb, X } from "lucide-react";
import { generateGameReportPDF, generateComprehensiveGameReportPDF } from "@/lib/pdfGenerator";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import ChessboardPanel from "./ChessboardPanel";
import MoveHistoryPanel from "./MoveHistoryPanel";
import MoveTypePieChart from "./MoveTypePieChart";
import { Progress } from "@/components/ui/progress";
import PuzzleRecommendationCard from "./PuzzleRecommendationCard";
import { Button } from "@/components/ui/button";
import { useMoveExplanation } from "@/hooks/useMoveExplanation";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface GameReviewProps {
  moveHistory: string[];
  analysis?: ReviewMove[];
  accuracy?: number;
  result?: string;
  opening?: string;
  lessons?: { theme: string; tips: string[] }[];
  keyMistakes?: string[];
  magnusSuggestion?: { move: string; reasoning: string };
  shouldSave?: boolean;
  fullPage?: boolean;
  gameResult?: string; // Added for compatibility with usages
  onClose?: () => void; // Added for compatibility with usages
  playerColor?: "white" | "black";
}

const getFensFromMoves = (moves: { move: string }[]): string[] => {
  const chess = new Chess();
  const fens = [chess.fen()];
  moves.forEach((move: { move: string }) => {
    try {
      chess.move(move.move);
      fens.push(chess.fen());
    } catch (error) {
      console.error('Invalid move:', move.move, error);
      // Skip invalid moves but continue processing
    }
  });
  return fens;
};

// For circular progress, fallback to styled bar if not available
const CircularProgress = ({ value, max = 100, size = 64, stroke = 8, color = '#ef4444', bg = '#e5e7eb' }: { value: number; max?: number; size?: number; stroke?: number; color?: string; bg?: string }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  return (
    <svg width={size} height={size} className="block mx-auto">
      <circle cx={size/2} cy={size/2} r={radius} stroke={bg} strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={circ} strokeDashoffset={circ * (1-pct)} strokeLinecap="round" style={{transition:'stroke-dashoffset 0.5s'}} />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="1.1em" fill={color} fontWeight="bold">{Math.round(value)}%</text>
    </svg>
  );
};

// Utility for double border effect
const doubleBorder = "border-2 border-accent/50 bg-card rounded-2xl shadow p-4 relative before:content-[''] before:absolute before:inset-1 before:rounded-xl before:border before:border-accent/30 before:pointer-events-none";

// New component for the mini-summary block
const MiniSummaryBlock = ({ analysis }: { analysis: ReviewMove[] }) => {
  const stats = {
    brilliant: analysis.filter(m => m.type === "Brilliant").length,
    correct: analysis.filter(m => m.type === "Correct").length,
    mistakes: analysis.filter(m => m.type === "Mistake").length,
    blunders: analysis.filter(m => m.type === "Blunder").length
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-4 gap-4 max-w-2xl">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-500">{stats.brilliant}</div>
          <div className="text-sm text-muted-foreground">Brilliant</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{stats.correct}</div>
          <div className="text-sm text-muted-foreground">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.mistakes}</div>
          <div className="text-sm text-muted-foreground">Mistakes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{stats.blunders}</div>
          <div className="text-sm text-muted-foreground">Blunders</div>
        </div>
      </div>
    </div>
  );
};

// New AI Explanation Panel Component
const AIExplanationPanel = ({ 
  selectedMove, 
  onClose,
  isLoading = false
}: { 
  selectedMove: ReviewMove | null; 
  onClose: () => void; 
  isLoading?: boolean;
}) => {
  console.log('AIExplanationPanel received:', { selectedMove, isLoading });
  if (!selectedMove) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card rounded-lg shadow-lg border-2 border-dashed border-muted">
        <div className="text-center text-muted-foreground">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Click on any move to see AI analysis</p>
          <p className="text-sm">The AI will provide insights about the move's quality and strategic implications</p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Brilliant':
        return 'text-cyan-400 bg-cyan-950/50 border-cyan-400/30';
      case 'Correct':
        return 'text-green-400 bg-green-950/50 border-green-400/30';
      case 'Mistake':
        return 'text-yellow-400 bg-yellow-950/50 border-yellow-400/30';
      case 'Blunder':
        return 'text-red-400 bg-red-950/50 border-red-400/30';
      default:
        return 'text-muted-foreground bg-muted/50 border-muted/30';
    }
  };

  return (
    <div className="w-full h-full bg-card rounded-lg shadow-lg border-2 border-accent/50">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-accent" />
            <h3 className="text-xl font-bold text-foreground">
              Explanation of {selectedMove.move}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/20 rounded-full transition-colors duration-200"
            aria-label="Close explanation"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedMove.type)}`}>
            {selectedMove.type}
          </span>
          <span className="text-sm text-muted-foreground">
            Eval: {selectedMove.evaluation}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 text-foreground leading-relaxed">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Generating AI explanation...</p>
              </div>
            ) : selectedMove.explanation ? (
              <div className="text-base whitespace-pre-line leading-relaxed">
                {console.log('Rendering explanation:', selectedMove.explanation)}
                {selectedMove.explanation}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Accomplishment:</h4>
                  <p>This move {selectedMove.type.toLowerCase()} the position by {selectedMove.evaluation.startsWith('-') ? 'giving up advantage' : 'gaining advantage'}.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Why "{selectedMove.type}" ({selectedMove.evaluation} eval):</h4>
                  <p>This move {selectedMove.type === 'Correct' ? 'follows sound chess principles' : selectedMove.type === 'Brilliant' ? 'demonstrates exceptional tactical insight' : 'deviates from optimal play'}.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Concepts:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Position evaluation: {selectedMove.evaluation}</li>
                    <li>Move quality: {selectedMove.type}</li>
                    <li>Strategic implications: {selectedMove.type === 'Correct' || selectedMove.type === 'Brilliant' ? 'Maintains or improves position' : 'Creates weaknesses or tactical opportunities for opponent'}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Refactored Move History Panel for the new layout
const RefactoredMoveHistoryPanel = ({ 
  analysis, 
  currentMoveIdx, 
  onMoveClick,
  moveHistory,
  onAnalysisUpdate
}: { 
  analysis: ReviewMove[]; 
  currentMoveIdx: number; 
  onMoveClick: (move: ReviewMove, idx: number) => void;
  moveHistory: string[];
  onAnalysisUpdate: (newAnalysis: ReviewMove[]) => void;
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Brilliant':
        return 'text-cyan-500';
      case 'Correct':
        return 'text-green-500';
      case 'Mistake':
        return 'text-yellow-500';
      case 'Blunder':
        return 'text-red-500';
      default:
        return 'text-[var(--muted-foreground)]';
    }
  };

  // Group moves into pairs (White and Black moves)
  const movePairs = [];
  for (let i = 0; i < analysis.length; i += 2) {
    const whiteMove = analysis[i];
    const blackMove = analysis[i + 1];
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: whiteMove,
      black: blackMove
    });
  }

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handler for Get AI Analysis button
  const handleGetAIAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the original move history for AI analysis
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moves: moveHistory }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get AI analysis');
      }
      
      const data = await res.json();
      if (data.analysis && Array.isArray(data.analysis)) {
        // Update analysis directly through callback
        onAnalysisUpdate(data.analysis);
        setError(null);
      } else {
        setError('Invalid analysis format returned');
      }
    } catch (e: any) {
      console.error('AI Analysis error:', e);
      setError(e.message || 'Failed to analyze game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-card rounded-lg shadow-lg flex flex-col">
      <div className="font-bold text-lg mb-4 flex items-center gap-2 justify-center p-4 border-b">
        Move History
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b border-muted">
              <th className="py-2 px-1 text-xs">#</th>
              <th className="py-2 px-1 text-xs">White Move</th>
              <th className="py-2 px-1 text-xs">Type</th>
              <th className="py-2 px-1 text-xs">Eval</th>
              <th className="py-2 px-1 text-xs">Black Move</th>
              <th className="py-2 px-1 text-xs">Type</th>
              <th className="py-2 px-1 text-xs">Eval</th>
            </tr>
          </thead>
          <tbody>
            {movePairs.map((pair, idx) => (
              <tr
                key={idx}
                className={`border-b border-muted group hover:bg-accent/20 ${
                  (currentMoveIdx - 1 >= pair.moveNumber * 2 - 2 && currentMoveIdx - 1 <= pair.moveNumber * 2 - 1)
                    ? 'bg-accent/30'
                    : ''
                }`}
              >
                {/* Move Number */}
                <td className="py-2 px-1 font-mono text-xs">
                  {pair.moveNumber}
                </td>
                {/* White Move */}
                <td className="py-2 px-1 font-mono text-xs">
                  {pair.white ? (
                    <span
                      className="hover:bg-accent/40 cursor-pointer block rounded px-1 py-1 transition-colors"
                      onClick={() => onMoveClick(pair.white, pair.moveNumber * 2 - 1)}
                    >
                      {pair.white.move}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                {/* White Move Type */}
                <td className={`py-2 px-1 font-bold text-xs ${getTypeColor(pair.white?.type || '')}`}>
                  {pair.white?.type || '-'}
                </td>
                {/* White Move Evaluation */}
                <td className="py-2 px-1 font-mono text-xs">
                  {pair.white?.evaluation || '-'}
                </td>
                {/* Black Move */}
                <td className="py-2 px-1 font-mono text-xs">
                  {pair.black ? (
                    <span
                      className="hover:bg-accent/40 cursor-pointer block rounded px-1 py-1 transition-colors"
                      onClick={() => onMoveClick(pair.black, pair.moveNumber * 2)}
                    >
                      {pair.black.move}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                {/* Black Move Type */}
                <td className={`py-2 px-1 font-bold text-xs ${getTypeColor(pair.black?.type || '')}`}>
                  {pair.black?.type || '-'}
                </td>
                {/* Black Move Evaluation */}
                <td className="py-2 px-1 font-mono text-xs">
                  {pair.black?.evaluation || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-center mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleGetAIAnalysis}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Get AI Analysis'}
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};

// New component for the comprehensive PDF export button
const ComprehensivePDFExportButton = ({
  analysis,
  playerColor,
  opening,
  result,
  totalMoves,
  accuracy,
  moveHistory,
  elo,
  totalTime,
  moveTypesChartRef,
  accuracyByPhaseChartRef,
  positionEvaluationChartRef,
  moveRiskProfileChartRef,
  overviewSectionRef,
  finalBoardSectionRef,
  moveHistorySectionRef,
  chartsSectionRef,
  learningSectionRef,
  prepareFinalBoardCapture
}: {
  analysis: any[],
  playerColor: string,
  opening: string,
  result: string,
  totalMoves: number,
  accuracy: number,
  moveHistory: string[],
  elo: number,
  totalTime: number,
  moveTypesChartRef?: React.RefObject<HTMLElement>,
  accuracyByPhaseChartRef?: React.RefObject<HTMLElement>,
  positionEvaluationChartRef?: React.RefObject<HTMLElement>,
  moveRiskProfileChartRef?: React.RefObject<HTMLElement>,
  overviewSectionRef?: React.RefObject<HTMLElement>,
  finalBoardSectionRef?: React.RefObject<HTMLElement>,
  moveHistorySectionRef?: React.RefObject<HTMLElement>,
  chartsSectionRef?: React.RefObject<HTMLElement>,
  learningSectionRef?: React.RefObject<HTMLElement>,
  prepareFinalBoardCapture?: () => Promise<() => void> | (() => void)
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);
    // Ensure the chessboard reflects the FINAL position during capture
    let restore: (() => void) | void | null = null;
    try {
      if (prepareFinalBoardCapture) {
        const cleanupOrPromise = prepareFinalBoardCapture();
        restore = cleanupOrPromise instanceof Promise ? await cleanupOrPromise : cleanupOrPromise;
        // allow layout to settle
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 120)));
      }

      console.log('Starting PDF generation with data:', {
        analysisLength: analysis?.length,
        moveHistoryLength: moveHistory?.length,
        accuracy,
        totalMoves
      });
      
      await generateComprehensiveGameReportPDF({
        analysis,
        playerColor,
        opening: opening || "Unknown Opening",
        result: result || "Draw",
        totalMoves,
        accuracy,
        playerName: "Player",
        opponentName: "Opponent",
        date: new Date().toLocaleDateString(),
        moveHistory,
        playerElo: elo,
        totalGameTime: totalTime,
        moveTypesChartElement: moveTypesChartRef?.current || undefined,
        accuracyByPhaseChartElement: accuracyByPhaseChartRef?.current || undefined,
        positionEvaluationChartElement: positionEvaluationChartRef?.current || undefined,
        moveRiskProfileChartElement: moveRiskProfileChartRef?.current || undefined,
        // Pixel-perfect section elements (dereferenced at click time)
        overviewElement: overviewSectionRef?.current || undefined,
        finalBoardElement: finalBoardSectionRef?.current || undefined,
        moveHistoryElement: moveHistorySectionRef?.current || undefined,
        chartsElement: chartsSectionRef?.current || undefined,
        learningElement: learningSectionRef?.current || undefined
      });
      
      console.log('PDF generation completed successfully');
    } catch (error) {
      console.error('PDF generation failed with detailed error:', error);
      console.error('Error stack:', error.stack);
      alert(`PDF generation failed: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      // restore user position if we changed it for capture
      try { if (restore) restore(); } catch {}
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="mt-8">
      <Button
        onClick={handleExportPDF}
        disabled={isGeneratingPDF}
        className="w-full bg-gradient-to-r from-[#00F5D4] to-[#57CC99] hover:from-[#00F5D4]/90 hover:to-[#57CC99]/90 text-[var(--card-foreground)] font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg group text-lg"
        title="Export comprehensive game analysis as PDF report"
      >
        {isGeneratingPDF ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Generating Comprehensive PDF...
          </>
        ) : (
          <>
            <FileText className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
            📊 Download Comprehensive Game Report
          </>
        )}
      </Button>
    </div>
  );
};

const GameReview: React.FC<GameReviewProps> = ({
  moveHistory,
  analysis: analysisProp,
  accuracy: accuracyProp,
  result: resultProp,
  opening: openingProp,
  playerColor: playerColorProp,
  lessons: lessonsProp,
  keyMistakes: keyMistakesProp,
  magnusSuggestion: magnusSuggestionProp,
  shouldSave = false,
  fullPage = false,
}) => {
  // Add refs for chart elements
  const moveTypesChartRef = useRef<HTMLDivElement>(null);
  const accuracyByPhaseChartRef = useRef<HTMLDivElement>(null);
  const positionEvaluationChartRef = useRef<HTMLDivElement>(null);
  const moveRiskProfileChartRef = useRef<HTMLDivElement>(null);
  // Refs for pixel-perfect PDF capture sections
  const overviewSectionRef = useRef<HTMLDivElement>(null);
  const finalBoardSectionRef = useRef<HTMLDivElement>(null);
  const moveHistorySectionRef = useRef<HTMLDivElement>(null);
  const chartsSectionRef = useRef<HTMLDivElement>(null);
  const learningSectionRef = useRef<HTMLDivElement>(null);

  // All hooks must be called at the top level, before any conditional returns
  const [analysis, setAnalysis] = useState<ReviewMove[]>(analysisProp || []);
  const [accuracy, setAccuracy] = useState<number>(accuracyProp || 0);
  const [elo, setElo] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(0);
  const [tryMoveMode, setTryMoveMode] = useState(false);
  const [userChess, setUserChess] = useState(new Chess());
  const [userFen, setUserFen] = useState(userChess.fen());
  const [showMistakeReplay, setShowMistakeReplay] = useState(false);
  const [mistakeReplayData, setMistakeReplayData] = useState<{ fen: string; engineMove: string } | null>(null);
  const [showAllMistakes, setShowAllMistakes] = useState(false);
  const [selectedMoveForExplanation, setSelectedMoveForExplanation] = useState<ReviewMove | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  // Guard
  if (!Array.isArray(moveHistory) || moveHistory.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-xl text-muted-foreground">
        No game data found. Please start a review from a completed game.
      </div>
    );
  }

  // Helper function for player titles
  const getRandomPlayerTitle = (accuracy: number): string => {
    if (accuracy >= 90) return "Grandmaster Candidate";
    if (accuracy >= 80) return "Tactical Warrior";
    if (accuracy >= 70) return "Strategic Thinker";
    if (accuracy >= 60) return "Chess Enthusiast";
    if (accuracy >= 50) return "Learning Player";
    return "Blunder Knight";
  };

  // Only set analysis from analysisProp on initial mount
  useEffect(() => {
    if (analysisProp) setAnalysis(analysisProp);
    // eslint-disable-next-line
  }, []);

  // Only fetch analysis if analysisProp is not provided and moveHistory is non-empty
  useEffect(() => {
    if (!analysisProp && moveHistory.length > 0) {
      setLoading(true);
      analyzeMovesLocally(moveHistory, Chess, 15)
        .then((data) => {
          setAnalysis(data.analysis);
          setAccuracy(data.accuracy);
          setElo(data.elo);
        })
        .catch((error) => {
          console.error('❌ Stockfish analysis failed:', error);
          const mockAnalysis = moveHistory.map((move: string, idx: number) => {
            const isCheckmate = move.includes('#');
            if (isCheckmate) {
              return { move, type: 'Brilliant', explanation: 'Checkmate! The ultimate winning move.', evaluation: '30.00', bestMove: move };
            }
            return { move, type: idx % 10 === 7 ? 'Blunder' : idx % 7 === 4 ? 'Mistake' : idx % 3 === 1 ? 'Correct' : 'Brilliant', explanation: `Move ${idx + 1}` as string, evaluation: (Math.random() * 2 - 1).toFixed(2), bestMove: 'e4' };
          });
          setAnalysis(mockAnalysis);
        })
        .finally(() => setLoading(false));
    }
  }, [analysisProp, moveHistory]);

  // Listen for AI analysis update event
  useEffect(() => {
    const handler = (event: any) => {
      if (event.detail && event.detail.analysis) {
        setAnalysis(event.detail.analysis);
      }
    };
    window.addEventListener('ai-analysis-update', handler);
    return () => window.removeEventListener('ai-analysis-update', handler);
  }, []);

  // FENs for board navigation
  const fens = useMemo(() => analysis.length > 0 ? getFensFromMoves(analysis) : [new Chess().fen()], [analysis]);

  useEffect(() => {
    if (!tryMoveMode && fens.length > 0 && currentMoveIdx < fens.length) {
      setUserChess(new Chess(fens[currentMoveIdx]));
      setUserFen(fens[currentMoveIdx]);
    }
  }, [currentMoveIdx, tryMoveMode, fens]);

  // Ensure FINAL board position for PDF capture, then restore prior state
  const prepareFinalBoardCapture = () => {
    try {
      const prevIdx = currentMoveIdx;
      const prevFen = userFen;
      const prevTry = tryMoveMode;
      const finalIdx = Math.max(0, fens.length - 1);
      const finalFen = fens[finalIdx];

      // Force board to final state
      setTryMoveMode(false);
      setCurrentMoveIdx(finalIdx);
      setUserChess(new Chess(finalFen));
      setUserFen(finalFen);

      // Return cleanup to restore previous state
      return () => {
        setTryMoveMode(prevTry);
        setCurrentMoveIdx(prevIdx);
        setUserChess(new Chess(prevFen));
        setUserFen(prevFen);
      };
    } catch (e) {
      console.warn('prepareFinalBoardCapture failed, proceeding without adjustment', e);
      return () => {};
    }
  };

  // AI explanation
  const { getExplanation } = useMoveExplanation();
  useEffect(() => {
    const handleMoveClick = async (event: CustomEvent) => {
      const { move } = event.detail;
      setIsLoadingExplanation(true);
      try {
        const explanation = await getExplanation({
          move: move.move,
          position: `After move ${move.moveNumber || 1}`,
          moveType: move.type,
          evaluation: move.evaluation,
          moveNumber: move.moveNumber || 1,
          playerColor: move.playerColor || 'white',
          fenBefore: move.fenBefore,
          fenAfter: move.fenAfter,
        });
        setSelectedMoveForExplanation({ ...move, explanation });
      } catch (error) {
        const fallbackMove = { ...move, explanation: `This ${move.type.toLowerCase()} move (${move.evaluation} eval) ${move.type === 'Correct' || move.type === 'Brilliant' ? 'improves the position' : 'could be improved'}.` };
        setSelectedMoveForExplanation(fallbackMove);
      } finally {
        setIsLoadingExplanation(false);
      }
    };
    window.addEventListener('move-clicked', handleMoveClick as EventListener);
    return () => window.removeEventListener('move-clicked', handleMoveClick as EventListener);
  }, [getExplanation]);

  const handleBoardDrop = (source: string, target: string): boolean => {
    if (!tryMoveMode) return false;
    const chess = new Chess(userFen);
    const moveObj: any = { from: source, to: target };
    const piece = chess.get(source as any);
    const isPromotion = piece && piece.type === 'p' && ((piece.color === 'w' && target[1] === '8') || (piece.color === 'b' && target[1] === '1'));
    if (isPromotion) moveObj.promotion = 'q';
    const move = chess.move(moveObj);
    if (move) { setUserChess(chess); setUserFen(chess.fen()); return true; }
    return false;
  };

  const handleNav = (type: 'first' | 'prev' | 'next' | 'last'): void => {
    if (tryMoveMode) return;
    if (type === 'first') setCurrentMoveIdx(0);
    if (type === 'prev') setCurrentMoveIdx((idx) => Math.max(0, idx - 1));
    if (type === 'next') setCurrentMoveIdx((idx) => Math.min(fens.length - 1, idx + 1));
    if (type === 'last') setCurrentMoveIdx(fens.length - 1);
  };

  const allAnalysis = Array.isArray(analysis) ? analysis : [];
  const safeAnalysis = allAnalysis.filter((_, index) => index % 2 === 0);
  if (loading || allAnalysis.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Analyzing your game...</p>
        </div>
      </div>
    );
  }

  const moveCounts = safeAnalysis.reduce(
    (acc: { Brilliant: number; Correct: number; Mistake: number; Blunder: number }, move) => {
      if (acc.hasOwnProperty(move.type)) acc[move.type as keyof typeof acc] += 1;
      return acc;
    },
    { Brilliant: 0, Correct: 0, Mistake: 0, Blunder: 0 }
  );

  const opening = openingProp || "Unknown Opening";
  const lessons = lessonsProp || [];
  const magnusSuggestion = magnusSuggestionProp || { move: "-", reasoning: "No suggestion available." };
  const result = (() => {
    if (resultProp) return resultProp;
    if (moveHistory.length === 0) return "-";
    const lastMove = moveHistory[moveHistory.length - 1];
    if (lastMove.includes('#')) return moveHistory.length % 2 === 0 ? 'Loss' : 'Win';
    if (lastMove.includes('=') && lastMove.includes('1/2-1/2')) return 'Draw';
    if (lastMove.includes('1/2-1/2')) return 'Draw';
    if (lastMove.includes('1-0')) return moveHistory.length % 2 === 1 ? 'Win' : 'Loss';
    if (lastMove.includes('0-1')) return moveHistory.length % 2 === 1 ? 'Loss' : 'Win';
    return 'Draw';
  })();

  const calculatedAccuracy = accuracy || accuracyProp || 0;
  const totalTime = 1200;
  const enhancedGameResult = result?.toLowerCase().includes('win') ? 'win' : result?.toLowerCase().includes('loss') ? 'loss' : 'draw';
  const playerColor = 'white';

  return (
    <div className="w-full min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center shadow-md">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-foreground tracking-tight">Game Review</h1>
          <p className="mt-1 text-sm text-muted-foreground">Analyze your game with Stockfish and AI insights</p>
        </div>

        <Tabs defaultValue="game-view" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 rounded-lg border border-accent/30 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 overflow-hidden divide-x divide-accent/20">
            <TabsTrigger value="game-view" className="text-sm md:text-base font-semibold py-3 flex items-center gap-2 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-0 data-[state=active]:bg-accent/15 data-[state=active]:text-foreground text-muted-foreground rounded-none">📋 Game View</TabsTrigger>
            <TabsTrigger value="analytical-view" className="text-sm md:text-base font-semibold py-3 flex items-center gap-2 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-0 data-[state=active]:bg-accent/15 data-[state=active]:text-foreground text-muted-foreground rounded-none">📊 Analytical View</TabsTrigger>
          </TabsList>

          <TabsContent value="game-view" className="space-y-6">
            {/* Game View Tab - Chessboard and Move History */}
            <div className="flex flex-col md:flex-row justify-center items-start w-full max-w-4xl mx-auto gap-8" style={{ minHeight: 320 }}>
              {/* Final Board Section */}
              <div ref={finalBoardSectionRef} data-pdf-section="final-board" className="flex-1 flex items-center justify-center p-2 w-full md:w-1/2">
                <ChessboardPanel
                  userFen={userFen}
                  tryMoveMode={tryMoveMode}
                  onPieceDrop={handleBoardDrop}
                  onNav={handleNav}
                  onTryMoveToggle={() => {
                    setTryMoveMode((m) => !m);
                    if (tryMoveMode) {
                      setUserChess(new Chess(fens[currentMoveIdx]));
                      setUserFen(fens[currentMoveIdx]);
                    }
                  }}
                  currentMoveIdx={currentMoveIdx}
                  totalMoves={moveHistory.length}
                />
              </div>
              {/* Move History Section */}
              <div ref={moveHistorySectionRef} data-pdf-section="move-history" className="flex-1 flex flex-col p-2 w-full md:w-1/2">
                <MoveHistoryPanel
                  analysis={allAnalysis}
                  currentMoveIdx={currentMoveIdx}
                  onMistakeClick={(idx) => {
                    const fen = fens[idx];
                    const engineMove = analysis[idx]?.bestMove || "";
                    setMistakeReplayData({ fen, engineMove });
                    setShowMistakeReplay(true);
                  }}
                  setCurrentMoveIdx={setCurrentMoveIdx}
                  moveHistory={moveHistory}
                  onAnalysisUpdate={setAnalysis}
                />
                {/* AI Explanation below Move History */}
                <div className="mt-4">
                  <AIExplanationPanel
                    selectedMove={selectedMoveForExplanation}
                    onClose={() => setSelectedMoveForExplanation(null)}
                    isLoading={isLoadingExplanation}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytical-view" className="space-y-6">
            {/* Overview Section */}
            <div ref={overviewSectionRef} data-pdf-section="overview">
              <EnhancedGameSummaryCard
                opening={opening}
                ecoCode="A00"
                accuracy={calculatedAccuracy}
                result={result}
                totalMoves={moveHistory.length}
                totalTime={totalTime}
                gameResult={enhancedGameResult}
                analysis={safeAnalysis}
              />
              <MiniSummaryBlock analysis={safeAnalysis} />
            </div>

            {/* Graphs Section */}
            <div ref={chartsSectionRef} data-pdf-section="charts">
              <GraphsCard
                ref={moveTypesChartRef}
                analysis={safeAnalysis}
                playerColor={playerColor}
                totalGameTime={totalTime}
              />
            </div>

            {/* Analytical View intentionally excludes board and move history */}

            {/* Two-card-per-row layout for Learning and Export */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Section */}
              <div ref={learningSectionRef} data-pdf-section="learning">
                <LearningImprovementCard
                  analysis={safeAnalysis}
                  onStartLesson={(url) => window.open(url, '_blank')}
                  onStartPuzzle={(url) => window.open(url, '_blank')}
                />
              </div>

              {/* Puzzle Section */}
              <PuzzleCard analysis={safeAnalysis} />
            </div>

            {/* Comprehensive PDF Export Button */}
            <ComprehensivePDFExportButton
              analysis={safeAnalysis}
              playerColor={playerColor}
              opening={opening}
              result={result}
              totalMoves={Math.ceil(moveHistory.length / 2)}
              accuracy={calculatedAccuracy}
              moveHistory={moveHistory}
              elo={elo}
              totalTime={totalTime}
              moveTypesChartRef={moveTypesChartRef as unknown as React.RefObject<HTMLElement>}
              accuracyByPhaseChartRef={accuracyByPhaseChartRef as unknown as React.RefObject<HTMLElement>}
              positionEvaluationChartRef={positionEvaluationChartRef as unknown as React.RefObject<HTMLElement>}
              moveRiskProfileChartRef={moveRiskProfileChartRef as unknown as React.RefObject<HTMLElement>}
              overviewSectionRef={overviewSectionRef as React.RefObject<HTMLElement>}
              finalBoardSectionRef={finalBoardSectionRef as React.RefObject<HTMLElement>}
              moveHistorySectionRef={moveHistorySectionRef as React.RefObject<HTMLElement>}
              chartsSectionRef={chartsSectionRef as React.RefObject<HTMLElement>}
              learningSectionRef={learningSectionRef as React.RefObject<HTMLElement>}
              prepareFinalBoardCapture={prepareFinalBoardCapture}
            />
          </TabsContent>
        </Tabs>

        {/* Mistake Replay Modal */}
        {showMistakeReplay && mistakeReplayData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <MistakeReplayCard
              fen={mistakeReplayData.fen}
              engineMove={mistakeReplayData.engineMove}
              onClose={() => setShowMistakeReplay(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameReview;