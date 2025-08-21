import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Play, Pause } from "lucide-react";

interface VoiceExplanationCardProps {
  message: string;
}

export const VoiceExplanationCard: React.FC<VoiceExplanationCardProps> = ({ message }) => {
  const [playing, setPlaying] = useState(false);

  const handleToggle = () => {
    setPlaying((p) => !p);
    // Integrate with TTS system if available
  };

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Volume2 className="w-5 h-5 text-primary" /> Voice Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-start">
        <Button onClick={handleToggle} variant="outline" className="flex items-center gap-2">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {playing ? "Pause" : "Play"} Audio
        </Button>
        <div className="text-muted-foreground mt-2">{message}</div>
      </CardContent>
    </Card>
  );
};

export default VoiceExplanationCard; 