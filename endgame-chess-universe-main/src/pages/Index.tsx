import React from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import HeroSection from '@/components/sections/HeroSection';
import AIBotsSection from '@/components/sections/AIBotsSection';
import AnalysisSection from '@/components/sections/AnalysisSection';
import ThemeShowcase from '@/components/sections/ThemeShowcase';
import FinalCTA from '@/components/sections/FinalCTA';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-hero">
        <HeroSection />
        <AIBotsSection />
        <AnalysisSection />
        <ThemeShowcase />
        <FinalCTA />
      </div>
    </ThemeProvider>
  );
};

export default Index;
