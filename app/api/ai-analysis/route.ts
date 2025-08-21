import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER2_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { moves } = await request.json();
    
    if (!moves || !Array.isArray(moves)) {
      return NextResponse.json({ error: 'Missing or invalid moves array' }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      console.error('OpenRouter API key not found. Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENROUTER')));
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    console.log('Using API key:', OPENROUTER_API_KEY ? 'Present' : 'Missing');
    console.log('Analyzing moves:', moves.length, 'moves');

    // Simplified prompt for better JSON compliance
    const prompt = `Analyze these chess moves and return ONLY a JSON array. Each move needs: move, type, evaluation, explanation.

Moves: ${moves.join(' ')}

Example format:
[
  {"move": "e4", "type": "Correct", "evaluation": "+0.3", "explanation": "Controls center"},
  {"move": "e5", "type": "Correct", "evaluation": "0.0", "explanation": "Symmetric response"}
]

Types: Brilliant, Correct, Mistake, Blunder
Return ONLY the JSON array:`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://chess-ai-clone.vercel.app',
        'X-Title': 'Chess AI Analysis'
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-coder-32b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a chess grandmaster providing detailed move analysis. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, response.statusText, errorText);
      return NextResponse.json({ 
        error: `OpenRouter API error: ${response.status} - ${response.statusText}`,
        details: errorText 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data, null, 2));
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in response. Full response:', data);
      return NextResponse.json({ 
        error: 'No content received from AI',
        response: data 
      }, { status: 500 });
    }

    // Try to parse the JSON array from the reply
    let analysis = null;
    try {
      analysis = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from text if model adds extra text
      const match = content.match(/\[.*\]/s);
      if (match) {
        try {
          analysis = JSON.parse(match[0]);
        } catch (parseError) {
          console.error('Failed to parse extracted JSON:', parseError);
          return NextResponse.json({ error: 'Invalid JSON response from AI' }, { status: 500 });
        }
      }
    }
    
    if (!analysis || !Array.isArray(analysis)) {
      console.error('Invalid analysis format:', content);
      return NextResponse.json({ error: 'Invalid analysis format from AI' }, { status: 500 });
    }

    // Validate and sanitize the analysis
    const sanitizedAnalysis = analysis.map((move, index) => ({
      move: move.move || moves[index] || `Move ${index + 1}`,
      type: ['Brilliant', 'Correct', 'Mistake', 'Blunder'].includes(move.type) ? move.type : 'Correct',
      evaluation: move.evaluation || '0.0',
      explanation: move.explanation || 'No explanation provided'
    }));

    return NextResponse.json({ analysis: sanitizedAnalysis });
    
  } catch (error: any) {
    console.error('AI Analysis API error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
