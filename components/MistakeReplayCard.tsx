import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { CheckCircle, XCircle } from "lucide-react";

interface MistakeReplayCardProps {
  fen: string;
  engineMove: string;
  onClose: () => void;
}

export const MistakeReplayCard: React.FC<MistakeReplayCardProps> = ({ fen, engineMove, onClose }) => {
  const [userChess, setUserChess] = useState(new Chess(fen));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleDrop = (source: string, target: string): boolean => {
    if (completed) return false;
    const chess = new Chess(userChess.fen());
    const moveObj: any = { from: source, to: target };
    // Check if this is a pawn promotion move
    const piece = chess.get(source as any);
    const isPromotion = piece && 
                       piece.type === 'p' && 
                       ((piece.color === 'w' && target[1] === '8') || 
                        (piece.color === 'b' && target[1] === '1'));
    if (isPromotion) {
      moveObj.promotion = 'q'; // Default to queen for mistake replay
    }
    const move = chess.move(moveObj);
    if (move) {
      setUserChess(chess);
      if (move.san === engineMove) {
        setFeedback('correct');
        setCompleted(true);
      } else {
        setFeedback('incorrect');
      }
      return true;
    }
    return false;
  };

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">Try Again: Mistake Replay</CardTitle>
        <CardDescription className="text-sm">Can you find the engine's best move?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Chessboard
          position={userChess.fen()}
          onPieceDrop={handleDrop}
          arePiecesDraggable={!completed}
          boardWidth={320}
        />
        {feedback === 'correct' && (
          <div className="flex items-center gap-2 text-[var(--accent)] font-semibold">
            <CheckCircle className="w-5 h-5" /> This was the engine’s choice!
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className="flex items-center gap-2 text-red-500 font-semibold">
            <XCircle className="w-5 h-5" /> Still inaccurate. Try again.
          </div>
        )}
        <Button variant="outline" className="mt-2" onClick={onClose}>Close</Button>
      </CardContent>
    </Card>
  );
};

export default MistakeReplayCard; 