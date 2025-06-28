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
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  youWillLearn: string[];
  category: string;
  side: string;
  lessonCount: number;
  lessons: Lesson[];
  variations: Variation[];
  practice: PracticePuzzle[];
  quiz: QuizQuestion[];
  reviewGames: ReviewGame[];
}

export interface Lesson {
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  concept?: string;
  fen?: string;
  pgn?: string;
  task?: string;
  writeup?: string;
  solution?: string[];
}

export interface Variation {
  name: string;
  moves: string;
  type: 'Win' | 'Draw';
}

export interface PracticePuzzle {
  title: string;
  fen?: string;
  pgn?: string;
  goal: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ReviewGame {
  title: string;
  pgn: string;
  commentary?: string;
}



export const courses: Course[] = [
  // Openings with White
  {
    slug: 'one-e4-openings-explained',
    title: '1.e4 Openings Explained',
    subtitle: '',
    description: 'The 1.e4 opening is one of the most aggressive and widely played opening moves in chess. It opens lines for both the queen and bishop and leads to open, tactical games. This course will cover key responses to 1.e4, the basic strategies for both sides, and the most important setups to succeed with this opening.',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '2 hours',
    youWillLearn: [
      'Building strong pawn centers.',
      'Common traps to avoid.',
      'Effective attacking plans for White.'
    ],
    category: 'Openings',
    side: 'White',
    lessonCount: 3,
    lessons: [
      {
        title: 'Italian Game – Attack the Center',
        level: 'Beginner',
        concept: 'Quick development and central control.',
        pgn: 'e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3',
        writeup: 'The Italian Game focuses on quick development and central control. It leads to tactical, open positions.'
      },
      {
        title: 'Scotch Game – Open the Center Quickly',
        level: 'Intermediate',
        concept: 'Challenge Black\'s center early.',
        pgn: 'e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nc3 Bb4 6. Nxc6 bxc6',
        writeup: 'The Scotch Game challenges Black\'s center early and allows White active piece play.'
      },
      {
        title: "King's Gambit – Sacrifice for Attack",
        level: 'Advanced',
        concept: 'Sacrifice a pawn for a powerful attack.',
        pgn: 'e4 e5 2. f4 exf4 3. Nf3 g5 4. h4 g4 5. Ne5 h5',
        writeup: 'The King\'s Gambit is a sharp, aggressive opening where White sacrifices a pawn to open the f-file for an attack.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the main idea behind playing 1.e4?",
        options: ["Control center", "Push pawn sides", "Open h-file", "Castle quickly"],
        answer: "Control center"
      },
      {
        question: "What's a key defense against 1.e4?",
        options: ["Sicilian Defense", "French Defense", "King's Indian", "London System"],
        answer: "Sicilian Defense"
      },
      {
        question: "What is the goal of the Italian Game?",
        options: ["Quick kingside attack", "Early queen exchange", "Exchange bishops", "Play for a draw"],
        answer: "Quick kingside attack"
      },
      {
        question: "What is the drawback of moving f-pawn early?",
        options: ["Weakens king", "Strong center", "Fast development", "Attacks queenside"],
        answer: "Weakens king"
      },
      {
        question: "Why develop knights before bishops?",
        options: ["Knights control center quickly", "Bishops trap the king", "Knights guard f7 pawn", "Bishops block pawns"],
        answer: "Knights control center quickly"
      }
    ],
    reviewGames: []
  },
  {
    slug: 'one-d4-repertoire',
    title: '1.d4 Repertoire',
    subtitle: '',
    description: 'The 1.d4 opening is known for solid, strategic play that controls the center and builds long-term advantages. This course will guide you through the essential 1.d4 openings and their main plans.',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '2 hours',
    youWillLearn: [
      "How to create a solid pawn structure.",
      "How to handle Black's most common defenses.",
      'Key attacking setups in the 1.d4 systems.'
    ],
    category: 'Openings',
    side: 'White',
    lessonCount: 3,
    lessons: [
      {
        title: 'Queen\'s Gambit – Control the Center',
        level: 'Beginner',
        concept: 'Dominate the center with a classical pawn sacrifice.',
        pgn: 'd4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5',
        writeup: 'The Queen\'s Gambit is a classical opening where White offers a pawn to dominate the center.'
      },
      {
        title: 'London System – Solid and Safe',
        level: 'Intermediate',
        concept: 'Solid pawn structure and easy development.',
        pgn: 'd4 d5 2. Nf3 Nf6 3. Bf4 e6 4. e3 c5 5. c3',
        writeup: 'The London System is a flexible and safe setup focusing on strong pawn structure and easy development.'
      },
      {
        title: 'Trompowsky Attack – Quick Surprise',
        level: 'Advanced',
        concept: 'Surprise your opponent early with an offbeat attack.',
        pgn: 'd4 Nf6 2. Bg5 e6 3. e4 h6 4. Bxf6 Qxf6',
        writeup: 'The Trompowsky Attack is an offbeat, aggressive opening that surprises opponents early.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the main goal of 1.d4?",
        options: ["Strong pawn structure", "Fast king safety", "Early queen development", "Quick checkmate"],
        answer: "Strong pawn structure"
      },
      {
        question: "Which defense directly challenges 1.d4?",
        options: ["King's Indian Defense", "Caro-Kann", "French Defense", "Scandinavian Defense"],
        answer: "King's Indian Defense"
      },
      {
        question: "Why play Queen's Gambit?",
        options: ["Control center", "Sacrifice a pawn to attack", "Fast kingside attack", "Avoid piece trades"],
        answer: "Control center"
      },
      {
        question: "Why delay c4 in the London System?",
        options: ["Solid pawn structure", "Fast pawn storm", "Control f-file", "Trade queens early"],
        answer: "Solid pawn structure"
      },
      {
        question: "What's a key drawback of neglecting development?",
        options: ["Lose time", "Control center", "Early castling", "Strong pawn chain"],
        answer: "Lose time"
      }
    ],
    reviewGames: []
  },
  {
    slug: 'english-opening',
    title: 'English Opening (1.c4)',
    subtitle: '',
    description: 'The English Opening (1.c4) focuses on flexible pawn structures and positional mastery. This course will teach you how to handle both symmetrical and asymmetrical positions using the English Opening.',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '2 hours',
    youWillLearn: [
      'How to control key diagonals.',
      'Positional maneuvering techniques.',
      'Long-term pressure building.'
    ],
    category: 'Openings',
    side: 'White',
    lessonCount: 3,
    lessons: [
      {
        title: 'Symmetrical English – Balanced Play',
        level: 'Beginner',
        concept: 'Balanced, flexible play for both sides.',
        pgn: 'c4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. Nf3',
        writeup: 'The Symmetrical English is a quiet system where both players aim for balanced, positional play.'
      },
      {
        title: 'Botvinnik System – Complex Structures',
        level: 'Intermediate',
        concept: 'Deep positional ideas and complex pawn structures.',
        pgn: 'c4 c5 2. g3 g6 3. Bg2 Bg7 4. e4 Nc6 5. Nge2 e5 6. d3 d6 7. O-O',
        writeup: 'The Botvinnik System is a deep positional setup requiring patience and precise maneuvering.'
      },
      {
        title: 'Reverse Sicilian – Counterattack',
        level: 'Advanced',
        concept: 'Use Sicilian strategies with an extra tempo.',
        pgn: 'c4 e5 2. Nc3 Nf6 3. g3 d5 4. cxd5 Nxd5 5. Bg2 Nb6',
        writeup: 'The Reverse Sicilian allows White to use typical Sicilian strategies with an extra tempo.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the purpose of 1.c4?",
        options: ["Control d5 square", "Prepare f4 pawn push", "King safety", "Open g-file"],
        answer: "Control d5 square"
      },
      {
        question: "What's a common response to 1.c4?",
        options: ["Symmetrical setup", "King's Gambit", "French Defense", "Caro-Kann Defense"],
        answer: "Symmetrical setup"
      },
      {
        question: "Which strategy is typical in English Opening?",
        options: ["Flank attack", "Central pawn storm", "Fast king march", "Early rook lift"],
        answer: "Flank attack"
      },
      {
        question: "Why delay d4 in English Opening?",
        options: ["Flexibility", "Fast attack", "Open e-file", "Force bishop exchange"],
        answer: "Flexibility"
      },
      {
        question: "Which pawn structure is common in English?",
        options: ["Hedgehog", "Caro-Kann setup", "Philidor setup", "Slav wall"],
        answer: "Hedgehog"
      }
    ],
    reviewGames: []
  },
  // Openings with Black
  {
    slug: 'sicilian-defense-mastery',
    title: 'Sicilian Defense Mastery',
    subtitle: '',
    description: 'The Sicilian Defense is one of the most popular and aggressive responses to 1.e4. It allows Black to play for the win by creating imbalanced and tactical positions. This course will help you master key Sicilian Defense systems and how to handle White\'s attacking ideas.',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '3 hours',
    youWillLearn: [
      'Common pawn structures in the Sicilian.',
      'Sharp tactical themes and attacking plans.',
      "How to counter White's early aggression."
    ],
    category: 'Openings',
    side: 'Black',
    lessonCount: 3,
    lessons: [
      {
        title: 'Najdorf Variation – The King of Sicilians',
        level: 'Advanced',
        concept: 'The most aggressive and deeply analyzed system in the Sicilian Defense.',
        pgn: 'e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
        writeup: 'The Najdorf is the most aggressive and deeply analyzed system in the Sicilian Defense.'
      },
      {
        title: 'Classical Variation – Solid but Aggressive',
        level: 'Intermediate',
        concept: 'Solid defense with dynamic attacking chances.',
        pgn: 'e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6',
        writeup: 'The Classical Variation offers solid defense while maintaining dynamic attacking chances.'
      },
      {
        title: 'Accelerated Dragon – Fast Development',
        level: 'Beginner',
        concept: 'Quick piece development and the powerful g7 bishop.',
        pgn: 'e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7',
        writeup: 'The Accelerated Dragon focuses on quick piece development and the powerful g7 bishop.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the main idea behind the Sicilian Defense?",
        options: ["Fight for center from the side", "King safety first", "Avoid pawn moves", "Fast queenside development"],
        answer: "Fight for center from the side"
      },
      {
        question: "What's a typical pawn structure in Sicilian?",
        options: ["c5 and d6 pawns", "e6 and d5 pawns", "f6 and g6 pawns", "d4 and e4 pawns"],
        answer: "c5 and d6 pawns"
      },
      {
        question: "What's the Dragon variation known for?",
        options: ["fianchetto bishop", "Fast pawn storm", "Queen sacrifice", "Quick draws"],
        answer: "fianchetto bishop"
      },
      {
        question: "Why is Open Sicilian popular?",
        options: ["Sharp tactical play", "Slow pawn build-up", "Fast endgames", "Closed positions"],
        answer: "Sharp tactical play"
      },
      {
        question: "What's a drawback in the Sicilian Defense?",
        options: ["Weak d6 pawn", "Early checkmate", "Locked bishops", "Pawn sacrifices mandatory"],
        answer: "Weak d6 pawn"
      }
    ],
    reviewGames: []
  },
  {
    slug: 'french-defense-essentials',
    title: 'French Defense Essentials',
    subtitle: '',
    description: 'The French Defense is a solid and strategic response to 1.e4, focusing on a strong pawn chain and counterattacking potential. This course will guide you through the main lines and explain how to play for both sides.',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '2.5 hours',
    youWillLearn: [
      'Typical pawn structures and breakpoints.',
      'Counterplay plans for Black.',
      "Handling White's space advantage."
    ],
    category: 'Openings',
    side: 'Black',
    lessonCount: 3,
    lessons: [
      {
        title: 'Advance Variation – Block the Center',
        level: 'Beginner',
        concept: 'Closed center positions and pawn maneuvering.',
        pgn: 'e4 e6 2. d4 d5 3. e5',
        writeup: 'The Advance Variation leads to closed center positions with long-term pawn maneuvering.'
      },
      {
        title: 'Tarrasch Variation – Flexible Structures',
        level: 'Intermediate',
        concept: 'Flexible pawn structures and active piece play.',
        pgn: 'e4 e6 2. d4 d5 3. Nd2',
        writeup: 'The Tarrasch is a modern approach allowing flexible pawn structures and active piece play.'
      },
      {
        title: 'Winawer Variation – Complex Play',
        level: 'Advanced',
        concept: 'Sharp and complex positions requiring deep theory.',
        pgn: 'e4 e6 2. d4 d5 3. Nc3 Bb4',
        writeup: 'The Winawer leads to sharp and complex positions where both sides must know deep theory.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the main pawn move in French Defense?",
        options: ["e6", "c5", "d6", "g6"],
        answer: "e6"
      },
      {
        question: "What's the typical pawn structure?",
        options: ["e6, d5 closed center", "f6, g6 open king", "c4, d5 open files", "e4, d4 open center"],
        answer: "e6, d5 closed center"
      },
      {
        question: "What's the main target for White?",
        options: ["d5 square", "e6 square", "b7 pawn", "g7 pawn"],
        answer: "d5 square"
      },
      {
        question: "Why is the light-squared bishop problematic?",
        options: ["Often locked", "Too aggressive", "Forces early trades", "Traps own queen"],
        answer: "Often locked"
      },
      {
        question: "What's a key strategy for Black?",
        options: ["Counterattack on queenside", "Push f-pawn", "Early king march", "Sacrifice on h7"],
        answer: "Counterattack on queenside"
      }
    ],
    reviewGames: []
  },
  {
    slug: 'indian-defenses',
    title: 'Indian Defenses (KID, Nimzo, etc.)',
    subtitle: '',
    description: 'Indian Defenses offer dynamic and flexible setups against 1.d4. This course will cover key systems like the King\'s Indian Defense, Nimzo-Indian, and Grunfeld Defense, teaching you how to play for active counterplay.',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '3 hours',
    youWillLearn: [
      'Solid defensive setups.',
      'When to strike back in the center.',
      'Strategic plans for both sides.'
    ],
    category: 'Openings',
    side: 'Black',
    lessonCount: 3,
    lessons: [
      {
        title: 'King\'s Indian Defense – Play for Checkmate',
        level: 'Advanced',
        concept: 'Powerful kingside attack against White\'s center.',
        pgn: 'd4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5',
        writeup: 'The King\'s Indian Defense gives Black a powerful kingside attack against White\'s center.'
      },
      {
        title: 'Nimzo-Indian Defense – Control the Center',
        level: 'Intermediate',
        concept: 'Control the center indirectly and create pawn weaknesses.',
        pgn: 'd4 Nf6 2. c4 e6 3. Nc3 Bb4',
        writeup: 'The Nimzo-Indian aims to control the center indirectly and create pawn weaknesses.'
      },
      {
        title: 'Grunfeld Defense – Dynamic Counterplay',
        level: 'Advanced',
        concept: 'Let White build a big center, then strike quickly to dismantle it.',
        pgn: 'd4 Nf6 2. c4 g6 3. Nc3 d5',
        writeup: 'The Grunfeld allows White to build a big center, but Black strikes quickly to dismantle it.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the main setup in King's Indian Defense?",
        options: ["fianchetto kingside bishop", "Advance c-pawn", "Early queen sorties", "Swap center pawns"],
        answer: "fianchetto kingside bishop"
      },
      {
        question: "Why is Nimzo-Indian Defense strong?",
        options: ["Controls e4 early", "Trades dark-squared bishop", "Plays for draw", "Rushes king's side"],
        answer: "Controls e4 early"
      },
      {
        question: "In KID, where does Black often attack?",
        options: ["Kingside", "Queenside", "Center only", "Rook files"],
        answer: "Kingside"
      },
      {
        question: "What's the goal in Nimzo pawn structure?",
        options: ["Pressure on c4", "Push e4 quickly", "Castle queenside", "Sacrifice pawn on e5"],
        answer: "Pressure on c4"
      },
      {
        question: "Key drawback in King's Indian Defense?",
        options: ["Weak light squares", "Weak d6 pawn", "Blocked bishops", "Early trapped knight"],
        answer: "Weak light squares"
      }
    ],
    reviewGames: []
  },
  {
    slug: 'bishop-vs-knight-endgames',
    title: 'Bishop vs Knight Endgames',
    subtitle: '',
    description: 'Understanding the strengths and weaknesses of bishops versus knights in endgames is crucial. This course will help you master typical plans, winning techniques, and key positions.',
    difficulty: 'Intermediate',
    estimatedTime: '2 hours',
    youWillLearn: [
      'When the bishop is stronger than the knight.',
      'Maneuvering to restrict the knight.',
      'How to create winning pawn structures.'
    ],
    category: 'Endgames by Piece',
    lessonCount: 3,
    lessons: [
      {
        title: 'Good Bishop vs Bad Knight',
        level: 'Beginner',
        concept: 'Maximize bishop power and dominate closed positions.',
        fen: '6k1/4n1p1/6P1/7P/5B2/6K1/8/8 w - - 0 1',
        writeup: "Learn how to maximize your bishop's power and dominate closed positions."
      },
      {
        title: 'Restricting the Knight',
        level: 'Intermediate',
        concept: 'Force the knight into a passive role while improving king and pawn activity.',
        fen: '6k1/3n2p1/6P1/5K2/3B3P/6P1/8/8 w - - 0 1',
        writeup: 'Force the knight into a passive role while improving king and pawn activity.'
      },
      {
        title: 'Winning with the Outside Passed Pawn',
        level: 'Advanced',
        concept: 'Use the outside passed pawn to stretch the opponent\'s defenses.',
        fen: '2n2k2/p4p2/6p1/4B3/5P1K/6P1/8/8 w - - 0 1',
        writeup: 'Use the outside passed pawn to stretch the opponent\'s defenses.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "Which piece is usually stronger in open positions?",
        options: ["Bishop", "Knight", "Rook", "Queen"],
        answer: "Bishop"
      },
      {
        question: "When is the knight stronger?",
        options: ["Closed positions", "Open files", "Pawn majority", "fianchetto setup"],
        answer: "Closed positions"
      },
      {
        question: "What's a key endgame idea for bishops?",
        options: ["Long-range pressure", "Block center quickly", "Trap enemy rooks", "Fast king attack"],
        answer: "Long-range pressure"
      },
      {
        question: "When is opposite-colored bishop endgame often drawn?",
        options: ["When pawns are on both sides", "When knights are traded", "When rooks are doubled", "When kings are active"],
        answer: "When pawns are on both sides"
      },
      {
        question: "Which position favors the knight?",
        options: ["Blocked pawn chains", "Open diagonals", "Long pawn races", "Active rook endings"],
        answer: "Blocked pawn chains"
      }
    ],
    reviewGames: []
  },
  // Endgames by Piece
  {
    slug: 'rook-endgame-techniques',
    title: 'Rook Endgame Techniques',
    subtitle: 'Convert wins. Save draws. Dominate rook endgames.',
    description: 'This course teaches you everything from Lucena and Philidor to advanced rook positioning, active defense, and swindles.',
    difficulty: 'Intermediate',
    estimatedTime: '2.5 hours',
    youWillLearn: [
      'Lucena & Philidor positions',
      'Vancura Defense',
      'Rook Activity Rules',
      'Drawing inferior positions',
      'GM endgame examples',
    ],
    category: 'Endgames by Piece',
    lessonCount: 3,
    lessons: [
      {
        title: 'Lucena Position – Build the Bridge',
        level: 'Beginner',
        concept: 'Bridge building, rook cutoff',
        fen: '8/8/8/8/8/2k5/2P5/2K5 w - - 0 1',
        solution: ['Rc8+', 'Kd4', 'Kd2', 'Ke4', 'Rc4+', 'Kf3', 'Kd3'],
        task: 'Force promotion',
      },
      {
        title: 'Vancura Defense (Save with Checks)',
        level: 'Intermediate',
        fen: '8/8/8/1P6/1K6/8/6k1/5r2 b - - 0 1',
        solution: ['Rf6', 'Ka5', 'Kf3', 'b6', 'Rf1'],
      },
      {
        title: 'Carlsen-Style Endgame Squeeze',
        level: 'Advanced',
        concept: 'Carlsen vs Aronian fragment',
        pgn: '1. Kg5 Rf8 2. h5 Rg8+ 3. Kf6 Kd6 4. Re5 Rc8 5. Kf7 Rc3!',
        solution: [],
      },
    ],
    variations: [
      {
        name: 'Lucena',
        moves: '1. Rc8+ Kd4 2. Kd2 Ke4 3. Rc4+ Kf3 4. Kd3',
        type: 'Win',
      },
      {
        name: 'Philidor',
        moves: '1... Re6 2. Kd2 Re5 3. Kd3 Re6 =',
        type: 'Draw',
      },
      {
        name: 'Vancura Defense',
        moves: '1... Rf6 2. Ka5 Kf3 3. b6 Rf1 4. Ka6 Ke4 5. b7 Ra1+',
        type: 'Draw',
      },
    ],
    practice: [
      {
        title: 'Lucena Puzzle',
        fen: '8/8/8/8/8/2k5/2P5/2K5 w - - 0 1',
        goal: 'Promote pawn with proper rook placement',
      },
      {
        title: 'Philidor Save',
        fen: '8/8/8/8/2k5/8/2P5/2K5 b - - 0 1',
        goal: 'Avoid zugzwang and draw',
      },
      {
        title: 'Trap the King',
        pgn: '1. Re5+ Kg4 2. Re3 Rd1 3. Kg2 Rd2+',
        goal: 'Cut off and trap the king',
      },
    ],
    quiz: [
      {
        question: "In the Lucena position, what's the right first move?",
        options: ['Kd2', 'Rc6', 'Rc8', 'c4'],
        answer: 'Rc8',
      },
      {
        question: 'How do you defend in the Philidor position?',
        options: ['Push pawn', 'Keep rook on 3rd rank', 'King to d3', 'Move rook behind'],
        answer: 'Keep rook on 3rd rank',
      },
      {
        question: 'Why is rook behind pawn better?',
        options: ['Limits its progress', 'Controls center', 'Stops checks', 'Attacks king'],
        answer: 'Limits its progress',
      },
      {
        question: "What's Vancura's core idea?",
        options: ['Bridge build', 'King march', 'Lateral checks', 'Pawn block'],
        answer: 'Lateral checks',
      },
      {
        question: 'How to convert rook + 2 pawns?',
        options: ['Trade pieces', 'Push pawns while checking', 'Box king', 'Double rooks'],
        answer: 'Push pawns while checking',
      },
    ],
    reviewGames: [
      {
        title: 'Carlsen vs Aronian – Clean conversion of Lucena',
        pgn: '1. Kg5 Rf8 2. h5 Rg8+ 3. Kf6 Kd6 4. Re5 Rc8 5. Kf7 Rc3!',
      },
      {
        title: 'Capablanca vs Tartakower – Classic Philidor',
        pgn: '1... Re6 2. Kd2 Re5 3. Kd3 Re6',
      },
      {
        title: 'Nakamura vs Firouzja – Active defense & swindle',
        pgn: '1... Rf1+ 2. Kg4 f5+ 3. Kh3 Rh1+ 4. Kg2 Ra1 =',
      },
    ],
  },
  {
    slug: 'queen-endgames',
    title: 'Queen Endgames',
    subtitle: '',
    description: 'Learn how to handle queen endgames with accuracy and confidence. This course teaches you key checkmating patterns, perpetual checks, and how to avoid stalemates in high-pressure situations.',
    difficulty: 'Intermediate',
    estimatedTime: '',
    youWillLearn: [],
    category: 'Endgames by Piece',
    lessonCount: 0,
    lessons: [],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What is the queen's biggest strength in endgames?",
        options: ["Long-range power", "Fast castling", "Limited mobility", "Pawn pushing only"],
        answer: "Long-range power"
      },
      {
        question: "What is the key risk in queen endgames?",
        options: ["Stalemate traps", "King's safety is not important", "Queen always wins by force", "Castling rights"],
        answer: "Stalemate traps"
      },
      {
        question: "What should you aim for in queen endgames?",
        options: ["Checkmate or perpetual checks", "Quick material trades", "Avoid using the queen", "Keep the king far away"],
        answer: "Checkmate or perpetual checks"
      },
      {
        question: "Which tactic is common in queen endgames?",
        options: ["Forks and perpetual checks", "Only pawn trades", "Early resignation", "Slow piece development"],
        answer: "Forks and perpetual checks"
      },
      {
        question: "How can you win quickly in queen vs pawn endgames?",
        options: ["Cut the king off and force promotion", "Ignore the pawn", "Move the queen passively", "Only use the king"],
        answer: "Cut the king off and force promotion"
      }
    ],
    reviewGames: [],
  },
  {
    slug: 'attacking-chess',
    title: 'Attacking Chess',
    subtitle: '',
    description: 'Attacking chess is about putting constant pressure on your opponent, creating threats, and capitalizing on weaknesses. This course will teach you the art of building and executing strong attacks against the king and critical weaknesses.',
    difficulty: 'Beginner to Advanced',
    estimatedTime: '3 hours',
    youWillLearn: [
      'Key attacking patterns.',
      'Effective piece coordination for attack.',
      'How to sacrifice material for a decisive attack.'
    ],
    category: 'Tactics',
    lessonCount: 3,
    lessons: [
      {
        title: 'Classic Bishop Sacrifice on h7',
        level: 'Beginner',
        concept: 'Famous Bxh7+ sacrifice for a direct kingside attack.',
        pgn: 'e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7 Kxf7 7. Qf3+ Ke6 8. Nc3',
        writeup: 'Learn the famous Bxh7+ sacrifice that leads to a direct kingside attack.'
      },
      {
        title: 'Open File Domination',
        level: 'Intermediate',
        concept: 'Using rooks to dominate open files and create unstoppable pressure.',
        pgn: '',
        writeup: 'White controls the e-file with doubled rooks, building pressure against e7 pawn.'
      },
      {
        title: 'The Greek Gift Sacrifice',
        level: 'Advanced',
        concept: 'Bxh7+ followed by a queen and knight attack.',
        pgn: 'e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 a6 8. Nf3 c5 9. Bd3 Nc6 10. O-O',
        writeup: 'A powerful attacking concept involving a bishop sacrifice on h7 followed by a queen and knight attack.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the purpose of a bishop sacrifice on h7?",
        options: ["Open kingside", "Fast pawn promotion", "Close center", "Push rook pawns"],
        answer: "Open kingside"
      },
      {
        question: "Why double rooks on open file?",
        options: ["Control file and penetrate", "Trap enemy knight", "Push e-file pawn", "Force quick draw"],
        answer: "Control file and penetrate"
      },
      {
        question: "Greek Gift sacrifice starts with which move?",
        options: ["Bxh7+", "Qh5+", "Ng5", "f4"],
        answer: "Bxh7+"
      },
      {
        question: "What's a typical attacking idea?",
        options: ["Coordinate all pieces", "Exchange quickly", "Push side pawns", "Castle queenside always"],
        answer: "Coordinate all pieces"
      },
      {
        question: "What's the risk in attacking chess?",
        options: ["Overextending", "Losing center control", "Queen trapped", "Early king moves"],
        answer: "Overextending"
      }
    ],
    reviewGames: []
  },
  {
    slug: 'defensive-mastery',
    title: 'Defensive Mastery',
    subtitle: '',
    description: 'Great defenders know how to stay calm under pressure and find resources even in the worst positions. This course will teach you essential defensive techniques to survive difficult situations and turn the tables.',
    difficulty: 'Intermediate',
    estimatedTime: '2.5 hours',
    youWillLearn: [
      'How to create a fortress.',
      'Counterplay and tactical defense.',
      'Managing passive positions.'
    ],
    category: 'Tactics',
    lessonCount: 3,
    lessons: [
      {
        title: 'Creating Fortresses',
        level: 'Beginner',
        concept: "Build unbreakable defensive structures to neutralize the opponent's advantage.",
        fen: '8/8/8/2N5/8/8/8/8 w - - 0 1',
        writeup: "Learn how to build unbreakable defensive structures to neutralize the opponent's advantage."
      },
      {
        title: 'Counterplay and Active Defense',
        level: 'Intermediate',
        concept: 'Create threats while under attack and activate your pieces.',
        fen: '8/8/2p5/1p1k4/1P1P4/2K5/8/8 b - - 0 1',
        writeup: 'Counterattack is often the best defense. Learn how to create threats while under attack.'
      },
      {
        title: 'Defending Passive Positions',
        level: 'Advanced',
        concept: 'Defend when your pieces are restricted and wait for mistakes.',
        fen: '8/8/8/2p5/2P5/2k5/8/8 b - - 0 1',
        writeup: 'Master how to defend when your pieces are restricted and you must wait for your opponent to make mistakes.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's the key idea of a fortress?",
        options: ["Opponent can't break through", "Exchange queens fast", "Push center pawns", "Delay king's side castling"],
        answer: "Opponent can't break through"
      },
      {
        question: "What's an active defense?",
        options: ["Counterattacking threats", "Staying passive", "Trading all pieces", "Giving up pawns"],
        answer: "Counterattacking threats"
      },
      {
        question: "What's a passive defense risk?",
        options: ["Getting strangled", "Fast attack", "Queen blunders", "Open king"],
        answer: "Getting strangled"
      },
      {
        question: "How can you defend without moving pawns?",
        options: ["Piece activity", "Push center", "Early king walk", "Exchange pawns fast"],
        answer: "Piece activity"
      },
      {
        question: "What's a practical defensive resource?",
        options: ["Sacrifice material for counterplay", "Avoid all trades", "Push h-pawn quickly", "Force opposite-color bishops"],
        answer: "Sacrifice material for counterplay"
      }
    ],
    reviewGames: []
  },
  {
    slug: 'strategic-planning',
    title: 'Strategic Planning',
    subtitle: '',
    description: 'Strategy is the backbone of successful chess play. This course focuses on long-term planning, pawn structure manipulation, and understanding key positional principles that win games.',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '3 hours',
    youWillLearn: [
      'Identifying weaknesses and creating long-term plans.',
      'Maneuvering pieces to ideal squares.',
      'Exploiting open files, diagonals, and color complexes.'
    ],
    category: 'Strategy',
    lessonCount: 3,
    lessons: [
      {
        title: 'Exploiting Weak Squares',
        level: 'Beginner',
        concept: "Identify and target weak squares in the opponent's position.",
        fen: '8/8/3N4/8/8/8/8/8 w - - 0 1',
        writeup: "Learn how to identify and target weak squares in the opponent's position."
      },
      {
        title: 'Strong Outposts and Piece Maneuvering',
        level: 'Intermediate',
        concept: 'Maneuver pieces to perfect squares for maximum influence.',
        fen: '8/8/3N4/4B3/8/8/8/8 w - - 0 1',
        writeup: 'Master the art of maneuvering pieces to perfect squares for maximum influence.'
      },
      {
        title: 'Color Complexes and Long-Term Advantages',
        level: 'Advanced',
        concept: 'Exploit weaknesses on one color complex throughout the game.',
        fen: '8/8/8/8/8/8/3B4/3Q4 w - - 0 1',
        writeup: 'Learn how to exploit weaknesses on one color complex (light or dark squares) throughout the game.'
      }
    ],
    variations: [],
    practice: [],
    quiz: [
      {
        question: "What's a strategic plan?",
        options: ["Long-term idea", "Fast checkmate", "Immediate tactical blow", "Random pawn push"],
        answer: "Long-term idea"
      },
      {
        question: "Why control open files?",
        options: ["Infiltrate with rooks", "Push center fast", "Trap bishop", "Early queen trade"],
        answer: "Infiltrate with rooks"
      },
      {
        question: "What's an outpost?",
        options: ["Square that can't be challenged by pawns", "Place for the king", "Fast pawn sacrifice", "Early knight retreat"],
        answer: "Square that can't be challenged by pawns"
      },
      {
        question: "Color complexes focus on which squares?",
        options: ["Light or dark squares", "e4 and d4 only", "Center pawns", "Knight's starting squares"],
        answer: "Light or dark squares"
      },
      {
        question: "Why is piece maneuvering important?",
        options: ["Best squares maximize pressure", "Avoid traps", "Move fast for time control", "Castle by hand"],
        answer: "Best squares maximize pressure"
      }
    ],
    reviewGames: []
  },
]; 