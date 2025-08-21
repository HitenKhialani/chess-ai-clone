import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NextActionsCardProps {
  onRetry: () => void;
  onPlayPuzzle: () => void;
  onAnalyzeAnother: () => void;
  onPracticeTactics: () => void;
}

export const NextActionsCard: React.FC<NextActionsCardProps> = ({ onRetry, onPlayPuzzle, onAnalyzeAnother, onPracticeTactics }) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Next Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button onClick={onRetry} variant="default">🔁 Retry from Mistake</Button>
        <Button onClick={onPlayPuzzle} variant="outline">♟️ Play Similar Puzzle</Button>
        <Button onClick={onAnalyzeAnother} variant="outline">📊 Analyze Another Game</Button>
        <Button onClick={onPracticeTactics} variant="outline">🎯 Practice Tactics</Button>
      </CardContent>
    </Card>
  );
};

export default NextActionsCard; 