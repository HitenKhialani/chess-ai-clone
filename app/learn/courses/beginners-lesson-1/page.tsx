'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

export default function HowPiecesMoveLesson() {
  const [currentPiece, setCurrentPiece] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [game, setGame] = useState(new Chess());

  const pieceDemonstrations = [
    {
      name: "Pawn",
      description: "Pawns move forward one square at a time. On their first move, they can move two squares. Pawns capture diagonally.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "Pawns are the foot soldiers of chess. They move forward and capture diagonally. They can only move backward when they reach the opposite end of the board and promote to a stronger piece.",
      moves: [
        { from: "e2", to: "e4", description: "Pawn moves two squares forward on first move" },
        { from: "e4", to: "e5", description: "Pawn moves one square forward" },
        { from: "e5", to: "f6", description: "Pawn captures diagonally" }
      ],
      movementDots: [
        { square: "e4", color: "blue" },
        { square: "e5", color: "blue" },
        { square: "d3", color: "red" },
        { square: "f3", color: "red" }
      ]
    },
    {
      name: "Knight",
      description: "Knights move in an L-shape: 2 squares in one direction, then 1 square perpendicular to that direction.",
      fen: "4k3/8/8/8/4N4/8/8/4K3 w - - 0 1",
      explanation: "Knights are the only pieces that can jump over other pieces. They move in a distinctive L-pattern and are excellent for controlling the center of the board.",
      moves: [
        { from: "e4", to: "f6", description: "Knight moves in L-shape: 2 right, 1 up" },
        { from: "f6", to: "d5", description: "Knight moves in L-shape: 2 left, 1 down" },
        { from: "d5", to: "c3", description: "Knight moves in L-shape: 1 left, 2 down" }
      ],
      movementDots: [
        { square: "d6", color: "blue" },
        { square: "f6", color: "blue" },
        { square: "c5", color: "blue" },
        { square: "g5", color: "blue" },
        { square: "c3", color: "blue" },
        { square: "g3", color: "blue" },
        { square: "d2", color: "blue" },
        { square: "f2", color: "blue" }
      ]
    },
    {
      name: "Bishop",
      description: "Bishops move diagonally any number of squares. They stay on the same color squares throughout the game.",
      fen: "4k3/8/8/8/4B4/8/8/4K3 w - - 0 1",
      explanation: "Bishops are long-range pieces that move diagonally. Each bishop starts on a different color and can never change colors. They work best when they have open diagonals.",
      moves: [
        { from: "e4", to: "b7", description: "Bishop moves diagonally to capture" },
        { from: "b7", to: "d5", description: "Bishop moves diagonally to center" },
        { from: "d5", to: "h1", description: "Bishop moves diagonally to corner" }
      ],
      movementDots: [
        { square: "d5", color: "blue" },
        { square: "c6", color: "blue" },
        { square: "b7", color: "blue" },
        { square: "a8", color: "blue" },
        { square: "f5", color: "blue" },
        { square: "g6", color: "blue" },
        { square: "h7", color: "blue" },
        { square: "d3", color: "blue" },
        { square: "c2", color: "blue" },
        { square: "b1", color: "blue" },
        { square: "f3", color: "blue" },
        { square: "g2", color: "blue" },
        { square: "h1", color: "blue" }
      ]
    },
    {
      name: "Rook",
      description: "Rooks move horizontally and vertically any number of squares. They are powerful in open files.",
      fen: "4k3/8/8/8/4R4/8/8/4K3 w - - 0 1",
      explanation: "Rooks are the heavy artillery of chess. They move in straight lines and are most powerful when they control open files (columns with no pawns).",
      moves: [
        { from: "e4", to: "e8", description: "Rook moves vertically to back rank" },
        { from: "e8", to: "a8", description: "Rook moves horizontally to capture" },
        { from: "a8", to: "a4", description: "Rook moves vertically to center" }
      ],
      movementDots: [
        { square: "e5", color: "blue" },
        { square: "e6", color: "blue" },
        { square: "e7", color: "blue" },
        { square: "e8", color: "blue" },
        { square: "e3", color: "blue" },
        { square: "e2", color: "blue" },
        { square: "e1", color: "blue" },
        { square: "d4", color: "blue" },
        { square: "c4", color: "blue" },
        { square: "b4", color: "blue" },
        { square: "a4", color: "blue" },
        { square: "f4", color: "blue" },
        { square: "g4", color: "blue" },
        { square: "h4", color: "blue" }
      ]
    },
    {
      name: "Queen",
      description: "The queen combines the moves of both rook and bishop. She can move any number of squares in any direction.",
      fen: "4k3/8/8/8/4Q4/8/8/4K3 w - - 0 1",
      explanation: "The queen is the most powerful piece on the board. She can move like a rook and a bishop combined. However, she should be developed carefully to avoid being attacked by minor pieces.",
      moves: [
        { from: "e4", to: "e8", description: "Queen moves like a rook - vertically" },
        { from: "e8", to: "a4", description: "Queen moves like a bishop - diagonally" },
        { from: "a4", to: "h4", description: "Queen moves like a rook - horizontally" }
      ],
      movementDots: [
        // Rook moves
        { square: "e5", color: "blue" },
        { square: "e6", color: "blue" },
        { square: "e7", color: "blue" },
        { square: "e8", color: "blue" },
        { square: "e3", color: "blue" },
        { square: "e2", color: "blue" },
        { square: "e1", color: "blue" },
        { square: "d4", color: "blue" },
        { square: "c4", color: "blue" },
        { square: "b4", color: "blue" },
        { square: "a4", color: "blue" },
        { square: "f4", color: "blue" },
        { square: "g4", color: "blue" },
        { square: "h4", color: "blue" },
        // Bishop moves
        { square: "d5", color: "blue" },
        { square: "c6", color: "blue" },
        { square: "b7", color: "blue" },
        { square: "a8", color: "blue" },
        { square: "f5", color: "blue" },
        { square: "g6", color: "blue" },
        { square: "h7", color: "blue" },
        { square: "d3", color: "blue" },
        { square: "c2", color: "blue" },
        { square: "b1", color: "blue" },
        { square: "f3", color: "blue" },
        { square: "g2", color: "blue" },
        { square: "h1", color: "blue" }
      ]
    },
    {
      name: "King",
      description: "The king moves one square in any direction. The goal is to checkmate the opponent's king.",
      fen: "4k3/8/8/8/4K4/8/8/8 w - - 0 1",
      explanation: "The king is the most important piece. You lose if your king is checkmated. The king should usually be kept safe, often by castling early in the game.",
      moves: [
        { from: "e4", to: "e5", description: "King moves one square forward" },
        { from: "e5", to: "f5", description: "King moves one square right" },
        { from: "f5", to: "f4", description: "King moves one square down" }
      ],
      movementDots: [
        { square: "d5", color: "blue" },
        { square: "e5", color: "blue" },
        { square: "f5", color: "blue" },
        { square: "d4", color: "blue" },
        { square: "f4", color: "blue" },
        { square: "d3", color: "blue" },
        { square: "e3", color: "blue" },
        { square: "f3", color: "blue" }
      ]
    }
  ];

  // Reset game when piece changes
  useEffect(() => {
    const newGame = new Chess();
    
    // Clear the board and set up the demonstration
    newGame.clear();
    
    // Add kings (required for valid position)
    newGame.put({ type: 'k', color: 'w' }, 'e1');
    newGame.put({ type: 'k', color: 'b' }, 'e8');
    
    // Add the demonstration piece based on current piece
    const pieceMap = {
      0: { type: 'p', color: 'w' }, // Pawn
      1: { type: 'n', color: 'w' }, // Knight
      2: { type: 'b', color: 'w' }, // Bishop
      3: { type: 'r', color: 'w' }, // Rook
      4: { type: 'q', color: 'w' }, // Queen
      5: { type: 'k', color: 'w' }  // King (already placed)
    };
    
    const piece = pieceMap[currentPiece];
    if (piece && currentPiece !== 5) { // Don't add king twice
      newGame.put(piece, 'e4');
    }
    
    setGame(newGame);
    setCurrentMove(0);
  }, [currentPiece]);

  const nextPiece = () => {
    setCurrentPiece((prev) => (prev + 1) % pieceDemonstrations.length);
  };

  const prevPiece = () => {
    setCurrentPiece((prev) => (prev - 1 + pieceDemonstrations.length) % pieceDemonstrations.length);
  };

  const nextMove = () => {
    if (currentMove < pieceDemonstrations[currentPiece].moves.length - 1) {
      setCurrentMove(prev => prev + 1);
      animateMove(pieceDemonstrations[currentPiece].moves[currentMove + 1]);
    }
  };

  const prevMove = () => {
    if (currentMove > 0) {
      setCurrentMove(prev => prev - 1);
      // Reset to previous position
      const newGame = new Chess(pieceDemonstrations[currentPiece].fen);
      for (let i = 0; i < currentMove - 1; i++) {
        newGame.move(pieceDemonstrations[currentPiece].moves[i]);
      }
      setGame(newGame);
    }
  };

  const animateMove = (move) => {
    if (!move) return;
    
    setIsAnimating(true);
    
    // Add a small delay for visual effect
    setTimeout(() => {
      try {
        const result = game.move(move);
        if (result) {
          setGame(new Chess(game.fen()));
        }
      } catch (error) {
        console.log('Invalid move:', error);
      }
      setIsAnimating(false);
    }, 300);
  };

  const resetPiece = () => {
    const newGame = new Chess(pieceDemonstrations[currentPiece].fen);
    setGame(newGame);
    setCurrentMove(0);
  };

  const currentPieceData = pieceDemonstrations[currentPiece];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Lesson 1: How Pieces Move
          </h1>
          <p className="text-xl text-[var(--secondary-text)] max-w-3xl mx-auto">
            Learn the movement patterns of all chess pieces with interactive demonstrations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Interactive Chessboard */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 border border-[var(--border)] dark:border-green-800 flex flex-col justify-center items-center min-h-[500px]">
            <h3 className="text-xl font-bold mb-6 text-[var(--accent)] dark:text-green-300 text-center">
              {currentPieceData.name} Movement
            </h3>
            
            <div className="flex justify-center items-center mb-6">
              <ReactChessboard 
                position={game.fen()} 
                boardWidth={320}
                customBoardStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                customSquares={{
                  ...currentPieceData.movementDots.reduce((acc, dot) => ({
                    ...acc,
                    [dot.square]: {
                      backgroundColor: dot.color === "blue" ? "rgba(59, 130, 246, 0.5)" : "rgba(239, 68, 68, 0.5)",
                      borderRadius: "50%"
                    }
                  }), {})
                }}
              />
            </div>

            <div className="text-center mb-4">
              <p className="text-[var(--accent)] dark:text-green-300 text-sm mb-2">
                Blue dots show where the {currentPieceData.name.toLowerCase()} can move
              </p>
              {currentPieceData.name === "Pawn" && (
                <p className="text-[var(--destructive)] dark:text-red-400 text-xs">
                  Red dots show diagonal capture moves
                </p>
              )}
            </div>

            {/* Animation Controls */}
            <div className="flex justify-center gap-2 mb-4">
              <button 
                onClick={prevMove}
                disabled={currentMove === 0 || isAnimating}
                className="px-4 py-2 bg-[var(--card)]0 text-[var(--card-foreground)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary)] transition-colors"
              >
                Previous Move
              </button>
              <button 
                onClick={resetPiece}
                className="px-4 py-2 bg-[var(--card)]0 text-[var(--card-foreground)] rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={nextMove}
                disabled={currentMove >= currentPieceData.moves.length - 1 || isAnimating}
                className="px-4 py-2 bg-[var(--card)]0 text-[var(--card-foreground)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary)] transition-colors"
              >
                Next Move
              </button>
            </div>

            {/* Current Move Info */}
            {currentMove < currentPieceData.moves.length && (
              <div className="text-center">
                <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
                  Move {currentMove + 1}: {currentPieceData.moves[currentMove]?.description}
                </p>
              </div>
            )}
          </div>

          {/* Right: Theory and Explanation */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-[var(--border)] dark:border-blue-800 flex flex-col justify-between min-h-[500px]">
            {/* Current Piece Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--card)]0 text-[var(--card-foreground)] rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                  {currentPiece + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--primary)] dark:text-blue-300">
                    {currentPieceData.name}
                  </h2>
                  <p className="text-[var(--primary)] dark:text-blue-400">
                    {currentPieceData.description}
                  </p>
                </div>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-3 text-[var(--card-foreground)] dark:text-gray-200">
                  Key Points:
                </h3>
                <p className="text-[var(--card-foreground)] dark:text-[var(--muted-foreground)] leading-relaxed">
                  {currentPieceData.explanation}
                </p>
              </div>

              {/* Movement Tips */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  💡 Movement Tips:
                </h4>
                <ul className="text-sm text-[var(--accent)] dark:text-green-300 space-y-1">
                  {currentPieceData.name === "Pawn" && (
                    <>
                      <li>• Pawns can only move forward</li>
                      <li>• First move: 1 or 2 squares</li>
                      <li>• Captures diagonally only</li>
                    </>
                  )}
                  {currentPieceData.name === "Knight" && (
                    <>
                      <li>• Only piece that can jump over others</li>
                      <li>• Moves in L-shape: 2+1 or 1+2</li>
                      <li>• Can control 8 squares from center</li>
                    </>
                  )}
                  {currentPieceData.name === "Bishop" && (
                    <>
                      <li>• Moves diagonally any distance</li>
                      <li>• Stays on same color squares</li>
                      <li>• Works best with open diagonals</li>
                    </>
                  )}
                  {currentPieceData.name === "Rook" && (
                    <>
                      <li>• Moves horizontally and vertically</li>
                      <li>• Most powerful on open files</li>
                      <li>• Can control entire ranks and files</li>
                    </>
                  )}
                  {currentPieceData.name === "Queen" && (
                    <>
                      <li>• Combines rook and bishop moves</li>
                      <li>• Most powerful piece</li>
                      <li>• Develop carefully to avoid attacks</li>
                    </>
                  )}
                  {currentPieceData.name === "King" && (
                    <>
                      <li>• Moves one square in any direction</li>
                      <li>• Must be protected at all times</li>
                      <li>• Goal is to checkmate opponent's king</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Navigation Controls */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={prevPiece}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-[var(--card-foreground)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  Previous
                </button>
                <div className="text-center">
                  <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
                    {currentPiece + 1} of {pieceDemonstrations.length}
                  </span>
                </div>
                <button 
                  onClick={nextPiece}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-[var(--card-foreground)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  Next
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-2">
                {pieceDemonstrations.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentPiece 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 scale-125 shadow-md' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-[var(--card)]0'
                    }`}
                    onClick={() => setCurrentPiece(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 