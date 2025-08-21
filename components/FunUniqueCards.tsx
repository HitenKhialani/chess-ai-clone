import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  MessageSquare, 
  Star, 
  Camera, 
  Sparkles,
  Quote,
  TrendingUp,
  Eye
} from "lucide-react";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface MagnusComparison {
  playerMove: string;
  magnusMove: string;
  moveNumber: number;
  situation: string;
  reasoning: string;
  similarity: number; // 0-100
}

interface BotComment {
  moveNumber: number;
  comment: string;
  type: "roast" | "praise" | "observation";
  severity: "mild" | "savage" | "legendary";
}

interface CinematicMove {
  moveNumber: number;
  move: string;
  title: string;
  description: string;
  category: "brilliant" | "blunder" | "comeback" | "sacrifice" | "endgame";
  dramaMeter: number; // 0-100
}

interface FunUniqueCardsProps {
  analysis: ReviewMove[];
  onJumpToMove?: (moveIndex: number) => void;
  playerName?: string;
}

const generateMagnusComparison = (analysis: ReviewMove[]): MagnusComparison | null => {
  // Find the most interesting position for Magnus comparison
  const interestingMoves = analysis
    .map((move, index) => ({ ...move, index }))
    .filter(move => 
          move.type === "Brilliant" ||
    move.type === "Blunder" || 
      (move.bestMove && move.bestMove !== move.move)
    );
  
  if (interestingMoves.length === 0) return null;
  
  const selectedMove = interestingMoves[Math.floor(Math.random() * interestingMoves.length)];
  
  const situations = [
    "complex middlegame position",
    "critical endgame moment", 
    "tactical opportunity",
    "positional decision",
    "time pressure situation"
  ];
  
  const reasonings = [
    "Magnus would prioritize long-term compensation over material",
    "The World Champion prefers active piece play in such positions",
    "Magnus typically looks for counter-attacking chances here",
    "This type of position plays to Magnus's endgame mastery",
    "The World Champion would simplify to reach a favorable endgame"
  ];
  
  return {
    playerMove: selectedMove.move,
    magnusMove: selectedMove.bestMove || "Nf6+",
    moveNumber: selectedMove.index + 1,
    situation: situations[Math.floor(Math.random() * situations.length)],
    reasoning: reasonings[Math.floor(Math.random() * reasonings.length)],
          similarity: selectedMove.type === "Brilliant" ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40) + 20
  };
};

const generateBotComments = (analysis: ReviewMove[], playerName: string = "Player"): BotComment[] => {
  const comments: BotComment[] = [];
  
  // Roast comments for blunders
  const roastComments = [
    "Even my calculator cringed at that move! 🤖💀",
    "I've seen better moves from a random number generator 😅",
    "That move was so bad, it deserves its own chess notation! ❌",
    "Did you just play that move with your eyes closed? 👀",
    "My circuits are literally overheating from that blunder 🔥",
    "That's not chess, that's abstract art! 🎨",
    "I need to update my 'worst moves' database 📊"
  ];
  
  // Praise comments for good moves
  const praiseComments = [
    "Now THAT'S what I call a move! 🎯",
    "Even I'm impressed, and I'm literally a computer! 🤖👏",
    "That move was smoother than my algorithms! ✨",
    "You're starting to think like a machine - the good kind! 🧠",
    "My evaluation function is speechless! 📈",
    "That's World Championship level thinking! 👑",
    "I bow to your human intuition! 🙇‍♂️"
  ];
  
  // Observation comments
  const observationComments = [
    "Things are getting spicy on the board! 🌶️",
    "The plot thickens... 📚",
    "I sense a disturbance in the force... ⚡",
    "This position is getting more complex than my source code! 💻",
    "The tension is rising faster than my CPU temperature! 🌡️"
  ];
  
  analysis.forEach((move, index) => {
    if (move.type === "Blunder" && comments.length < 3) {
      comments.push({
        moveNumber: index + 1,
        comment: roastComments[Math.floor(Math.random() * roastComments.length)],
        type: "roast",
        severity: Math.random() > 0.7 ? "savage" : "mild"
      });
    } else if (move.type === "Brilliant" && comments.length < 3 && Math.random() > 0.7) {
      comments.push({
        moveNumber: index + 1,
        comment: praiseComments[Math.floor(Math.random() * praiseComments.length)],
        type: "praise",
        severity: "mild"
      });
    } else if (Math.random() > 0.9 && comments.length < 2) {
      comments.push({
        moveNumber: index + 1,
        comment: observationComments[Math.floor(Math.random() * observationComments.length)],
        type: "observation",
        severity: "mild"
      });
    }
  });
  
  return comments.slice(0, 3);
};

const findCinematicMove = (analysis: ReviewMove[]): CinematicMove | null => {
  // Find the most dramatic moment in the game
  let mostDramatic: { move: ReviewMove; index: number; drama: number } | null = null;
  
  analysis.forEach((move, index) => {
    let drama = 0;
    
    if (move.type === "Blunder") {
      drama = 85;
    } else if (move.type === "Brilliant" && Math.abs(parseFloat(move.evaluation)) > 3) {
      drama = 75;
    } else if (move.type === "Mistake") {
      drama = 60;
    } else if (move.type === "Brilliant") {
      drama = 40;
    }
    
    // Add randomness for variety
    drama += Math.random() * 20;
    
    if (!mostDramatic || drama > mostDramatic.drama) {
      mostDramatic = { move, index, drama };
    }
  });
  
  if (!mostDramatic) return null;
  
  const { move, index, drama } = mostDramatic;
  
  const titles = {
    brilliant: ["The Masterstroke", "Stroke of Genius", "The Golden Move"],
    blunder: ["The Horror Show", "The Nightmare Move", "The Epic Fail"],
    comeback: ["The Comeback Kid", "Against All Odds", "The Resurrection"],
    sacrifice: ["The Bold Sacrifice", "All or Nothing", "The Gambit"],
    endgame: ["The Final Touch", "Endgame Mastery", "The Finishing Move"]
  };
  
  const descriptions = {
    brilliant: ["A move that sparkled with creative genius!", "Pure chess artistry in motion!", "The kind of move that wins awards!"],
    blunder: ["A move that will be remembered for all the wrong reasons...", "Sometimes the board has other plans!", "The moment everything changed..."],
    comeback: ["From the ashes of defeat, hope emerged!", "Never count out the human spirit!", "The tide begins to turn!"],
    sacrifice: ["Sometimes you have to give to receive!", "A calculated risk that paid off!", "Bold decisions define champions!"],
    endgame: ["The final act of this chess drama!", "Technique meets artistry!", "The curtain falls on a masterpiece!"]
  };
  
  let category: CinematicMove["category"] = "endgame";
  if (move.type === "Blunder") category = "blunder";
  else if (move.type === "Brilliant" && index > analysis.length * 0.8) category = "endgame";
  else if (move.type === "Brilliant") category = "brilliant";
  
  const categoryTitles = titles[category];
  const categoryDescriptions = descriptions[category];
  
  return {
    moveNumber: index + 1,
    move: move.move,
    title: categoryTitles[Math.floor(Math.random() * categoryTitles.length)],
    description: categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)],
    category,
    dramaMeter: Math.min(100, Math.max(0, drama))
  };
};

const getSeverityEmoji = (severity: BotComment["severity"]): string => {
  switch (severity) {
    case "mild": return "😊";
    case "savage": return "🔥";
    case "legendary": return "💀";
    default: return "🤖";
  }
};

const getCategoryEmoji = (category: CinematicMove["category"]): string => {
  switch (category) {
    case "brilliant": return "✨";
    case "blunder": return "💥";
    case "comeback": return "🔄";
    case "sacrifice": return "⚔️";
    case "endgame": return "🏁";
    default: return "🎬";
  }
};

export const FunUniqueCards: React.FC<FunUniqueCardsProps> = ({
  analysis,
  onJumpToMove,
  playerName = "You"
}) => {
  const [activeTab, setActiveTab] = useState<"magnus" | "bot" | "cinematic">("magnus");
  
  const magnusComparison = generateMagnusComparison(analysis);
  const botComments = generateBotComments(analysis, playerName);
  const cinematicMove = findCinematicMove(analysis);

  return (
            <Card className="rounded-2xl shadow-lg bg-card border border-[#00F5D4]/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-6 w-6 text-[var(--accent)]" />
          Fun & Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          The entertaining side of your chess journey
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="magnus" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Magnus Says
            </TabsTrigger>
            <TabsTrigger value="bot" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Bot Roasts
            </TabsTrigger>
            <TabsTrigger value="cinematic" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Cinematic
            </TabsTrigger>
          </TabsList>
          
          {/* Magnus Comparison Tab */}
          <TabsContent value="magnus" className="space-y-6 mt-6">
            {magnusComparison ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                        What Would Magnus Do?
                      </h3>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Move {magnusComparison.moveNumber} - {magnusComparison.situation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Your Move</div>
                      <div className="text-2xl font-bold font-mono text-accent">
                        {magnusComparison.playerMove}
                      </div>
                    </div>
                    <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Magnus Would Play</div>
                      <div className="text-2xl font-bold font-mono text-yellow-600">
                        {magnusComparison.magnusMove}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Quote className="h-4 w-4 text-accent" />
                      <span className="font-semibold">Magnus's Reasoning</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                      "{magnusComparison.reasoning}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Similarity Score:</span>
                      <Badge className={`${
                        magnusComparison.similarity >= 70 ? "bg-[var(--accent)] text-[var(--accent-foreground)]" :
                        magnusComparison.similarity >= 50 ? "bg-yellow-500 text-black" :
                        "bg-[var(--destructive)] text-[var(--accent-foreground)]"
                      }`}>
                        {magnusComparison.similarity}%
                      </Badge>
                    </div>
                    {onJumpToMove && (
                      <Button
                        onClick={() => onJumpToMove(magnusComparison.moveNumber - 1)}
                        variant="outline"
                        size="sm"
                        className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review Move
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No interesting positions found for Magnus comparison</p>
              </div>
            )}
          </TabsContent>
          
          {/* Bot Comments Tab */}
          <TabsContent value="bot" className="space-y-4 mt-6">
            {botComments.length > 0 ? (
              <div className="space-y-4">
                {botComments.map((comment, index) => (
                  <div 
                    key={index}
                    className={`rounded-xl p-4 border ${
                      comment.type === "roast" 
                        ? "bg-red-50 dark:bg-red-900/20 border-[var(--border)] dark:border-red-800"
                        : comment.type === "praise"
                        ? "bg-green-50 dark:bg-green-900/20 border-[var(--border)] dark:border-green-800"
                        : "bg-[var(--card)] dark:bg-blue-900/20 border-[var(--border)] dark:border-blue-800"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getSeverityEmoji(comment.severity)}</span>
                        <div>
                          <span className="font-semibold">
                            Move {comment.moveNumber} - {comment.type === "roast" ? "Roast" : comment.type === "praise" ? "Praise" : "Observation"}
                          </span>
                          <Badge className="ml-2 text-xs" variant="secondary">
                            {comment.severity}
                          </Badge>
                        </div>
                      </div>
                      {onJumpToMove && (
                        <Button
                          onClick={() => onJumpToMove(comment.moveNumber - 1)}
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                    <p className="text-lg font-medium">
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>The bot was speechless this game! 🤐</p>
              </div>
            )}
          </TabsContent>
          
          {/* Cinematic Move Tab */}
          <TabsContent value="cinematic" className="space-y-6 mt-6">
            {cinematicMove ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-[var(--border)] dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{getCategoryEmoji(cinematicMove.category)}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {cinematicMove.title}
                      </h3>
                      <p className="text-sm text-[var(--accent)] dark:text-purple-400">
                        Move {cinematicMove.moveNumber} - The highlight of your game
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-4 mb-4">
                    <div className="text-center mb-3">
                      <div className="text-4xl font-bold font-mono text-[var(--accent)] mb-2">
                        {cinematicMove.move}
                      </div>
                      <p className="text-lg italic text-muted-foreground">
                        {cinematicMove.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Drama Meter</span>
                      <span className="text-sm font-mono">{cinematicMove.dramaMeter}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-[var(--secondary)] rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${cinematicMove.dramaMeter}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    {onJumpToMove && (
                      <Button
                        onClick={() => onJumpToMove(cinematicMove.moveNumber - 1)}
                        className="bg-[var(--accent)] hover:bg-[var(--accent)] hover:opacity-80 text-[var(--card-foreground)]"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Watch The Magic
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No cinematic moments found in this game</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FunUniqueCards; 