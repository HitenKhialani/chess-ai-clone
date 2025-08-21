"use client"

import * as React from "react"

type Theme = "grid" | "sol" | "flux" | "terra" | "glacis"

function useCurrentTheme(): Theme {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof document === "undefined") return "grid"
    return (document.documentElement.getAttribute("data-theme") as Theme) || "grid"
  })
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.theme) setTheme(detail.theme as Theme)
      else setTheme((document.documentElement.getAttribute("data-theme") as Theme) || "grid")
    }
    window.addEventListener("theme-change", handler as EventListener)
    return () => window.removeEventListener("theme-change", handler as EventListener)
  }, [])
  return theme
}

const FloatingBackground: React.FC = () => {
  const theme = useCurrentTheme()

  // Define simple themed layers
  const layers: Record<Theme, React.ReactNode> = {
    grid: (
      <>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(60% 60% at 70% 20%, rgba(102,252,241,0.12) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(40% 40% at 20% 80%, rgba(69,162,158,0.18) 0%, transparent 70%)"
        }} />
      </>
    ),
    sol: (
      <>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(50% 50% at 30% 20%, rgba(255,179,71,0.25) 0%, transparent 70%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(60% 60% at 80% 70%, rgba(255,204,128,0.18) 0%, transparent 70%)"
        }} />
      </>
    ),
    flux: (
      <>
        <div className="absolute inset-0" style={{
          background: "repeating-linear-gradient(135deg, rgba(57,255,20,0.08) 0 2px, transparent 2px 8px)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(35% 35% at 20% 30%, rgba(255,7,58,0.18) 0%, transparent 70%)"
        }} />
      </>
    ),
    terra: (
      <>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(50% 50% at 75% 25%, rgba(76,175,80,0.18) 0%, transparent 70%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(40% 40% at 25% 80%, rgba(141,110,99,0.18) 0%, transparent 70%)"
        }} />
      </>
    ),
    glacis: (
      <>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(45% 45% at 70% 20%, rgba(129,212,250,0.22) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(35% 35% at 25% 75%, rgba(79,195,247,0.18) 0%, transparent 70%)"
        }} />
      </>
    ),
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1]" aria-hidden="true">
      {layers[theme]}
    </div>
  )
}

export default FloatingBackground
