"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisLoadingBufferProps {
  isVisible: boolean;
}

const AnalysisLoadingBuffer: React.FC<AnalysisLoadingBufferProps> = ({ isVisible }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const messages = [
    "Analysing each move...",
    "Providing best results...",
    "Crafting your report...",
    "Almost there...",
    "Finalizing analysis..."
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isVisible, messages.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-accent/50 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Animated Buffer/Circle */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer rotating circle */}
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 bg-accent/20 rounded-full animate-pulse"></div>
            
            {/* Center dot */}
            <div className="absolute inset-6 bg-accent rounded-full"></div>
          </div>
        </div>

        {/* Animated Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-medium text-primary"
          >
            {messages[currentMessageIndex]}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {messages.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentMessageIndex ? 'bg-accent' : 'bg-accent/30'
              }`}
              animate={{
                scale: index === currentMessageIndex ? 1.2 : 1,
                opacity: index === currentMessageIndex ? 1 : 0.5
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Additional decorative elements */}
        <div className="mt-6 text-sm text-muted-foreground">
          Please wait while we analyze your game...
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoadingBuffer; 