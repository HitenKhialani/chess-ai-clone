"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const THEME_KEY = "endgame-theme"
const THEMES = ["grid", "sol", "flux", "terra", "glacis"] as const
type Theme = typeof THEMES[number]

const ICONS: Record<Theme, string> = {
  grid: "🌌",
  sol: "🌅",
  flux: "🎮",
  terra: "🌲",
  glacis: "❄️",
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return
  document.documentElement.setAttribute("data-theme", theme)
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }))
  } catch {}
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "grid"
    const saved = (localStorage.getItem(THEME_KEY) as Theme) || "grid"
    return THEMES.includes(saved) ? saved : "grid"
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const cycle = () => {
    const idx = THEMES.indexOf(theme)
    const next = THEMES[(idx + 1) % THEMES.length]
    setTheme(next)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycle}
      aria-label={`Switch theme (current: ${theme})`}
      className="rounded-full border border-[var(--border)] text-[var(--primary-text)] hover:bg-[var(--card)]/60"
      title={`Theme: ${theme}`}
    >
      <span className="text-lg leading-none">{ICONS[theme]}</span>
    </Button>
  )
}