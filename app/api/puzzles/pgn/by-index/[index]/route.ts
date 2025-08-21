import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { index: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    console.log(`Fetching puzzle from: ${backendUrl}/api/puzzles/pgn/by-index/${params.index}`);
    
    const response = await fetch(`${backendUrl}/api/puzzles/pgn/by-index/${params.index}`);
    
    console.log(`Backend response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error response: ${errorText}`);
      return NextResponse.json(
        { 
          error: 'Failed to fetch puzzle',
          backendUrl: backendUrl,
          status: response.status,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log(`Successfully fetched puzzle: ${JSON.stringify(data).substring(0, 100)}...`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      },
      { status: 500 }
    );
  }
} 