'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PlayCircle, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const middlegameResources = {
  pawnStructures: {
    title: "Pawn Structures",
    description: "Master the art of pawn play and structures in the middlegame",
    videos: [
      {
        title: "Isolated Queen's Pawn",
        url: "https://www.youtube.com/embed/YAuMj1f0RGY",
        author: "GothamChess",
        duration: "15:20"
      },
      {
        title: "Pawn Chain Strategies",
        url: "https://www.youtube.com/embed/3G0sH0HUwz0",
        author: "Daniel Naroditsky",
        duration: "20:15"
      }
    ],
    articles: [
      {
        title: "Understanding Pawn Weaknesses",
        url: "https://www.chess.com/article/view/pawn-weaknesses",
        readTime: "10 min"
      },
      {
        title: "Doubled Pawns Strategy",
        url: "https://lichess.org/study/doubled-pawns",
        readTime: "15 min"
      }
    ]
  },
  pieceCoordination: {
    title: "Piece Coordination",
    description: "Learn how to coordinate your pieces effectively",
    videos: [
      {
        title: "Piece Coordination Masterclass",
        url: "https://www.youtube.com/embed/xhJ7A_OaR9M",
        author: "ChessBase India",
        duration: "25:30"
      },
      {
        title: "Minor Pieces in the Middlegame",
        url: "https://www.youtube.com/embed/FcLYgXCkucc",
        author: "Saint Louis Chess Club",
        duration: "30:45"
      }
    ],
    articles: [
      {
        title: "Piece Coordination Guide",
        url: "https://www.chess.com/article/view/piece-coordination",
        readTime: "12 min"
      },
      {
        title: "Improving Piece Activity",
        url: "https://lichess.org/study/piece-activity",
        readTime: "20 min"
      }
    ]
  },
  attackingPlay: {
    title: "Attacking Play",
    description: "Master the art of attacking chess",
    videos: [
      {
        title: "Attacking the King",
        url: "https://www.youtube.com/embed/p6uqQ1EqBTg",
        author: "Hanging Pawns",
        duration: "22:15"
      },
      {
        title: "Sacrifice for Attack",
        url: "https://www.youtube.com/embed/LSZJs9ZgGVs",
        author: "PowerPlayChess",
        duration: "18:30"
      }
    ],
    articles: [
      {
        title: "Art of Attack",
        url: "https://www.chess.com/article/view/art-of-attack",
        readTime: "15 min"
      },
      {
        title: "Attacking Patterns",
        url: "https://lichess.org/study/attacking-chess",
        readTime: "25 min"
      }
    ]
  }
}

export default function MiddlegameLearningPage() {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/learn" className="text-[#00BFCF] hover:text-[#00BFCF]/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-[#FFFFFF]">Middlegame Strategy</h1>
          </div>
          <p className="text-[#CFFAFE] max-w-2xl">
            Master essential middlegame concepts through curated video lessons and articles from top chess instructors.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-[#3F51B5]">
              <CardContent className="p-6">
                <Tabs defaultValue="pawnStructures" className="space-y-4">
                  <TabsList className="bg-[#121212] border-b border-[#3F51B5]">
                    {Object.keys(middlegameResources).map((key) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white"
                      >
                        {middlegameResources[key].title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(middlegameResources).map(([key, section]) => (
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
                    <span className="text-[#00BFCF] font-semibold">4/6</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '66.67%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CFFAFE]">Articles Read</span>
                    <span className="text-[#00BFCF] font-semibold">3/6</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div className="bg-[#00BFCF] h-2 rounded-full" style={{ width: '50%' }}></div>
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
                    <span className="text-[#CFFAFE]">Pawn Structure Master</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#121212]">
                    <Trophy className="h-5 w-5 text-[#3F51B5]" />
                    <span className="text-[#CFFAFE]">Attacking Expert</span>
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