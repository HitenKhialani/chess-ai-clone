import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Eye, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface MoveInsightsCardProps {
  analysis: ReviewMove[];
  onJumpToMove?: (moveIndex: number) => void;
}

const typeIcons = {
  "Best": "✅",
  "Good": "👍", 

  "Mistake": "❗",
  "Blunder": "💥"
};

const findMissedMates = (analysis: ReviewMove[]): string[] => {
  // Simple heuristic: look for very high eval swings that could indicate missed mates
  const missedMates: string[] = [];
  
  for (let i = 1; i < analysis.length; i++) {
    const currentEval = parseFloat(analysis[i].evaluation);
    const prevEval = parseFloat(analysis[i - 1].evaluation);
    
    // If eval goes from very positive/negative to moderate, might be missed mate
    if (Math.abs(prevEval) > 5 && Math.abs(currentEval) < Math.abs(prevEval) / 2) {
      missedMates.push(`Move ${i + 1}: Potential mate missed`);
    }
  }
  
  return missedMates.slice(0, 3); // Limit to top 3
};

export const MoveInsightsCard: React.FC<MoveInsightsCardProps> = ({
  analysis,
  onJumpToMove
}) => {
  const [showEvalGraph, setShowEvalGraph] = useState(true);
  
  // Calculate best move ratio
  const bestMoves = analysis.filter(move => move.type === "Brilliant" || move.type === "Correct").length;
  const bestMoveRatio = analysis.length > 0 ? `${bestMoves}/${analysis.length}` : "0/0";
  const bestMovePercentage = analysis.length > 0 ? Math.round((bestMoves / analysis.length) * 100) : 0;
  
  // Find missed mates/tactics
  const missedMates = findMissedMates(analysis);
  
  // Prepare evaluation graph data
  const evalData = analysis.map((move, index) => ({
    move: index + 1,
    evaluation: parseFloat(move.evaluation),
    type: move.type
  }));
  
  const getEvalColor = (evaluation: number): string => {
    if (evaluation > 2) return "#22c55e"; // Green for good
    if (evaluation > 0) return "#3b82f6"; // Blue for slightly good
    if (evaluation > -2) return "#6b7280"; // Gray for equal
    return "#ef4444"; // Red for bad
  };

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6 text-accent" />
          Move Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">Deep analysis of your moves and missed opportunities</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Best Move Ratio */}
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 dark:from-accent/40 dark:to-accent/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-lg dark:text-foreground">Best Move Ratio</span>
            </div>
            <Badge className="bg-accent text-[var(--card-foreground)] text-lg px-3 py-1">
              {bestMoveRatio}
            </Badge>
          </div>
          <Progress value={bestMovePercentage} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground dark:text-foreground/70">
            You found the brilliant or correct moves {bestMovePercentage}% of the time
          </p>
        </div>

        {/* Missed Mates/Tactics */}
        {missedMates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg dark:text-foreground">Missed Opportunities</h3>
            </div>
            <div className="space-y-2">
              {missedMates.map((missed, index) => (
                <div key={index} className="bg-[var(--card)] dark:bg-[#1e1e2e] border border-yellow-200 dark:border-yellow-500 rounded-lg p-3 max-w-md">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {missed}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluation Graph Toggle */}
        <div>
          <Button
            variant="outline"
            onClick={() => setShowEvalGraph(!showEvalGraph)}
            className="mb-4 w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Evaluation Graph
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${showEvalGraph ? 'rotate-90' : ''}`} />
          </Button>
          
          {showEvalGraph && (
            <div className="bg-muted/20 dark:bg-muted/80 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={evalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="move" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Move', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Evaluation', angle: -90, position: 'insideLeft' }}
                    domain={[-5, 5]}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${Number(value).toFixed(2)}`, 'Evaluation']}
                    labelFormatter={(label) => `Move ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />
                  <Line 
                    type="monotone" 
                    dataKey="evaluation" 
                    stroke="#7C3AED" 
                    strokeWidth={2}
                    dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#7C3AED', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoveInsightsCard; 