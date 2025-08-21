// /app/api/analyze-game.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log('analyze-game API called');
  try {
    const body = await req.json();
    const moves = Array.isArray(body?.moves) ? body.moves : [];
    // Generate more realistic analysis for each move
    const types = ['Brilliant', 'Correct', 'Mistake', 'Blunder'];
    let evalScore = 0.2;
    const analysis = moves.map((move: string, idx: number) => {
      // Check if this is the last move and if it contains checkmate notation
      const isCheckmate = move.includes('#');
      
      // If it's checkmate, it's always the best move
      if (isCheckmate) {
        return {
          move,
          type: 'Best',
          explanation: 'Checkmate! The ultimate winning move.',
          evaluation: '30.00', // High positive evaluation for checkmate
          bestMove: move,
        };
      }
      
      // Alternate types, make some plausible eval swings
              const type = idx % 10 === 7 ? 'Blunder' : idx % 7 === 4 ? 'Mistake' : idx % 3 === 1 ? 'Correct' : 'Brilliant';
      // Simulate evaluation swings
      if (type === 'Blunder') evalScore -= 2.5;
      else if (type === 'Mistake') evalScore -= 1.0;
      
              else if (type === 'Correct') evalScore += 0.2;
        else evalScore += 0.1;
      // Clamp eval
      evalScore = Math.max(-10, Math.min(10, evalScore));
      return {
        move,
        type,
        explanation: `This move is considered ${type.toLowerCase()} by the engine.`,
        evaluation: evalScore.toFixed(2),
        bestMove: idx % 4 === 0 ? 'Nf3' : 'e4',
      };
    });
    return NextResponse.json({
      analysis,
      accuracy: 82,
      opening: moves && moves.length > 0 ? "Italian Game" : "Unknown Opening",
      lessons: [
        { theme: 'Opening Principles', tips: ['Control the center', 'Develop your pieces early'] },
        { theme: 'Tactics', tips: ['Look for forks', 'Watch for pins'] },
      ],
      keyMistakes: analysis.filter((m: any) => m.type === 'Mistake' || m.type === 'Blunder').map((m: any, i: number) => `Move ${i + 1}: ${m.move} (${m.type})`),
      magnusSuggestion: { move: 'Bc4', reasoning: 'Develops a piece and targets the weak f7 square.' },
    });
  } catch (err) {
    console.error('analyze-game API error:', err);
    return NextResponse.json({ error: 'Failed to analyze game', details: String(err) }, { status: 200 });
  }
} 