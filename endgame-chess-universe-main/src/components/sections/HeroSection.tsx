import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Play, BookOpen, BarChart3 } from 'lucide-react';
import heroChessPiece from '@/assets/hero-chess-piece.jpg';
import cosmicBackground from '@/assets/cosmic-background.jpg';

const HeroSection: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      if (!particlesRef.current) return;
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle absolute w-1 h-1 bg-primary/30 rounded-full';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particlesRef.current.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <div 
        className="absolute inset-0 opacity-20 parallax-bg"
        style={{
          backgroundImage: `url(${cosmicBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-glow opacity-90" />
      
      {/* Floating Chess Piece */}
      <div className="absolute right-10 top-20 chess-piece-float opacity-40 lg:opacity-60">
        <img 
          src={heroChessPiece} 
          alt="3D Chess Piece" 
          className="w-96 h-96 object-contain"
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="space-y-6">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="text-cosmic">Endgame</span>
            <br />
            <span className="text-foreground">AI Chess Training</span>
            <br />
            <span className="text-cosmic">Evolved</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Train smarter, analyze deeper, and play like the grandmasters.
            <br />
            Experience chess analysis beyond Chess.com & Lichess.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button variant="hero" size="lg" className="group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Play Now
            </Button>
            <Button variant="glass" size="lg" className="group">
              <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Learn Chess
            </Button>
            <Button variant="outline" size="lg" className="group">
              <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Try Analysis Free
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2 text-primary">
            <span className="text-sm font-medium">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;