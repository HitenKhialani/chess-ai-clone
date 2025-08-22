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

export default function FloatingBackground() {
  const theme = useCurrentTheme()

  // Grid starfield canvas (exactly 506 stars)
  const GridStarsCanvas: React.FC = () => {
    const ref = React.useRef<HTMLCanvasElement | null>(null)
    const starsRef = React.useRef<Array<{x:number;y:number;r:number;p:number;a:number;as:number;dx:number;dy:number}>>([])
    const rafRef = React.useRef<number | null>(null)

    React.useEffect(() => {
      const canvas = ref.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let w = canvas.width = canvas.offsetWidth
      let h = canvas.height = canvas.offsetHeight

      const initStars = () => {
        const stars: Array<{x:number;y:number;r:number;p:number;a:number;as:number;dx:number;dy:number}> = []
        for (let i=0;i<506;i++) {
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            // slightly smaller stars for lighter feel
            r: Math.random() * 0.6 + 0.3,
            p: Math.random() * Math.PI * 2,
            // lower base alpha for lighter look
            a: Math.random() * 0.25 + 0.25, // 0.25 - 0.5
            // slower twinkle speed
            as: (Math.random()*0.6 + 0.2) * 0.0015, // ~0.0003 - 0.0012
            // extremely gentle drift per frame (px)
            dx: (Math.random() - 0.5) * 0.02,
            dy: (Math.random() - 0.5) * 0.02,
          })
        }
        starsRef.current = stars
      }

      const draw = () => {
        ctx.clearRect(0,0,w,h)
        ctx.fillStyle = "transparent"
        for (const s of starsRef.current) {
          // very subtle twinkle by modulating alpha more slowly and lightly
          s.p += s.as
          const alpha = s.a * (0.75 + 0.10 * (0.5 + 0.5*Math.sin(s.p)))
          // gentle drift with wrap-around
          s.x += s.dx
          s.y += s.dy
          if (s.x < 0) s.x = w; else if (s.x > w) s.x = 0
          if (s.y < 0) s.y = h; else if (s.y > h) s.y = 0
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
          ctx.fill()
        }
        rafRef.current = requestAnimationFrame(draw)
      }

      const handleResize = () => {
        w = canvas.width = canvas.offsetWidth
        h = canvas.height = canvas.offsetHeight
        initStars()
      }

      initStars()
      draw()
      window.addEventListener('resize', handleResize)
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    return <canvas ref={ref} className="absolute inset-0 w-full h-full"/>
  }

  // Define simple themed layers
  const layers: Record<Theme, React.ReactNode> = {
    grid: (
      <>
        {/* Static soft nebula glows (no rotation) */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(60% 60% at 70% 20%, rgba(102,252,241,0.10) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(40% 40% at 20% 80%, rgba(69,162,158,0.16) 0%, transparent 70%)"
        }} />
        {/* Dense starfield via canvas (exactly 506 stars) */}
        <GridStarsCanvas />
      </>
    ),
    sol: (
      <>
        {/* Sun core */}
        <div className="absolute inset-0" style={{
          animation: "pulse-soft 12s ease-in-out infinite",
          background: "radial-gradient(34% 34% at 80% 18%, rgba(255,179,71,0.70) 0%, rgba(255,179,71,0.40) 44%, transparent 74%)"
        }} />
        {/* Rotating sun rays */}
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 90s linear infinite",
          background: "conic-gradient(from 0deg at 80% 18%, rgba(255,221,128,0.48) 0 14%, rgba(255,221,128,0) 14% 22%, rgba(255,221,128,0.38) 22% 30%, rgba(255,221,128,0) 30% 38%)"
        }} />
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 80s linear infinite reverse",
          background: "conic-gradient(from 10deg at 80% 18%, rgba(255,111,0,0.42) 0 16%, rgba(255,111,0,0) 16% 26%)"
        }} />
        {/* Extra ray layer for visibility */}
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 110s linear infinite",
          background: "conic-gradient(from -12deg at 78% 20%, rgba(255,180,80,0.28) 0 12%, rgba(255,180,80,0) 12% 24%)"
        }} />
        {/* Warm sky bloom */}
        <div className="absolute inset-0" style={{
          animation: "pulse-soft 14s ease-in-out infinite",
          background: "radial-gradient(60% 60% at 20% 80%, rgba(255,204,128,0.36) 0%, transparent 74%)"
        }} />
      </>
    ),
    flux: (
      <>
        {/* Exact theme background for Flux from CSS variables */}
        <div className="absolute inset-0" style={{
          background: "var(--background)"
        }} />
      </>
    ),
    terra: (
      <>
        {/* Primary forest sweep */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(140deg, rgba(124,192,67,0.90) 0%, rgba(124,192,67,0.78) 32%, rgba(124,192,67,0.62) 58%, rgba(124,192,67,0.42) 100%)"
        }} />
        {/* Distinct brown band */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(320deg, rgba(43,39,36,0.42) 0%, rgba(43,39,36,0.18) 28%, rgba(43,39,36,0.00) 56%)"
        }} />
        {/* Dappled canopy light */}
        <div className="absolute inset-0" style={{
          animation: "pulse-soft 9s ease-in-out infinite",
          background: "radial-gradient(48% 52% at 70% 18%, rgba(124,192,67,0.32) 0%, rgba(124,192,67,0) 65%)"
        }} />
        {/* Secondary canopy bloom for depth */}
        <div className="absolute inset-0" style={{
          animation: "pulse-soft 12s ease-in-out infinite",
          background: "radial-gradient(38% 38% at 22% 30%, rgba(148,208,100,0.18) 0%, rgba(148,208,100,0) 65%)"
        }} />
        {/* Gentle sheen */}
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 160s linear infinite",
          background: "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.07) 100%)"
        }} />
        {/* Multiple rotating light shafts (more than 2-3 animated pieces) */}
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 200s linear infinite",
          background: "conic-gradient(from 140deg at 30% 60%, rgba(255,255,255,0.04) 0 6%, rgba(255,255,255,0) 6% 24%)"
        }} />
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 220s linear infinite reverse",
          background: "conic-gradient(from -80deg at 70% 50%, rgba(255,255,255,0.03) 0 5%, rgba(255,255,255,0) 5% 23%)"
        }} />
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 260s linear infinite",
          background: "conic-gradient(from 20deg at 45% 30%, rgba(255,255,255,0.028) 0 7%, rgba(255,255,255,0) 7% 25%)"
        }} />
        {/* Low-lying drifting fog */}
        <div className="absolute inset-x-0 bottom-0 h-1/2" style={{
          animation: "drift-left 40s linear infinite",
          background: "linear-gradient( to top, rgba(108,78,58,0.25), rgba(108,78,58,0.18) 40%, rgba(108,78,58,0.0))"
        }} />
        <div className="absolute inset-x-0 bottom-0 h-1/3" style={{
          animation: "drift-right 55s linear infinite",
          background: "linear-gradient( to top, rgba(102,187,106,0.16), rgba(102,187,106,0.10) 40%, rgba(102,187,106,0.0))"
        }} />
        {/* Additional fog bands for more moving pieces */}
        <div className="absolute inset-x-0 bottom-0 h-1/4" style={{
          animation: "drift-left 70s linear infinite",
          background: "linear-gradient( to top, rgba(124,192,67,0.12), rgba(124,192,67,0.08) 40%, rgba(124,192,67,0.0))"
        }} />
        <div className="absolute inset-x-0 bottom-0 h-1/6" style={{
          animation: "drift-right 85s linear infinite",
          background: "linear-gradient( to top, rgba(43,39,36,0.12), rgba(43,39,36,0.06) 40%, rgba(43,39,36,0.0))"
        }} />
      </>
    ),
    glacis: (
      <>
        {/* Icy fog base layers */}
        <div className="absolute inset-x-0 bottom-0 h-3/5" style={{
          animation: "drift-right 60s linear infinite",
          background: "linear-gradient(to top, rgba(225,245,254,0.45), rgba(225,245,254,0.22) 40%, rgba(225,245,254,0.0))"
        }} />
        <div className="absolute inset-x-0 bottom-0 h-2/5" style={{
          animation: "drift-left 80s linear infinite",
          background: "linear-gradient(to top, rgba(178,235,242,0.32), rgba(178,235,242,0.14) 40%, rgba(178,235,242,0.0))"
        }} />
        {/* Polar light arcs */}
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 120s linear infinite",
          background: "conic-gradient(from 200deg at 30% 60%, rgba(79,195,247,0.16) 0 16%, rgba(79,195,247,0) 16% 36%)"
        }} />
        <div className="absolute inset-0" style={{
          animation: "slow-rotate 100s linear infinite reverse",
          background: "conic-gradient(from 40deg at 70% 30%, rgba(129,212,250,0.14) 0 18%, rgba(129,212,250,0) 18% 40%)"
        }} />
        {/* Cold glows */}
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
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <style>{`
        @keyframes slow-rotate { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes drift-left { 0% { transform: translateX(0px) } 50% { transform: translateX(-30px) } 100% { transform: translateX(0px) } }
        @keyframes drift-right { 0% { transform: translateX(0px) } 50% { transform: translateX(30px) } 100% { transform: translateX(0px) } }
        @keyframes pulse-soft { 0% { opacity: 0.85 } 50% { opacity: 0.65 } 100% { opacity: 0.85 } }
        @keyframes shooting-star { 0% { left: -20%; opacity: 0 } 5% { opacity: 1 } 60% { left: 120%; opacity: 0.85 } 100% { left: 140%; opacity: 0 } }
      `}</style>
      {layers[theme]}
    </div>
  )
}
