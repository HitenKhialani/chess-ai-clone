import React, { useState } from "react";
import MoveExplanationTooltip from "./MoveExplanationTooltip";
import MoveExplanationPanel from "./MoveExplanationPanel";

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
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [selectedMoveData, setSelectedMoveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplanationClick = (explanationText: string, moveData: any) => {
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
      className="flex flex-col bg-card rounded-lg shadow-lg"
      style={{ height: 400, minWidth: 320, maxWidth: 400, boxSizing: 'border-box', justifyContent: 'center' }}
    >
      <div className="font-bold text-lg mb-2 flex items-center gap-2 justify-center">Move History</div>
      <div
        className="overflow-y-auto w-full"
        style={{ flex: 1, maxHeight: 340 }}
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
                          setCurrentMoveIdx(pair.moveNumber * 2 - 1);
                          // Show AI explanation
                          if (pair.white && pair.white.explanation) {
                            handleExplanationClick(pair.white.explanation, {
                              move: pair.white.move,
                              moveType: pair.white.type,
                              evaluation: pair.white.evaluation,
                              moveNumber: pair.moveNumber,
                              playerColor: 'white'
                            });
                          }
                        }}
                      >
                        {pair.white.move}
                      </span>
                    </MoveExplanationTooltip>
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
                          setCurrentMoveIdx(pair.moveNumber * 2);
                          // Show AI explanation
                          if (pair.black && pair.black.explanation) {
                            handleExplanationClick(pair.black.explanation, {
                              move: pair.black.move,
                              moveType: pair.black.type,
                              evaluation: pair.black.evaluation,
                              moveNumber: pair.moveNumber,
                              playerColor: 'black'
                            });
                          }
                        }}
                      >
                        {pair.black.move}
                      </span>
                    </MoveExplanationTooltip>
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
      
      {/* AI Analysis Button */}
      <div className="flex flex-col items-center p-3 border-t border-muted">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
          onClick={handleGetAIAnalysis}
          disabled={loading || !moveHistory || !onAnalysisUpdate}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Analyzing...
            </div>
          ) : (
            'Get AI Analysis'
          )}
        </button>
        {error && (
          <div className="text-red-500 text-xs mt-2 text-center max-w-full break-words">
            {error}
          </div>
        )}
        {!moveHistory && (
          <div className="text-gray-500 text-xs mt-1">
            Move history required for AI analysis
          </div>
        )}
      </div>
      
      {/* Move Explanation Panel */}
      {explanation && selectedMoveData && (
        <div className="mt-4">
          <MoveExplanationPanel
            explanation={explanation}
            moveData={selectedMoveData}
            onClose={handleCloseExplanation}
          />
        </div>
      )}
    </div>
  );
};

export default MoveHistoryPanel; 