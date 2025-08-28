import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://localhost:3008/api/exchange_db2api?format=web')
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Exchange API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exchange data' },
      { status: 500 }
    )
  }
}