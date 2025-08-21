import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface WhatWouldMagnusDoCardProps {
  move: string;
  reasoning: string;
}

export const WhatWouldMagnusDoCard: React.FC<WhatWouldMagnusDoCardProps> = ({ move, reasoning }) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Crown className="w-5 h-5 text-yellow-400" /> What Would Magnus Do?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-lg font-bold text-primary mb-2">{move}</div>
        <div className="text-muted-foreground text-sm">{reasoning}</div>
      </CardContent>
    </Card>
  );
};

export default WhatWouldMagnusDoCard; 