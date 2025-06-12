import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
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
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#111827] text-white antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
