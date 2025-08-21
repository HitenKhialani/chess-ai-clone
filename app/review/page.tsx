"use client";

import GameReview from "@/components/GameReview";
import AnalysisLoadingBuffer from "@/components/AnalysisLoadingBuffer";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { analyzeMovesLocally } from "@/app/lib/stockfish";
import { Chess } from "chess.js";

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const movesParam = searchParams.get("moves");
  const resultParam = searchParams.get("result");
  const isViewingExisting = searchParams.get("existing") === "true";
  let moveHistory: string[] = [];
  
  // Determine game result from move history if not provided
  const determineGameResult = (moves: string[]): "win" | "loss" | "draw" => {
    if (resultParam === "white") return "win";
    if (resultParam === "black") return "loss";
    if (resultParam === "draw") return "draw";
    
    if (moves.length === 0) return "draw";
    
    const lastMove = moves[moves.length - 1];
    
    // Check for checkmate
    if (lastMove.includes('#')) {
      if (moves.length % 2 === 0) {
        return "loss"; // User (White) lost
      } else {
        return "win"; // User (White) won
      }
    }
    
    // Check for draw
    if (lastMove.includes('1/2-1/2')) {
      return "draw";
    }
    
    // Check for resignation
    if (lastMove.includes('1-0')) {
      return moves.length % 2 === 1 ? "win" : "loss";
    }
    if (lastMove.includes('0-1')) {
      return moves.length % 2 === 1 ? "loss" : "win";
    }
    
    return "draw";
  };
  
  try {
    if (movesParam) moveHistory = JSON.parse(decodeURIComponent(movesParam));
  } catch {
    moveHistory = [];
  }
  
  let gameResult: "win" | "loss" | "draw" = determineGameResult(moveHistory);

  const [analysis, setAnalysis] = useState<any[] | undefined>(undefined);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  const [opening, setOpening] = useState<string | undefined>(undefined);
  const [lessons, setLessons] = useState<any[] | undefined>(undefined);
  const [keyMistakes, setKeyMistakes] = useState<string[] | undefined>(undefined);
  const [magnusSuggestion, setMagnusSuggestion] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  
  // Check if this game was already saved (persist across refreshes)
  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('savedGames') || '[]');
    const gameKey = `${movesParam}-${gameResult}`;
    
    if (isViewingExisting) {
      setGameSaved(true);
      console.log('Viewing existing game, skipping save');
    } else if (savedGames.includes(gameKey)) {
      setGameSaved(true);
    }
    
    console.log('Saved games in localStorage:', savedGames);
    console.log('Current game key:', gameKey);
    console.log('Game already saved:', savedGames.includes(gameKey));
    console.log('Viewing existing game:', isViewingExisting);
  }, [movesParam, gameResult, isViewingExisting]);

  useEffect(() => {
    if (moveHistory.length > 0) {
      // Check if analysis is already cached
      const analysisKey = `analysis-${movesParam}`;
      const cachedAnalysis = localStorage.getItem(analysisKey);
      let shouldUseCache = false;
      
      if (cachedAnalysis) {
        console.log('Found cached analysis, checking validity...');
        try {
          const data = JSON.parse(cachedAnalysis);
          // Check if the cached data has a timestamp and is not too old (optional)
          const cacheAge = data.timestamp ? Date.now() - data.timestamp : 0;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (cacheAge > maxAge) {
            console.log('Cached analysis is too old, will regenerate');
            localStorage.removeItem(analysisKey);
          } else {
            console.log('Using cached analysis');
            setAnalysis(data.analysis || data);
            setAccuracy(data.accuracy);
            setLoading(false);
            shouldUseCache = true;
          }
        } catch (error) {
          console.error('Error parsing cached analysis:', error);
          localStorage.removeItem(analysisKey);
        }
      }
      
      // Only perform fresh analysis if we don't have valid cached data and haven't started analysis yet
      if (!shouldUseCache && !analysisStarted) {
        console.log('Performing fresh analysis');
        setLoading(true);
        setAnalysisStarted(true);
        
        // Use client-side analysis with fixed depth for consistency
        analyzeMovesLocally(moveHistory, Chess, 10)
        .then((data) => {
          // Cache the analysis result BEFORE setting state
          const analysisKey = `analysis-${movesParam}`;
          const dataWithTimestamp = {
            ...data,
            timestamp: Date.now()
          };
          localStorage.setItem(analysisKey, JSON.stringify(dataWithTimestamp));
          
          // Set accuracy and analysis from the new format
          setAnalysis(data.analysis || data);
          setAccuracy(data.accuracy);
          setLoading(false);

          // Save game to backend after analysis is complete (only once)
          if (!gameSaved && !isViewingExisting) {
            const saveGame = async () => {
              try {
                const token = localStorage.getItem('token');
                if (!token) {
                  console.log('No token found, cannot save game');
                  return;
                }

                const savedGames = JSON.parse(localStorage.getItem('savedGames') || '[]');
                const gameKey = `${movesParam}-${gameResult}`;
                
                if (savedGames.includes(gameKey)) {
                  console.log('Game already saved, skipping duplicate save');
                  setGameSaved(true);
                  return;
                }

                console.log('Saving game from review page with moves:', moveHistory);
                console.log('Game result:', gameResult);

                const gameReport = data.analysis || moveHistory.map((move, index) => ({
                  move,
                  type: 'Brilliant',
                  explanation: 'Move played',
                  evaluation: '0.00'
                }));

                console.log('Sending game report:', gameReport);
                
                const response = await fetch('/api/users/save-game', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    game_report: gameReport,
                    result: gameResult
                  }),
                });

                console.log('Save game response status:', response.status);
                const responseData = await response.json();
                console.log('Save game response data:', responseData);

                if (response.ok) {
                  console.log('Game saved successfully from review page');
                  setGameSaved(true);
                  
                  if (!savedGames.includes(gameKey)) {
                    savedGames.push(gameKey);
                    localStorage.setItem('savedGames', JSON.stringify(savedGames));
                  }
                  
                  // Award coins for best moves at odd positions (only once)
                  const awardKey = `awarded-${movesParam}-${gameResult}`;
                  if (!localStorage.getItem(awardKey)) {
                    try {
                      const awardResponse = await fetch('/api/users/award-best-moves', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          game_report: gameReport
                        }),
                      });
                      
                      if (awardResponse.ok) {
                        const awardData = await awardResponse.json();
                        console.log('Coins awarded for best moves:', awardData);
                        if (awardData.coinsAwarded > 0) {
                          localStorage.setItem(awardKey, 'true');
                          window.dispatchEvent(new CustomEvent('user-data-updated'));
                        }
                      } else {
                        console.error('Failed to award coins for best moves');
                      }
                    } catch (awardError) {
                      console.error('Error awarding coins for best moves:', awardError);
                    }
                  } else {
                    console.log('Coins already awarded for this game, skipping');
                  }
                } else {
                  console.error('Failed to save game from review page:', responseData);
                }
              } catch (error) {
                console.error('Error saving game from review page:', error);
              }
            };

            saveGame();
          } else {
            console.log('Game already saved, skipping duplicate save');
          }
        })
        .catch((error) => {
          console.error('Analysis error:', error);
          setLoading(false);
        });
      }
    }
  }, [movesParam, gameResult, isViewingExisting]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)] text-[var(--primary-text)]">
      <AnalysisLoadingBuffer isVisible={loading} />
      {!loading && (
        <div className="w-full max-w-6xl mx-auto p-4">
          <GameReview
            moveHistory={moveHistory}
            analysis={analysis}
            accuracy={accuracy}
            opening={opening}
            lessons={lessons}
            keyMistakes={keyMistakes}
            magnusSuggestion={magnusSuggestion}
            shouldSave={true}
            gameResult={gameResult}
            fullPage={true}
          />
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--card-foreground)]">Loading review...</div>}>
      <ReviewPageContent />
    </Suspense>
  );
}