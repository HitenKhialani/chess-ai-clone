import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoveExplanationTooltip from "./MoveExplanationTooltip";

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
  fenBefore?: string;
  fenAfter?: string;
}

interface MoveHistoryPanelProps {
  analysis: ReviewMove[];
  currentMoveIdx: number;
  onMistakeClick: (idx: number) => void;
  setCurrentMoveIdx: (idx: number) => void;
  moveHistory?: string[];
  onAnalysisUpdate?: (newAnalysis: ReviewMove[]) => void;
  /** If true, renders a minimal read-only table without AI tabs/tooltips */
  compact?: boolean;
}

/**
 * MoveHistoryPanel - Displays chess moves in a table format with White and Black moves in separate columns
 * Format matches the design shown in the first image with columns: # | White Move | Type | Eval | Black Move | Type | Eval
 */
const MoveHistoryPanel: React.FC<MoveHistoryPanelProps> = ({
  analysis,
  currentMoveIdx,
  onMistakeClick,
  setCurrentMoveIdx,
  moveHistory,
  onAnalysisUpdate,
  compact = false,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [selectedMoveData, setSelectedMoveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'stockfish' | 'ai'>(
    'stockfish'
  );
  const [aiLoaded, setAiLoaded] = useState(false);

  const handleExplanationClick = (explanationText: string, moveData: any) => {
    // Instead of rendering an inline explanation card here, dispatch an event
    // so the bottom AIExplanationPanel (in GameReview) shows the details.
    const detailMove = {
      move: moveData.move,
      type: moveData.moveType,
      evaluation: moveData.evaluation,
      moveNumber: moveData.moveNumber,
      playerColor: moveData.playerColor,
      fenBefore: moveData.fenBefore,
      fenAfter: moveData.fenAfter,
      explanation: explanationText,
    };
    window.dispatchEvent(new CustomEvent("move-clicked", { detail: { move: detailMove } }));
    setExplanation(explanationText);
    setSelectedMoveData(moveData);
  };

  const handleCloseExplanation = () => {
    setExplanation('');
    setSelectedMoveData(null);
  };

  // Handler for Get AI Analysis button
  const handleGetAIAnalysis = async () => {
    if (!moveHistory || !onAnalysisUpdate) {
      setError('AI analysis not available - missing required data');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moves: moveHistory }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get AI analysis');
      }
      
      const data = await res.json();
      if (data.analysis && Array.isArray(data.analysis)) {
        onAnalysisUpdate(data.analysis);
        setError(null);
        setAiLoaded(true);
      } else {
        setError('Invalid analysis format returned');
      }
    } catch (e: any) {
      console.error('AI Analysis error:', e);
      setError(e.message || 'Failed to analyze game');
    } finally {
      setLoading(false);
    }
  };
  // Group moves into pairs (White and Black moves)
  const movePairs = [];
  for (let i = 0; i < analysis.length; i += 2) {
    const whiteMove = analysis[i];
    const blackMove = analysis[i + 1];
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: whiteMove,
      black: blackMove
    });
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Brilliant':
        return 'text-cyan-500';
      case 'Correct':
        return 'text-green-500';
      case 'Mistake':
        return 'text-yellow-500';
      case 'Blunder':
        return 'text-red-500';
      default:
        return 'text-[var(--muted-foreground)]';
    }
  };

  return (
    <div
      className="flex flex-col bg-card rounded-lg shadow-lg h-full"
      style={{ minWidth: 320, maxWidth: 400, boxSizing: 'border-box', justifyContent: 'center' }}
    >
      <div className="font-bold text-lg flex items-center gap-2 justify-center pt-3">Move History</div>
      {/* Analysis mode tabs (hidden in compact mode) */}
      {!compact && (
        <div className="px-3 pb-2">
          <Tabs value={mode} onValueChange={(v) => {
            const next = (v as 'stockfish' | 'ai');
            setMode(next);
            if (next === 'ai' && !aiLoaded && !loading) {
              void handleGetAIAnalysis();
            }
          }}>
            <TabsList className="grid w-full grid-cols-2 rounded-lg border border-accent/30 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 overflow-hidden">
              <TabsTrigger
                value="stockfish"
                className="text-xs sm:text-sm font-medium text-muted-foreground rounded-none data-[state=active]:text-foreground data-[state=active]:bg-accent/15"
              >
                Stockfish Analysis
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="text-xs sm:text-sm font-medium text-muted-foreground rounded-none data-[state=active]:text-foreground data-[state=active]:bg-accent/15"
              >
                Get AI Analysis
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {error && (
            <div className="text-red-500 text-xs mt-2 text-center max-w-full break-words">
              {error}
            </div>
          )}
        </div>
      )}
      <div
        className="overflow-y-auto w-full"
        style={{ flex: 1, maxHeight: 400 }}
      >
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b border-muted">
              <th className="py-1 px-1 text-xs">#</th>
              <th className="py-1 px-1 text-xs">White Move</th>
              <th className="py-1 px-1 text-xs">Type</th>
              <th className="py-1 px-1 text-xs">Eval</th>
              <th className="py-1 px-1 text-xs">Black Move</th>
              <th className="py-1 px-1 text-xs">Type</th>
              <th className="py-1 px-1 text-xs">Eval</th>
            </tr>
          </thead>
          <tbody>
            {movePairs.map((pair, idx) => (
              <tr
                key={idx}
                className={`border-b border-muted group hover:bg-accent/20 ${
                  (currentMoveIdx - 1 >= pair.moveNumber * 2 - 2 && currentMoveIdx - 1 <= pair.moveNumber * 2 - 1) 
                    ? 'bg-accent/30' 
                    : ''
                }`}
                style={{ cursor: 'pointer' }}
              >
                {/* Move Number */}
                <td className="py-1 px-1 font-mono text-xs">
                  {pair.moveNumber}
                </td>
                
                {/* White Move */}
                <td className="py-1 px-1 font-mono text-xs">
                  {pair.white ? (
                    compact ? (
                      <span
                        className="block"
                        onClick={() => setCurrentMoveIdx(pair.moveNumber * 2 - 1)}
                      >
                        {pair.white.move}
                      </span>
                    ) : (
                      <MoveExplanationTooltip
                        moveData={{
                          move: pair.white.move,
                          position: `After move ${pair.moveNumber * 2 - 1}`,
                          moveType: pair.white.type,
                          evaluation: pair.white.evaluation,
                          moveNumber: pair.moveNumber,
                          playerColor: 'white',
                          fenBefore: pair.white.fenBefore,
                          fenAfter: pair.white.fenAfter
                        }}
                        onExplanationClick={handleExplanationClick}
                      >
                        <span 
                          className="hover:bg-accent/40 cursor-pointer block"
                          onClick={() => {
                            // Only update board index here; the tooltip will fetch and dispatch explanation when ready
                            setCurrentMoveIdx(pair.moveNumber * 2 - 1);
                          }}
                        >
                          {pair.white.move}
                        </span>
                      </MoveExplanationTooltip>
                    )
                  ) : (
                    '-'
                  )}
                </td>
                
                {/* White Move Type */}
                <td className={`py-1 px-1 font-bold text-xs ${getTypeColor(pair.white?.type || '')}`}>
                  {pair.white?.type || '-'}
                </td>
                
                {/* White Move Evaluation */}
                <td className="py-1 px-1 font-mono text-xs">
                  {pair.white?.evaluation || '-'}
                </td>

                {/* Black Move */}
                <td className="py-1 px-1 font-mono text-xs">
                  {pair.black ? (
                    compact ? (
                      <span
                        className="block"
                        onClick={() => setCurrentMoveIdx(pair.moveNumber * 2)}
                      >
                        {pair.black.move}
                      </span>
                    ) : (
                      <MoveExplanationTooltip
                        moveData={{
                          move: pair.black.move,
                          position: `After move ${pair.moveNumber * 2}`,
                          moveType: pair.black.type,
                          evaluation: pair.black.evaluation,
                          moveNumber: pair.moveNumber,
                          playerColor: 'black',
                          fenBefore: pair.black.fenBefore,
                          fenAfter: pair.black.fenAfter
                        }}
                        onExplanationClick={handleExplanationClick}
                      >
                        <span 
                          className="hover:bg-accent/40 cursor-pointer block"
                          onClick={() => {
                            // Only update board index here; the tooltip will fetch and dispatch explanation when ready
                            setCurrentMoveIdx(pair.moveNumber * 2);
                          }}
                        >
                          {pair.black.move}
                        </span>
                      </MoveExplanationTooltip>
                    )
                  ) : (
                    '-'
                  )}
                </td>
              
              {/* Black Move Type */}
              <td className={`py-1 px-1 font-bold text-xs ${getTypeColor(pair.black?.type || '')}`}>
                {pair.black?.type || '-'}
              </td>
              
              {/* Black Move Evaluation */}
              <td className="py-1 px-1 font-mono text-xs">
                {pair.black?.evaluation || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      {/* Inline explanation removed in favor of bottom AIExplanationPanel in GameReview */}
    </div>
  );
};
export default MoveHistoryPanel; 