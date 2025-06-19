import { useEffect } from "react";
import Chessboard from "chessboardjsx"; // or use your existing botPlayPage board
import { Chess } from "chess.js";

export default function PuzzleBoard({ fen, onMove, isLocked }) {
  const game = new Chess(fen);

  return (
    <Chessboard
      position={fen}
      onDrop={({ sourceSquare, targetSquare }) => {
        if (isLocked) return;
        const move = game.move({ from: sourceSquare, to: targetSquare });
        if (move) onMove(move.san);
      }}
    />
  );
}