import { NextRequest, NextResponse } from 'next/server';
import { cleanMarkdownText } from '@/lib/textCleaner';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function POST(req: NextRequest) {
  console.log('🔍 Move explanation API called');
  try {
    const { move, position, moveType, evaluation, moveNumber, playerColor, fenBefore, fenAfter } = await req.json();
    console.log('📝 Request data:', { move, moveType, evaluation, moveNumber, playerColor });

    if (!OPENROUTER_API_KEY) {
      console.log('❌ OpenRouter API key not configured');
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }
    console.log('✅ OpenRouter API key found');

    if (!move || !position) {
      return NextResponse.json({ error: 'Move and position are required' }, { status: 400 });
    }

    // Create a prompt for the AI to explain the move
    const positionInfo = fenBefore && fenAfter 
      ? `Position before move: ${fenBefore}\nPosition after move: ${fenAfter}`
      : `Position: ${position}`;

    const prompt = `Analyze this chess move: ${move} (${moveType}, eval: ${evaluation}, move ${moveNumber}, ${playerColor}).

${positionInfo}

Provide an explanation in this EXACT format with proper line breaks:

Explanation of ${move}:

Accomplishment:  
[What the move accomplishes - 1-2 sentences]

Why "${moveType}" (${evaluation} eval):  
[Why it's classified as ${moveType} - 1-2 sentences]

Key Concepts:  
[First key concept]
[Second key concept]
[Third key concept if applicable]

Use double line breaks between sections and single line breaks within sections. Keep it concise, educational, and follow the exact format above. Use plain text only - no markdown formatting like ** or bullet points (-).`;

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'HTTP-Referer': 'https://your-chess-app.com',
          'X-Title': 'Chess Move Analyzer'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful chess coach who provides clear, educational explanations of chess moves. Keep explanations concise but informative.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],

          temperature: 0.7
        }),
        signal: controller.signal
      });

            clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch {
          const text = await response.text();
          errorData = { message: text };
        }
        console.error('OpenRouter API error:', errorData);
        return NextResponse.json({ error: 'Failed to get move explanation' }, { status: response.status });
      }
      // Robustly parse body even if provider returns plain text
      const contentType = response.headers.get('content-type') || '';
      const raw = await response.text();
      let data: any = null;
      try {
        data = contentType.includes('application/json') ? JSON.parse(raw) : JSON.parse(raw);
      } catch (e) {
        console.warn('OpenRouter non-JSON or malformed JSON body, using raw text fallback');
        // Return the raw text as explanation if it looks like plain text
        const fallback = cleanMarkdownText(raw || 'Unable to generate explanation');
        return NextResponse.json({ explanation: fallback });
      }
      console.log('🤖 AI Response:', data);
      console.log('🤖 Message object:', data.choices?.[0]?.message);
      
      // Check for content in both 'content' and 'reasoning' fields
      const message = data.choices?.[0]?.message;
      let explanation = message?.content || message?.reasoning || 'Unable to generate explanation';
      
      // Clean up markdown formatting
      explanation = cleanMarkdownText(explanation);
      
      console.log('📖 Generated explanation:', explanation);

      return NextResponse.json({ explanation });
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('Request timed out');
        return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 408 });
      }
      
      console.error('Error explaining move:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error explaining move:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 408 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 