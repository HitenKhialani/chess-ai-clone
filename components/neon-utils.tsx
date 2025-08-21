"use client"

import { useTheme } from "next-themes"

// Neon color classes for dynamic assignment
export const neonColorClasses = {
  yellow: "neon-yellow",
  pink: "neon-pink", 
  green: "neon-green",
  cyan: "neon-cyan",
  orange: "neon-orange",
  purple: "neon-purple",
  red: "neon-red",
  blue: "neon-blue"
}

// Neon button classes
export const neonButtonClasses = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  success: "btn-success",
  info: "btn-info",
  warning: "btn-warning",
  danger: "btn-danger"
}

// Neon badge classes
export const neonBadgeClasses = {
  yellow: "badge-yellow",
  pink: "badge-pink",
  green: "badge-green",
  cyan: "badge-cyan"
}

// Function to get random neon color class
export function getRandomNeonColor(): string {
  const colors = Object.values(neonColorClasses)
  return colors[Math.floor(Math.random() * colors.length)]
}

// Function to get random neon button class
export function getRandomNeonButton(): string {
  const buttons = Object.values(neonButtonClasses)
  return buttons[Math.floor(Math.random() * buttons.length)]
}

// Function to get random neon badge class
export function getRandomNeonBadge(): string {
  const badges = Object.values(neonBadgeClasses)
  return badges[Math.floor(Math.random() * badges.length)]
}

// Hook to check if current theme is neon
export function useNeonTheme() {
  const { theme } = useTheme()
  return theme === "neon"
}

// Component that applies random neon styling
export function NeonElement({ 
  children, 
  type = "color",
  className = "",
  ...props 
}: {
  children: React.ReactNode
  type?: "color" | "button" | "badge"
  className?: string
  [key: string]: any
}) {
  const isNeon = useNeonTheme()
  
  if (!isNeon) {
    return <span className={className} {...props}>{children}</span>
  }

  let neonClass = ""
  switch (type) {
    case "button":
      neonClass = getRandomNeonButton()
      break
    case "badge":
      neonClass = getRandomNeonBadge()
      break
    default:
      neonClass = getRandomNeonColor()
  }

  return (
    <span className={`${neonClass} ${className}`} {...props}>
      {children}
    </span>
  )
} 