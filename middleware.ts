import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = ['/signin', '/signup', '/reset-password']
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Check for user session
  const userCookie = request.cookies.get('user')
  
  // If user is not authenticated and trying to access protected route
  if (!isPublicPath && !userCookie) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  
  // If user is authenticated and trying to access auth pages
  if (isPublicPath && userCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images).*)',
  ],
}