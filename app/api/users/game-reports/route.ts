import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('Game reports API called');
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      console.log('No token provided for game reports');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    console.log('Fetching game reports from:', backendUrl);
    
    const response = await fetch(`${backendUrl}/api/users/game-reports`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Game reports response status:', response.status);
    const data = await response.json();
    console.log('Game reports data:', data);

    if (response.ok) {
      console.log('Game reports fetched successfully');
      return NextResponse.json(data);
    } else {
      console.log('Failed to fetch game reports');
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Error fetching game reports:', error);
    return NextResponse.json({ error: 'Failed to fetch game reports' }, { status: 500 });
  }
} 