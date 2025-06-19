import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/lib/theme-context"
import { ThemeToggle } from "@/components/theme-toggle"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Endgame - Where AI Learning Begins",
  description:
    "Master chess with AI-powered analysis, personalized training, and insights from the world's greatest grandmasters.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#4f46e5] dark:via-[#7c3aed] dark:to-[#111827] text-gray-900 dark:text-white antialiased`}>
        <ThemeProvider>
          <ThemeToggle />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
