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
        }
      },
      {
        title: "Common Opening Traps",
        description: "Explore the most frequent traps in popular openings and how to avoid them.",
        duration: "20 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Recognize the Scholar's Mate and how to defend against it",
            "Spot the Fool's Mate and why it rarely works",
            "Learn the Elephant Trap in the Queen's Gambit",
            "Avoid the Noah's Ark Trap in the Ruy Lopez"
          ],
          keyIdeas: [
            "Trap Recognition",
            "Defensive Awareness",
            "Opening Safety"
          ]
        }
      }
    ]
  },
  "tactical-patterns": {
    title: "Tactical Patterns",
    description: "Sharpen your tactical vision by mastering pins, forks, skewers, discovered attacks, and more. This course includes hundreds of real-game puzzles, motif recognition drills, and video breakdowns of famous tactical combinations used by top players.",
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
            "Skewers attack two pieces in a line, forcing the first to move"
          ],
          keyIdeas: [
            "Absolute Pin",
            "Relative Pin",
            "Skewer Attack",
            "Piece Alignment"
          ]
        }
      },
      {
        title: "Double Attacks",
        description: "Master the fork and double attack to win material and create threats.",
        duration: "18 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "A fork is a double attack by one piece on two or more targets",
            "Knights are especially effective at forking kings and queens",
            "Look for undefended pieces and weak squares"
          ],
          keyIdeas: [
            "Fork",
            "Double Attack",
            "Tactical Awareness"
          ]
        }
      }
    ]
  },
  "endgame-essentials": {
    title: "Endgame Essentials",
    description: "Learn to convert advantages and save difficult positions with must-know endgame techniques. Study king and pawn endings, opposition, rook and minor piece endgames, fortress building, and practical endgame studies from world championship matches.",
    duration: "2.5 hours",
    level: "Advanced",
    lessons: 10,
    progress: 25,
    chapters: [
      {
        title: "King and Pawn Endings",
        description: "Master the basics of king and pawn endgames, including opposition, key squares, and promotion races.",
        duration: "20 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "The concept of opposition and its importance in pawn races",
            "How to use key squares to promote your pawn",
            "The rule of the square for pawn endgames"
          ],
          keyIdeas: [
            "Opposition",
            "Key Squares",
            "Promotion"
          ]
        }
      },
      {
        title: "Rook Endgames",
        description: "Learn the most common rook endgame techniques, including the Lucena and Philidor positions.",
        duration: "22 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Building a bridge: the Lucena position",
            "Defending with the Philidor position",
            "Cutting off the king and active rook placement"
          ],
          keyIdeas: [
            "Lucena Position",
            "Philidor Position",
            "Rook Activity"
          ]
        }
      },
      {
        title: "Minor Piece Endgames",
        description: "Understand how to handle bishop and knight endgames with practical winning techniques.",
        duration: "18 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "The power of a bishop versus a knight in open positions",
            "Mastering opposite-colored bishop endings",
            "Key mating patterns with bishop and knight"
          ],
          keyIdeas: [
            "Minor Piece Coordination",
            "Opposite-Colored Bishop Endings",
            "Mating Patterns"
          ]
        }
      }
    ]
  },
  "strategic-planning": {
    title: "Strategic Planning",
    description: "Develop your chess understanding with lessons on pawn structures, piece placement, prophylaxis, and long-term planning. Analyze classic games to see how grandmasters build and execute winning strategies, and practice with interactive exercises.",
    duration: "4 hours",
    level: "Advanced",
    lessons: 15,
    progress: 0,
    chapters: [
      {
        title: "Pawn Structure Analysis",
        description: "Understand how pawn structures influence plans and piece placement.",
        duration: "18 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Isolated pawns, doubled pawns, and backward pawns",
            "Pawn majorities and minority attacks",
            "How to use pawn breaks to open lines"
          ],
          keyIdeas: [
            "Pawn Weaknesses",
            "Pawn Breaks",
            "Minority Attack"
          ]
        }
      },
      {
        title: "Prophylaxis",
        description: "Learn the art of preventing your opponent's plans and improving your own position.",
        duration: "16 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "What is prophylaxis in chess?",
            "How to anticipate and stop threats before they arise",
            "Examples from grandmaster games"
          ],
          keyIdeas: [
            "Prophylactic Thinking",
            "Threat Prevention",
            "Strategic Defense"
          ]
        }
      },
      {
        title: "Long-Term Planning",
        description: "Master how to build and execute strategic long-term plans based on the position.",
        duration: "20 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Identify weak squares and long-term pawn weaknesses",
            "How to reposition your pieces for maximum effectiveness",
            "Building pressure without rushing the attack"
          ],
          keyIdeas: [
            "Positional Play",
            "Piece Maneuvering",
            "Pressure Building"
          ]
        }
      }
    ]
  },
  "attacking-chess": {
    title: "Attacking Chess",
    description: "Learn how to launch powerful attacks against the enemy king! This course covers king safety assessment, piece coordination, pawn storms, sacrifices, and attacking techniques used in grandmaster games. Includes annotated model games and attack drills.",
    duration: "3.5 hours",
    level: "Intermediate",
    lessons: 12,
    progress: 0,
    chapters: [
      {
        title: "King Safety Assessment",
        description: "Learn how to evaluate the safety of both kings and recognize attacking opportunities.",
        duration: "18 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Check for open files and diagonals near the king",
            "Count the number of defenders and attackers around the king",
            "Recognize typical attacking patterns such as sacrifices on h7/h2"
          ],
          keyIdeas: [
            "King Exposure",
            "Attacking Patterns",
            "Pawn Shield"
          ]
        }
      },
      {
        title: "Pawn Storms",
        description: "Master the art of launching pawn storms against the castled king.",
        duration: "20 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "When to start a pawn storm",
            "How to coordinate your pieces with advancing pawns",
            "Typical sacrifices to break through the defense"
          ],
          keyIdeas: [
            "Pawn Storm",
            "Piece Coordination",
            "Sacrifice"
          ]
        }
      },
      {
        title: "Attacking the Uncastled King",
        description: "Learn to punish opponents who delay castling or leave their king vulnerable.",
        duration: "16 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Quick development and opening lines against the uncastled king",
            "Typical patterns to trap the king in the center",
            "Exploiting open files and diagonals"
          ],
          keyIdeas: [
            "Central King Attack",
            "Rapid Development",
            "Exploiting Open Lines"
          ]
        }
      }
    ]
  },
  "defensive-mastery": {
    title: "Defensive Mastery",
    description: "Master the art of defense and counterplay: learn how to spot threats, build fortresses, find resources in tough positions, and turn defense into attack. Study famous defensive games and practice with exercises designed to improve your resilience under pressure.",
    duration: "3 hours",
    level: "Advanced",
    lessons: 10,
    progress: 0,
    chapters: [
      {
        title: "Defensive Principles",
        description: "Learn the core principles of solid defense and how to apply them in your games.",
        duration: "15 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Always look for your opponent's threats first",
            "Activate your pieces to defend key squares",
            "Exchange pieces to relieve pressure when under attack"
          ],
          keyIdeas: [
            "Threat Detection",
            "Piece Activity",
            "Exchange"
          ]
        }
      },
      {
        title: "Counterattack Opportunities",
        description: "Find ways to turn defense into offense and seize the initiative.",
        duration: "17 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Look for tactical shots when defending",
            "How to create threats while parrying your opponent's attack",
            "Examples of famous counterattacks"
          ],
          keyIdeas: [
            "Counterattack",
            "Initiative",
            "Tactical Defense"
          ]
        }
      },
      {
        title: "Building Fortresses",
        description: "Learn how to create defensive setups that cannot be broken.",
        duration: "16 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "What is a fortress in chess?",
            "Common fortress structures in endgames",
            "Using fortress ideas to secure draws in worse positions"
          ],
          keyIdeas: [
            "Fortress Setup",
            "Draw Defense",
            "Defensive Structures"
          ]
        }
      }
    ]
  },
  "calculation-training": {
    title: "Calculation Training",
    description: "Boost your calculation skills and visualization with structured exercises. Learn how to identify candidate moves, calculate forcing lines, avoid blunders, and solve complex positions under time pressure—just like a tournament player.",
    duration: "4 hours",
    level: "Intermediate",
    lessons: 12,
    progress: 0,
    chapters: [
      {
        title: "Introduction to Calculation",
        description: "Learn the basics of calculation and how to visualize moves ahead.",
        duration: "14 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "What is calculation in chess?",
            "How to visualize moves and anticipate responses",
            "The difference between calculation and intuition"
          ],
          keyIdeas: [
            "Visualization",
            "Move Anticipation",
            "Calculation"
          ]
        }
      },
      {
        title: "Forcing Moves",
        description: "Practice calculating checks, captures, and threats to improve accuracy.",
        duration: "16 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "Always start by looking for forcing moves",
            "Checks, captures, and threats narrow down the possibilities",
            "How to use forcing moves to calculate tactics"
          ],
          keyIdeas: [
            "Forcing Moves",
            "Tactical Calculation",
            "Accuracy"
          ]
        }
      },
      {
        title: "Candidate Moves and Elimination",
        description: "Learn to identify all possible candidate moves and eliminate bad options efficiently.",
        duration: "18 min",
        isCompleted: false,
        isLocked: false,
        content: {
          theory: [
            "How to list candidate moves systematically",
            "Using process of elimination to narrow choices",
            "Balancing speed and accuracy in practical games"
          ],
          keyIdeas: [
            "Candidate Moves",
            "Move Elimination",
            "Practical Calculation"
          ]
        }
      }
    ]
  }
};
