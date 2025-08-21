"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Bot, Target, Crown, Brain, Zap, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

interface ExtractedLink {
  title: string
  url: string
  type: 'course' | 'bot' | 'puzzle' | 'grandmaster' | 'other'
  description?: string
}

interface ResponseLinksCardProps {
  content: string
  theme?: 'light' | 'dark'
}

export default function ResponseLinksCard({ content, theme = 'dark' }: ResponseLinksCardProps) {
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([])
  const router = useRouter()

  useEffect(() => {
    const links = extractLinksFromContent(content)
    setExtractedLinks(links)
  }, [content])

  const extractLinksFromContent = (text: string): ExtractedLink[] => {
    const links: ExtractedLink[] = []
    
    // Course patterns
    const coursePatterns = [
      { pattern: /1\.e4 Openings Explained|Italian Game|Scotch Game|King's Gambit|e4 openings/g, url: '/learn/courses/one-e4-openings-explained', type: 'course' as const, title: '1.e4 Openings Explained' },
      { pattern: /French Defense Essentials|Advance.*Tarrasch.*Winawer|French Defense/g, url: '/learn/courses/french-defense-essentials', type: 'course' as const, title: 'French Defense Essentials' },
      { pattern: /Attacking Chess|Greek Gift|opening lines for attacks|attacking ideas/g, url: '/learn/courses/attacking-chess', type: 'course' as const, title: 'Attacking Chess' },
      { pattern: /D4 Openings|d4 openings/g, url: '/learn/courses/one-d4-openings', type: 'course' as const, title: 'D4 Openings' },
      { pattern: /Rook Endgame Techniques|rook endgame/g, url: '/learn/courses/rook-endgame-techniques', type: 'course' as const, title: 'Rook Endgame Techniques' },
      { pattern: /Bishop vs Knight Endgames|bishop.*knight.*endgame/g, url: '/learn/courses/bishop-vs-knight-endgames', type: 'course' as const, title: 'Bishop vs Knight Endgames' },
      { pattern: /Queen Endgames|queen endgame/g, url: '/learn/courses/queen-endgames', type: 'course' as const, title: 'Queen Endgames' },
      { pattern: /Strategic Planning|strategic planning/g, url: '/learn/courses/strategic-planning', type: 'course' as const, title: 'Strategic Planning' },
      { pattern: /Defensive Mastery|defensive mastery/g, url: '/learn/courses/defensive-mastery', type: 'course' as const, title: 'Defensive Mastery' },
      { pattern: /English Opening|English opening/g, url: '/learn/courses/english-opening', type: 'course' as const, title: 'English Opening' },
      { pattern: /Indian Defenses|Indian defenses/g, url: '/learn/courses/indian-defenses', type: 'course' as const, title: 'Indian Defenses' },
      { pattern: /Sicilian Defense Mastery|Sicilian Defense|sicilian defense/g, url: '/learn/courses/sicilian-defense-mastery', type: 'course' as const, title: 'Sicilian Defense Mastery' },
    ]

    // Bot patterns
    const botPatterns = [
      { pattern: /Beginner Bot|400-800 ELO/g, url: '/play/beginner', type: 'bot' as const, title: 'Beginner Bot' },
      { pattern: /Intermediate Bot|800-1600 ELO/g, url: '/play/intermediate', type: 'bot' as const, title: 'Intermediate Bot' },
      { pattern: /Advanced Bot|1600-2300 ELO/g, url: '/play/advanced', type: 'bot' as const, title: 'Advanced Bot' },
      { pattern: /More Advanced Bot|2300-3000 ELO/g, url: '/play/moreadvanced', type: 'bot' as const, title: 'More Advanced Bot' },
      { pattern: /Stockfish Master|3000\+ ELO/g, url: '/play/stockfish', type: 'bot' as const, title: 'Stockfish Master' },
      { pattern: /Magnus Carlsen/g, url: '/game/magnus', type: 'grandmaster' as const, title: 'Magnus Carlsen Games' },
      { pattern: /Hikaru Nakamura/g, url: '/game/grandmaster/hikaru', type: 'grandmaster' as const, title: 'Hikaru Nakamura Games' },
      { pattern: /Fabiano Caruana/g, url: '/game/grandmaster/fabiano', type: 'grandmaster' as const, title: 'Fabiano Caruana Games' },
    ]

    // Puzzle patterns
    const puzzlePatterns = [
      { pattern: /Puzzles|Mate in 1/g, url: '/puzzles/mate-in-1', type: 'puzzle' as const, title: "Puzzles" },
      { pattern: /Fork.*puzzles|Fork section/g, url: '/puzzles/fork', type: 'puzzle' as const, title: 'Fork Puzzles' },
      { pattern: /Pin.*puzzles|Pin section/g, url: '/puzzles/pin', type: 'puzzle' as const, title: 'Pin Puzzles' },
      { pattern: /Endgame.*puzzles|Endgame section/g, url: '/puzzles/endgame', type: 'puzzle' as const, title: 'Endgame Puzzles' },
      { pattern: /Tactics.*puzzles|Tactics section/g, url: '/puzzles/tactics', type: 'puzzle' as const, title: 'Tactics Puzzles' },
      { pattern: /Random.*puzzles|Random section/g, url: '/puzzles/random', type: 'puzzle' as const, title: 'Random Puzzles' },
      { pattern: /Strategy.*puzzles|Strategy section/g, url: '/puzzles/strategy', type: 'puzzle' as const, title: 'Strategy Puzzles' },
      { pattern: /Openings.*puzzles|Openings section/g, url: '/puzzles/openings', type: 'puzzle' as const, title: 'Openings Puzzles' },
    ]

    // General section patterns
    const sectionPatterns = [
      { pattern: /LEARN.*section|learn section/g, url: '/learn', type: 'other' as const, title: 'Learn Section' },
      { pattern: /PLAY.*section|play section/g, url: '/play', type: 'other' as const, title: 'Play Section' },
      { pattern: /PUZZLES.*section|puzzles section/g, url: '/puzzles', type: 'other' as const, title: 'Puzzles Section' },
      { pattern: /ANALYSIS.*section|analysis section/g, url: '/analysis', type: 'other' as const, title: 'Analysis Section' },
    ]

    // Check all patterns
    const allPatterns = [...coursePatterns, ...botPatterns, ...puzzlePatterns, ...sectionPatterns]
    
    allPatterns.forEach(({ pattern, url, type, title }) => {
      if (pattern.test(text)) {
        // Check if this link is already added
        const exists = links.some(link => link.url === url)
        if (!exists) {
          links.push({
            title,
            url,
            type,
            description: getDescriptionForType(type, title)
          })
        }
      }
    })

    return links
  }

  const getDescriptionForType = (type: string, title: string): string => {
    switch (type) {
      case 'course':
        return 'Interactive chess course with lessons and exercises'
      case 'bot':
        return 'Play against AI opponent'
      case 'puzzle':
        return 'Practice tactical puzzles'
      case 'grandmaster':
        return 'Analyze grandmaster games'
      case 'other':
        return 'Explore chess content'
      default:
        return 'Explore chess content'
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />
      case 'bot':
        return <Bot className="h-4 w-4" />
      case 'puzzle':
        return <Target className="h-4 w-4" />
      case 'grandmaster':
        return <Crown className="h-4 w-4" />
      case 'other':
        return <ExternalLink className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case 'course':
        return theme === 'light' ? 'text-[var(--primary)]' : 'text-blue-400'
      case 'bot':
        return theme === 'light' ? 'text-[var(--accent)]' : 'text-green-400'
      case 'puzzle':
        return theme === 'light' ? 'text-[var(--accent)]' : 'text-purple-400'
      case 'grandmaster':
        return theme === 'light' ? 'text-[var(--primary)]' : 'text-orange-400'
      default:
        return theme === 'light' ? 'text-[var(--muted-foreground)]' : 'text-[var(--muted-foreground)]'
    }
  }

  const handleLinkClick = (url: string) => {
    router.push(url)
  }

  if (extractedLinks.length === 0) {
    return null
  }

  return (
    <div className="mt-4 w-full">
      <div className={`rounded-lg border p-3 ${
        theme === 'light' 
          ? 'bg-[var(--card)] border-[#E5E7EB]' 
          : 'bg-[var(--card)]/10 backdrop-blur-xl border-[var(--border)]/20'
      }`}>
        <div className={`text-sm font-medium flex items-center gap-2 mb-3 ${
          theme === 'light' ? 'text-[#1A1A1A]' : 'text-[var(--accent-foreground)]'
        }`}>
          <ExternalLink className="h-4 w-4" />
          Quick Links
        </div>
        <div className="grid grid-cols-1 gap-2">
          {extractedLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`justify-start h-auto p-2 text-left hover:scale-102 transition-all duration-200 w-full ${
                theme === 'light'
                  ? 'border-[#D1D5DB] hover:bg-[#F3F4F6] hover:border-[#D97706]'
                  : 'border-[var(--border)]/20 hover:bg-[var(--card)]/10 hover:border-purple-400'
              }`}
              onClick={() => handleLinkClick(link.url)}
            >
              <div className="flex items-start gap-2 w-full">
                <div className={`flex-shrink-0 mt-0.5 ${getColorForType(link.type)}`}>
                  {getIconForType(link.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-xs ${
                    theme === 'light' ? 'text-[#1A1A1A]' : 'text-[var(--accent-foreground)]'
                  }`}>
                    {link.title}
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    theme === 'light' ? 'text-[#666666]' : 'text-[var(--muted-foreground)]'
                  }`}>
                    {link.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 