import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth'
import { auth } from './firebase'

export interface AuthResponse {
  success: boolean
  error?: Error | null
  data?: unknown
}

export const authService = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      return { success: true, data: userCredential.user }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      return { success: true, data: userCredential.user }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async signOut(): Promise<AuthResponse> {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const user = auth.currentUser
      if (!user) {
        return { success: false, error: new Error('No user logged in') }
      }
      await updatePassword(user, newPassword)
      return { success: true }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return auth.currentUser
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  async getSession(): Promise<User | null> {
    try {
      return auth.currentUser
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  },
}
