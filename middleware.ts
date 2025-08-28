import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 로그인이 필요 없는 public 경로들
const publicPaths = ['/signin', '/signup', '/reset-password']
const authPaths = ['/signin', '/signup', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // API 경로는 통과
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // 세션 쿠키 확인
  const session = request.cookies.get('session')
  
  // 로그인 된 사용자가 auth 페이지 접근 시 대시보드로 리다이렉트
  if (session && authPaths.some(path => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  
  // 로그인 안 된 사용자가 보호된 페이지 접근 시 로그인 페이지로
  if (!session && !publicPaths.some(path => pathname.startsWith(path))) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}