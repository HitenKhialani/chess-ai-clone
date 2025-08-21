import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Puzzle, 
  Target, 
  Zap, 
  Shield, 
  Crown,
  TrendingUp,
  Brain,
  Sword,
  Eye,
  Move
} from "lucide-react";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface PuzzleCardProps {
  analysis: ReviewMove[];
}

const getPuzzleRecommendations = (analysis: ReviewMove[]) => {
  const mistakes = analysis.filter(move => 
    move.type === "Blunder" || move.type === "Mistake"
  );
  
  const puzzleTypes = [];
  
  // Analyze mistakes to recommend specific puzzle types
  const mistakeTypes = mistakes.map(m => m.explanation.toLowerCase());
  
  if (mistakeTypes.some(m => m.includes("pin") || m.includes("pinned"))) {
    puzzleTypes.push({
      title: "Pin Tactics",
      description: "Master the art of pinning pieces",
      icon: "📌",
      difficulty: "Intermediate",
      category: "pins",
      count: 12
    });
  }
  
  if (mistakeTypes.some(m => m.includes("fork") || m.includes("forked"))) {
    puzzleTypes.push({
      title: "Fork Tactics",
      description: "Learn to create multiple threats",
      icon: "🍴",
      difficulty: "Beginner",
      category: "forks",
      count: 8
    });
  }
  
  if (mistakeTypes.some(m => m.includes("checkmate") || m.includes("mate"))) {
    puzzleTypes.push({
      title: "Checkmate Patterns",
      description: "Practice winning combinations",
      icon: "👑",
      difficulty: "Advanced",
      category: "checkmate",
      count: 15
    });
  }
  
  if (mistakeTypes.some(m => m.includes("defense") || m.includes("defend"))) {
    puzzleTypes.push({
      title: "Defensive Tactics",
      description: "Improve your defensive skills",
      icon: "🛡️",
      difficulty: "Intermediate",
      category: "defense",
      count: 10
    });
  }
  
  // Always include some general puzzle types
  if (puzzleTypes.length < 3) {
    puzzleTypes.push({
      title: "Tactical Combinations",
      description: "Master complex tactical sequences",
      icon: "⚡",
      difficulty: "Intermediate",
      category: "tactics",
      count: 20
    });
    
    puzzleTypes.push({
      title: "Endgame Practice",
      description: "Perfect your endgame technique",
      icon: "🏁",
      difficulty: "Advanced",
      category: "endgame",
      count: 18
    });
  }
  
  return puzzleTypes.slice(0, 3);
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Beginner": return "bg-[var(--secondary)] text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "Advanced": return "bg-[var(--secondary)] text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default: return "bg-[var(--secondary)] text-[var(--card-foreground)] dark:bg-[var(--background)]/30 dark:text-[var(--muted-foreground)]";
  }
};

export const PuzzleCard: React.FC<PuzzleCardProps> = ({ analysis }) => {
  const puzzleRecommendations = getPuzzleRecommendations(analysis);
  const totalMistakes = analysis.filter(m => 
    m.type === "Blunder" || m.type === "Mistake"
  ).length;

  return (
            <Card className="rounded-2xl shadow-lg bg-card/90 backdrop-blur-sm border border-[#00F5D4]/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden h-full flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <Puzzle className="h-6 w-6 text-purple-500" />
          Targeted Puzzle Practice
          <Badge variant="secondary" className="ml-auto bg-[var(--secondary)] text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            {totalMistakes} areas
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Puzzle Stats */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-[var(--accent)] dark:text-purple-200 mb-2">
            {puzzleRecommendations.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Puzzle Categories Recommended
          </div>
        </div>

        {/* Puzzle Recommendations */}
        <div className="space-y-4 flex-1">
          {puzzleRecommendations.map((puzzle, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl p-4 border border-[var(--border)]/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{puzzle.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{puzzle.title}</h3>
                  <p className="text-sm text-muted-foreground">{puzzle.description}</p>
                </div>
                <Badge className={getDifficultyColor(puzzle.difficulty)}>
                  {puzzle.difficulty}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {puzzle.count} puzzles
                </div>
                
                <Button
                  onClick={() => window.open(`/puzzles/${puzzle.category}`, '_blank')}
                  className="bg-[var(--accent)] hover:bg-[var(--accent)] hover:opacity-80 text-[var(--card-foreground)] font-bold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Solve Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div className="mt-6 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-lg p-4 border border-[var(--border)]/50 dark:border-indigo-800/50 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="h-6 w-6 text-indigo-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">All Puzzle Categories</h3>
              <p className="text-sm text-muted-foreground">Explore our complete puzzle library</p>
            </div>
          </div>
          
          <Button
            onClick={() => window.open('/puzzles', '_blank')}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-[var(--card-foreground)] font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg group"
          >
            <Puzzle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            🧩 Explore All Puzzles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PuzzleCard; 