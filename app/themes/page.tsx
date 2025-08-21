'use client';

import { ThemeShowcase } from '../../components/theme-showcase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[var(--primary-text)]">
            Theme Showcase
          </h1>
          <p className="text-lg text-[var(--secondary-text)] max-w-2xl mx-auto">
            Experience four unique themes designed to enhance your chess training experience. 
            Each theme offers a distinct visual style while maintaining perfect chessboard visibility.
          </p>
        </div>

        {/* Theme Showcase Component */}
        <div className="py-8">
          <ThemeShowcase />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--primary-text)]">Dark Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--secondary-text)] text-sm mb-4">
                Bioluminescent abyss with electric cyan accents. Perfect for focused training sessions.
              </p>
            </CardContent>
          </Card>

          <Card className="card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--primary-text)]">Light Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--secondary-text)] text-sm mb-4">
                Warm cream background with soft orange highlights. Cozy and inviting.
              </p>
            </CardContent>
          </Card>

          <Card className="card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--primary-text)]">Neon Gamified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--secondary-text)] text-sm mb-4">
                High-energy gaming aesthetic with bright neon colors and glow effects.
              </p>
            </CardContent>
          </Card>

          <Card className="card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[var(--primary-text)]">Zen Minimal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--secondary-text)] text-sm mb-4">
                Clean and minimal design with soft indigo accents. Focus on simplicity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Theme Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-[var(--primary-text)]">
                Theme Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--primary-text)]">🎨 Visual Consistency</h4>
                <p className="text-sm text-[var(--secondary-text)]">
                  All themes maintain perfect contrast and readability while offering unique aesthetics.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--primary-text)]">♟️ Chessboard Preservation</h4>
                <p className="text-sm text-[var(--secondary-text)]">
                  Chess pieces and board colors remain constant across all themes for optimal gameplay.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--primary-text)]">⚡ Smooth Transitions</h4>
                <p className="text-sm text-[var(--secondary-text)]">
                  Instant theme switching with smooth animations and hover effects.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="text-[var(--primary-text)]">
                Theme Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--primary-text)]">🌙 Dark Mode</h4>
                <p className="text-sm text-[var(--secondary-text)]">
                  Reduces eye strain during long training sessions. Perfect for night-time practice.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--primary-text)]">☀️ Light Mode</h4>
                <p className="text-sm text-[var(--secondary-text)]">
                  Warm and inviting. Great for daytime use and casual play.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--primary-text)]">⚡ Neon Mode</h4>
                <p className="text-sm text-[var(--secondary-text)]">
                  High-energy gaming experience. Ideal for competitive play and tournaments.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[var(--primary-text)]">🧘 Zen Mode</h4>
                <p className="text-sm text-[var(--secondary-text)]">
                  Clean and distraction-free. Perfect for focused study and analysis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-[var(--primary-text)]">
            Ready to Experience Your Perfect Theme?
          </h3>
          <p className="text-[var(--secondary-text)]">
            Use the theme switcher in the navigation bar to try all four themes instantly.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-[var(--accent)] text-[var(--card-foreground)] hover:bg-[var(--accent)]/90">
              Start Training
            </Button>
            <Button variant="outline" className="border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--card-foreground)]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 