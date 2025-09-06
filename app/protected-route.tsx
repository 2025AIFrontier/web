'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getAuthData } from '@/lib/auth-utils'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = getAuthData()
    
    // Allow access to signin page without authentication
    if (pathname === '/signin') {
      // If already logged in, redirect to dashboard
      if (user) {
        router.push('/dashboard')
      }
      setIsChecking(false)
      return
    }
    
    // For all other pages, require authentication
    if (!user) {
      router.push('/signin')
    }
    
    setIsChecking(false)
  }, [pathname, router])

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return <>{children}</>
}