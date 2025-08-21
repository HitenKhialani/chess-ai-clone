import { NextRequest, NextResponse } from 'next/server';
import { cleanMoveAnalysis } from '@/lib/textCleaner';

export const runtime = "nodejs";

const DEEPSEEK_API_KEY = process.env.OPENROUTER_API_KEY;
const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface MoveAnalysis {
  move: string;
  type: 'Brilliant' | 'Correct' | 'Mistake' | 'Blunder';
  explanation: string;
  evaluation: string;
  bestMove?: string;
}

interface GameAnalysis {
  analysis: MoveAnalysis[];
  accuracy: number;
  elo: number;
  opening: string;
  ecoCode: string;
  result: string;
  moveCounts: {
    brilliant: number;
    correct: number;
    mistakes: number;
    blunders: number;
  };
}

function calculateAccuracy(analysis: MoveAnalysis[]): number {
  if (analysis.length === 0) return 0;
  
  // Count move types
  let B = 0; // Brilliant moves
  let C = 0; // Correct moves
  let M = 0; // Mistakes
  let BL = 0; // Blunders
  
  analysis.forEach(move => {
    switch (move.type) {
      case 'Brilliant':
        B++;
        break;
      case 'Correct':
        C++;
        break;
      case 'Mistake':
        M++;
        break;
      case 'Blunder':
        BL++;
        break;
    }
  });
  
  const T = analysis.length; // Total moves
  
  // Apply the formula: ((2*B + 1*C - 0.8*M - 1*BL) / T) * 100
  const accuracy = ((2 * B + 1 * C - 0.8 * M - 1 * BL) / T) * 100;
  
  // Round to 2 decimal places and clamp between 0 and 100
  return Math.max(0, Math.min(100, parseFloat(accuracy.toFixed(2))));
}

function calculateELO(accuracy: number): number {
  if (accuracy < 20) return 100;
  if (accuracy < 30) return 300;
  if (accuracy < 40) return 500;
  if (accuracy < 50) return 800;
  if (accuracy < 60) return 1000;
  if (accuracy < 70) return 1200;
  if (accuracy < 80) return 1500;
  if (accuracy < 90) return 1700;
  return 2000;
}

function getMoveCounts(analysis: MoveAnalysis[]) {
  const counts = {
    brilliant: 0,
    correct: 0,
    mistakes: 0,
    blunders: 0
  };
  
  analysis.forEach(move => {
    switch (move.type) {
      case 'Brilliant':
        counts.brilliant++;
        break;
      case 'Correct':
        counts.correct++;
        break;
      case 'Mistake':
        counts.mistakes++;
        break;
      case 'Blunder':
        counts.blunders++;
        break;
    }
  });
  
  return counts;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { moves, pgn } = body;
    
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: 'DeepSeek API key not configured' }, { status: 500 });
    }

    if (!moves || !Array.isArray(moves) || moves.length === 0) {
      return NextResponse.json({ error: 'No moves provided' }, { status: 400 });
    }

    // Create the prompt for DeepSeek API
    const prompt = `Analyze this chess game and provide detailed move-by-move analysis. 

Game moves: ${moves.join(' ')}

Please analyze each move and provide:
1. Move type classification (Brilliant, Correct, Mistake, or Blunder)
2. Brief explanation for each move (use plain text, no markdown formatting like ** or -)
3. Position evaluation after each move
4. Best move suggestion if the played move is not optimal

Return the analysis as a JSON object with this exact structure:
{
  "analysis": [
    {
      "move": "e4",
      "type": "Correct",
      "explanation": "Strong opening move that controls the center",
      "evaluation": "0.2",
      "bestMove": null
    }
  ],
  "opening": "Italian Game",
  "ecoCode": "C50",
  "result": "1-0"
}

Make sure the analysis is realistic and educational. Consider:
- Opening principles for early moves
- Tactical opportunities and threats
- Position evaluation changes
- Strategic considerations

IMPORTANT: Use plain text only in explanations. Do not use markdown formatting like **bold** or bullet points (-). Write clean, readable explanations without any special characters.

Return only valid JSON, no additional text.`;

    // Call DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
              body: JSON.stringify({
          model: 'deepseek/deepseek-coder',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from DeepSeek API');
    }

    // Parse the AI response
    let parsedAnalysis;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        parsedAnalysis = JSON.parse(aiResponse);
      }
      
      // Clean up markdown formatting from the analysis
      if (parsedAnalysis.analysis && Array.isArray(parsedAnalysis.analysis)) {
        parsedAnalysis.analysis = cleanMoveAnalysis(parsedAnalysis.analysis);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid response format from AI');
    }

    // Validate and process the analysis
    if (!parsedAnalysis.analysis || !Array.isArray(parsedAnalysis.analysis)) {
      throw new Error('Invalid analysis format from AI');
    }

    // Ensure we have the right number of moves
    const analysis = parsedAnalysis.analysis.slice(0, moves.length);
    
    // Fill in any missing moves with default analysis
    while (analysis.length < moves.length) {
      analysis.push({
        move: moves[analysis.length],
        type: 'Correct',
        explanation: 'Standard developing move',
        evaluation: '0.0'
      });
    }

    // Calculate derived metrics
    const accuracy = calculateAccuracy(analysis);
    const elo = calculateELO(accuracy);
    const moveCounts = getMoveCounts(analysis);

    const result: GameAnalysis = {
      analysis,
      accuracy,
      elo,
      opening: parsedAnalysis.opening || 'Unknown Opening',
      ecoCode: parsedAnalysis.ecoCode || 'A00',
      result: parsedAnalysis.result || '*',
      moveCounts
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('DeepSeek analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze game', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
