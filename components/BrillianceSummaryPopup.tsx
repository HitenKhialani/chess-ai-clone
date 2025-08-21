import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Target, CheckCircle, AlertTriangle, XCircle, Trophy, BarChart3 } from 'lucide-react';

interface BrillianceSummaryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCalculating: boolean;
  brillianceStats: {
    brilliantMoves: number;
    correctMoves: number;
    mistakes: number;
    blunders: number;
  } | null;
  winner: string | null;
  lastGameResult: 'white' | 'black' | null;
  drawReason: string;
  opponentName: string;
  onAnalyzeGame: () => void;
  onPlayAgain: () => void;
}

export const BrillianceSummaryPopup: React.FC<BrillianceSummaryPopupProps> = ({
  open,
  onOpenChange,
  isCalculating,
  brillianceStats,
  winner,
  lastGameResult,
  drawReason,
  opponentName,
  onAnalyzeGame,
  onPlayAgain,
}) => {
  const isWin = lastGameResult === 'white';
  const isLoss = lastGameResult === 'black';
  const isDraw = lastGameResult === null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-3xl p-8" style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(20px)'
      }}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-2" style={{
            color: isWin ? '#10B981' : isLoss ? '#EF4444' : '#F59E0B'
          }}>
            {winner ? `Checkmate! ${winner} wins!` : `Draw by ${drawReason}!`}
          </DialogTitle>
          <DialogDescription className="text-lg mb-6" style={{ color: 'var(--secondary-text)' }}>
            {winner 
              ? (isWin
                  ? "Congratulations! You've checkmated the AI!"
                  : 'The AI has checkmated you! Better luck next time!')
              : `The game has ended in a draw by ${drawReason.toLowerCase()}.`
            }
          </DialogDescription>
          
          {/* Brilliance Summary with Glassmorphism */}
          <div className="rounded-2xl p-6 mb-6" style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, transparent 100%)',
            backgroundOpacity: '0.1',
            border: '1px solid var(--border)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="text-center space-y-4">
              {/* Brilliant Moves */}
              <div className="flex items-center justify-center gap-3">
                <Target className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                <div className="text-xl font-bold" style={{ color: 'var(--primary-text)' }}>
                  {isCalculating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--accent)' }} />
                      Calculating...
                    </span>
                  ) : (
                    "? Brilliant Moves"
                  )}
                </div>
              </div>
              
              {/* Move Statistics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center gap-1">
                  <CheckCircle className="h-5 w-5" style={{ color: '#10B981' }} />
                  <span className="font-semibold" style={{ color: 'var(--primary-text)' }}>
                    ?
                  </span>
                  <span className="text-xs" style={{ color: 'var(--secondary-text)' }}>Correct</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <AlertTriangle className="h-5 w-5" style={{ color: '#F59E0B' }} />
                  <span className="font-semibold" style={{ color: 'var(--primary-text)' }}>
                    ?
                  </span>
                  <span className="text-xs" style={{ color: 'var(--secondary-text)' }}>Mistakes</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <XCircle className="h-5 w-5" style={{ color: '#EF4444' }} />
                  <span className="font-semibold" style={{ color: 'var(--primary-text)' }}>
                    ?
                  </span>
                  <span className="text-xs" style={{ color: 'var(--secondary-text)' }}>Blunders</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Opponent Info */}
          <div className="flex justify-between w-full text-sm mb-6 p-3 rounded-xl" style={{
            background: 'var(--card)',
            border: '1px solid var(--border)'
          }}>
            <span className="font-semibold" style={{ color: 'var(--secondary-text)' }}>Opponent:</span>
            <span className="font-bold" style={{ color: 'var(--primary-text)' }}>{opponentName}</span>
          </div>
        </DialogHeader>
        
        <DialogFooter className="flex flex-row gap-4 justify-center mt-6">
          <Button
            className="font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none'
            }}
            onClick={onAnalyzeGame}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analyze Game
          </Button>
          <Button
            className="font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              background: '#10B981',
              color: '#fff',
              border: 'none'
            }}
            onClick={onPlayAgain}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 