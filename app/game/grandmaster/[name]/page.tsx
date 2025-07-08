"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Chess, Move } from "chess.js";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import the chessboard to avoid SSR issues
const Chessboard = dynamic<any>(() => import("react-chessboard").then(mod => mod.Chessboard), { ssr: false });

interface GameInfo {
  event?: string;
  site?: string;
  date?: string;
  round?: string;
  white?: string;
  black?: string;
  result?: string;
  eco?: string;
  opening?: string;
}

export default function GrandmasterGamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = typeof params.name === 'string' ? params.name : Array.isArray(params.name) ? params.name[0] : '';
  const event = searchParams.get('event');
  const opponent = searchParams.get('opponent');
  
  const [pgn, setPgn] = useState<string>("");
  const [moves, setMoves] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0); // 0 = initial position
  const [fen, setFen] = useState<string>("");
  const [lastMoveSquares, setLastMoveSquares] = useState<{ from: string, to: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameInfo, setGameInfo] = useState<GameInfo>({});

  useEffect(() => {
    async function fetchGame() {
      setLoading(true);
      setError("");
      try {
        let url = `/api/grandmaster-game?name=${name}`;
        if (event) url += `&event=${event}`;
        if (opponent) url += `&opponent=${opponent}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Game not found");
        const data = await res.json();
        setPgn(data.pgn);
        setGameInfo(data.info || {});
        const chess = new Chess();
        chess.loadPgn(data.pgn);
        setMoves(chess.history({ verbose: false }));
        chess.reset();
        setFen(chess.fen());
        setMoveIndex(0);
        setLastMoveSquares(null);
      } catch (err: any) {
        setError(err.message || "Failed to load game");
      } finally {
        setLoading(false);
      }
    }
    if (name) fetchGame();
  }, [name, event, opponent]);

  // Play moves up to moveIndex
  useEffect(() => {
    if (!pgn || moves.length === 0) return;
    const chess = new Chess();
    let lastMove: Move | null = null;
    for (let i = 0; i < moveIndex; i++) {
      lastMove = chess.move(moves[i]);
    }
    setFen(chess.fen());
    if (lastMove) {
      setLastMoveSquares({ from: lastMove.from, to: lastMove.to });
    } else {
      setLastMoveSquares(null);
    }
  }, [moveIndex, pgn, moves]);

  const handleNextMove = () => {
    if (moveIndex < moves.length) {
      setMoveIndex(moveIndex + 1);
    }
  };

  const handlePrevMove = () => {
    if (moveIndex > 0) {
      setMoveIndex(moveIndex - 1);
    }
  };

  const handleReset = () => {
    setMoveIndex(0);
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  // Highlight last move
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (lastMoveSquares) {
    customSquareStyles[lastMoveSquares.from] = { background: 'rgba(255,255,0,0.5)' };
    customSquareStyles[lastMoveSquares.to] = { background: 'rgba(0,255,0,0.4)' };
  }

  // Prepare move list for display
  const movePairs: string[][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i], moves[i + 1]]);
  }

  return (
    <main className="min-h-screen pt-20 pb-16 bg-[var(--background)] flex flex-col items-center">
      <div className="flex flex-col md:flex-row gap-12 justify-center items-start w-full max-w-6xl">
        <div className="card border border-[var(--accent)] shadow-lg p-6 w-full md:w-2/3">
          {/* Board and moves */}
          <h2 className="text-2xl font-bold mb-4 text-[var(--primary-text)]">{name.replace(/%20/g, ' ')}'s Game</h2>
          <Chessboard position={fen} boardWidth={400} customSquareStyles={customSquareStyles} animationDuration={300} />
          <div className="flex justify-center mt-4 space-x-2">
            <Button onClick={handlePrevMove} disabled={moveIndex === 0} variant="outline">Previous Move</Button>
            <Button onClick={handleNextMove} disabled={moveIndex >= moves.length}>Next Move</Button>
            <Button onClick={handleReset} variant="secondary">Reset</Button>
          </div>
          <div className="text-center text-purple-200 mt-2">
            Move {moveIndex} of {moves.length}
          </div>
          {/* Move List */}
          <div className="mt-6 bg-[#23263a] rounded-lg p-4 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2 text-sm text-purple-100">
              <div className="font-bold">#</div>
              <div className="font-bold">White</div>
              <div className="font-bold">Black</div>
              {movePairs.map((pair, idx) => (
                <React.Fragment key={idx}>
                  <div className="text-purple-400 font-semibold">{idx + 1}</div>
                  <div className={moveIndex - 1 === idx * 2 ? "bg-purple-700 text-white rounded px-1" : ""}>{pair[0]}</div>
                  <div className={moveIndex - 1 === idx * 2 + 1 ? "bg-purple-700 text-white rounded px-1" : ""}>{pair[1]}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="card border border-[var(--accent)] shadow-lg p-6 w-full md:w-1/3">
          <h3 className="text-xl font-bold mb-2 text-[var(--accent)]">Game Info</h3>
          {gameInfo.event && <div><span className="text-purple-400">Event:</span> {gameInfo.event}</div>}
          {gameInfo.site && <div><span className="text-purple-400">Site:</span> {gameInfo.site}</div>}
          {gameInfo.date && <div><span className="text-purple-400">Date:</span> {gameInfo.date}</div>}
          {gameInfo.round && <div><span className="text-purple-400">Round:</span> {gameInfo.round}</div>}
          {gameInfo.white && <div><span className="text-purple-400">White:</span> {gameInfo.white}</div>}
          {gameInfo.black && <div><span className="text-purple-400">Black:</span> {gameInfo.black}</div>}
          {gameInfo.result && <div><span className="text-purple-400">Result:</span> {gameInfo.result}</div>}
          {gameInfo.eco && <div><span className="text-purple-400">ECO:</span> {gameInfo.eco}</div>}
          {gameInfo.opening && <div><span className="text-purple-400">Opening:</span> {gameInfo.opening}</div>}
        </div>
      </div>
    </main>
  );
} 