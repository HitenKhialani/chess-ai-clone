"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Lightbulb, X } from "lucide-react";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface RefactoredGameReviewProps {
  moveHistory: string[];
  analysis?: ReviewMove[];
  accuracy?: number;
  result?: string;
  opening?: string;
  playerColor?: "white" | "black";
}

const getFensFromMoves = (moves: { move: string }[]): string[] => {
  const chess = new Chess();
  const fens = [chess.fen()];
  moves.forEach((move: { move: string }) => {
    chess.move(move.move);
    fens.push(chess.fen());
  });
  return fens;
};

// AI Explanation Panel Component
const AIExplanationPanel = ({ 
  selectedMove, 
  onClose 
}: { 
  selectedMove: ReviewMove | null; 
  onClose: () => void; 
}) => {
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
        return 'text-cyan-500 bg-cyan-50 border-[var(--border)]';
      case 'Correct':
        return 'text-green-500 bg-green-50 border-[var(--border)]';
      case 'Mistake':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'Blunder':
        return 'text-red-500 bg-red-50 border-[var(--border)]';
      default:
        return 'text-gray-500 bg-[var(--card)] border-[var(--border)]';
    }
  };

  return (
    <div className="w-full h-full bg-card rounded-lg shadow-lg border-2 border-[var(--border)] bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-[var(--primary)]" />
            <h3 className="text-xl font-bold text-[var(--card-foreground)]">
              Explanation of {selectedMove.move}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            aria-label="Close explanation"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedMove.type)}`}>
            {selectedMove.type}
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            Eval: {selectedMove.evaluation}
          </span>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className="text-[var(--card-foreground)] leading-relaxed">
            {selectedMove.explanation ? (
              <p className="text-base">
                {selectedMove.explanation}
              </p>
            ) : (
              <p className="text-base">
                This move {selectedMove.type.toLowerCase()} the position by {selectedMove.evaluation.startsWith('-') ? 'giving up advantage' : 'gaining advantage'}. 
                {selectedMove.type === 'Correct' ? ' It follows sound chess principles.' : 
                 selectedMove.type === 'Brilliant' ? ' It demonstrates exceptional tactical insight.' : 
                 ' It deviates from optimal play.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Refactored Move History Panel
const RefactoredMoveHistoryPanel = ({ 
  analysis, 
  currentMoveIdx, 
  onMoveClick 
}: { 
  analysis: ReviewMove[]; 
  currentMoveIdx: number; 
  onMoveClick: (move: ReviewMove, idx: number) => void; 
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
      </div>
    </div>
  );
};

// Refactored Chessboard Panel
const RefactoredChessboardPanel = ({
  userFen,
  currentMoveIdx,
  totalMoves,
  onNav
}: {
  userFen: string;
  currentMoveIdx: number;
  totalMoves: number;
  onNav: (type: 'first' | 'prev' | 'next' | 'last') => void;
}) => {
  // Responsive board width calculation
  const getBoardWidth = () => {
    if (typeof window === 'undefined') return 400;
    
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    if (isMobile) {
      return Math.min(300, window.innerWidth * 0.8);
    }
    return Math.min(400, window.innerWidth * 0.25);
  };

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center bg-card shadow-lg p-4">
      <Chessboard
        position={userFen}
        arePiecesDraggable={false}
        boardWidth={getBoardWidth()}
        customBoardStyle={{ borderRadius: 12, boxShadow: '0 2px 16px #0002' }}
      />
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button 
          className="px-2 py-1 bg-accent hover:bg-accent/80 rounded text-xs transition-colors disabled:opacity-50" 
          onClick={() => onNav('first')} 
          disabled={currentMoveIdx === 0}
        >
          {'|<'}
        </button>
        <button 
          className="px-2 py-1 bg-accent hover:bg-accent/80 rounded text-xs transition-colors disabled:opacity-50" 
          onClick={() => onNav('prev')} 
          disabled={currentMoveIdx === 0}
        >
          {'<'}
        </button>
        <span className="px-2 py-1 text-xs bg-muted rounded">
          {Math.ceil(currentMoveIdx / 2)} / {Math.ceil(totalMoves / 2)}
        </span>
        <button 
          className="px-2 py-1 bg-accent hover:bg-accent/80 rounded text-xs transition-colors disabled:opacity-50" 
          onClick={() => onNav('next')} 
          disabled={currentMoveIdx === totalMoves - 1}
        >
          {'>'}
        </button>
        <button 
          className="px-2 py-1 bg-accent hover:bg-accent/80 rounded text-xs transition-colors disabled:opacity-50" 
          onClick={() => onNav('last')} 
          disabled={currentMoveIdx === totalMoves - 1}
        >
          {'>|'}
        </button>
      </div>
    </Card>
  );
};

const RefactoredGameReview: React.FC<RefactoredGameReviewProps> = ({
  moveHistory,
  analysis: analysisProp,
  accuracy: accuracyProp,
  result: resultProp,
  opening: openingProp,
  playerColor = "white",
}) => {
  // State management
  const [analysis, setAnalysis] = useState<ReviewMove[]>(analysisProp || []);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(0);
  const [selectedMove, setSelectedMove] = useState<ReviewMove | null>(null);
  const [userChess, setUserChess] = useState(new Chess());
  const [userFen, setUserFen] = useState(userChess.fen());

  // Guard: If moveHistory is empty or not an array, show a message
  if (!Array.isArray(moveHistory) || moveHistory.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-xl text-muted-foreground">
        No game data found. Please start a review from a completed game.
      </div>
    );
  }

  // Generate FEN positions from moves
  const fens = useMemo(() => {
    const chess = new Chess();
    const fens = [chess.fen()];
    moveHistory.forEach((move) => {
      try {
        chess.move(move);
        fens.push(chess.fen());
      } catch (error) {
        console.error('Invalid move:', move);
      }
    });
    return fens;
  }, [moveHistory]);

  // Update FEN when current move changes
  useEffect(() => {
    if (fens[currentMoveIdx]) {
      setUserFen(fens[currentMoveIdx]);
    }
  }, [currentMoveIdx, fens]);

  // Navigation handlers
  const handleNav = (type: 'first' | 'prev' | 'next' | 'last'): void => {
    switch (type) {
      case 'first':
        setCurrentMoveIdx(0);
        break;
      case 'prev':
        setCurrentMoveIdx(Math.max(0, currentMoveIdx - 1));
        break;
      case 'next':
        setCurrentMoveIdx(Math.min(moveHistory.length, currentMoveIdx + 1));
        break;
      case 'last':
        setCurrentMoveIdx(moveHistory.length);
        break;
    }
  };

  // Move click handler
  const handleMoveClick = (move: ReviewMove, idx: number) => {
    setSelectedMove(move);
    setCurrentMoveIdx(idx);
  };

  // Close explanation handler
  const handleCloseExplanation = () => {
    setSelectedMove(null);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground font-sans">
      {/* Main Container - 100% of page */}
      <div className="w-full h-screen flex flex-col">
        {/* Top Section - 60% of screen height */}
        <div className="h-[60%] flex gap-6 p-4">
          {/* Left 60% - Chessboard */}
          <div className="w-[60%]">
            <RefactoredChessboardPanel
              userFen={userFen}
              currentMoveIdx={currentMoveIdx}
              totalMoves={moveHistory.length}
              onNav={handleNav}
            />
          </div>
          
          {/* Right 40% - Move History */}
          <div className="w-[40%]">
            <RefactoredMoveHistoryPanel
              analysis={analysis}
              currentMoveIdx={currentMoveIdx}
              onMoveClick={handleMoveClick}
            />
          </div>
        </div>

        {/* Bottom Section - 40% of screen height */}
        <div className="h-[40%] p-4">
          <AIExplanationPanel
            selectedMove={selectedMove}
            onClose={handleCloseExplanation}
          />
        </div>
      </div>
    </div>
  );
};

export default RefactoredGameReview; 