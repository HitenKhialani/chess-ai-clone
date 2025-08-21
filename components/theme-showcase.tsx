"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const themes = [
  {
    id: "dark",
    name: "🌙 Dark Mode",
    description: "Bioluminescent Abyss - Deep navy with electric cyan accents",
    colors: {
      background: "#0A1A2F",
      accent: "#00F5D4",
      text: "#D8E6FF"
    }
  },
  {
    id: "light",
    name: "☀️ Light Mode", 
    description: "Warm Cream - Cozy and inviting with soft orange highlights",
    colors: {
      background: "#F4D6C6",
      accent: "#D2693F",
      text: "#222222"
    }
  },
  {
    id: "neon",
    name: "⚡ Neon Gamified",
    description: "Chaotic gaming experience with multiple neon colors and dynamic effects",
    colors: {
      background: "#0a0a0a",
      accent: "#FFD93D",
      text: "#F8F8F8"
    }
  },
  {
    id: "zen",
    name: "🧘 Zen Minimal",
    description: "Clean and minimal with soft indigo accents",
    colors: {
      background: "#F2F2F2",
      accent: "#5C6BC0",
      text: "#1A1A1A"
    }
  }
]

export function ThemeShowcase() {
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const { setTheme } = useTheme()

  const applyTheme = () => {
    setTheme(selectedTheme)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[var(--primary-text)] mb-3">
          Choose Your Theme
        </h2>
        <p className="text-lg text-[var(--secondary-text)] max-w-2xl mx-auto">
          Select from four unique visual themes to personalize your chess experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {themes.map((theme) => {
          return (
            <div 
              key={theme.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 p-6 rounded-lg border-2 ${
                selectedTheme === theme.id 
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg' 
                  : 'border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5'
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{theme.name.split(' ')[0]}</div>
                <div className="text-lg font-semibold text-[var(--primary-text)]">
                  {theme.name}
                </div>
              </div>
              <p className="text-[var(--secondary-text)] text-sm mb-6 leading-relaxed">
                {theme.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-[var(--border)]"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                  <span className="text-sm text-[var(--secondary-text)]">Background</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-[var(--border)]"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <span className="text-sm text-[var(--secondary-text)]">Accent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-[var(--border)]"
                    style={{ backgroundColor: theme.colors.text }}
                  />
                  <span className="text-sm text-[var(--secondary-text)]">Text</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="text-center space-y-4">
        <p className="text-base text-[var(--secondary-text)]">
          Current theme: <span className="font-semibold text-[var(--accent)]">
            {themes.find(t => t.id === selectedTheme)?.name}
          </span>
        </p>
        <Button 
          className="bg-[var(--accent)] text-[var(--card-foreground)] hover:bg-[var(--accent)]/90 px-8 py-3 text-lg font-bold"
          onClick={applyTheme}
        >
          Apply Theme
        </Button>
      </div>
    </div>
  )
} 