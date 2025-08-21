import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Clock, PlayCircle, CheckCircle2, Brain, Shield, Zap, Puzzle } from "lucide-react";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface LearningImprovementCardProps {
  analysis: ReviewMove[];
  onStartLesson?: (lessonUrl: string) => void;
  onStartPuzzle?: (puzzleUrl: string) => void;
}

const getLessonRecommendations = (analysis: ReviewMove[]) => {
  const mistakes = analysis.filter(move => 
    move.type === "Blunder" || move.type === "Mistake"
  );
  
  const lessons = [];
  
  if (mistakes.length > analysis.length * 0.3) {
    lessons.push({
      title: "Avoid Blunders in Middlegame",
      description: "Master tactical awareness to prevent critical mistakes",
      icon: "⚔️",
      difficulty: "Intermediate",
      time: "25 min",
      url: "/learn/tactics"
    });
  }
  
  if (mistakes.some(m => m.explanation.includes("checkmate"))) {
    lessons.push({
      title: "Master King Safety",
      description: "Learn essential defensive patterns and king protection",
      icon: "👑",
      difficulty: "Beginner",
      time: "30 min",
      url: "/learn/endgames"
    });
  }
  
  if (analysis.length > 50) {
    lessons.push({
      title: "Time Management Mastery",
      description: "Make quality decisions under time pressure",
      icon: "⏰",
      difficulty: "Advanced",
      time: "20 min",
      url: "/learn/time-management"
    });
  }
  
  // Always include a general improvement lesson
  lessons.push({
    title: "Positional Understanding",
    description: "Improve strategic thinking and piece coordination",
    icon: "🎯",
    difficulty: "Intermediate",
    time: "40 min",
    url: "/learn/strategy"
  });
  
  return lessons.slice(0, 2); // Limit to 2 lessons
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Beginner": return "bg-[var(--secondary)] text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "Advanced": return "bg-[var(--secondary)] text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default: return "bg-[var(--secondary)] text-[var(--card-foreground)] dark:bg-[var(--background)]/30 dark:text-[var(--muted-foreground)]";
  }
};

export const LearningImprovementCard: React.FC<LearningImprovementCardProps> = ({
  analysis,
  onStartLesson,
  onStartPuzzle
}) => {
  const totalMistakes = analysis.filter(m => 
    m.type === "Blunder" || m.type === "Mistake"
  ).length;
  
  const improvementScore = Math.max(0, 100 - (totalMistakes / analysis.length * 100));
  const lessonRecommendations = getLessonRecommendations(analysis);

  return (
    <Card className="rounded-2xl shadow-lg bg-card/90 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <BookOpen className="h-6 w-6 text-green-500" />
          Learning & Improvement
          <Badge variant="secondary" className="ml-auto bg-[var(--secondary)] text-green-800 dark:bg-green-900/30 dark:text-green-300">
            {totalMistakes} areas
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Improvement Score */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-[var(--accent)] dark:text-green-200 mb-2">
            {improvementScore.toFixed(0)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Improvement Potential
          </div>
        </div>

        {/* Lesson Recommendations */}
        <div className="space-y-4 mb-6">
          {lessonRecommendations.map((lesson, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl p-4 border border-[var(--border)]/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{lesson.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                </div>
                <Badge className={getDifficultyColor(lesson.difficulty)}>
                  {lesson.difficulty}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {lesson.time}
                </div>
                
                <Button
                  onClick={() => onStartLesson?.(lesson.url)}
                  className="bg-[var(--accent)] hover:bg-[var(--accent)] hover:opacity-80 text-[var(--card-foreground)] font-bold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Lesson
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Puzzle Practice Button */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-[var(--border)]/50 dark:border-purple-800/50 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🧩</div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">Puzzle Practice</h3>
              <p className="text-sm text-muted-foreground">Sharpen your tactical skills with themed puzzles</p>
            </div>
          </div>
          
          <Button
            onClick={() => onStartPuzzle?.("/puzzles")}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-[var(--card-foreground)] font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg group"
          >
            <Puzzle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            🧩 Puzzle Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningImprovementCard; 