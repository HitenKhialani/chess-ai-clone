import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, BookOpen, Clock, Trophy } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { estimateEloFromAccuracy } from "@/lib/eloEstimator";

interface EnhancedGameSummaryCardProps {
  playerTitle?: string;
  opening: string;
  ecoCode?: string;
  accuracy: number;
  result: string;
  totalMoves: number;
  totalTime?: number; // in seconds
  gameResult?: "win" | "loss" | "draw";
  analysis?: Array<{ type: string }>; // For pie chart data
  onRematch?: () => void;
  onShare?: () => void;
}

const resultColors = {
  win: "bg-[var(--accent)] text-[var(--accent-foreground)]",
  loss: "bg-[var(--destructive)] text-[var(--accent-foreground)]", 
  draw: "bg-[var(--card)]0 text-[var(--accent-foreground)]"
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const COLORS = {
  Brilliant: '#06b6d4', // Cyan
  Correct: '#4CAF50',   // Green
  Mistake: '#FF9800',   // Yellow
  Blunder: '#F44336'    // Red
};

export const EnhancedGameSummaryCard: React.FC<EnhancedGameSummaryCardProps> = ({
  opening,
  ecoCode,
  accuracy,
  result,
  totalMoves,
  totalTime,
  gameResult = "draw",
  analysis = [],
}) => {
  const displayEco = ecoCode || "A00";
  
  // Calculate pie chart data from analysis
  const moveCounts = analysis.reduce((acc, move) => {
    acc[move.type] = (acc[move.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Brilliant Moves', value: moveCounts.Brilliant || 0, color: COLORS.Brilliant },
    { name: 'Correct Moves', value: moveCounts.Correct || 0, color: COLORS.Correct },
    { name: 'Mistakes', value: moveCounts.Mistake || 0, color: COLORS.Mistake },
    { name: 'Blunders', value: moveCounts.Blunder || 0, color: COLORS.Blunder },
  ].filter(item => item.value > 0);

  // Calculate percentages for legend
  const totalMovesAnalyzed = analysis.length || totalMoves;
  const brilliantMovesPercent = totalMovesAnalyzed > 0 ? Math.round(((moveCounts.Brilliant || 0) / totalMovesAnalyzed) * 100) : 0;
  const correctMovesPercent = totalMovesAnalyzed > 0 ? Math.round(((moveCounts.Correct || 0) / totalMovesAnalyzed) * 100) : 0;
  const blundersPercent = totalMovesAnalyzed > 0 ? Math.round(((moveCounts.Blunder || 0) / totalMovesAnalyzed) * 100) : 0;
  const mistakesPercent = totalMovesAnalyzed > 0 ? Math.round(((moveCounts.Mistake || 0) / totalMovesAnalyzed) * 100) : 0;
  
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardContent className="p-6 space-y-6">
        {/* Top Section - Opening and Result */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Opening</div>
            <div className="text-xl font-bold text-foreground">{opening}</div>
            <div className="text-sm text-muted-foreground">ECO: {displayEco}</div>
          </div>
          <Badge className={`${resultColors[gameResult]} text-lg px-4 py-2 font-bold`}>
            {result}
          </Badge>
        </div>

        {/* Middle Section - Game Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center space-y-2 p-3 bg-accent/5 rounded-xl">
            <Target className="h-6 w-6 text-green-500" />
            <div className="text-2xl font-bold text-foreground">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-3 bg-accent/5 rounded-xl">
            <Trophy className="h-6 w-6 text-blue-500" />
            <div className="text-xl font-bold text-foreground">{estimateEloFromAccuracy(accuracy)}</div>
            <div className="text-sm text-muted-foreground">ELO</div>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-3 bg-accent/5 rounded-xl">
            <BookOpen className="h-6 w-6 text-purple-500" />
            <div className="text-xl font-bold text-foreground">{Math.ceil(totalMoves / 2)}</div>
            <div className="text-sm text-muted-foreground">Moves</div>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-3 bg-accent/5 rounded-xl">
            <Trophy className="h-6 w-6 text-orange-500" />
            <div className="text-xl font-bold text-foreground">
              {gameResult === "win" ? "Win" : gameResult === "loss" ? "Loss" : "Draw"}
            </div>
            <div className="text-sm text-muted-foreground">Result</div>
          </div>
        </div>

        {/* Bottom Section - Analysis Overview */}
        <div>
          <div className="text-lg font-semibold text-foreground mb-4">Analysis Overview</div>
          <div className="flex items-center gap-6">
            {/* Pie Chart */}
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} moves`, name]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--accent)]"></div>
                <span className="text-sm text-foreground">Brilliant Moves {brilliantMovesPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--accent)]"></div>
                <span className="text-sm text-foreground">Correct Moves {correctMovesPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-foreground">Mistakes {mistakesPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--destructive)]"></div>
                <span className="text-sm text-foreground">Blunders {blundersPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedGameSummaryCard; 