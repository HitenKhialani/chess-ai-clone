import type { Metadata } from 'next'
import './globals.css'
import '../../styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeManager } from '@/components/ThemeManager'

export const metadata: Metadata = {
  title: 'Simplo',
  description: 'A modern AI chatbot powered by OpenRouter',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: 'var(--background)', color: 'var(--primary-text)' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
