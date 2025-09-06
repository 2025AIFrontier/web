'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in from cookie
    const checkAuth = () => {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      
      if (pathname === '/signin') {
        // If already logged in, redirect to dashboard
        if (userCookie) {
          router.push('/dashboard')
        }
      } else {
        // For protected routes, if no cookie, redirect to signin
        if (!userCookie) {
          router.push('/signin')
        }
      }
    }

    checkAuth()
  }, [pathname, router])

  return <>{children}</>
}