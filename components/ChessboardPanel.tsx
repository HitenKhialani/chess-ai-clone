import { Card } from "@/components/ui/card";
import { Chessboard } from "react-chessboard";
import React from "react";

interface ChessboardPanelProps {
  userFen: string;
  tryMoveMode: boolean;
  onPieceDrop: (source: string, target: string) => boolean;
  onNav: (type: 'first' | 'prev' | 'next' | 'last') => void;
  onTryMoveToggle: () => void;
  currentMoveIdx: number;
  totalMoves: number;
}

const ChessboardPanel: React.FC<ChessboardPanelProps> = ({
  userFen,
  tryMoveMode,
  onPieceDrop,
  onNav,
  onTryMoveToggle,
  currentMoveIdx,
  totalMoves,
}) => (
  <Card className="w-full max-w-lg h-full flex flex-col items-center justify-center bg-card shadow-lg p-4">
    <Chessboard
      position={userFen}
      onPieceDrop={onPieceDrop}
      arePiecesDraggable={tryMoveMode}
      boardWidth={Math.min(400, typeof window !== 'undefined' ? window.innerWidth * 0.4 : 400)}
      customBoardStyle={{ borderRadius: 12, boxShadow: '0 2px 16px #0002' }}
    />
    <div className="flex justify-center gap-2 mt-4">
      <button className="btn" onClick={() => onNav('first')} disabled={tryMoveMode || currentMoveIdx === 0}>{'|<'}</button>
      <button className="btn" onClick={() => onNav('prev')} disabled={tryMoveMode || currentMoveIdx === 0}>{'<'}</button>
      <span className="px-2 py-1 text-sm">Move {Math.ceil(currentMoveIdx / 2)} / {Math.ceil(totalMoves / 2)}</span>
              <button className="btn" onClick={() => onNav('next')} disabled={tryMoveMode || currentMoveIdx === totalMoves - 1}>{'>'}</button>
        <button className="btn" onClick={() => onNav('last')} disabled={tryMoveMode || currentMoveIdx === totalMoves - 1}>{'>|'}</button>
    </div>
  </Card>
);

export default ChessboardPanel; 