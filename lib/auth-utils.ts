export const clearAuthData = () => {
  // Clear sessionStorage
  sessionStorage.removeItem('user')
  
  // Clear cookie
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export const setAuthData = (userId: string) => {
  // Set sessionStorage
  sessionStorage.setItem('user', JSON.stringify({ id: userId }))
  
  // Set cookie (expires in 24 hours)
  const expires = new Date()
  expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000))
  document.cookie = `user=${userId}; path=/; expires=${expires.toUTCString()}`
}

export const getAuthData = () => {
  // Check cookie first (persistent across browser sessions)
  const cookies = document.cookie.split(';')
  const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
  
  if (userCookie) {
    const userId = userCookie.split('=')[1]
    
    // Sync with sessionStorage if not present
    if (!sessionStorage.getItem('user')) {
      sessionStorage.setItem('user', JSON.stringify({ id: userId }))
    }
    
    return { id: userId }
  }
  
  // If no cookie, check sessionStorage
  const sessionUser = sessionStorage.getItem('user')
  if (sessionUser) {
    const user = JSON.parse(sessionUser)
    // Restore cookie
    setAuthData(user.id)
    return user
  }
  
  return null
}