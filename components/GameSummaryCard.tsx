import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { estimateEloFromAccuracy } from "@/lib/eloEstimator";

interface GameSummaryCardProps {
  opening: string;
  accuracy: number;
  result: string;
  moveCounts: {
    Brilliant: number;
    Correct: number;
    Mistake: number;
    Blunder: number;
  };
  totalMoves: number;
}

const typeColors: Record<string, string> = {
  Brilliant: "bg-[var(--accent)] text-[var(--accent-foreground)]",
  Correct: "bg-[var(--accent)] text-[var(--accent-foreground)]",
  Mistake: "bg-yellow-500 text-black",
  Blunder: "bg-[var(--destructive)] text-[var(--accent-foreground)]",
};

export const GameSummaryCard: React.FC<GameSummaryCardProps> = ({
  opening,
  accuracy,
  result,
  moveCounts,
  totalMoves,
}) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">Game Summary</CardTitle>
        <CardDescription className="text-sm">Overview of your game performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Opening</div>
            <div className="font-semibold text-primary text-base">{opening}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
            <div className="font-bold text-2xl text-primary">{accuracy}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Result</div>
            <div className="font-bold text-xl text-primary">{result}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Moves</div>
            <div className="font-bold text-xl text-primary">{Math.ceil(totalMoves / 2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">ELO</div>
            <div className="font-bold text-xl text-primary">{estimateEloFromAccuracy(accuracy)}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(moveCounts).map(([type, count]) => (
            <Badge key={type} className={`rounded-full px-3 py-1 font-semibold ${typeColors[type]}`}>{type}: {count}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSummaryCard; 