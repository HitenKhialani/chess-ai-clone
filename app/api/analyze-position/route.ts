import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { fen } = await request.json()

    if (!fen) {
      return NextResponse.json({ error: "FEN position is required" }, { status: 400 })
    }

    // Simulate analysis processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Parse the FEN to get basic position info
    const fenParts = fen.split(" ")
    const position = fenParts[0]
    const activeColor = fenParts[1]
    const castling = fenParts[2]
    const enPassant = fenParts[3]
    const halfmove = fenParts[4]
    const fullmove = fenParts[5]

    // Basic position analysis
    const pieceCount = position.replace(/[^a-zA-Z]/g, '').length
    const isEarlyGame = parseInt(fullmove) <= 10
    const isMidGame = parseInt(fullmove) > 10 && parseInt(fullmove) <= 25
    const isEndGame = parseInt(fullmove) > 25

    let gamePhase = "Opening"
    if (isMidGame) gamePhase = "Middlegame"
    if (isEndGame) gamePhase = "Endgame"

    const analysis = `🔍 **Position Analysis**

**Game Phase:** ${gamePhase} (Move ${fullmove})
**Active Player:** ${activeColor === 'w' ? 'White' : 'Black'}
**Pieces on Board:** ${pieceCount}

**Position Features:**
${castling !== '-' ? `• Castling rights: ${castling}` : '• No castling rights available'}
${enPassant !== '-' ? `• En passant target: ${enPassant}` : ''}
• Halfmove clock: ${halfmove}

**Strategic Considerations:**
${isEarlyGame ? '• Focus on piece development and king safety\n• Control the center with pawns and pieces\n• Complete castling if possible' : ''}
${isMidGame ? '• Look for tactical opportunities\n• Improve piece coordination\n• Consider pawn structure and weaknesses' : ''}
${isEndGame ? '• Activate the king\n• Push passed pawns\n• Simplify to favorable endings' : ''}

💡 **Note:** This is a basic position analysis. For detailed move suggestions, use the "Analyze Position" button in the game interface which uses the Stockfish engine.`

    return NextResponse.json({
      analysis,
      fen,
      gamePhase,
      activeColor: activeColor === 'w' ? 'White' : 'Black',
      moveNumber: parseInt(fullmove)
    })
  } catch (error) {
    console.error("Error analyzing position:", error)
    return NextResponse.json({ error: "Failed to analyze position" }, { status: 500 })
  }
}