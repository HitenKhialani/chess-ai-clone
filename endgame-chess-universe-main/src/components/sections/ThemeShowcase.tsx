import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Palette, Star, Sun, Zap, Leaf, Snowflake } from 'lucide-react';

const themes = [
  {
    id: 'grid' as const,
    name: 'Grid',
    description: 'Cosmos & galaxy vibes with stars and nebula',
    icon: Star,
    preview: 'from-blue-600 via-purple-600 to-indigo-800',
  },
  {
    id: 'solve' as const,
    name: 'Solve',
    description: 'Sunset horizon with warm gradients',
    icon: Sun,
    preview: 'from-orange-400 via-red-500 to-yellow-600',
  },
  {
    id: 'flux' as const,
    name: 'Flux',
    description: 'Gaming neon cyberpunk with glowing grids',
    icon: Zap,
    preview: 'from-pink-500 via-purple-500 to-cyan-500',
  },
  {
    id: 'terra' as const,
    name: 'Terra',
    description: 'Lush forests with earthy greens and browns',
    icon: Leaf,
    preview: 'from-green-600 via-emerald-700 to-green-800',
  },
  {
    id: 'glacius' as const,
    name: 'Glacius',
    description: 'Icy glacier with crystal blue shards',
    icon: Snowflake,
    preview: 'from-cyan-400 via-blue-500 to-indigo-600',
  },
];

const ThemeShowcase: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Palette className="w-6 h-6 text-primary" />
            <span className="text-primary font-medium">Customization</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-cosmic">Choose Your Universe</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your chess experience with five unique themes.
            Each creates a completely different atmosphere and mood.
          </p>
        </div>
        
        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {themes.map((themeOption) => {
            const IconComponent = themeOption.icon;
            const isActive = theme === themeOption.id;
            
            return (
              <div
                key={themeOption.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isActive ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setTheme(themeOption.id)}
              >
                {/* Theme Preview Card */}
                <div className={`
                  relative overflow-hidden rounded-2xl p-6 glass-card
                  ${isActive ? 'ring-2 ring-primary shadow-glow' : 'hover:shadow-cosmic'}
                  transition-all duration-300
                `}>
                  {/* Background Gradient Preview */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${themeOption.preview} opacity-20
                    group-hover:opacity-30 transition-opacity duration-300
                  `} />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center space-y-4">
                    {/* Icon */}
                    <div className={`
                      w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${themeOption.preview} 
                      flex items-center justify-center
                      ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      transition-transform duration-300
                    `}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Name */}
                    <h3 className={`
                      font-bold text-lg
                      ${isActive ? 'text-primary' : 'text-foreground'}
                    `}>
                      {themeOption.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {themeOption.description}
                    </p>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="inline-flex items-center space-x-1 text-primary text-sm font-medium">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span>Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Theme Description */}
        <div className="text-center mt-12">
          <div className="bg-card rounded-xl p-6 glass-card max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2 text-primary">
              Current Theme: {themes.find(t => t.id === theme)?.name}
            </h4>
            <p className="text-muted-foreground">
              {themes.find(t => t.id === theme)?.description}
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Customize Further
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThemeShowcase;