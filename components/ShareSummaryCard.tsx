import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareSummaryCardProps {
  accuracy: number;
  result: string;
  keyMistakes: string[];
  replayLink: string;
}

export const ShareSummaryCard: React.FC<ShareSummaryCardProps> = ({ accuracy, result, keyMistakes, replayLink }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(replayLink);
  };

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Share2 className="w-5 h-5 text-primary" /> Share Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex gap-4 items-center">
          <div className="text-2xl font-bold text-primary">{accuracy}%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
          <div className="text-xl font-bold text-primary ml-6">{result}</div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">Key Mistakes:</div>
        <ul className="list-disc ml-6 text-sm">
          {keyMistakes.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>Copy Link</Button>
          <Button size="sm" variant="outline" asChild>
            <a href={`https://wa.me/?text=${encodeURIComponent(replayLink)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(replayLink)}`} target="_blank" rel="noopener noreferrer">Telegram</a>
          </Button>
          <Button size="sm" variant="outline">Download PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareSummaryCard; 