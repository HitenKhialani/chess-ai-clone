import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { game_report } = await req.json();
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    if (!game_report || !Array.isArray(game_report)) {
      return NextResponse.json({ error: 'Missing or invalid game report' }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    console.log('Calling backend award-best-moves endpoint:', `${backendUrl}/api/users/award-best-moves`);
    
    const response = await fetch(`${backendUrl}/api/users/award-best-moves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ game_report }),
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', response.headers);
    
    const responseText = await response.text();
    console.log('Backend response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response was:', responseText);
      return NextResponse.json({ error: 'Backend returned invalid JSON' }, { status: 500 });
    }

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Error awarding best moves:', error);
    return NextResponse.json({ error: 'Failed to award best moves' }, { status: 500 });
  }
} 