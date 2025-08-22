import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Target, Download, Sparkles } from 'lucide-react';

const AnalysisSection: React.FC = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-primary font-medium">MVP Feature #1</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-cosmic">Game Analysis</span>
            <br />
            <span className="text-foreground">Beyond Chess.com & Lichess</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolutionary AI-powered analysis that classifies every move with precision.
            Get insights that even grandmasters would envy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Analysis Board (Left) */}
          <div className="space-y-8">
            {/* Mock Chessboard */}
            <div className="bg-card rounded-2xl p-6 glass-card hover-lift">
              <div className="aspect-square bg-gradient-to-br from-chess-white to-chess-gold rounded-xl mb-4 flex items-center justify-center">
                <div className="text-chess-black text-6xl">♔♕♖♗♘♙</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Move</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    Brilliant!
                  </span>
                </div>
                <div className="text-foreground font-mono">Nf6+ (Knight to f6, check)</div>
              </div>
            </div>
            
            {/* Move History */}
            <div className="bg-card rounded-xl p-6 glass-card">
              <h4 className="font-semibold mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2 text-primary" />
                Move Classification
              </h4>
              <div className="space-y-2">
                {[
                  { move: 'Qh5+', type: 'Brilliant', color: 'bg-yellow-500' },
                  { move: 'Nf6', type: 'Correct', color: 'bg-green-500' },
                  { move: 'Bxf7+', type: 'Mistake', color: 'bg-orange-500' },
                  { move: 'Kh1??', type: 'Blunder', color: 'bg-red-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="font-mono text-sm">{item.move}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-muted-foreground">{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Analysis Features (Right) */}
          <div className="space-y-8">
            {/* Accuracy Chart */}
            <div className="bg-card rounded-2xl p-6 glass-card hover-lift">
              <h4 className="font-semibold mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                Accuracy Analysis
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">White Accuracy</span>
                  <span className="text-primary font-bold">87.3%</span>
                </div>
                <div className="w-full bg-background/50 rounded-full h-3">
                  <div className="bg-gradient-to-r from-primary to-primary-glow h-3 rounded-full" style={{ width: '87.3%' }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Black Accuracy</span>
                  <span className="text-secondary font-bold">92.1%</span>
                </div>
                <div className="w-full bg-background/50 rounded-full h-3">
                  <div className="bg-gradient-to-r from-secondary to-secondary-glow h-3 rounded-full" style={{ width: '92.1%' }} />
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="bg-card rounded-2xl p-6 glass-card hover-lift">
              <h4 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                Performance Insights
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">94%</div>
                  <div className="text-xs text-muted-foreground">Opening Accuracy</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">2.3s</div>
                  <div className="text-xs text-muted-foreground">Avg Think Time</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-chess-gold">3</div>
                  <div className="text-xs text-muted-foreground">Brilliant Moves</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">+1.2</div>
                  <div className="text-xs text-muted-foreground">Rating Change</div>
                </div>
              </div>
            </div>
            
            {/* Export Button */}
            <Button variant="cosmic" size="lg" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis Report (PDF)
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;