import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Save game API called');
    const { game_report, result } = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];

    console.log('Token received:', token ? 'Yes' : 'No');
    console.log('Game report received:', game_report ? 'Yes' : 'No');
    console.log('Result received:', result);

    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    if (!game_report || !result) {
      console.log('Missing game report or result');
      return NextResponse.json({ error: 'Missing game report or result' }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    console.log('Backend URL:', backendUrl);
    
    const response = await fetch(`${backendUrl}/api/users/save-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        game_report,
        result
      }),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (response.ok) {
      console.log('Game saved successfully to backend');
      return NextResponse.json(data);
    } else {
      console.log('Backend save failed');
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
} 