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

interface OpeningResources {
  [key: string]: ResourceSection
}

const openingResources: OpeningResources = {
  fundamentals: {
    title: "Opening Principles",
    description: "Learn the core principles that govern successful opening play",
    videos: [
      {
        title: "Opening Principles Every Beginner Must Know",
        url: "https://www.youtube.com/embed/8IlJ3v8I4Z8",
        author: "GothamChess",
        duration: "20:15"
      },
      {
        title: "How to Build an Opening Repertoire",
        url: "https://www.youtube.com/embed/6IegDENuxU4",
        author: "Daniel Naroditsky",
        duration: "25:30"
      }
    ],
    articles: [
      {
        title: "Basic Opening Principles",
        url: "https://www.chess.com/article/view/the-principles-of-the-opening",
        readTime: "15 min"
      },
      {
        title: "Common Opening Mistakes",
        url: "https://lichess.org/study/opening-mistakes",
        readTime: "12 min"
      }
    ]
  },
  popularOpenings: {
    title: "Popular Openings",
    description: "Master the most common and effective chess openings",
    videos: [
      {
        title: "The Italian Game for White",
        url: "https://www.youtube.com/embed/Ib8XaRKCAfo",
        author: "ChessBase India",
        duration: "18:45"
      },
      {
        title: "Sicilian Defense Explained",
        url: "https://www.youtube.com/embed/KbqJ9Z-3Irs",
        author: "Saint Louis Chess Club",
        duration: "30:20"
      }
    ],
    articles: [
      {
        title: "Ruy Lopez Guide",
        url: "https://www.chess.com/article/view/ruy-lopez-chess-opening",
        readTime: "20 min"
      },
      {
        title: "French Defense Strategy",
        url: "https://lichess.org/study/french-defense",
        readTime: "18 min"
      }
    ]
  },
  openingTraps: {
    title: "Opening Traps",
    description: "Learn to avoid common traps and set them for your opponents",
    videos: [
      {
        title: "Most Common Opening Traps",
        url: "https://www.youtube.com/embed/LxhzJvQs2PU",
        author: "Hanging Pawns",
        duration: "22:10"
      },
      {
        title: "Deadly Opening Traps",
        url: "https://www.youtube.com/embed/9mhLQOZKVQs",
        author: "PowerPlayChess",
        duration: "19:45"
      }
    ],
    articles: [
      {
        title: "Famous Opening Traps",
        url: "https://www.chess.com/article/view/chess-opening-traps",
        readTime: "15 min"
      },
      {
        title: "Avoiding Opening Disasters",
        url: "https://lichess.org/study/opening-traps",
        readTime: "16 min"
      }
    ]
  }
}

export default function OpeningLearningPage() {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/learn" className="text-[#00BFCF] hover:text-[#00BFCF]/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Opening Fundamentals</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Master the essential opening principles and build a strong repertoire with guidance from top chess instructors.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <Tabs defaultValue="fundamentals" className="space-y-4">
                  <TabsList className="bg-[#121212] border-b border-[#3F51B5]">
                    {Object.keys(openingResources).map((key) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                      >
                        {openingResources[key].title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(openingResources).map(([key, section]) => (
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
                    <span className="text-[#00BFCF] font-semibold">3/6</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Articles Read</span>
                    <span className="text-[#00BFCF] font-semibold">2/6</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '33.33%' }}></div>
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
                    <span className="text-[#CFFAFE]">Opening Explorer</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#121212]">
                    <Trophy className="h-5 w-5 text-[#3F51B5]" />
                    <span className="text-[#CFFAFE]">Repertoire Builder</span>
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