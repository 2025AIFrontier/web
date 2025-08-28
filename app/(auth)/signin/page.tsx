'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: email, pw: password }),
      })

      if (response.ok) {
        // 로그인 성공 후 페이지 새로고침하여 사용자 정보 업데이트
        window.location.href = '/dashboard'
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <>
      <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">Welcome back!</h1>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg">
            <span className="text-sm">{error}</span>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address / Username</label>
            <input 
              id="email" 
              className="form-input w-full" 
              type="text"
              placeholder="Enter email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              className="form-input w-full" 
              type="password" 
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="mr-1">
            <Link className="text-sm underline hover:no-underline" href="/reset-password">Forgot Password?</Link>
          </div>
          <button 
            type="submit"
            className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white ml-3"
          >
            Sign In
          </button>
        </div>
      </form>
      {/* Footer */}
      <div className="pt-5 mt-6 border-t border-gray-100 dark:border-gray-700/60">
        <div className="text-sm">
          Don't you have an account? <Link className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  )
}