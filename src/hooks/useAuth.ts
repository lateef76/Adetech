import { useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'

interface UseAuthReturn {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    // Setup listener for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signOut,
  }
}
