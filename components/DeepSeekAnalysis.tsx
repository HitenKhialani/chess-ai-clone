"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertCircle, CheckCircle, Zap, Crown } from "lucide-react"

interface MoveAnalysis {
  move: string;
  type: 'Brilliant' | 'Correct' | 'Mistake' | 'Blunder';
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface GameAnalysis {
  analysis: MoveAnalysis[];
  accuracy: number;
  elo: number;
  opening: string;
  ecoCode: string;
  result: string;
  moveCounts: {
    brilliant: number;
    correct: number;
    mistakes: number;
    blunders: number;
  };
}

interface DeepSeekAnalysisProps {
  moves: string[];
  pgn?: string;
}

export default function DeepSeekAnalysis({ moves, pgn }: DeepSeekAnalysisProps) {
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeGame = async () => {
    if (!moves || moves.length === 0) {
      setError('No moves to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/deepseek-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moves,
          pgn
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze game');
    } finally {
      setLoading(false);
    }
  };

  const getMoveTypeColor = (type: string) => {
    switch (type) {
      case 'Brilliant':
        return 'bg-yellow-500 text-black';
      case 'Correct':
        return 'bg-green-500 text-white';
      case 'Mistake':
        return 'bg-orange-500 text-white';
      case 'Blunder':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getMoveTypeIcon = (type: string) => {
    switch (type) {
      case 'Brilliant':
        return <Zap className="h-4 w-4" />;
      case 'Correct':
        return <CheckCircle className="h-4 w-4" />;
      case 'Mistake':
        return <AlertCircle className="h-4 w-4" />;
      case 'Blunder':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="krishna-card border-rgb(153, 0, 255)/30 card-shadow text-[var(--card-foreground)] purple-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--accent)]">
            <Brain className="h-5 w-5" />
            AI Game Analysis
          </CardTitle>
          <CardDescription className="text-[var(--primary-text)]">
            Get AI-powered analysis of your chess game with accuracy, ELO rating, and move categorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={analyzeGame} 
            disabled={loading || !moves || moves.length === 0}
            className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[#B5532A] border-[var(--accent)] border transition-all duration-200"
          >
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Game Summary */}
          <Card className="krishna-card border-rgb(153, 0, 255)/30 card-shadow text-[var(--card-foreground)] purple-glow">
            <CardHeader>
              <CardTitle className="text-[var(--accent)]">Game Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">{analysis.accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-[var(--secondary-text)]">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">{analysis.elo}</div>
                  <div className="text-sm text-[var(--secondary-text)]">ELO Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">{analysis.analysis.length}</div>
                  <div className="text-sm text-[var(--secondary-text)]">Total Moves</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--accent)]">{analysis.opening}</div>
                  <div className="text-sm text-[var(--secondary-text)]">Opening</div>
                </div>
              </div>

              {/* Move Type Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--accent)] mb-3 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Move Type Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-yellow-100 border border-yellow-300 rounded">
                    <div className="text-xl font-bold text-yellow-800">{analysis.moveCounts.brilliant}</div>
                    <div className="text-sm text-yellow-700">Brilliant</div>
                  </div>
                  <div className="text-center p-3 bg-green-100 border border-green-300 rounded">
                    <div className="text-xl font-bold text-green-800">{analysis.moveCounts.correct}</div>
                    <div className="text-sm text-green-700">Correct</div>
                  </div>
                  <div className="text-center p-3 bg-orange-100 border border-orange-300 rounded">
                    <div className="text-xl font-bold text-orange-800">{analysis.moveCounts.mistakes}</div>
                    <div className="text-sm text-orange-700">Mistakes</div>
                  </div>
                  <div className="text-center p-3 bg-red-100 border border-red-300 rounded">
                    <div className="text-xl font-bold text-red-800">{analysis.moveCounts.blunders}</div>
                    <div className="text-sm text-red-700">Blunders</div>
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-[var(--secondary-text)]">Opening</div>
                  <div className="font-semibold text-[var(--primary-text)]">{analysis.opening}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--secondary-text)]">ECO Code</div>
                  <div className="font-semibold text-[var(--primary-text)]">{analysis.ecoCode}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--secondary-text)]">Result</div>
                  <div className="font-semibold text-[var(--primary-text)]">{analysis.result}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Move-by-Move Analysis */}
          <Card className="krishna-card border-rgb(153, 0, 255)/30 card-shadow text-[var(--card-foreground)] purple-glow">
            <CardHeader>
              <CardTitle className="text-[var(--accent)]">Move-by-Move Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analysis.analysis.map((moveAnalysis, index) => (
                  <div key={index} className="p-3 border border-[var(--border)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--primary-text)]">
                          Move {index + 1}: {moveAnalysis.move}
                        </span>
                        <Badge className={getMoveTypeColor(moveAnalysis.type)}>
                          {getMoveTypeIcon(moveAnalysis.type)}
                          <span className="ml-1">{moveAnalysis.type}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-[var(--secondary-text)]">
                        Eval: {moveAnalysis.evaluation}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--primary-text)] mb-2">
                      {moveAnalysis.explanation}
                    </div>
                    {moveAnalysis.bestMove && (
                      <div className="text-xs text-[var(--secondary-text)]">
                        Best move: {moveAnalysis.bestMove}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
