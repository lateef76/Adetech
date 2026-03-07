import { useEffect, useState, useCallback } from 'react'
import type { User } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { authService } from '@/services/auth'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Setup listener for auth changes
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    try {
      await authService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
  }
}
