"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import { PuzzleBoard } from "@/components/puzzle-board";
import { classNames } from "@/lib/utils";
import { toast } from "sonner";

interface GrandmasterPuzzle {
  id: number;
  fen: string;
  moves: string[];
  description: string;
  rating: number;
  keyIdeas: string[];
}

type GrandmasterPuzzles = {
  [key: string]: GrandmasterPuzzle[];
};

// Sample puzzle data - in a real app this would come from a database
const grandmasterPuzzles: GrandmasterPuzzles = {
  Carlsen: [
    {
      id: 1,
      fen: "r1bqk2r/pp2bppp/2n1pn2/3p4/3P4/2NB1N2/PPP2PPP/R1BQ1RK1 w kq - 0 1",
      moves: ["Nxe5", "Nxe5", "d4", "Nc6"],
      description: "From Carlsen vs Karjakin, World Championship 2016",
      rating: 2400,
      keyIdeas: ["Pin", "Double attack"],
    },
    // Add more Carlsen puzzles here
  ],
  Kasparov: [
    {
      id: 1,
      fen: "r2qk2r/ppp2ppp/2n1bP2/2b5/2p5/2N5/PPP2PPP/R1BQR1K1 w kq - 0 1",
      moves: ["Rxe6", "fxe6", "Qd7+", "Kf8", "Qxf7#"],
      description: "From Kasparov vs Karpov, World Championship 1985",
      rating: 2350,
      keyIdeas: ["Sacrifice", "Mate threat"],
    },
    // Add more Kasparov puzzles here
  ],
  Fischer: [
    {
      id: 1,
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
      moves: ["Bxf7+", "Kxf7", "Nxe5+", "Ke8", "Nxc6"],
      description: "From Fischer vs Spassky, World Championship 1972",
      rating: 2500,
      keyIdeas: ["King safety", "Material advantage"],
    },
    // Add more Fischer puzzles here
  ],
};

export default function GrandmasterPuzzles() {
  const [selectedGM, setSelectedGM] = useState(Object.keys(grandmasterPuzzles)[0]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  const currentPuzzles = grandmasterPuzzles[selectedGM] || [];
  const currentPuzzle = currentPuzzles[currentPuzzleIndex];

  // If data is not loaded yet, show loading state
  if (!currentPuzzle || !selectedGM) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl">Loading puzzle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Grandmaster Puzzles</h1>
      
      <div className="max-w-7xl mx-auto">
        <Tab.Group onChange={(index: number) => {
          const newGM = Object.keys(grandmasterPuzzles)[index];
          setSelectedGM(newGM);
          setCurrentPuzzleIndex(0);
        }}>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1 mb-8">
            {Object.keys(grandmasterPuzzles).map((gm) => (
              <Tab
                key={gm}
                className={({ selected }: { selected: boolean }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-cyan-600 text-white shadow"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  )
                }
              >
                {gm}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {Object.keys(grandmasterPuzzles).map((gm) => (
              <Tab.Panel key={gm} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex justify-center">
                    <PuzzleBoard
                      fen={currentPuzzle.fen}
                      moves={currentPuzzle.moves}
                      onComplete={() => {
                        toast.success("Great job! You solved the puzzle!");
                        // Optionally advance to next puzzle after a delay
                        setTimeout(() => {
                          if (currentPuzzleIndex < currentPuzzles.length - 1) {
                            setCurrentPuzzleIndex(currentPuzzleIndex + 1);
                          }
                        }, 1500);
                      }}
                      onFail={() => {
                        toast.error("That's not the correct move. Try again!");
                      }}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-800 rounded-lg p-6">
                      <h2 className="text-xl font-semibold mb-4">Puzzle Information</h2>
                      <div className="space-y-4">
                        <p><span className="text-cyan-400">Description:</span> {currentPuzzle.description}</p>
                        <p><span className="text-cyan-400">Rating:</span> {currentPuzzle.rating}</p>
                        <p><span className="text-cyan-400">Key Ideas:</span> {currentPuzzle.keyIdeas.join(", ")}</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentPuzzleIndex(Math.max(0, currentPuzzleIndex - 1))}
                        disabled={currentPuzzleIndex === 0}
                        className="px-4 py-2 bg-cyan-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-700"
                      >
                        Previous Puzzle
                      </button>
                      <button
                        onClick={() => setCurrentPuzzleIndex(Math.min(currentPuzzles.length - 1, currentPuzzleIndex + 1))}
                        disabled={currentPuzzleIndex === currentPuzzles.length - 1}
                        className="px-4 py-2 bg-cyan-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-700"
                      >
                        Next Puzzle
                      </button>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 