import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { moves } = await request.json();
    
    if (!moves || !Array.isArray(moves)) {
      return NextResponse.json({ error: 'Missing or invalid moves array' }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    // Enhanced prompt for better chess analysis
    const prompt = `You are a chess grandmaster analyzing a game. For each move in the following sequence, provide detailed analysis.

Moves: ${moves.join(' ')}

Return a JSON array where each move object has:
- move: the chess move in algebraic notation
- type: one of "Brilliant", "Correct", "Mistake", "Blunder"
- evaluation: numerical evaluation (positive for white advantage, negative for black advantage, e.g., "+1.2", "-0.5", "+3.1")
- explanation: detailed explanation of why this move is good/bad and its strategic implications

Classification criteria:
- Brilliant: Exceptional move that creates winning advantage or solves complex position
- Correct: Sound move that maintains position or follows good principles
- Mistake: Suboptimal move that gives slight disadvantage but doesn't lose material
- Blunder: Poor move that loses material or creates significant disadvantage

Return ONLY the JSON array, no additional text.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://chess-ai-clone.vercel.app',
        'X-Title': 'Chess AI Analysis'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
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
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json({ error: `OpenRouter API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json({ error: 'No content received from AI' }, { status: 500 });
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
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
 ✓ Compiled in 2.8s (3256 modules)
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
 ✓ Compiled in 942ms (3256 modules)
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
 ○ Compiling /api/users/save-game ...
 ✓ Compiled /api/users/save-game in 1676ms (1594 modules)
Save game API called
Token received: Yes
Game report received: Yes
Result received: loss
Backend URL: http://localhost:5000
Error saving game: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/save-game/route.ts:33:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Save game API called
Token received: Yes
Game report received: Yes
Result received: loss
Backend URL: http://localhost:5000
Error saving game: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/save-game/route.ts:33:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incrementing time: TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async globalThis.fetch (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:57569)
    at async POST (webpack-internal:///(rsc)/./app/api/users/increment-time/route.ts:26:26)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:63809
    at async eU.execute (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:53964)
    at async eU.handle (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\compiled\next-server\app-route.runtime.dev.js:6:65062)
    at async doRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1333:42)
    at async cacheEntry.responseCache.get.routeKind (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1555:28)
    at async DevServer.renderToResponseWithComponentsImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1463:28)
    at async DevServer.renderPageComponent (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1856:24)
    at async DevServer.renderToResponseImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:1894:32)
    at async DevServer.pipeImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:911:25)
    at async NextNodeServer.handleCatchallRenderRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\next-server.js:271:17)
    at async DevServer.handleRequestImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\base-server.js:807:17)
    at async C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:331:20
    at async Span.traceAsyncFn (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\trace\trace.js:151:20)
    at async DevServer.handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\dev\next-dev-server.js:328:24)
    at async invokeRender (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:163:21)
    at async handleRequest (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:342:24)
    at async requestHandlerImpl (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\router-server.js:366:13)
    at async Server.requestListener (C:\Users\rutur\OneDrive\Desktop\chess-ai-clone-main\node_modules\next\dist\server\lib\start-server.js:140:13) {
  [cause]: AggregateError [ECONNREFUSED]:
      at internalConnectMultiple (node:net:1139:18)
      at afterConnectMultiple (node:net:1712:7)
      at TCPConnectWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
  }
}
Error incre