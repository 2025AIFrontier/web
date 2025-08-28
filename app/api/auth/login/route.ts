import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, pw } = body
    
    // PostgREST API를 통해 사용자 검증
    const response = await fetch(`http://localhost:3010/users?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }
    
    const users = await response.json()
    
    // 사용자가 없거나 비밀번호가 틀린 경우
    if (users.length === 0 || users[0].pw !== pw) {
      return NextResponse.json(
        { error: 'Invalid ID or password' },
        { status: 401 }
      )
    }
    
    const user = users[0]
    
    // 세션 생성
    const sessionData = {
      userId: user.id,
      loginTime: new Date().toISOString()
    }
    
    // 쿠키에 세션 저장
    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7일
    })
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}