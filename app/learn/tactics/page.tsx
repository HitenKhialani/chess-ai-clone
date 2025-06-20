'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PlayCircle, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Video {
  title: string
  url: string
  author: string
  duration: string
}

interface Article {
  title: string
  url: string
  readTime: string
}

interface ResourceSection {
  title: string
  description: string
  videos: Video[]
  articles: Article[]
}

interface TacticsResources {
  [key: string]: ResourceSection
}

const tacticsResources: TacticsResources = {
  combinations: {
    title: "Tactical Combinations",
    description: "Learn to spot and execute complex tactical combinations",
    videos: [
      {
        title: "Advanced Pin Tactics",
        url: "https://www.youtube.com/embed/yv7_0svOlQU",
        author: "ChessBrah",
        duration: "25:10"
      },
      {
        title: "Double Attack Masterclass",
        url: "https://www.youtube.com/embed/9LMRN0A9G4g",
        author: "Daniel Naroditsky",
        duration: "28:45"
      }
    ],
    articles: [
      {
        title: "Complex Combinations Guide",
        url: "https://www.chess.com/article/view/advanced-tactics",
        readTime: "20 min"
      },
      {
        title: "Pattern Recognition in Tactics",
        url: "https://lichess.org/study/tactical-patterns",
        readTime: "25 min"
      }
    ]
  },
  sacrifices: {
    title: "Tactical Sacrifices",
    description: "Master the art of piece sacrifices for decisive advantages",
    videos: [
      {
        title: "Queen Sacrifices in Attack",
        url: "https://www.youtube.com/embed/ZZwZ7HzoD_E",
        author: "GothamChess",
        duration: "22:15"
      },
      {
        title: "Positional Sacrifices",
        url: "https://www.youtube.com/embed/kUvKYYPhL3E",
        author: "Saint Louis Chess Club",
        duration: "35:20"
      }
    ],
    articles: [
      {
        title: "Art of the Sacrifice",
        url: "https://www.chess.com/article/view/chess-sacrifices",
        readTime: "18 min"
      },
      {
        title: "Exchange Sacrifices",
        url: "https://lichess.org/study/exchange-sacrifices",
        readTime: "22 min"
      }
    ]
  },
  calculation: {
    title: "Deep Calculation",
    description: "Improve your calculation abilities in complex positions",
    videos: [
      {
        title: "Calculation Training Methods",
        url: "https://www.youtube.com/embed/Km2zOOGcwz8",
        author: "Hanging Pawns",
        duration: "30:10"
      },
      {
        title: "Advanced Visualization",
        url: "https://www.youtube.com/embed/vR2B4y_dQvs",
        author: "PowerPlayChess",
        duration: "26:45"
      }
    ],
    articles: [
      {
        title: "Improving Calculation",
        url: "https://www.chess.com/article/view/calculation-training",
        readTime: "15 min"
      },
      {
        title: "Visualization Exercises",
        url: "https://lichess.org/study/calculation",
        readTime: "20 min"
      }
    ]
  }
}

export default function TacticsLearningPage() {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/learn" className="text-[#00BFCF] hover:text-[#00BFCF]/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Advanced Tactics</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Master complex tactical patterns and improve your calculation abilities with advanced lessons from chess experts.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <Tabs defaultValue="combinations" className="space-y-4">
                  <TabsList className="bg-[#121212] border-b border-[#3F51B5]">
                    {Object.keys(tacticsResources).map((key) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                      >
                        {tacticsResources[key].title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(tacticsResources).map(([key, section]) => (
                    <TabsContent key={key} value={key}>
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-semibold text-[#FFFFFF] mb-2">{section.title}</h2>
                          <p className="text-[#CFFAFE]">{section.description}</p>
                        </div>

                        {/* Video Section */}
                        <div>
                          <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Video Lessons</h3>
                          <div className="grid gap-6">
                            {section.videos.map((video, index) => (
                              <div key={index} className="space-y-3">
                                <div className="aspect-video">
                                  <iframe
                                    className="w-full h-full rounded-lg"
                                    src={video.url}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                                <div>
                                  <h4 className="text-[#FFFFFF] font-semibold">{video.title}</h4>
                                  <div className="flex items-center gap-2 text-sm text-[#CFFAFE]">
                                    <PlayCircle className="h-4 w-4" />
                                    <span>{video.duration}</span>
                                    <span>•</span>
                                    <span>{video.author}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Articles Section */}
                        <div>
                          <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Recommended Reading</h3>
                          <div className="grid gap-4">
                            {section.articles.map((article, index) => (
                              <a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-lg bg-[#121212] hover:bg-[#1a1a1a] transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <BookOpen className="h-5 w-5 text-[#00BFCF]" />
                                  <span className="text-[#FFFFFF]">{article.title}</span>
                                </div>
                                <Badge variant="outline" className="text-[#CFFAFE] border-[#3F51B5]">
                                  {article.readTime}
                                </Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Videos Watched</span>
                    <span className="text-[#00BFCF] font-semibold">2/6</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '33.33%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Articles Read</span>
                    <span className="text-[#00BFCF] font-semibold">1/6</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '16.67%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#FFFFFF] mb-4">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#121212]">
                    <Trophy className="h-5 w-5 text-[#00BFCF]" />
                    <span className="text-[#CFFAFE]">Tactical Genius</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#121212]">
                    <Trophy className="h-5 w-5 text-[#3F51B5]" />
                    <span className="text-[#CFFAFE]">Calculation Master</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}