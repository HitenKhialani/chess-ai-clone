'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useMediaQuery } from 'react-responsive';

const Chessboard = dynamic(
  () => import('react-chessboard').then((m) => m.Chessboard),
  { ssr: false }
);

const botSettings: Record<string, { depth: number; depthRange: string; eloRange: string; rating: number; accuracy: number; name: string; skill: number; description: string }> = {
  beginner: { depth: 2, depthRange: '1–2', eloRange: '400–800', rating: 600, accuracy: 85, name: 'Beginner Bot', skill: 0, description: "A gentle introduction to chess AI. Plays with limited depth and skill." },
  intermediate: { depth: 5, depthRange: '3–5', eloRange: '800–1600', rating: 1200, accuracy: 90, name: 'Intermediate Bot', skill: 5, description: "A balanced opponent for developing players. Offers a good challenge." },
  advanced: { depth: 8, depthRange: '6–8', eloRange: '1600–2300', rating: 2000, accuracy: 95, name: 'Advanced Bot', skill: 10, description: "A formidable opponent for experienced players. Plays with deeper analysis." },
  moreadvanced: { depth: 10, depthRange: '9–10', eloRange: '2300–3000', rating: 2650, accuracy: 98, name: 'More Advanced Bot', skill: 15, description: "A very strong opponent for advanced players. Approaches master level." },
  master: { depth: 12, depthRange: '11+', eloRange: '3000+', rating: 3200, accuracy: 99, name: 'Master Bot', skill: 20, description: "The ultimate challenge. Plays at grandmaster level." },
};

export default function BotPlayPage() {
  const params = useParams<{ bot: string }>();
  const bot = Array.isArray(params?.bot) ? params.bot[0] : params?.bot;

  if (!bot || !(bot in botSettings)) {
    notFound();
  }

  const { depth, depthRange, eloRange, rating, accuracy, name, skill, description } = botSettings[bot];

  const engineRef = useRef<Worker | null>(null);
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [evalScore, setEvalScore] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [showCheckmate, setShowCheckmate] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastGameResult, setLastGameResult] = useState<'white' | 'black' | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [gameHistory, setGameHistory] = useState<Chess[]>([new Chess()]);

  const makeEngineMove = (fen: string) => {
    console.log("Bot depth:", depth);
    setIsThinking(true);
    engineRef.current?.postMessage(`position fen ${fen}`);
    engineRef.current?.postMessage(`go depth ${depth}`);
  };

  useEffect(() => {
    engineRef.current = new Worker('/engine/stockfish.js');

    engineRef.current.onmessage = (event) => {
      const line = String(event.data);

      if (line.startsWith('bestmove')) {
        const best = line.split(' ')[1];
        setGame((g) => {
          const updated = new Chess(g.fen());
          const move = updated.move({ from: best.slice(0, 2), to: best.slice(2, 4) });
          if (move) {
            const newHistory = [...moveHistory.slice(0, currentMoveIndex), `${move.from}${move.to}`];
            setMoveHistory(newHistory);

            const newGameHistory = [...gameHistory.slice(0, currentMoveIndex + 1), updated];
            setGameHistory(newGameHistory);
            setCurrentMoveIndex(newGameHistory.length - 1);
          }
          return updated;
        });
        setIsThinking(false);
      }
      if (line.startsWith('info depth') && line.includes('score cp')) {
        const match = line.match(/score cp (-?\d+)/);
        if (match) setEvalScore(Number(match[1]) / 100);
      }
    };

    engineRef.current.postMessage('uci');
    engineRef.current.postMessage('isready');
    engineRef.current.postMessage(`setoption name Skill Level value ${skill}`);

    return () => engineRef.current?.terminate();
  }, [depth, skill]);

  const getLegalMovesForSquare = (square: Square) => {
    return game.moves({ square, verbose: true }).map((m: any) => m.to as Square);
  };

  useEffect(() => {
    if (game.isCheckmate()) {
      setShowCheckmate(true);
      const winnerColor = game.turn() === 'w' ? 'Black' : 'White';
      setWinner(winnerColor);
      setLastGameResult(game.turn() === 'w' ? 'black' : 'white');
    }
  }, [game]);

  const handleSquareClick = (square: Square) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setLegalMoves(getLegalMovesForSquare(square));
        return;
      }
      const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
      if (move) {
        const newGame = new Chess(game.fen());
        setGame(newGame);

        const newHistory = [...moveHistory.slice(0, currentMoveIndex), `${move.from}${move.to}`];
        setMoveHistory(newHistory);

        const newGameHistory = [...gameHistory.slice(0, currentMoveIndex + 1), newGame];
        setGameHistory(newGameHistory);
        setCurrentMoveIndex(newGameHistory.length - 1);

        setSelectedSquare(null);
        setLegalMoves([]);
        setTimeout(() => makeEngineMove(newGame.fen()), 300);
        return;
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        const moves = getLegalMovesForSquare(square);
        if (moves.length > 0) {
          setSelectedSquare(square);
          setLegalMoves(moves);
        }
      }
    }
  };

  const onDrop = (src: string, dst: string) => {
    const move = game.move({ from: src, to: dst, promotion: 'q' });
    if (!move) return false;
    const newGame = new Chess(game.fen());
    setGame(newGame);

    const newHistory = [...moveHistory.slice(0, currentMoveIndex), `${move.from}${move.to}`];
    setMoveHistory(newHistory);

    const newGameHistory = [...gameHistory.slice(0, currentMoveIndex + 1), newGame];
    setGameHistory(newGameHistory);
    setCurrentMoveIndex(newGameHistory.length - 1);

    setSelectedSquare(null);
    setLegalMoves([]);
    setTimeout(() => makeEngineMove(newGame.fen()), 300);
    return true;
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setGameHistory([newGame]);
    setIsThinking(false);
    setEvalScore(0);
    setCurrentMoveIndex(0);
    setSelectedSquare(null);
    setLegalMoves([]);
    setShowCheckmate(false);
    setWinner(null);
    setLastGameResult(null);
  };

  const goToMove = (index: number) => {
    if (index >= 0 && index < gameHistory.length) {
      setGame(gameHistory[index]);
      setCurrentMoveIndex(index);
    }
  };

  const goToPreviousMove = () => {
    if (currentMoveIndex > 0) {
      goToMove(currentMoveIndex - 1);
    }
  };

  const goToNextMove = () => {
    if (currentMoveIndex < gameHistory.length - 1) {
      goToMove(currentMoveIndex + 1);
    }
  };

  const getKingSquare = () => {
    if (!game) return null;
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = board[r][c];
        if (square && square.type === 'k' && square.color === game.turn() && game.isCheck()) {
          return `${String.fromCharCode(97 + c)}${8 - r}`;
        }
      }
    }
    return null;
  };

  const checkKingSquare = getKingSquare();

  const customSquareStyles = {
    ...(selectedSquare
      ? {
          [selectedSquare as Square]: { background: 'rgba(255,255,0,0.4)' },
          ...Object.fromEntries(
            legalMoves.map(sq => [sq as Square, { background: 'radial-gradient(circle, rgba(0, 191, 207, 0.8) 25%, transparent 25%)' }])
          ),
        }
      : {}),
    ...(checkKingSquare ? { [checkKingSquare as Square]: { background: 'rgba(255,0,0,0.6)' } } : {}),
  };

  const evalBarHeight = 240;
  const evalBarCenter = evalBarHeight / 2;
  const evalMax = 6;
  const evalScoreClamped = Math.max(Math.min(evalScore, evalMax), -evalMax);
  const evalBarWhite = evalScoreClamped > 0 ? evalBarCenter - (evalScoreClamped / evalMax) * evalBarCenter : evalBarCenter;
  const evalBarBlack = evalScoreClamped < 0 ? evalBarCenter + (Math.abs(evalScoreClamped) / evalMax) * evalBarCenter : evalBarCenter;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#818cf8]">{name}</h1>
            <p className="text-white/60">{description}</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-right">
              <div className="text-sm text-white/60">Depth</div>
              <div className="text-lg font-semibold text-[#818cf8]">{depth}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Skill Level</div>
              <div className="text-lg font-semibold text-[#818cf8]">{skill}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                onSquareClick={handleSquareClick}
                boardWidth={isMobile ? 320 : 480}
                arePiecesDraggable={!isThinking}
                boardOrientation="white"
                customBoardStyle={{ borderRadius: 16, boxShadow: '0 4px 32px #0004' }}
                customSquareStyles={customSquareStyles}
                animationDuration={150}
              />
            </div>
            <div className="flex gap-2 justify-center mt-4 w-full">
              <Button className="bg-[#23263a] text-white hover:bg-[#4f46e5]" onClick={resetGame}>New Game</Button>
              <Button className="bg-[#23263a] text-white hover:bg-[#4f46e5]" onClick={goToPreviousMove} disabled={currentMoveIndex === 0}>
                Previous Move
              </Button>
              <Button className="bg-[#23263a] text-white hover:bg-[#4f46e5]" onClick={goToNextMove} disabled={currentMoveIndex >= gameHistory.length - 1}>
                Next Move
              </Button>
              <Button className="bg-[#23263a] text-[#818cf8] border border-[#818cf8] hover:bg-[#4f46e5] hover:text-white" variant="outline">Analyze Position</Button>
            </div>
          </div>

          <div className="bg-[#181f2a] rounded-xl p-4">
            <h2 className="text-lg font-semibold text-[#818cf8] mb-4">Move History</h2>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {moveHistory.length === 0 ? (
                <div className="text-[#818cf8]">No moves yet.</div>
              ) : (
                moveHistory.map((move, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/90 cursor-pointer hover:text-[#818cf8]" onClick={() => goToMove(idx + 1)}>
                    <span className="text-[#818cf8]">{Math.floor(idx / 2) + 1}.</span>
                    <span className="font-mono">{move}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showCheckmate} onOpenChange={setShowCheckmate}>
        <DialogContent className="max-w-md w-full rounded-2xl p-8 bg-[#181f2a] border border-[#818cf8] text-center">
          <DialogHeader>
            <DialogTitle className={`text-3xl font-bold mb-2 ${lastGameResult === 'white' ? 'text-[#a78bfa]' : 'text-[#818cf8]'}`}>{`Checkmate! ${winner} wins!`}</DialogTitle>
            <DialogDescription className="text-lg mb-4">
              {lastGameResult === 'white'
                ? "Congratulations! You've checkmated the AI!"
                : 'The AI has checkmated you! Better luck next time!'}
            </DialogDescription>
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="flex justify-between w-full text-sm">
                <span className="font-semibold text-[#818cf8]">Opponent:</span>
                <span className="font-bold text-white">{name}</span>
              </div>
              <div className="flex justify-between w-full text-sm">
                <span className="font-semibold text-[#818cf8]">Your Rating:</span>
                <span className="font-bold text-white">{rating}</span>
              </div>
              <div className="flex justify-between w-full text-sm">
                <span className="font-semibold text-[#818cf8]">Accuracy:</span>
                <span className="font-bold text-[#a78bfa]">{accuracy}%</span>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-4 justify-center mt-4">
            <Button className="bg-[#a78bfa] hover:bg-[#818cf8] text-white font-bold px-6 py-2 rounded-lg" onClick={() => { resetGame(); setShowCheckmate(false); }}>New Game</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
