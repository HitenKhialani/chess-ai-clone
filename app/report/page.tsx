'use client';

import React from 'react';
import GameReportPDF from '@/components/GameReportPDF';
import { generateGameReportPDF } from '@/lib/pdfGenerator';

// Sample game analysis data
const sampleAnalysis = [
  { move: "e4", type: "Brilliant", explanation: "Strong opening move", evaluation: "0.5", bestMove: "e4" },
  { move: "e5", type: "Correct", explanation: "Classical response", evaluation: "0.3", bestMove: "e5" },
  { move: "Nf3", type: "Brilliant", explanation: "Developing knight", evaluation: "0.4", bestMove: "Nf3" },
  { move: "Nc6", type: "Correct", explanation: "Natural development", evaluation: "0.2", bestMove: "Nc6" },
  { move: "Bc4", type: "Brilliant", explanation: "Italian Game", evaluation: "0.6", bestMove: "Bc4" },
  { move: "Bc5", type: "Correct", explanation: "Giuoco Piano", evaluation: "0.1", bestMove: "Bc5" },
  { move: "c3", type: "Brilliant", explanation: "Preparing d4", evaluation: "0.7", bestMove: "c3" },
  { move: "Nf6", type: "Mistake", explanation: "Allows d4", evaluation: "-0.8", bestMove: "d6" },
  { move: "d4", type: "Brilliant", explanation: "Central breakthrough", evaluation: "1.2", bestMove: "d4" },
  { move: "exd4", type: "Blunder", explanation: "Loses material", evaluation: "-2.1", bestMove: "Bb6" },
  { move: "cxd4", type: "Brilliant", explanation: "Winning pawn", evaluation: "2.5", bestMove: "cxd4" },
  { move: "Bb4+", type: "Mistake", explanation: "Desperation", evaluation: "-3.0", bestMove: "O-O" },
  { move: "Bd2", type: "Brilliant", explanation: "Blocking check", evaluation: "3.2", bestMove: "Bd2" },
  { move: "Bxd2+", type: "Blunder", explanation: "Loses bishop", evaluation: "-4.5", bestMove: "Bc5" },
  { move: "Nxd2", type: "Brilliant", explanation: "Winning piece", evaluation: "4.8", bestMove: "Nxd2" }
];

export default function ReportPage() {
  const handleGeneratePDF = async () => {
    try {
      await generateGameReportPDF({
        analysis: sampleAnalysis,
        playerColor: "white",
        opening: "Italian Game (Giuoco Piano)",
        result: "1-0",
        totalMoves: 15,
        accuracy: 73,
        playerName: "Player",
        opponentName: "Opponent",
        date: new Date().toLocaleDateString(),
        moveHistory: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4", "exd4", "cxd4", "Bb4+", "Bd2", "Bxd2+", "Nxd2"],
        playerElo: 1380,
        totalGameTime: 330
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Chess Game Report Demo</h1>
        <GameReportPDF 
          analysis={sampleAnalysis}
          opening="Italian Game (Giuoco Piano)"
          result="1-0"
          totalMoves={15}
          accuracy={73}
          onGeneratePDF={handleGeneratePDF}
        />
      </div>
    </div>
  );
} 