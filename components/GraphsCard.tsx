import React, { useState, useEffect, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Target,
  Clock,
  Zap,
  Shield,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Brain,
  Trophy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Timer,
  Crown,
  Lightbulb,
  Circle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { motion } from "framer-motion";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
  timeSpent?: number;
}

interface GraphsCardProps {
  analysis: ReviewMove[];
  playerColor?: "white" | "black";
  totalGameTime?: number;
}

const COLORS = {
  brilliant: "#06b6d4", // cyan
  correct: "#22c55e",   // green
  mistake: "#eab308",   // yellow
  blunder: "#ef4444",   // red
  neutral: "#6b7280",
  positive: "#10b981",  // emerald
  negative: "#ef4444",  // red
  neutral_eval: "#6b7280" // gray
};

const getMoveTypeColor = (type: string): string => {
  switch (type) {
    case "Brilliant": return COLORS.brilliant;
    case "Correct": return COLORS.correct;
    case "Mistake": return COLORS.mistake;
    case "Blunder": return COLORS.blunder;
    default: return COLORS.neutral;
  }
};

const getMoveTypeIcon = (type: string) => {
  switch (type) {
    case "Brilliant": return <Star className="h-4 w-4 text-cyan-500" />;
    case "Correct": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Mistake": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "Blunder": return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <Circle className="h-4 w-4 text-gray-500" />;
  }
};

const calculatePhaseAccuracy = (analysis: ReviewMove[]): { phase: string; accuracy: number; moves: number }[] => {
  const totalMoves = analysis.length;
  const openingMoves = Math.min(10, Math.floor(totalMoves * 0.3));
  const middlegameMoves = Math.min(20, Math.floor(totalMoves * 0.5));
  const endgameMoves = totalMoves - openingMoves - middlegameMoves;

  const phases = [
    { phase: "Opening", moves: openingMoves },
    { phase: "Middlegame", moves: middlegameMoves },
    { phase: "Endgame", moves: endgameMoves }
  ];

  return phases.map(phase => {
    const phaseMoves = analysis.slice(0, phase.moves);
    const correctMoves = phaseMoves.filter(move => 
      move.type === "Correct" || move.type === "Brilliant"
    ).length;
    const accuracy = phase.moves > 0 ? Math.round((correctMoves / phase.moves) * 100) : 0;
    
    return {
      phase: phase.phase,
      accuracy,
      moves: phase.moves
    };
  }).filter(phase => phase.moves > 0);
};

const calculateAccuracy = (moves: ReviewMove[]): number => {
  if (moves.length === 0) return 0;
  const correctMoves = moves.filter(move => 
    move.type === "Correct" || move.type === "Brilliant"
  ).length;
  return Math.round((correctMoves / moves.length) * 100);
};

const calculateMoveRisk = (analysis: ReviewMove[]): { aggressive: number; defensive: number; balanced: number } => {
  const aggressiveMoves = analysis.filter(move => 
    parseFloat(move.evaluation) > 0.5
  ).length;
  const defensiveMoves = analysis.filter(move => 
    parseFloat(move.evaluation) < -0.5
  ).length;
  const balancedMoves = analysis.length - aggressiveMoves - defensiveMoves;
  
  return {
    aggressive: aggressiveMoves,
    defensive: defensiveMoves,
    balanced: balancedMoves
  };
};

const calculateTimeData = (analysis: ReviewMove[]): { range: string; count: number }[] => {
  const timeRanges = [
    { range: "0-30s", count: 0 },
    { range: "30-60s", count: 0 },
    { range: "60s+", count: 0 }
  ];

  analysis.forEach(move => {
    const time = move.timeSpent || 0;
    if (time <= 30) timeRanges[0].count++;
    else if (time <= 60) timeRanges[1].count++;
    else timeRanges[2].count++;
  });

  return timeRanges.filter(range => range.count > 0);
};

const getInsightText = (graphType: string, data: any): string => {
  switch (graphType) {
    case 'moveType':
      const brilliantCount = data.find((item: any) => item.name === 'Brilliant')?.value || 0;
      if (brilliantCount > 0) {
        return `You made ${brilliantCount} brilliant moves! Excellent play.`;
      }
      return "Focus on improving move quality and avoiding mistakes.";
      
    case 'phaseAccuracy':
      const bestPhase = data.reduce((best: any, current: any) => 
        current.accuracy > best.accuracy ? current : best
      );
      return `Your ${bestPhase.phase} was strongest with ${bestPhase.accuracy}% accuracy.`;
      
    case 'evaluation':
      const positiveMoves = data.filter((move: any) => move.evaluation > 0).length;
      const totalMoves = data.length;
      const positivePercentage = Math.round((positiveMoves / totalMoves) * 100);
      return `You maintained advantage in ${positivePercentage}% of moves.`;
      
    default:
      return "Analyze your game patterns to improve your chess skills.";
  }
};

export const GraphsCard = forwardRef<HTMLDivElement, GraphsCardProps>(({
  analysis,
  playerColor = "white",
  totalGameTime
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Prepare data for different graphs
  const evalData = analysis.map((move, index) => ({
    move: index + 1,
    evaluation: parseFloat(move.evaluation),
    type: move.type,
    color: parseFloat(move.evaluation) >= 0 ? COLORS.positive : COLORS.negative
  }));
  
  const phaseData = calculatePhaseAccuracy(analysis);
  const riskData = calculateMoveRisk(analysis);
  const timeData = calculateTimeData(analysis);
  
  const moveTypeData = [
      { name: 'Brilliant', value: analysis.filter(m => m.type === "Brilliant").length, color: COLORS.brilliant },
  { name: 'Correct', value: analysis.filter(m => m.type === "Correct").length, color: COLORS.correct },
  { name: 'Mistake', value: analysis.filter(m => m.type === "Mistake").length, color: COLORS.mistake },
  { name: 'Blunder', value: analysis.filter(m => m.type === "Blunder").length, color: COLORS.blunder }
  ].filter(item => item.value > 0);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="space-y-6"
    >
      {/* Header Card */}
              <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border border-[#00F5D4]/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <BarChart3 className="h-8 w-8 text-purple-500" />
            Game Analytics
        </CardTitle>
        <p className="text-sm text-muted-foreground">
            Visual insights into your gameplay performance
        </p>
      </CardHeader>
      </Card>

      {/* Two-card-per-row layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* 1. Move Type Breakdown (Pie Chart) */}
      <motion.div variants={cardVariants}>
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border border-[#00F5D4]/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <PieChartIcon className="h-6 w-6 text-cyan-500" />
                Move Types
              <Badge variant="secondary" className="ml-auto bg-[var(--secondary)] text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
                {analysis.length} moves
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moveTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any, name: any) => [value, name]}
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--primary-text)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                  {moveTypeData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="text-lg">
                      {getMoveTypeIcon(item.name)}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm" style={{ color: item.color }}>
                          {item.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.name}</div>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

                {/* 2. Phase-wise Accuracy (Bar Chart) */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border border-[#00F5D4]/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-6 w-6 text-green-500" />
                Accuracy by Phase
                <Badge variant="secondary" className="ml-auto bg-[var(--secondary)] text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {phaseData.length} phases
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="phase" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: any, name: any) => [`${value}%`, 'Accuracy']}
                      labelFormatter={(label) => `${label} Phase`}
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--primary-text)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} barSize={40}>
                      {phaseData.map((entry, index) => {
                        const colors = ['#22c55e', '#3b82f6', '#f59e0b'];
                        return <Cell key={`cell-${index}`} fill={colors[index]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-[var(--border)]/50 dark:border-green-800/50">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  🎯 {getInsightText('phaseAccuracy', phaseData)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Evaluation Over Time (Line Chart) */}
      <motion.div variants={cardVariants}>
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border border-[#00F5D4]/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6 text-purple-500" />
                Position Evaluation
              <Badge variant="secondary" className="ml-auto bg-[var(--secondary)] text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {analysis.length} moves
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="move" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: any, name: any) => [value.toFixed(2), 'Evaluation']}
                      labelFormatter={(label) => `Move ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--primary-text)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="evaluation" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                    />
                    <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-[var(--border)]/50 dark:border-purple-800/50">
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  📈 {getInsightText('evaluation', evalData)}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

                {/* 4. Move Risk Analysis (Bar Chart) */}
        <motion.div variants={cardVariants}>
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border border-[#00F5D4]/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-6 w-6 text-orange-500" />
                Move Risk Profile
                <Badge variant="secondary" className="ml-auto bg-[var(--secondary)] text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                  Risk Analysis
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Aggressive', value: riskData.aggressive, color: '#ef4444' },
                    { name: 'Balanced', value: riskData.balanced, color: '#6b7280' },
                    { name: 'Defensive', value: riskData.defensive, color: '#3b82f6' }
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: any, name: any) => [value, 'Moves']}
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--primary-text)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {[
                        { color: '#ef4444' },
                        { color: '#6b7280' },
                        { color: '#3b82f6' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg border border-[var(--border)]/50 dark:border-orange-800/50">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  🛡️ {riskData.aggressive > riskData.defensive ? 'You played aggressively' : 'You played defensively'} with {riskData.balanced} balanced moves.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
            </div>
    </motion.div>
  );
});

GraphsCard.displayName = 'GraphsCard';

export default GraphsCard; 