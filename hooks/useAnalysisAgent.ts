'use client';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

/** Fetch grandmaster game data from Lichess for given FEN */
async function fetchMaster(fen: string) {
  const url = `https://explorer.lichess.ovh/masters?fen=${encodeURIComponent(fen)}&topGames=1&moves=0`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Lichess Explorer error');
  return res.json();
}

export type Advice = {
  bestMove: string;
  score: string;
  pv: string;
  master?: {
    white: string;
    black: string;
    year: number;
    result: string;
    nextMoves: string[];
  };
};

export default function useAnalysisAgent(fenTrigger: string | null) {
  const stockfishRef = useRef<Worker | null>(null);
  const [advice, setAdvice] = useState<Advice | null>(null);

  // 1. Spin up analysis Stockfish
  useEffect(() => {
    stockfishRef.current = new Worker('/engine/stockfish.js');
    stockfishRef.current.postMessage('uci');
    stockfishRef.current.postMessage('isready');
    return () => stockfishRef.current?.terminate();
  }, []);

  // 2. Trigger Stockfish analysis when fenTrigger updates
  useEffect(() => {
    if (!fenTrigger || !stockfishRef.current) return;
    setAdvice(null);

    stockfishRef.current.postMessage(`position fen ${fenTrigger}`);
    stockfishRef.current.postMessage('go depth 14');

    const onMessage = (e: MessageEvent<string>) => {
      const msg = e.data;
      if (msg.startsWith('info') && msg.includes(' pv ')) {
        const pv = msg.split(' pv ')[1];
        const bestMove = pv.split(' ')[0];
        const scoreMatch = msg.match(/score (cp|mate) (-?\d+)/);
        let score = '';
        if (scoreMatch) {
          score = scoreMatch[1] === 'cp' ? (parseInt(scoreMatch[2]) / 100).toFixed(2) : '#' + scoreMatch[2];
        }
        setAdvice((prev) => ({ ...prev, bestMove, score, pv }));
      } else if (msg.startsWith('bestmove')) {
        stockfishRef.current?.removeEventListener('message', onMessage);
      }
    };

    stockfishRef.current.addEventListener('message', onMessage);
  }, [fenTrigger]);

  // 3. Fetch master game data
  const { data: masterData } = useSWR(
    fenTrigger ? ['master', fenTrigger] : null,
    () => fetchMaster(fenTrigger!)
  );

  useEffect(() => {
    if (advice && masterData?.topGames?.length) {
      const gm = masterData.topGames[0];
      setAdvice((prev) =>
        prev
          ? {
              ...prev,
              master: {
                white: gm.white,
                black: gm.black,
                year: gm.year,
                result: gm.result,
                nextMoves: gm.moves || [],
              },
            }
          : null
      );
    }
  }, [masterData, advice]);

  return advice;
}
