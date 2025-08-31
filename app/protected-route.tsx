'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const user = sessionStorage.getItem('user')
    
    // Allow access to signin page without authentication
    if (pathname === '/signin') {
      // If already logged in, redirect to dashboard
      if (user) {
        router.push('/dashboard')
      }
      return
    }
    
    // For all other pages, require authentication
    if (!user) {
      router.push('/signin')
    }
  }, [pathname, router])

  return <>{children}</>
}