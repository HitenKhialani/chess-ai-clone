import { useEffect, useState } from "react";
import PuzzleBoard from "./components/PuzzleBoard";
import { generatePuzzle } from "./engine/puzzleGenerator";

export default function PuzzlePage() {
  const [fen, setFen] = useState(null);
  const [solution, setSolution] = useState(null);

  const loadPuzzle = async () => {
    const endgameFEN = "8/8/8/3k4/4P3/8/3K4/8 w - - 0 1"; // example
    const puzzle = await generatePuzzle(endgameFEN);
    if (puzzle) {
      setFen(puzzle.fen);
      setSolution(puzzle.bestMove);
    }
  };

  useEffect(() => {
    loadPuzzle();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Puzzle Section</h1>
      {fen && (
        <PuzzleBoard
          fen={fen}
          onMove={(move) => {
            if (move === solution) alert("✅ Correct!");
            else alert("❌ Try Again!");
          }}
        />
      )}
    </div>
  );
}