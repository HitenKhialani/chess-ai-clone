'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactChessboard = dynamic(() => import('react-chessboard').then(mod => mod.Chessboard), { ssr: false });
import { Chess } from 'chess.js';

export default function BasicRulesLesson() {
  const [currentRule, setCurrentRule] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [game, setGame] = useState(new Chess());

  const ruleDemonstrations = [
    {
      name: "Check",
      description: "When a king is under attack, it is in check and must be defended.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "Check occurs when a piece attacks the enemy king. The king must move out of check, block the attack, or capture the attacking piece. You cannot make any other move when your king is in check.",
      moves: [
        { from: "e2", to: "e4", description: "White moves pawn to e4" },
        { from: "e7", to: "e5", description: "Black moves pawn to e5" },
        { from: "d1", to: "h5", description: "White queen attacks king - CHECK!" }
      ],
      checkExamples: [
        { position: "Check by Queen", example: "Qh5+ attacks king" },
        { position: "Check by Knight", example: "Nf7+ attacks king" },
        { position: "Check by Bishop", example: "Bc4+ attacks king" }
      ]
    },
    {
      name: "Checkmate",
      description: "When a king is in check and cannot escape, it is checkmate - the game is over.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "Checkmate occurs when a king is in check and there is no legal move to escape. The game ends immediately when checkmate occurs. The player whose king is checkmated loses.",
      moves: [
        { from: "e2", to: "e4", description: "White moves pawn" },
        { from: "e7", to: "e5", description: "Black moves pawn" },
        { from: "d1", to: "h5", description: "White queen attacks" },
        { from: "g7", to: "g6", description: "Black blocks with pawn" },
        { from: "h5", to: "xf7", description: "White queen captures - CHECKMATE!" }
      ],
      checkmateExamples: [
        { position: "Scholar's Mate", example: "Qxf7# (4 moves)" },
        { position: "Fool's Mate", example: "Qh4# (2 moves)" },
        { position: "Back Rank Mate", example: "Qh8# (back rank)" }
      ]
    },
    {
      name: "Stalemate",
      description: "When a player has no legal moves but their king is not in check, it is stalemate - a draw.",
      fen: "k7/8/8/8/8/8/8/7K w - - 0 1",
      explanation: "Stalemate occurs when a player has no legal moves but their king is not in check. This results in a draw. Stalemate is often used as a defensive technique to save a lost position.",
      moves: [
        { from: "h1", to: "h2", description: "White king moves" },
        { from: "a8", to: "a7", description: "Black king moves" },
        { from: "h2", to: "h3", description: "White king moves" },
        { from: "a7", to: "a8", description: "Black king moves - STALEMATE!" }
      ],
      stalemateExamples: [
        { position: "King vs King", example: "No legal moves" },
        { position: "King vs King + Pawn", example: "Pawn blocked" },
        { position: "King vs King + Bishop", example: "Bishop trapped" }
      ]
    },
    {
      name: "Draw Conditions",
      description: "There are several ways a chess game can end in a draw.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "A draw can occur through stalemate, insufficient material, threefold repetition, fifty-move rule, or mutual agreement. Understanding draw conditions is crucial for both winning and defending.",
      moves: [
        { from: "g1", to: "f3", description: "White knight moves" },
        { from: "b8", to: "c6", description: "Black knight moves" },
        { from: "f3", to: "g1", description: "White knight returns" },
        { from: "c6", to: "b8", description: "Black knight returns - REPETITION!" }
      ],
      drawConditions: [
        { condition: "Stalemate", description: "No legal moves, king not in check" },
        { condition: "Insufficient Material", description: "Cannot checkmate (K vs K, K vs K+B, etc.)" },
        { condition: "Threefold Repetition", description: "Same position occurs three times" },
        { condition: "Fifty-Move Rule", description: "50 moves without capture or pawn move" },
        { condition: "Mutual Agreement", description: "Both players agree to draw" }
      ]
    },
    {
      name: "Special Rules",
      description: "Learn about castling, en passant, and pawn promotion.",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      explanation: "Chess has several special rules: castling (king and rook move together), en passant (pawn captures diagonally after opponent's two-square pawn move), and pawn promotion (pawn becomes any piece when reaching the opposite end).",
      moves: [
        { from: "e1", to: "g1", description: "Kingside castling - O-O" },
        { from: "e8", to: "c8", description: "Queenside castling - O-O-O" },
        { from: "e2", to: "e4", description: "Pawn moves two squares" },
        { from: "d4", to: "e3", description: "En passant capture" }
      ],
      specialRules: [
        { rule: "Castling", description: "King moves two squares toward rook, rook jumps over" },
        { rule: "En Passant", description: "Pawn captures diagonally after opponent's two-square move" },
        { rule: "Pawn Promotion", description: "Pawn becomes any piece when reaching the 8th rank" },
        { rule: "Check", description: "King is under attack and must be defended" },
        { rule: "Checkmate", description: "King is in check with no escape - game over" }
      ]
    }
  ];

  // Reset game when rule changes
  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setCurrentMove(0);
  }, [currentRule]);

  const nextRule = () => {
    setCurrentRule((prev) => (prev + 1) % ruleDemonstrations.length);
  };

  const prevRule = () => {
    setCurrentRule((prev) => (prev - 1 + ruleDemonstrations.length) % ruleDemonstrations.length);
  };

  const nextMove = () => {
    if (currentMove < ruleDemonstrations[currentRule].moves.length - 1) {
      setCurrentMove(prev => prev + 1);
      animateMove(ruleDemonstrations[currentRule].moves[currentMove + 1]);
    }
  };

  const prevMove = () => {
    if (currentMove > 0) {
      setCurrentMove(prev => prev - 1);
      // Reset to previous position
      const newGame = new Chess(ruleDemonstrations[currentRule].fen);
      for (let i = 0; i < currentMove - 1; i++) {
        newGame.move(ruleDemonstrations[currentRule].moves[i]);
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

  const resetRule = () => {
    const newGame = new Chess(ruleDemonstrations[currentRule].fen);
    setGame(newGame);
    setCurrentMove(0);
  };

  const currentRuleData = ruleDemonstrations[currentRule];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] px-4 py-10">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Lesson 3: Basic Rules & Objectives
          </h1>
          <p className="text-xl text-[var(--secondary-text)] max-w-3xl mx-auto">
            Learn the essential rules of chess including check, checkmate, stalemate, and various draw conditions
          </p>
      </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Interactive Chessboard */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 border border-[var(--border)] dark:border-green-800 flex flex-col justify-center items-center min-h-[500px]">
            <h3 className="text-xl font-bold mb-6 text-[var(--accent)] dark:text-green-300 text-center">
              {currentRuleData.name}
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
                className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent)] transition-colors"
              >
                Previous Move
              </button>
              <button 
                onClick={resetRule}
                className="px-4 py-2 bg-[var(--card)]0 text-[var(--card-foreground)] rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={nextMove}
                disabled={currentMove >= currentRuleData.moves.length - 1 || isAnimating}
                className="px-4 py-2 bg-[var(--accent)] text-[var(--card-foreground)] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent)] transition-colors"
              >
                Next Move
              </button>
            </div>

            {/* Current Move Info */}
            {currentMove < currentRuleData.moves.length && (
              <div className="text-center">
                <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
                  Move {currentMove + 1}: {currentRuleData.moves[currentMove]?.description}
                </p>
              </div>
            )}
          </div>

          {/* Right: Theory and Explanation */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-8 border border-[var(--border)] dark:border-orange-800 flex flex-col justify-between min-h-[500px]">
            {/* Current Rule Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[var(--accent)] text-[var(--card-foreground)] rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                  {currentRule + 1}
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-[var(--accent)] dark:text-green-300">
                    {currentRuleData.name}
                </h2>
                  <p className="text-[var(--accent)] dark:text-green-400">
                    {currentRuleData.description}
                  </p>
                </div>
              </div>
              
              <div className="bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-3 text-[var(--card-foreground)] dark:text-gray-200">
                  Key Points:
                </h3>
                <p className="text-[var(--card-foreground)] dark:text-[var(--muted-foreground)] leading-relaxed">
                  {currentRuleData.explanation}
                </p>
            </div>

              {/* Check Examples */}
              {currentRuleData.checkExamples && (
                <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    ⚔️ Check Examples:
              </h4>
                  <div className="space-y-1 text-sm">
                    {currentRuleData.checkExamples.map((example, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-[var(--destructive)] dark:text-red-300">{example.position}:</span>
                        <span className="font-mono text-[var(--destructive)] dark:text-red-400">{example.example}</span>
                      </div>
                    ))}
              </div>
            </div>
              )}

              {/* Checkmate Examples */}
              {currentRuleData.checkmateExamples && (
                <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    👑 Checkmate Examples:
                  </h4>
                  <div className="space-y-1 text-sm">
                    {currentRuleData.checkmateExamples.map((example, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-[var(--destructive)] dark:text-red-300">{example.position}:</span>
                        <span className="font-mono text-[var(--destructive)] dark:text-red-400">{example.example}</span>
            </div>
                    ))}
          </div>
        </div>
              )}

              {/* Draw Conditions */}
              {currentRuleData.drawConditions && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    🤝 Draw Conditions:
                  </h4>
                  <div className="space-y-1 text-sm">
                    {currentRuleData.drawConditions.map((condition, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-yellow-700 dark:text-yellow-300">{condition.condition}:</span>
                        <span className="text-yellow-600 dark:text-yellow-400">{condition.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Rules */}
              {currentRuleData.specialRules && (
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    ⚡ Special Rules:
                  </h4>
                  <div className="space-y-1 text-sm">
                    {currentRuleData.specialRules.map((rule, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-[var(--primary)] dark:text-blue-300">{rule.rule}:</span>
                        <span className="text-[var(--primary)] dark:text-blue-400">{rule.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                </div>
                
            {/* Navigation Controls */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={prevRule}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-[var(--card-foreground)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  Previous
                </button>
                <div className="text-center">
                  <span className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)]">
                    {currentRule + 1} of {ruleDemonstrations.length}
                  </span>
                </div>
                <button 
                  onClick={nextRule}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-[var(--card-foreground)] rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  Next
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-2">
                {ruleDemonstrations.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentRule 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 scale-125 shadow-md' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-[var(--card)]0'
                    }`}
                    onClick={() => setCurrentRule(index)}
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
