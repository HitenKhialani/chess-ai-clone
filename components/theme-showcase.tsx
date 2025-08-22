"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { THEMES, type PlanetTheme } from "@/components/ThemeManager"

const THEME_KEY = "endgame-theme"

const themeCards: Array<{
  id: PlanetTheme
  name: string
  description: string
  icon: string
}> = [
  { id: "grid", name: "Grid", description: "Cosmos & galaxy vibes with stars and nebula", icon: "⭐" },
  { id: "sol", name: "Solve", description: "Sunset horizon with warm gradients", icon: "🌅" },
  { id: "flux", name: "Flux", description: "Gaming neon cyberpunk with glowing grids", icon: "🎮" },
  { id: "terra", name: "Terra", description: "Lush forests with earthy greens and browns", icon: "🌲" },
  { id: "glacis", name: "Glacius", description: "Icy glacier with crystal blue shards", icon: "❄️" },
]

function applyTheme(theme: PlanetTheme) {
  if (typeof document === "undefined") return
  document.documentElement.setAttribute("data-theme", theme)
  try { localStorage.setItem(THEME_KEY, theme) } catch {}
  try { window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } })) } catch {}
}

export function ThemeShowcase() {
  const [selectedTheme, setSelectedTheme] = useState<PlanetTheme>("grid")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = (localStorage.getItem(THEME_KEY) as PlanetTheme) || "grid"
      if (THEMES.includes(saved)) setSelectedTheme(saved)
    } catch {}
    setMounted(true)
  }, [])

  const onApply = () => applyTheme(selectedTheme)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[var(--primary-text)] mb-3">
          Choose Your Theme
        </h2>
        <p className="text-lg text-[var(--secondary-text)] max-w-2xl mx-auto">
          Switch between the same themes available in the navbar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {themeCards.map((t) => (
          <div
            key={t.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 p-6 rounded-lg border-2 ${
              selectedTheme === t.id
                ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg"
                : "border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5"
            }`}
            onClick={() => setSelectedTheme(t.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl" aria-hidden>{t.icon}</div>
              <div className="text-lg font-semibold text-[var(--primary-text)]">{t.name}</div>
            </div>
            <p className="text-[var(--secondary-text)] text-sm mb-2 leading-relaxed">{t.description}</p>
            {selectedTheme === t.id && (
              <div className="text-xs text-[var(--accent)] font-medium">Active</div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center space-y-4">
        <p className="text-base text-[var(--secondary-text)]">
          Current theme: <span className="font-semibold text-[var(--accent)]" suppressHydrationWarning>
            {mounted ? themeCards.find((tt) => tt.id === selectedTheme)?.name : "Grid"}
          </span>
        </p>
        <Button
          className="bg-[var(--accent)] text-[var(--card-foreground)] hover:bg-[var(--accent)]/90 px-8 py-3 text-lg font-bold"
          onClick={onApply}
        >
          Apply Theme
        </Button>
      </div>
    </div>
  )
}