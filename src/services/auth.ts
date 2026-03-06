import { supabase } from './supabase'
import type { Session } from '@supabase/supabase-js'
import { AuthError } from '@supabase/supabase-js'

export interface AuthResponse {
  success: boolean
  error?: AuthError | Error | null
  data?: unknown
}

export const authService = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) return { success: false, error }
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) return { success: false, error }
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) return { success: false, error }
      return { success: true }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) return { success: false, error }
      return { success: true }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) return { success: false, error }
      return { success: true }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  async getSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
