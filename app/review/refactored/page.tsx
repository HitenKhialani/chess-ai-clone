"use client";

import RefactoredGameReview from "@/components/RefactoredGameReview";
import { Suspense } from "react";

// Sample data for demonstration
const sampleMoveHistory = [
  "e4", "e6", "Ke2", "Qg5", "Kf3", "Nc6", "Be2", "Ne5"
];

const sampleAnalysis = [
  {
    move: "e4",
    type: "Correct",
    explanation: "This move stakes a claim in the center by occupying the e4-square, freeing the queen and king's bishop. It adheres to classical opening principles.",
    evaluation: "0.00"
  },
  {
    move: "e6",
    type: "Correct",
    explanation: "Black responds with a solid move that prepares to develop the light-squared bishop and maintains flexibility. This leads to the French Defense.",
    evaluation: "0.83"
  },
  {
    move: "Ke2",
    type: "Correct",
    explanation: "An unusual but playable move that develops the king to a safe square while keeping options open for the light-squared bishop.",
    evaluation: "1.73"
  },
  {
    move: "Qg5",
    type: "Correct",
    explanation: "Black immediately targets the exposed king and creates threats. This move puts pressure on White's position and forces White to respond carefully.",
    evaluation: "0.28"
  },
  {
    move: "Kf3",
    type: "Blunder",
    explanation: "This move exposes the king to immediate tactical threats. Black can now deliver a devastating blow with Nc6, creating a fork and winning material.",
    evaluation: "9.38"
  },
  {
    move: "Nc6",
    type: "Correct",
    explanation: "Black develops the knight and creates a fork threat. This move puts White in a difficult position and demonstrates good tactical awareness.",
    evaluation: "-2.58"
  },
  {
    move: "Be2",
    type: "Correct",
    explanation: "White tries to defend against the fork, but the position is already lost. This move attempts to protect the king but comes too late.",
    evaluation: "0.00"
  },
  {
    move: "Ne5",
    type: "Brilliant",
    explanation: "A brilliant tactical move that delivers checkmate! Black sacrifices the knight to create a beautiful mating pattern.",
    evaluation: "0.00"
  }
];

function RefactoredReviewPageContent() {
  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--primary-text)]">
      <RefactoredGameReview
        moveHistory={sampleMoveHistory}
        analysis={sampleAnalysis}
        accuracy={75}
        result="loss"
        opening="French Defense"
        playerColor="white"
      />
    </div>
  );
}

export default function RefactoredReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--card-foreground)]">Loading refactored review...</div>}>
      <RefactoredReviewPageContent />
    </Suspense>
  );
} 