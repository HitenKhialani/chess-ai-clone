// hooks/useStockfish.js
import { useEffect, useRef, useCallback } from 'react';

export default function useStockfish(onBestMove) {
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker('/engine/stockfish.js'); // path for public folder
    workerRef.current.postMessage('uci');

    workerRef.current.onmessage = (e) => {
      const text = e.data;
      if (text.startsWith('bestmove')) {
        const move = text.split(' ')[1];
        onBestMove?.(move);
      }
    };

    return () => workerRef.current.terminate();
  }, [onBestMove]);

  const send = useCallback((cmd) => {
    workerRef.current?.postMessage(cmd);
  }, []);

  const setPosition = useCallback((fenOrMoves) => {
    if (fenOrMoves.startsWith('position')) send(fenOrMoves);
    else send(`position fen ${fenOrMoves}`);
  }, [send]);

  const go = useCallback(({ depth = 12 } = {}) => {
    send(`go depth ${depth}`);
  }, [send]);

  return { send, setPosition, go };
}
