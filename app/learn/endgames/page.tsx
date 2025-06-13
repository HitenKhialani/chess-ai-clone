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

interface EndgameResources {
  [key: string]: ResourceSection
}

const endgameResources: EndgameResources = {
  pawnEndgames: {
    title: "Pawn Endgames",
    description: "Master essential pawn endgame techniques and principles",
    videos: [
      {
        title: "Opposition and Key Squares",
        url: "https://www.youtube.com/embed/YgeYwuJuH7E",
        author: "Daniel Naroditsky",
        duration: "32:15"
      },
      {
        title: "Pawn Breakthroughs",
        url: "https://www.youtube.com/embed/5jvR_YCwThU",
        author: "Saint Louis Chess Club",
        duration: "45:30"
      }
    ],
    articles: [
      {
        title: "Essential Pawn Endgames",
        url: "https://www.chess.com/article/view/pawn-endgames",
        readTime: "25 min"
      },
      {
        title: "Advanced Pawn Structures",
        url: "https://lichess.org/study/pawn-endgames",
        readTime: "30 min"
      }
    ]
  },
  rookEndgames: {
    title: "Rook Endgames",
    description: "Study critical rook endgame positions and techniques",
    videos: [
      {
        title: "Lucena Position Masterclass",
        url: "https://www.youtube.com/embed/QkreZe8rSQE",
        author: "GothamChess",
        duration: "28:45"
      },
      {
        title: "Philidor Position Explained",
        url: "https://www.youtube.com/embed/nPCgBQcXY9A",
        author: "ChessBase India",
        duration: "35:20"
      }
    ],
    articles: [
      {
        title: "Rook vs Pawn Endgames",
        url: "https://www.chess.com/article/view/rook-endgames",
        readTime: "22 min"
      },
      {
        title: "Rook Endgame Principles",
        url: "https://lichess.org/study/rook-endings",
        readTime: "28 min"
      }
    ]
  },
  theoreticalEndgames: {
    title: "Theoretical Positions",
    description: "Learn key theoretical endgame positions from world champions",
    videos: [
      {
        title: "Queen vs Pawn Endgames",
        url: "https://www.youtube.com/embed/u8ZqeqK4yF4",
        author: "Hanging Pawns",
        duration: "40:10"
      },
      {
        title: "Minor Piece Endgames",
        url: "https://www.youtube.com/embed/kRYv6VKHY9k",
        author: "PowerPlayChess",
        duration: "38:45"
      }
    ],
    articles: [
      {
        title: "Essential Theoretical Endings",
        url: "https://www.chess.com/article/view/theoretical-endgames",
        readTime: "35 min"
      },
      {
        title: "Building an Endgame Repertoire",
        url: "https://lichess.org/study/endgame-theory",
        readTime: "40 min"
      }
    ]
  }
}

export default function EndgameLearningPage() {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/learn" className="text-[#00BFCF] hover:text-[#00BFCF]/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Grandmaster Endgames</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Study winning techniques from world champions and master essential endgame principles that will improve your overall chess understanding.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <Tabs defaultValue="pawnEndgames" className="space-y-4">
                  <TabsList className="bg-[#121212] border-b border-[#3F51B5]">
                    {Object.keys(endgameResources).map((key) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                      >
                        {endgameResources[key].title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(endgameResources).map(([key, section]) => (
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
                    <span className="text-[#00BFCF] font-semibold">1/6</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '16.67%' }}></div>
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
                    <span className="text-[#CFFAFE]">Endgame Expert</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#121212]">
                    <Trophy className="h-5 w-5 text-[#3F51B5]" />
                    <span className="text-[#CFFAFE]">Theoretical Master</span>
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