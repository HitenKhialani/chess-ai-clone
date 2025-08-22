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
  // To avoid SSR/CSR text mismatches, start with a stable default ("grid")
  // and then read localStorage after mount.
  const [theme, setTheme] = useState<Theme>("grid")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Initialize from localStorage on client only
    try {
      const saved = (localStorage.getItem(THEME_KEY) as Theme) || "grid"
      if (THEMES.includes(saved)) setTheme(saved)
    } catch {}
    setMounted(true)
  }, [])

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
      {/* suppressHydrationWarning prevents SSR/CSR emoji mismatch warnings */}
      <span className="text-lg leading-none" suppressHydrationWarning>
        {mounted ? ICONS[theme] : ICONS["grid"]}
      </span>
    </Button>
  )
}