import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  Clock, 
  Flame, 
  Snowflake,
  Target,
  Timer,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  Activity,
  Trophy,
  Share2,
  RotateCcw
} from "lucide-react";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
  timeSpent?: number;
}

interface GameReportPDFProps {
  analysis: ReviewMove[];
  playerColor?: "white" | "black";
  totalGameTime?: number;
  opening?: string;
  result?: string;
  totalMoves?: number;
  accuracy?: number;
  onGeneratePDF?: () => Promise<void>;
}

const calculateStreaks = (analysis: ReviewMove[]) => {
  let bestStreak = 0;
  let coldStreak = 0;
  let currentStreak = 0;
  let currentBadStreak = 0;
  let maxBadStreak = 0;
  
  analysis.forEach((move) => {
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
      if (currentStreak > 0) currentStreak = 0;
      if (currentBadStreak > 0) currentBadStreak = 0;
    }
  });
  
  return { bestStreak, coldStreak: maxBadStreak, currentStreak };
};

const calculateMoveRisk = (analysis: ReviewMove[]) => {
  let aggressive = 0;
  let defensive = 0;
  let balanced = 0;
  
  analysis.forEach(move => {
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
  const riskScore = Math.min(100, (aggressive * 2 + balanced * 1) / total * 50);
  
  return {
    aggressive: Math.round((aggressive / total) * 100),
    defensive: Math.round((defensive / total) * 100), 
    balanced: Math.round((balanced / total) * 100),
    riskScore: Math.round(riskScore)
  };
};

const calculatePhaseAccuracy = (analysis: ReviewMove[]) => {
  const phases = [
    { name: "Opening", start: 0, end: Math.min(20, Math.floor(analysis.length * 0.25)) },
    { name: "Middlegame", start: Math.min(20, Math.floor(analysis.length * 0.25)), end: Math.max(Math.floor(analysis.length * 0.75), analysis.length - 15) },
    { name: "Endgame", start: Math.max(Math.floor(analysis.length * 0.75), analysis.length - 15), end: analysis.length }
  ];
  
  return phases.map(phase => {
    const phaseMoves = analysis.slice(phase.start, phase.end);
    const bestMoves = phaseMoves.filter(m => m.type === "Brilliant" || m.type === "Correct").length;
    const blunders = phaseMoves.filter(m => m.type === "Blunder").length;
    const mistakes = phaseMoves.filter(m => m.type === "Mistake").length;
    const accuracy = phaseMoves.length > 0 ? Math.round((bestMoves / phaseMoves.length) * 100) : 0;
    
    return {
      phase: phase.name,
      accuracy,
      moves: phaseMoves.length,
      blunders,
      mistakes
    };
  });
};

const findTopBlunders = (analysis: ReviewMove[]) => {
  const blunders: any[] = [];
  for (let i = 1; i < analysis.length; i++) {
    const move = analysis[i];
    if (move.type === "Blunder" || move.type === "Mistake") {
      const currentEval = parseFloat(move.evaluation);
      const prevEval = parseFloat(analysis[i - 1].evaluation);
      const evalLoss = Math.abs(currentEval - prevEval);
      
      blunders.push({
        moveNumber: i + 1,
        move: move.move,
        evalLoss,
        explanation: move.explanation,
        bestMove: move.bestMove
      });
    }
  }
  
  return blunders.sort((a, b) => b.evalLoss - a.evalLoss).slice(0, 3);
};

export const GameReportPDF: React.FC<GameReportPDFProps> = ({
  analysis,
  playerColor = "white",
  totalGameTime,
  opening = "Unknown Opening",
  result = "Draw",
  totalMoves = analysis.length,
  accuracy = 75,
  onGeneratePDF
}) => {
  const streakData = calculateStreaks(analysis);
  const riskData = calculateMoveRisk(analysis);
  const phaseData = calculatePhaseAccuracy(analysis);
  const topBlunders = findTopBlunders(analysis);
  
  const bestMoves = analysis.filter(move => move.type === "Brilliant" || move.type === "Correct").length;
  const bestMovePercentage = analysis.length > 0 ? Math.round((bestMoves / analysis.length) * 100) : 0;
  
  const totalMistakes = analysis.filter(m => 
    m.type === "Blunder" || m.type === "Mistake"
  ).length;
  
  const improvementScore = Math.max(0, 100 - (totalMistakes / analysis.length * 100));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-[var(--card)] dark:bg-[var(--background)]">
      {/* Page 1: Executive Summary */}
      <div className="page-break-after">
        <Card className="rounded-2xl shadow-lg bg-card border border-[#00F5D4]/30">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold">
              <Trophy className="h-8 w-8 text-accent" />
              Chess Game Analysis Report
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Comprehensive Performance Review
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Game Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-accent/10 to-accent/5 dark:from-accent/40 dark:to-accent/20 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{totalMoves}</div>
                <div className="text-sm text-muted-foreground">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{result}</div>
                <div className="text-sm text-muted-foreground">Result</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{opening}</div>
                <div className="text-sm text-muted-foreground">Opening</div>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-transparent rounded-xl p-4 border border-[var(--border)] dark:border-green-600">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-green-500" />
                  <span className="font-semibold dark:text-green-200">Best Streak</span>
                </div>
                <div className="text-2xl font-bold text-[var(--accent)] dark:text-green-200">
                  {streakData.bestStreak}
                </div>
                <p className="text-xs text-muted-foreground dark:text-green-300">
                  Consecutive good moves
                </p>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-transparent rounded-xl p-4 border border-[var(--border)] dark:border-blue-600">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold dark:text-blue-200">Best Move Ratio</span>
                </div>
                <div className="text-2xl font-bold text-[var(--primary)] dark:text-blue-200">
                  {bestMovePercentage}%
                </div>
                <p className="text-xs text-muted-foreground dark:text-blue-300">
                  {bestMoves}/{analysis.length} moves
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-transparent rounded-xl p-4 border border-[var(--border)] dark:border-purple-600">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold dark:text-purple-200">Improvement Potential</span>
                </div>
                <div className="text-2xl font-bold text-[var(--accent)] dark:text-purple-200">
                  {improvementScore.toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground dark:text-purple-300">
                  {totalMistakes} areas identified
                </p>
              </div>
            </div>

            {/* Risk Profile Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-transparent dark:to-transparent rounded-xl p-4 border border-[var(--border)] dark:border-orange-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-orange-500" />
                  <span className="font-bold text-lg dark:text-foreground">Playing Style Analysis</span>
                </div>
                <Badge className={`text-xl px-4 py-2 font-bold ${
                  riskData.riskScore >= 70 ? "bg-[var(--destructive)] text-[var(--card-foreground)]" :
                  riskData.riskScore >= 40 ? "bg-yellow-500 text-black" :
                  "bg-[var(--accent)] text-[var(--card-foreground)]"
                }`}>
                  {riskData.riskScore}/100
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-[var(--destructive)] dark:text-red-200">{riskData.aggressive}%</div>
                  <div className="text-xs text-muted-foreground">Aggressive</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--primary)] dark:text-blue-200">{riskData.balanced}%</div>
                  <div className="text-xs text-muted-foreground">Balanced</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--accent)] dark:text-green-200">{riskData.defensive}%</div>
                  <div className="text-xs text-muted-foreground">Defensive</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page 2: Detailed Analysis */}
      <div className="page-break-after">
        <Card className="rounded-2xl shadow-lg bg-card border border-[#00F5D4]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BarChart3 className="h-6 w-6 text-accent" />
              Detailed Performance Analysis
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Game Phases Performance */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Performance by Game Phase
              </h3>
              
              <div className="space-y-4">
                {phaseData.map((phase, index) => (
                  <div key={index} className="border border-border rounded-xl p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg dark:text-foreground">{phase.phase}</h4>
                        <p className="text-sm text-muted-foreground dark:text-foreground/70">
                          {phase.moves} moves analyzed
                        </p>
                      </div>
                      <Badge className={`text-lg px-3 py-1 ${
                        phase.accuracy >= 85 ? "bg-[var(--accent)] text-[var(--accent-foreground)]" :
                        phase.accuracy >= 70 ? "bg-yellow-500 text-black" :
                        "bg-[var(--destructive)] text-[var(--accent-foreground)]"
                      }`}>
                        {phase.accuracy}%
                      </Badge>
                    </div>
                    
                    <Progress value={phase.accuracy} className="h-3 mb-3" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold dark:text-foreground">{phase.moves}</div>
                        <div className="text-muted-foreground dark:text-foreground/70">Moves</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--primary)] dark:text-orange-400">{phase.mistakes}</div>
                        <div className="text-muted-foreground dark:text-foreground/70">Mistakes</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--destructive)] dark:text-red-400">{phase.blunders}</div>
                        <div className="text-muted-foreground dark:text-foreground/70">Blunders</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Blunders Analysis */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Critical Mistakes Analysis
              </h3>
              
              {topBlunders.length === 0 ? (
                <div className="text-center py-6 bg-green-50 dark:bg-transparent rounded-xl border border-[var(--border)] dark:border-green-600">
                  <span className="text-2xl mb-2 block">🎉</span>
                  <p className="text-[var(--accent)] dark:text-green-400 font-semibold">
                    No major blunders detected!
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-green-300 mt-1">
                    Excellent game management
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topBlunders.map((blunder, index) => (
                    <div key={index} className="bg-red-50 dark:bg-transparent border border-[var(--border)] dark:border-red-500 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 font-bold">#{index + 1}</span>
                          <span className="font-semibold dark:text-red-200">Move {blunder.moveNumber}: {blunder.move}</span>
                          <Badge className="bg-[var(--destructive)] text-[var(--card-foreground)] text-xs">
                            -{blunder.evalLoss.toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-red-300 mb-2">{blunder.explanation}</p>
                      {blunder.bestMove && (
                        <p className="text-sm">
                          <span className="font-medium dark:text-foreground">Better: </span>
                          <span className="font-mono bg-muted px-2 py-1 rounded dark:text-foreground">{blunder.bestMove}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page 3: Recommendations & Action Plan */}
      <div className="page-break-after">
        <Card className="rounded-2xl shadow-lg bg-card border border-[#00F5D4]/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-accent" />
              Improvement Recommendations
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Learning Priorities */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-transparent dark:to-transparent rounded-xl p-4 border border-[var(--border)] dark:border-blue-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  <span className="font-bold text-lg dark:text-blue-200">Learning Priorities</span>
                </div>
                <Badge className="bg-[var(--card)]0 text-[var(--card-foreground)] text-lg px-3 py-1">
                  {improvementScore.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={improvementScore} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground dark:text-blue-300">
                {totalMistakes} areas identified for improvement in this game
              </p>
            </div>

            {/* Specific Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border rounded-xl p-4 bg-card">
                <h4 className="font-semibold mb-3 dark:text-foreground">Immediate Focus Areas</h4>
                <ul className="space-y-2 text-sm text-muted-foreground dark:text-foreground/70">
                  {totalMistakes > 0 && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Tactical pattern recognition
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Positional understanding
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Time management skills
                      </li>
                    </>
                  )}
                  {riskData.aggressive > 50 && (
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Risk assessment and calculation
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="border border-border rounded-xl p-4 bg-card">
                <h4 className="font-semibold mb-3 dark:text-foreground">Practice Recommendations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground dark:text-foreground/70">
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Tactical puzzles (15 min/day)
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    Opening theory study
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Time control practice games
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Endgame technique drills
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 dark:from-accent/40 dark:to-accent/20 rounded-xl p-4 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="font-semibold dark:text-foreground">30-Day Action Plan</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold mb-2 dark:text-foreground">Week 1</h5>
                  <p className="text-muted-foreground dark:text-foreground/70">
                    Focus on tactical puzzles and pattern recognition
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold mb-2 dark:text-foreground">Week 2</h5>
                  <p className="text-muted-foreground dark:text-foreground/70">
                    Study opening theory and positional concepts
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold mb-2 dark:text-foreground">Week 3-4</h5>
                  <p className="text-muted-foreground dark:text-foreground/70">
                    Practice time management and endgame technique
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate PDF Button */}
      <div className="text-center">
        <Button 
          onClick={async () => {
            if (onGeneratePDF) {
              try {
                await onGeneratePDF();
              } catch (error) {
                console.error('PDF generation failed:', error);
                alert('PDF generation failed. Please try again.');
              }
            }
          }}
          className="bg-accent hover:bg-accent/90 text-[var(--card-foreground)] font-bold py-3 px-6 rounded-xl"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Generate PDF Report
        </Button>
      </div>
    </div>
  );
};

export default GameReportPDF; 