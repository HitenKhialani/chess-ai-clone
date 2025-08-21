import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccuracyScoreCardProps {
  accuracy: number;
  message: string;
}

export const AccuracyScoreCard: React.FC<AccuracyScoreCardProps> = ({ accuracy, message }) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Accuracy Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - accuracy / 100)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary">{accuracy}%</span>
        </div>
        <div className="text-base text-muted-foreground mt-2">{message} <span className="text-2xl">🎯</span></div>
      </CardContent>
    </Card>
  );
};

export default AccuracyScoreCard; 