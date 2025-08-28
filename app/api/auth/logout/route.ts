import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // 세션 쿠키 삭제
  const cookieStore = await cookies()
  cookieStore.delete('session')
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
}