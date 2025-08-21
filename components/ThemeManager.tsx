"use client"

import { useEffect, useState } from "react"

const THEME_KEY = "endgame-theme"
export type PlanetTheme = "grid" | "sol" | "flux" | "terra" | "glacis"
export const THEMES: PlanetTheme[] = ["grid", "sol", "flux", "terra", "glacis"]

export function ThemeManager() {
  const [theme, setTheme] = useState<PlanetTheme>(() => {
    if (typeof window === "undefined") return "grid"
    const saved = (localStorage.getItem(THEME_KEY) as PlanetTheme) || "grid"
    return THEMES.includes(saved) ? saved : "grid"
  })

  // Apply to <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  // Sync with localStorage and notify listeners
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }))
  }, [theme])

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY && e.newValue) {
        const t = e.newValue as PlanetTheme
        if (THEMES.includes(t)) setTheme(t)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return null
}
