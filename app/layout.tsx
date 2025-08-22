import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/navbar"
import FloatingBackground from "@/components/FloatingBackground"

import { TimeTrackerProvider } from '../components/TimeTrackerProvider'
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from '@/components/UserProvider'
import { ThemeManager } from "@/components/ThemeManager"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Endgame - AI Chess Trainer",
  description: "Sharpen your chess skills with AI-powered analysis and personalized training.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="grid">
      <body className={`${inter.className} min-h-screen antialiased scale-container`}>
        <ThemeManager />
        <TimeTrackerProvider>
          <UserProvider>

            <FloatingBackground />
            <Navbar />
            <main className="relative z-10 container mx-auto px-4 py-8">
              {children}
            </main>

            <Toaster />
          </UserProvider>
        </TimeTrackerProvider>
      </body>
    </html>
  )
}
