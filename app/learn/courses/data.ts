export interface Position {
  fen: string
  moves: string[]
  explanation: string
}

export interface ChapterContent {
  theory: string[]
  keyIdeas: string[]
}

export interface Chapter {
  title: string
  description: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  content?: ChapterContent
  positions?: Position[]
}

export interface Course {
  title: string
  description: string
  duration: string
  level: string
  lessons: number
  progress: number
  chapters: Chapter[]
}

export const coursesData: Record<string, Course> = {
  "opening-fundamentals": {
    title: "Opening Fundamentals",
    description: "Master the essential principles of chess openings and learn how to develop a strong opening repertoire. This course covers key concepts like center control, piece development, and common opening traps.",
    duration: "2 hours",
    level: "Beginner",
    lessons: 8,
    progress: 75,
    chapters: [
      {
        title: "Understanding Opening Principles",
        description: "Learn the fundamental principles that guide successful opening play, including center control, piece development, and king safety.",
        duration: "15 min",
        isCompleted: true,
        isLocked: false,
        content: {
          theory: [
            "Control the center with pawns and pieces",
            "Develop your minor pieces (knights and bishops) early",
            "Don't move the same piece multiple times in the opening",
            "Castle early to protect your king",
            "Connect your rooks by clearing the back rank"
          ],
          keyIdeas: [
            "Center Control",
            "Piece Development",
            "King Safety",
            "Pawn Structure",
            "Tempo"
          ]
        },
        positions: [
          {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
            explanation: "Practice the Italian Game opening. White aims to control the center and develop pieces quickly."
          },
          {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            moves: ["d4", "d5", "c4"],
            explanation: "Practice the Queen's Gambit opening. White offers a pawn to gain control of the center."
          }
        ]
      },
      {
        title: "Control of the Center",
        description: "Discover strategies for controlling the central squares and understanding when to strike in the center.",
        duration: "20 min",
        isCompleted: true,
        isLocked: false,
        content: {
          theory: [
            "The four central squares (e4, e5, d4, d5) are crucial",
            "Pawns are the most effective tools for controlling central squares",
            "Minor pieces should support your central pawns",
            "Avoid weakening your center with unnecessary pawn moves",
            "Be ready to counter your opponent's central breaks"
          ],
          keyIdeas: [
            "Central Pawns",
            "Piece Coordination",
            "Pawn Breaks",
            "Square Control",
            "Central Tension"
          ]
        },
        positions: [
          {
            fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 1",
            moves: ["e5", "c5"],
            explanation: "Practice central control in the French Defense structure. Black challenges White's center."
          }
        ]
      }
    ]
  },
  "tactical-patterns": {
    title: "Tactical Patterns",
    description: "Master the art of chess tactics through systematic study of common patterns and combinations. This course will sharpen your tactical vision and calculation abilities.",
    duration: "3 hours",
    level: "Intermediate",
    lessons: 12,
    progress: 50,
    chapters: [
      {
        title: "Pins and Skewers",
        description: "Learn to identify and create pin and skewer tactics in various positions.",
        duration: "15 min",
        isCompleted: true,
        isLocked: false,
        content: {
          theory: [
            "A pin restricts a piece's movement to protect a more valuable piece",
            "Absolute pins prevent any movement due to check",
            "Relative pins allow movement but would lose material",
            "Skewers attack two pieces in a line, forcing the first to move",
            "Look for alignment of pieces to create pins and skewers"
          ],
          keyIdeas: [
            "Absolute Pin",
            "Relative Pin",
            "Skewer Attack",
            "Piece Alignment",
            "Material Gain"
          ]
        },
        positions: [
          {
            fen: "r3k2r/ppp2ppp/2n5/3q4/8/2N5/PPP2PPP/R3K2R w KQkq - 0 1",
            moves: ["Rd1"],
            explanation: "Find the pin tactic. White can pin Black's queen to their king."
          }
        ]
      }
    ]
  }
} 