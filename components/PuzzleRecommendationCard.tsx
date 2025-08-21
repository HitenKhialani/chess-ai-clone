import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle } from "lucide-react";

interface PuzzleRecommendationCardProps {
  missedCount: number;
  section: string;
  puzzlePath: string[]; // e.g., ["Openings", "Puzzle 1"]
  puzzleUrl: string;
}

const PuzzleRecommendationCard: React.FC<PuzzleRecommendationCardProps> = ({
  missedCount,
  section,
  puzzlePath,
  puzzleUrl,
}) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">Puzzle Recommendation</CardTitle>
        <CardDescription className="text-sm">
          {`You missed ${missedCount} puzzle${missedCount !== 1 ? 's' : ''} in the ${section.toLowerCase()}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Puzzle className="w-5 h-5 text-primary" />
          <span>
            Practice: {puzzlePath.map((part, i) => (
              <span key={i} className="font-semibold text-primary">
                {part}{i < puzzlePath.length - 1 && <span className="mx-1 text-muted-foreground">→</span>}
              </span>
            ))}
          </span>
        </div>
        <Button asChild className="w-fit mt-2" variant="default">
          <a href={puzzleUrl} target="_blank" rel="noopener noreferrer">
            ♟️ Go to Puzzle
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PuzzleRecommendationCard; 