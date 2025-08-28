import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }
  
  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        name: session.userId,
        email: `${session.userId}@example.com`,
        role: session.userId === 'admin' ? 'Administrator' : 'User'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }
}