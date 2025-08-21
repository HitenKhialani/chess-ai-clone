import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    console.log('Testing backend connection to:', backendUrl);
    
    const response = await fetch(`${backendUrl}/health`);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Backend health check failed',
          status: response.status,
          statusText: response.statusText,
          backendUrl: backendUrl
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json({
      success: true,
      backendUrl: backendUrl,
      health: data
    });
  } catch (error) {
    console.error('Error testing backend connection:', error);
    return NextResponse.json(
      { 
        error: 'Backend connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      },
      { status: 500 }
    );
  }
} 