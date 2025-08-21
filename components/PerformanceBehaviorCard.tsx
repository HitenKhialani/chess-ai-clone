import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  Clock, 
  Flame, 
  Snowflake,
  Target,
  Timer
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
  timeSpent?: number; // in seconds
}

interface PerformanceBehaviorCardProps {
  analysis: ReviewMove[];
  playerColor?: "white" | "black";
  totalGameTime?: number; // in seconds
}

interface StreakData {
  bestStreak: number;
  coldStreak: number;
  currentStreak: number;
  streakType: "good" | "bad" | "neutral";
}

interface MoveRiskData {
  aggressive: number;
  defensive: number;
  balanced: number;
  riskScore: number; // 0-100, where 100 is very aggressive
}

interface TimeData {
  averageMoveTime: number;
  fastestMove: number;
  slowestMove: number;
  blunderMoveTime: number;
  timeDistribution: { range: string; count: number }[];
}

const calculateStreaks = (analysis: ReviewMove[]): StreakData => {
  let bestStreak = 0;
  let coldStreak = 0;
  let currentStreak = 0;
  let currentBadStreak = 0;
  let maxBadStreak = 0;
  
  analysis.forEach((move, index) => {
      const isGoodMove = move.type === "Brilliant" || move.type === "Correct";
  const isBadMove = move.type === "Blunder" || move.type === "Mistake";
    
    if (isGoodMove) {
      currentStreak++;
      currentBadStreak = 0;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else if (isBadMove) {
      currentBadStreak++;
      currentStreak = 0;
      if (currentBadStreak > maxBadStreak) {
        maxBadStreak = currentBadStreak;
      }
    } else {
      // Inaccuracy - neutral
      if (currentStreak > 0) currentStreak = 0;
      if (currentBadStreak > 0) currentBadStreak = 0;
    }
  });
  
  const lastMove = analysis[analysis.length - 1];
  let streakType: "good" | "bad" | "neutral" = "neutral";
  if (lastMove) {
    if (lastMove.type === "Brilliant" || lastMove.type === "Correct") streakType = "good";
    else if (lastMove.type === "Blunder" || lastMove.type === "Mistake") streakType = "bad";
  }
  
  return {
    bestStreak,
    coldStreak: maxBadStreak,
    currentStreak: currentStreak || currentBadStreak,
    streakType
  };
};

const calculateMoveRisk = (analysis: ReviewMove[]): MoveRiskData => {
  let aggressive = 0;
  let defensive = 0;
  let balanced = 0;
  
  analysis.forEach(move => {
    // Simple heuristic: blunders and mistakes suggest aggressive play
    // Best moves in complex positions suggest calculated risk
    const evaluation = parseFloat(move.evaluation);
    
    if (move.type === "Blunder" || (move.type === "Mistake" && Math.abs(evaluation) > 2)) {
      aggressive++;
    } else if (move.type === "Brilliant" && Math.abs(evaluation) < 0.5) {
      defensive++;
    } else {
      balanced++;
    }
  });
  
  const total = analysis.length;
  const aggressivePercent = (aggressive / total) * 100;
  const defensivePercent = (defensive / total) * 100;
  const balancedPercent = (balanced / total) * 100;
  
  // Calculate risk score (0-100)
  const riskScore = Math.min(100, (aggressive * 2 + balanced * 1) / total * 50);
  
  return {
    aggressive: Math.round(aggressivePercent),
    defensive: Math.round(defensivePercent), 
    balanced: Math.round(balancedPercent),
    riskScore: Math.round(riskScore)
  };
};

const calculateTimeData = (analysis: ReviewMove[], totalGameTime?: number): TimeData => {
  const moveTimes = analysis.map(move => move.timeSpent || 0).filter(time => time > 0);
  
  const averageMoveTime = moveTimes.length > 0 ? moveTimes.reduce((a, b) => a + b, 0) / moveTimes.length : 0;
  const fastestMove = moveTimes.length > 0 ? Math.min(...moveTimes) : 0;
  const slowestMove = moveTimes.length > 0 ? Math.max(...moveTimes) : 0;
  
  // Calculate blunder move time
  const blunderMoves = analysis.filter(move => move.type === "Blunder");
  const blunderTimes = blunderMoves.map(move => move.timeSpent || 0).filter(time => time > 0);
  const blunderMoveTime = blunderTimes.length > 0 ? blunderTimes.reduce((a, b) => a + b, 0) / blunderTimes.length : 0;
  
  // Time distribution
  const timeDistribution = [
    { range: "0-5s", count: moveTimes.filter(t => t <= 5).length },
    { range: "5-15s", count: moveTimes.filter(t => t > 5 && t <= 15).length },
    { range: "15-30s", count: moveTimes.filter(t => t > 15 && t <= 30).length },
    { range: "30s+", count: moveTimes.filter(t => t > 30).length }
  ];
  
  return {
    averageMoveTime,
    fastestMove,
    slowestMove,
    blunderMoveTime,
    timeDistribution
  };
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

const getRiskColor = (riskScore: number): string => {
  if (riskScore >= 70) return "text-[var(--destructive)] dark:text-red-400";
  if (riskScore >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-[var(--accent)] dark:text-green-400";
};

const getRiskDescription = (riskScore: number): string => {
  if (riskScore >= 70) return "Aggressive - High risk, high reward";
  if (riskScore >= 40) return "Balanced - Calculated risks";
  return "Conservative - Safe and steady";
};

export const PerformanceBehaviorCard: React.FC<PerformanceBehaviorCardProps> = ({
  analysis,
  playerColor = "white",
  totalGameTime
}) => {
  const [activeTab, setActiveTab] = useState<"streaks" | "risk" | "time">("streaks");
  
  const streakData = calculateStreaks(analysis);
  const riskData = calculateMoveRisk(analysis);
  const timeData = calculateTimeData(analysis, totalGameTime);
  
  const pieData = [
    { name: 'Aggressive', value: riskData.aggressive, color: '#ef4444' },
    { name: 'Balanced', value: riskData.balanced, color: '#3b82f6' },
    { name: 'Defensive', value: riskData.defensive, color: '#22c55e' }
  ];

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-6 w-6 text-accent" />
          Performance Behavior
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Analysis of your playing patterns and decision-making behavior
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="streaks" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Streaks
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Risk Profile
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Analysis
            </TabsTrigger>
          </TabsList>
          
          {/* Streaks Tab */}
          <TabsContent value="streaks" className="space-y-6 mt-6">
            {/* Current Streak */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 dark:bg-[#1e1e2e] dark:from-[#1e1e2e] dark:to-[#1e1e2e] rounded-xl p-4 border border-accent/20 dark:border-accent/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {streakData.streakType === "good" ? (
                    <Flame className="h-6 w-6 text-green-500" />
                  ) : streakData.streakType === "bad" ? (
                    <Snowflake className="h-6 w-6 text-red-500" />
                  ) : (
                    <Target className="h-6 w-6 text-gray-500" />
                  )}
                  <span className="font-semibold text-lg text-[var(--card-foreground)] dark:text-foreground">
                    {streakData.streakType === "good" ? "Hot Streak" : 
                     streakData.streakType === "bad" ? "Cold Streak" : "Neutral"}
                  </span>
                </div>
                <Badge className="bg-[var(--card)]0 text-[var(--card-foreground)] text-lg px-3 py-1">
                  {streakData.currentStreak} moves
                </Badge>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] dark:text-foreground/70">
                {streakData.streakType === "good" ? "Consecutive good moves" :
                 streakData.streakType === "bad" ? "Consecutive mistakes" :
                 "Steady play without significant streaks"}
              </p>
            </div>

            {/* Best and Worst Streaks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--card)] dark:bg-[#1e1e2e] rounded-xl p-4 border border-[var(--border)] dark:border-green-600">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-[var(--accent)] dark:text-green-200">Best Streak</span>
                </div>
                <div className="text-3xl font-bold text-[var(--accent)] dark:text-green-200 mb-1">
                  {streakData.bestStreak}
                </div>
                <p className="text-sm text-[var(--accent)] dark:text-green-300">
                  Consecutive good moves
                </p>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-[#1e1e2e] rounded-xl p-4 border border-[var(--border)] dark:border-red-600">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-[var(--destructive)] dark:text-red-200">Worst Streak</span>
                </div>
                <div className="text-3xl font-bold text-[var(--destructive)] dark:text-red-200 mb-1">
                  {streakData.coldStreak}
                </div>
                <p className="text-sm text-[var(--destructive)] dark:text-red-300">
                  Consecutive mistakes
                </p>
              </div>
            </div>

            {/* Consistency Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-5 w-5 text-accent" />
                <span className="font-semibold text-foreground">Consistency Rating</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {streakData.bestStreak >= 5 ? "Excellent consistency" :
                 streakData.bestStreak >= 3 ? "Good consistency" :
                 streakData.coldStreak >= 3 ? "Inconsistent play" :
                 "Very consistent play"}
              </p>
            </div>
          </TabsContent>
          
          {/* Risk Profile Tab */}
          <TabsContent value="risk" className="space-y-6 mt-6">
            {/* Risk Score */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:bg-[#1e1e2e] dark:from-[#1e1e2e] dark:to-[#1e1e2e] rounded-xl p-4 border border-[var(--border)] dark:border-orange-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-orange-500" />
                  <span className="font-bold text-lg text-[var(--card-foreground)] dark:text-foreground">Move Risk Score</span>
                </div>
                <Badge className={`text-xl px-4 py-2 font-bold ${
                  riskData.riskScore >= 70 ? "bg-[var(--destructive)] text-[var(--card-foreground)]" :
                  riskData.riskScore >= 40 ? "bg-yellow-500 text-black" :
                  "bg-[var(--accent)] text-[var(--card-foreground)]"
                }`}>
                  {riskData.riskScore}/100
                </Badge>
              </div>
              <Progress value={riskData.riskScore} className="h-4 mb-2" />
              <p className={`text-sm font-medium ${getRiskColor(riskData.riskScore)}`}>
                {getRiskDescription(riskData.riskScore)}
              </p>
            </div>

            {/* Risk Distribution */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Playing Style Distribution
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-[var(--card)] dark:bg-[#1e1e2e] rounded-lg border border-[var(--border)] dark:border-red-600">
                  <div className="text-2xl font-bold text-[var(--destructive)] dark:text-red-200">{riskData.aggressive}%</div>
                  <div className="text-xs text-[var(--muted-foreground)] dark:text-red-300">Aggressive</div>
                </div>
                <div className="text-center p-3 bg-[var(--card)] dark:bg-[#1e1e2e] rounded-lg border border-[var(--border)] dark:border-blue-600">
                  <div className="text-2xl font-bold text-[var(--primary)] dark:text-blue-200">{riskData.balanced}%</div>
                  <div className="text-xs text-[var(--muted-foreground)] dark:text-blue-300">Balanced</div>
                </div>
                <div className="text-center p-3 bg-[var(--card)] dark:bg-[#1e1e2e] rounded-lg border border-[var(--border)] dark:border-green-600">
                  <div className="text-2xl font-bold text-[var(--accent)] dark:text-green-200">{riskData.defensive}%</div>
                  <div className="text-xs text-[var(--muted-foreground)] dark:text-green-300">Defensive</div>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          {/* Time Analysis Tab */}
          <TabsContent value="time" className="space-y-6 mt-6">
            {/* Time Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[var(--card)] dark:bg-[#1e1e2e] rounded-xl p-3 border border-[var(--border)] dark:border-blue-600">
                <div className="flex items-center gap-1 mb-1">
                  <Timer className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-[var(--card-foreground)] dark:text-blue-200">Average</span>
                </div>
                <div className="text-lg font-bold text-[var(--primary)] dark:text-blue-200">
                  {formatTime(timeData.averageMoveTime)}
                </div>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-[#1e1e2e] rounded-xl p-3 border border-[var(--border)] dark:border-green-600">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-[var(--card-foreground)] dark:text-green-200">Fastest</span>
                </div>
                <div className="text-lg font-bold text-[var(--accent)] dark:text-green-200">
                  {formatTime(timeData.fastestMove)}
                </div>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-[#1e1e2e] rounded-xl p-3 border border-[var(--border)] dark:border-orange-600">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-[var(--card-foreground)] dark:text-orange-200">Slowest</span>
                </div>
                <div className="text-lg font-bold text-[var(--primary)] dark:text-orange-200">
                  {formatTime(timeData.slowestMove)}
                </div>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-[#1e1e2e] rounded-xl p-3 border border-[var(--border)] dark:border-red-600">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium text-[var(--card-foreground)] dark:text-red-200">Blunder Time</span>
                </div>
                <div className="text-lg font-bold text-[var(--destructive)] dark:text-red-200">
                  {formatTime(timeData.blunderMoveTime)}
                </div>
              </div>
            </div>

            {/* Time Distribution Chart */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Time Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData.timeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${value}`, 'Moves']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Time Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:bg-[#1e1e2e] dark:from-[#1e1e2e] dark:to-[#1e1e2e] rounded-xl p-4 border border-[var(--border)] dark:border-purple-600">
              <h3 className="font-semibold mb-2 text-[var(--card-foreground)] dark:text-foreground">Time Management Insights</h3>
              <ul className="text-sm text-[var(--muted-foreground)] dark:text-foreground/70 space-y-1">
                <li>
                  • Blunders took {((timeData.blunderMoveTime / timeData.averageMoveTime) * 100).toFixed(0)}% 
                  {timeData.blunderMoveTime > timeData.averageMoveTime ? " more" : " less"} time than average
                </li>
                <li>
                  • {timeData.timeDistribution[0].count} moves were made quickly (under 5 seconds)
                </li>
                <li>
                  • Time pressure might be a factor in {timeData.timeDistribution[3].count} moves (30+ seconds)
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceBehaviorCard; 