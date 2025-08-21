import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  BarChart3,
  Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface HeatmapVisualsCardProps {
  analysis: ReviewMove[];
}

interface PhaseAccuracy {
  phase: string;
  accuracy: number;
  moves: number;
  blunders: number;
  mistakes: number;
  description: string;
}

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#ef4444'];

const calculatePhaseAccuracy = (analysis: ReviewMove[]): PhaseAccuracy[] => {
  const phases = [
    { name: "Opening", start: 0, end: Math.min(20, Math.floor(analysis.length * 0.25)), description: "First moves and development" },
    { name: "Middlegame", start: Math.min(20, Math.floor(analysis.length * 0.25)), end: Math.max(Math.floor(analysis.length * 0.75), analysis.length - 15), description: "Complex tactics and strategy" },
    { name: "Endgame", start: Math.max(Math.floor(analysis.length * 0.75), analysis.length - 15), end: analysis.length, description: "Technical precision required" }
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
      mistakes,
      description: phase.description
    };
  });
};

export const HeatmapVisualsCard: React.FC<HeatmapVisualsCardProps> = ({
  analysis
}) => {
  const [activeTab, setActiveTab] = useState<"phases" | "trends">("phases");
  
  const phaseData = calculatePhaseAccuracy(analysis);
  
  // Generate accuracy trend over time
  const trendData = analysis.map((move, index) => {
    const windowSize = 10;
    const start = Math.max(0, index - windowSize + 1);
    const window = analysis.slice(start, index + 1);
    const goodMoves = window.filter(m => m.type === "Brilliant" || m.type === "Correct").length;
    const accuracy = (goodMoves / window.length) * 100;
    
    return {
      move: index + 1,
      accuracy: accuracy,
      type: move.type
    };
  });

  // Convert phase data to pie chart format
  const phasePieData = phaseData.map(phase => ({
    name: phase.phase,
    value: phase.accuracy,
    moves: phase.moves,
    blunders: phase.blunders,
    mistakes: phase.mistakes
  }));

  // Convert trend data to pie chart format (group by accuracy ranges)
  const accuracyRanges = [
    { name: 'Excellent (90-100%)', min: 90, max: 100, color: '#22c55e' },
    { name: 'Good (70-89%)', min: 70, max: 89, color: '#3b82f6' },
    { name: 'Average (50-69%)', min: 50, max: 69, color: '#eab308' },
    { name: 'Poor (30-49%)', min: 30, max: 49, color: '#f97316' },
    { name: 'Very Poor (0-29%)', min: 0, max: 29, color: '#ef4444' }
  ];

  const trendPieData = accuracyRanges.map(range => {
    const count = trendData.filter(d => d.accuracy >= range.min && d.accuracy <= range.max).length;
    return {
      name: range.name,
      value: count,
      color: range.color
    };
  }).filter(item => item.value > 0);

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart3 className="h-6 w-6 text-accent" />
          Visual Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Heatmaps and visual patterns in your play
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phases" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Game Phases
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Accuracy Trend
            </TabsTrigger>
          </TabsList>

          
          {/* Game Phases Tab */}
          <TabsContent value="phases" className="space-y-6 mt-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Performance by Game Phase
              </h3>
              
              {/* Compact Game Phase Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {phaseData.map((phase, index) => (
                  <div key={index} className="border border-border rounded-xl p-3 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm dark:text-foreground">{phase.phase}</h4>
                        <p className="text-xs text-muted-foreground dark:text-foreground/70">{phase.description}</p>
                      </div>
                      <Badge className={`text-xs px-2 py-1 ${
                        phase.accuracy >= 85 ? "bg-[var(--accent)] text-[var(--accent-foreground)]" :
                        phase.accuracy >= 70 ? "bg-yellow-500 text-black" :
                        "bg-[var(--destructive)] text-[var(--accent-foreground)]"
                      }`}>
                        {phase.accuracy}%
                      </Badge>
                    </div>
                    
                    <Progress value={phase.accuracy} className="h-2 mb-2" />
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
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
              
              {/* Phase Comparison Pie Chart */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3 dark:text-foreground">Accuracy Comparison</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={phasePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {phasePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, name]}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Accuracy Trend Tab */}
          <TabsContent value="trends" className="space-y-6 mt-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Accuracy Over Time
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Distribution of accuracy levels throughout the game
              </p>
              
              {/* Accuracy Trend Pie Chart */}
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trendPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trendPieData.map((entry, index) => (
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
              
              {/* Trend Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--card)] dark:bg-transparent rounded-xl p-4">
                  <h4 className="font-semibold mb-2 dark:text-blue-200">Peak Performance</h4>
                  <div className="text-2xl font-bold text-[var(--primary)] dark:text-blue-200 mb-1">
                    {Math.max(...trendData.map(d => d.accuracy)).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-blue-300">
                    Highest rolling accuracy achieved
                  </p>
                </div>
                
                <div className="bg-orange-50 dark:bg-transparent rounded-xl p-4">
                  <h4 className="font-semibold mb-2 dark:text-orange-200">Consistency</h4>
                  <div className="text-2xl font-bold text-[var(--primary)] dark:text-orange-200 mb-1">
                    {(100 - (Math.max(...trendData.map(d => d.accuracy)) - Math.min(...trendData.map(d => d.accuracy)))).toFixed(0)}%
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-orange-300">
                    Based on accuracy variance
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HeatmapVisualsCard; 