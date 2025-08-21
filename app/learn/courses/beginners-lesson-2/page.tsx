'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(mod => mod.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

export default function ChessNotationLesson() {
  const [currentNotation, setCurrentNotation] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [game, setGame] = useState(new Chess());

  const notationDemonstrations = [
    {
      name: "Piece Abbreviations",
      description: "Each piece has a specific letter abbreviation in algebraic notation.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "In algebraic notation, each piece is represented by a capital letter: K=King, Q=Queen, R=Rook, B=Bishop, N=Knight. Pawns have no letter - they are indicated by the square they move to.",
      moves: [
        { from: "e2", to: "e4", notation: "e4", description: "Pawn moves to e4 (no piece letter needed)" },
        { from: "g1", to: "f3", notation: "Nf3", description: "Knight moves to f3" },
        { from: "f1", to: "c4", notation: "Bc4", description: "Bishop moves to c4" }
      ],
      examples: [
        { piece: "K", name: "King", example: "Ke2" },
        { piece: "Q", name: "Queen", example: "Qd4" },
        { piece: "R", name: "Rook", example: "Re1" },
        { piece: "B", name: "Bishop", example: "Bc4" },
        { piece: "N", name: "Knight", example: "Nf3" },
        { piece: "", name: "Pawn", example: "e4" }
      ]
    },
    {
      name: "Square Coordinates",
      description: "The chess board uses a coordinate system with letters a-h and numbers 1-8.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "Each square is identified by a letter (a-h) and number (1-8). Letters go from left to right (a-h), numbers from bottom to top (1-8) from White's perspective. The bottom-left square is a1.",
      moves: [
        { from: "e2", to: "e4", notation: "e4", description: "Pawn moves from e2 to e4" },
        { from: "e7", to: "e5", notation: "e5", description: "Black pawn moves from e7 to e5" },
        { from: "g1", to: "f3", notation: "Nf3", description: "Knight moves from g1 to f3" }
      ],
      coordinates: [
        { square: "a1", description: "Bottom-left corner" },
        { square: "h1", description: "Bottom-right corner" },
        { square: "a8", description: "Top-left corner" },
        { square: "h8", description: "Top-right corner" },
        { square: "e4", description: "Center square" },
        { square: "d5", description: "Center square" }
      ]
    },
    {
      name: "Move Notation",
      description: "A complete move includes the piece letter and destination square.",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
      explanation: "Moves are written as: Piece Letter + Destination Square. For example, Nf3 means a knight moves to f3. If two pieces can move to the same square, additional information is added.",
      moves: [
        { from: "g1", to: "f3", notation: "Nf3", description: "Knight moves to f3" },
        { from: "b8", to: "c6", notation: "Nc6", description: "Black knight moves to c6" },
        { from: "f1", to: "c4", notation: "Bc4", description: "Bishop moves to c4" }
      ],
      moveExamples: [
        { notation: "e4", meaning: "Pawn moves to e4" },
        { notation: "Nf3", meaning: "Knight moves to f3" },
        { notation: "Bc4", meaning: "Bishop moves to c4" },
        { notation: "O-O", meaning: "Kingside castling" },
        { notation: "O-O-O", meaning: "Queenside castling" }
      ]
    },
    {
      name: "Special Moves",
      description: "Castling, captures, and check have special notation.",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
      explanation: "Special moves have unique notation: O-O for kingside castling, O-O-O for queenside castling, x for captures, + for check, # for checkmate. En passant and pawn promotion have special notation too.",
      moves: [
        { from: "e1", to: "g1", notation: "O-O", description: "Kingside castling" },
        { from: "f3", to: "e5", notation: "Nxe5", description: "Knight captures on e5" },
        { from: "e5", to: "d7", notation: "Nd7+", description: "Knight moves to d7 with check" }
      ],
      specialMoves: [
        { notation: "O-O", meaning: "Kingside castling" },
        { notation: "O-O-O", meaning: "Queenside castling" },
        { notation: "Nxe5", meaning: "Knight captures on e5" },
        { notation: "e8=Q", meaning: "Pawn promotes to queen" },
        { notation: "e5+", meaning: "Move with check" },
        { notation: "Qh8#", meaning: "Checkmate" }
      ]
    },
    {
      name: "Reading Games",
      description: "Learn to read and write complete chess games using notation.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "A complete game is written as a series of moves with numbers. Each move pair (White and Black) gets a number. For example: 1.e4 e5 2.Nf3 Nc6 means White plays e4, Black responds e5, then White plays Nf3, Black responds Nc6.",
      moves: [
        { from: "e2", to: "e4", notation: "1.e4", description: "White's first move" },
        { from: "e7", to: "e5", notation: "1...e5", description: "Black's first move" },
        { from: "g1", to: "f3", notation: "2.Nf3", description: "White's second move" },
        { from: "b8", to: "c6", notation: "2...Nc6", description: "Black's second move" }
      ],
      gameExample: [
        "1.e4 e5",
        "2.Nf3 Nc6", 
        "3.Bc4 Bc5",
        "4.c3 Nf6",
        "5.d3 d6"
      ]
    }
  ];

  // Reset game when notation changes
  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setCurrentMove(0);
  }, [currentNotation]);

  const nextNotation = () => {
    setCurrentNotation((prev) => (prev + 1) % notationDemonstrations.length);
  };

  const prevNotation = () => {
    setCurrentNotation((prev) => (prev - 1 + notationDemonstrations.length) % notationDemonstrations.length);
  };

  const nextMove = () => {
    if (currentMove < notationDemonstrations[currentNotation].moves.length - 1) {
      setCurrentMove(prev => prev + 1);
      animateMove(notationDemonstrations[currentNotation].moves[currentMove + 1]);
    }
  };

  const prevMove = () => {
    if (currentMove > 0) {
      setCurrentMove(prev => prev - 1);
      // Reset to previous position
      const newGame = new Chess(notationDemonstrations[currentNotation].fen);
      for (let i = 0; i < currentMove - 1; i++) {
        newGame.move(notationDemonstrations[currentNotation].moves[i]);
      }
      setGame(newGame);
    }
  };

  const animateMove = (move) => {
    if (!move) return;
    
    setIsAnimating(true);
    
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

  const resetNotation = () => {
    const newGame = new Chess(notationDemonstrations[currentNotation].fen);
    setGame(newGame);
    setCurrentMove(0);
  };

  const currentNotationData = notationDemonstrations[currentNotation];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Lesson 2: Understanding Chess Notation
          </h1>
          <p className="text-xl text-[var(--secondary-text)] max-w-3xl mx-auto">
            Master algebraic notation to read and write chess moves, understand piece abbreviations, and recognize special moves
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Interactive Chessboard */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-[var(--border)] dark:border-blue-800 flex flex-col justify-center items-center min-h-[500px]">
            <h3 className="text-xl font-bold mb-6 text-[var(--primary)] dark:text-blue-300 text-center">
              {currentNotationData.name}
            </h3>
            
            <div className="flex justify-center items-center mb-6">
              <ReactChessboard 
                position={game.fen()} 
                boardWidth={320}
                customBoardStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
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
                onClick={resetNotation}
                className="px-4 py-2 bg-[var(--card)]0 text-[var(--card-foreground)] rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={nextMove}
                disabled={currentMove >= currentNotationData.moves.length - 1 || isAnimating}
                className="px-4 py-2 bg-[var(--card)]0 text-[var(--card-foreground)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary)] transition-colors"
              >
                Next Move
              </button>
            </div>

            {/* Current Move Info */}
            {currentMove < currentNotationData.moves.length && (
              <div className="text-center">
                <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
                  Move {currentMove + 1}: {currentNotationData.moves[currentMove]?.notation} - {currentNotationData.moves[currentMove]?.description}
                </p>
              </div>
            )}
          </div>

          {/* Right: Theory and Explanation */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 border border-[var(--border)] dark:border-purple-800 flex flex-col justify-between min-h-[500px]">
            {/* Current Notation Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--card)]0 text-[var(--card-foreground)] rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                  {currentNotation + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--primary)] dark:text-blue-300">
                    {currentNotationData.name}
                  </h2>
                  <p className="text-[var(--primary)] dark:text-blue-400">
                    {currentNotationData.description}
                  </p>
                </div>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-3 text-[var(--card-foreground)] dark:text-gray-200">
                  Key Points:
                </h3>
                <p className="text-[var(--card-foreground)] dark:text-[var(--muted-foreground)] leading-relaxed">
                  {currentNotationData.explanation}
                </p>
              </div>

              {/* Notation Examples */}
              {currentNotationData.examples && (
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    📝 Piece Abbreviations:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {currentNotationData.examples.map((example, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-[var(--primary)] dark:text-blue-300">{example.name}:</span>
                        <span className="font-mono text-[var(--primary)] dark:text-blue-400">{example.example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Moves */}
              {currentNotationData.specialMoves && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    ⚡ Special Moves:
                  </h4>
                  <div className="space-y-1 text-sm">
                    {currentNotationData.specialMoves.map((move, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-mono text-[var(--accent)] dark:text-purple-300">{move.notation}:</span>
                        <span className="text-[var(--accent)] dark:text-purple-400">{move.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Example */}
              {currentNotationData.gameExample && (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    🎮 Game Example:
                  </h4>
                  <div className="font-mono text-sm text-[var(--accent)] dark:text-green-300">
                    {currentNotationData.gameExample.map((move, index) => (
                      <div key={index}>{move}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={prevNotation}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-[var(--card-foreground)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  Previous
                </button>
                <div className="text-center">
                  <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
                    {currentNotation + 1} of {notationDemonstrations.length}
                  </span>
                </div>
                <button 
                  onClick={nextNotation}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-[var(--card-foreground)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  Next
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-2">
                {notationDemonstrations.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentNotation 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 scale-125 shadow-md' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-[var(--card)]0'
                    }`}
                    onClick={() => setCurrentNotation(index)}
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
