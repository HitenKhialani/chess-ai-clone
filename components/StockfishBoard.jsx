// components/StockfishBoard.jsx
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useState, useCallback } from 'react';
import useStockfish from '../hooks/useStockfish';

export default function StockfishBoard() {
  const game = useState(() => new Chess())[0];
  const [, setFen] = useState(game.fen());
  const [thinking, setThinking] = useState(false);

  const { setPosition, go } = useStockfish((bestMove) => {
    if (bestMove && game.move(bestMove, { sloppy: true })) {
      setFen(game.fen());
      setThinking(false);
    }
  });

  const onPieceDrop = useCallback((source, target) => {
    const move = { from: source, to: target, promotion: 'q' };
    const result = game.move(move);
    if (result) {
      setFen(game.fen());
      setThinking(true);
      const history = game.history({ verbose: false }).join(' ');
      setPosition(`position startpos moves ${history}`);
      go({ depth: 12 });
      return true;
    }
    return false;
  }, [game, go, setPosition]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onPieceDrop}
        boardOrientation="white"
        arePiecesDraggable={!thinking}
      />
      {thinking && <p className="text-purple-500">Stockfish is thinking…</p>}
    </div>
  );
}
