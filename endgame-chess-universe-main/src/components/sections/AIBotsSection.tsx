import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Zap, Trophy, Crown } from 'lucide-react';

const aiProfiles = [
  {
    name: 'Bobby',
    level: 'Beginner',
    rating: '800-1200',
    personality: 'Encouraging and patient',
    quote: "Let's learn together! Every grandmaster was once a beginner.",
    icon: Bot,
    color: 'from-green-400 to-blue-500',
  },
  {
    name: 'Mikhail',
    level: 'Intermediate',
    rating: '1200-1800',
    personality: 'Strategic and analytical',
    quote: "Think before you move. Chess is 99% tactics!",
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'Kasparov AI',
    level: 'Advanced',
    rating: '1800-2400',
    personality: 'Aggressive and tactical',
    quote: "I will crush you with precision. Are you ready?",
    icon: Trophy,
    color: 'from-red-400 to-pink-500',
  },
  {
    name: 'Stockfish',
    level: 'Engine',
    rating: '3500+',
    personality: 'Cold and calculating',
    quote: "Resistance is futile. I see 40 moves ahead.",
    icon: Crown,
    color: 'from-purple-400 to-indigo-600',
  },
];

const AIBotsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-cosmic">Play vs AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Battle against our AI opponents, each with unique personalities and playing styles.
            From encouraging beginners to ruthless engines.
          </p>
        </div>
        
        {/* AI Bots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aiProfiles.map((bot, index) => {
            const IconComponent = bot.icon;
            return (
              <div
                key={bot.name}
                className="glass-card p-6 rounded-2xl hover-lift chess-glow group cursor-pointer"
              >
                {/* Bot Avatar */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${bot.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                
                {/* Bot Info */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{bot.name}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-primary font-medium">{bot.level}</p>
                    <p className="text-xs text-muted-foreground">Rating: {bot.rating}</p>
                  </div>
                  
                  {/* Personality */}
                  <p className="text-sm text-muted-foreground italic">{bot.personality}</p>
                  
                  {/* Quote */}
                  <div className="bg-background/50 p-3 rounded-lg mt-4">
                    <p className="text-sm text-foreground">"{bot.quote}"</p>
                  </div>
                  
                  {/* Challenge Button */}
                  <Button 
                    variant="cosmic" 
                    className="w-full mt-4 group-hover:scale-105 transition-transform"
                  >
                    Challenge
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Section Footer */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Each AI adapts to your skill level and provides personalized feedback
          </p>
          <Button variant="outline" size="lg">
            View All AI Opponents
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIBotsSection;