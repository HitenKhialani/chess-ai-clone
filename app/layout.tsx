import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { TimeTrackerProvider } from '../components/TimeTrackerProvider'
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from '@/components/UserProvider'

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#0A1A2F] text-[#D8E6FF] antialiased`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <TimeTrackerProvider>
            <UserProvider>
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
              <Toaster />
            </UserProvider>
          </TimeTrackerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
