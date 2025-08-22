import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Crown, Sparkles } from 'lucide-react';

const FinalCTA: React.FC = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Cosmic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-background" />
      <div className="absolute inset-0 hero-glow opacity-30" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 cosmic-glow">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          
          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-cosmic">Join the Chess</span>
            <br />
            <span className="text-foreground">Revolution</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the future of chess training. Powered by AI. 
            <br />
            Inspired by Chess. Built for You.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button variant="hero" size="lg" className="group">
              <Rocket className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Join Free
            </Button>
            <Button variant="cosmic" size="lg" className="group">
              <Crown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Upgrade to Pro
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Explore Endgame
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-secondary">1M+</div>
              <div className="text-sm text-muted-foreground">Games Analyzed</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-chess-gold">99.9%</div>
              <div className="text-sm text-muted-foreground">Analysis Accuracy</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Credits */}
      <div className="text-center mt-16 pt-8 border-t border-border/30">
        <p className="text-sm text-muted-foreground">
          Powered by AI • Inspired by Chess • Built for You
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;