import { type NextRequest, NextResponse } from "next/server"

// Get API key from environment variable
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY environment variable is not set")
}

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId, userId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Check if any message contains an image
    const hasImage = messages.some((msg: any) => msg.image)
    
    // Use vision model if there's an image, otherwise use the regular model
    const model = hasImage ? "openai/gpt-4o-mini" : "deepseek/deepseek-r1-0528:free"

    // Process messages to include images in the correct format
    const processedMessages = messages.map((msg: any) => {
      if (msg.image) {
        // For vision models, we need to include the image in the content array
        return {
          role: msg.role,
          content: [
            {
              type: "text",
              text: msg.content || "Please describe this image."
            },
            {
              type: "image_url",
              image_url: {
                url: msg.image
              }
            }
          ]
        }
      } else {
        return {
          role: msg.role,
          content: msg.content
        }
      }
    })

    // Create comprehensive website knowledge for the AI
    const websiteKnowledge = `
You are Simplo, an AI assistant for the Endgame chess website. You have comprehensive knowledge about this chess learning platform and can help users with any questions about the website's features, content, and functionality.

WEBSITE OVERVIEW:
Endgame is a comprehensive chess learning platform that offers multiple features for chess improvement.

MAIN SECTIONS:

1. PLAY SECTION:
- Beginner Bot (400-800 ELO, depth 1-2): Perfect for learning the basics
- Intermediate Bot (800-1600 ELO, depth 3-5): Challenging but fair gameplay
- Advanced Bot (1600-2300 ELO, depth 6-8): Strong tactical play
- More Advanced Bot (2300-3000 ELO, depth 9-10): Near grandmaster level
- Stockfish Master (3000+ ELO, depth 11+): Ultimate chess challenge

2. LEARN SECTION - COURSES AVAILABLE:

OPENINGS WITH WHITE:
- 1.e4 Openings Explained: Covers Italian Game, Scotch Game, King's Gambit. Difficulty: Beginner to Intermediate. Estimated time: 2 hours.
- 1.d4 Repertoire: Covers Queen's Gambit, London System, Trompowsky Attack. Difficulty: Beginner to Intermediate. Estimated time: 2 hours.
- English Opening (1.c4): Covers Symmetrical English, Botvinnik System, Reverse Sicilian. Difficulty: Intermediate to Advanced. Estimated time: 2 hours.

OPENINGS WITH BLACK:
- Sicilian Defense Mastery: Covers Najdorf, Classical, Accelerated Dragon variations. Difficulty: Intermediate to Advanced. Estimated time: 3 hours.
- French Defense Essentials: Covers Advance, Tarrasch, Winawer variations. Difficulty: Beginner to Intermediate. Estimated time: 2.5 hours.
- Indian Defenses: Covers King's Indian, Nimzo-Indian, Grunfeld Defense. Difficulty: Intermediate to Advanced. Estimated time: 3 hours.

ENDGAMES:
- Bishop vs Knight Endgames: Covers good bishop vs bad knight, restricting the knight, outside passed pawns. Difficulty: Intermediate. Estimated time: 2 hours.
- Rook Endgame Techniques: Covers Lucena position, Philidor defense, Vancura defense. Difficulty: Intermediate. Estimated time: 2.5 hours.
- Queen Endgames: Covers checkmating patterns, perpetual checks, avoiding stalemates. Difficulty: Intermediate.

TACTICS & STRATEGY:
- Attacking Chess: Covers bishop sacrifice on h7, open file domination, Greek Gift sacrifice. Difficulty: Beginner to Advanced. Estimated time: 3 hours.
- Defensive Mastery: Covers creating fortresses, counterplay, defending passive positions. Difficulty: Intermediate. Estimated time: 2.5 hours.
- Strategic Planning: Covers weak squares, outposts, color complexes. Difficulty: Intermediate to Advanced. Estimated time: 3 hours.

3. PUZZLES SECTION (Mate'n Rush):
- Mate in 1: 7 easy puzzles for practicing checkmating in one move
- Pin: 10 puzzles for practicing pin tactics
- Fork: Multiple puzzles for fork tactics
- Tactics: Various tactical puzzles
- Endgame: Endgame-specific puzzles
- Random: Mixed puzzle types
- Grandmaster: Puzzles from grandmaster games

4. GRANDMASTER GAMES:
Available grandmasters to play against or learn from:
- Magnus Carlsen: Norwegian, 2859 FIDE rating, 5-time world champion, versatile opening style, exceptional endgame skills
- Hikaru Nakamura: American, 2787 FIDE rating, 5-time US champion, aggressive style, speed chess specialist
- Fabiano Caruana: American, 2796 FIDE rating, classical player, deep opening preparation
- Viswanathan Anand: Indian, 2754 FIDE rating, 5-time world champion, universal player, lightning-fast calculation

5. ANALYSIS SECTION:
The Game Analysis page provides comprehensive tools for analyzing chess games and positions:

CHESS BOARD FEATURES:
- Interactive 8x8 chess board in initial position
- Make moves manually on the board
- Upload PGN (Portable Game Notation) files for analysis
- Board controls: Undo, Redo, Reset Board, Analyze with GM

GAME CONTROLS:
- PGN Upload: Upload your games in PGN format for analysis
- PGN Metadata Display: Shows game information like Event, Site, Date, Round, White, Black, Result
- Save PGN: Save analyzed games with custom filenames
- Load Saved PGN: Access previously saved games
- Grandmaster Analysis: Choose from available grandmasters for position analysis
- Voice Analysis: Enable voice explanations for moves and positions

ANALYSIS FEATURES:
- Position evaluation with engine analysis
- Move suggestions and alternatives
- Game replay and move-by-move analysis
- Grandmaster-level insights and commentary
- Performance tracking and improvement suggestions
- Interactive learning with voice explanations

FEATURES:
- Dark blue theme with purple accents
- Responsive design for all devices
- User authentication and profiles
- Progress tracking
- Interactive chess boards
- Real-time game analysis

When users ask about the website, provide specific, helpful information about these features and guide them to the appropriate sections. Be enthusiastic about chess learning and encourage exploration of the platform's comprehensive content.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: hasImage 
              ? `${websiteKnowledge}\n\nYou are also a helpful AI assistant with vision capabilities. When you see an image, describe what you observe in detail. Be friendly, helpful, and conversational. Always respond in English.`
              : websiteKnowledge,
          },
          ...processedMessages,
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      let errorPayload: string | Record<string, unknown>
      try {
        errorPayload = await response.json()
      } catch {
        errorPayload = await response.text()
      }

      console.error("OpenRouter API error:", errorPayload)

      return NextResponse.json({ error: errorPayload }, { status: response.status })
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json({ error: "Invalid response format from OpenRouter API" }, { status: 500 })
    }

    const assistantMessage = data.choices[0].message.content;

    // Save messages to database if chatId and userId are provided
    if (chatId && userId) {
      try {
        // Get the latest user message
        const latestUserMessage = messages[messages.length - 1];
        
        // Save user message
        await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/simplo/chats/${chatId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.headers.get('authorization')?.split(' ')[1]}`
          },
          body: JSON.stringify({
            role: latestUserMessage.role,
            content: latestUserMessage.content,
            image: latestUserMessage.image
          })
        });

        // Save assistant message
        await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/simplo/chats/${chatId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.headers.get('authorization')?.split(' ')[1]}`
          },
          body: JSON.stringify({
            role: 'assistant',
            content: assistantMessage
          })
        });
      } catch (dbError) {
        console.error("Error saving to database:", dbError);
        // Don't fail the request if database save fails
      }
    }

    return NextResponse.json({
      content: assistantMessage,
      usage: data.usage,
    })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 