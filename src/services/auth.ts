import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth'
import { auth } from './firebase'
import { db } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export interface AuthResponse {
  success: boolean
  error?: Error | null
  data?: unknown
}

// Helper function to create or update user document in Firestore
async function createUserDocument(user: User, additionalData: Record<string, unknown> = {}) {
  if (!user) return

  const userRef = doc(db, 'users', user.uid)
  const userSnapshot = await getDoc(userRef)

  // Only create if user doesn't exist
  if (!userSnapshot.exists()) {
    const {
      displayName,
      email,
      photoURL,
    } = user

    try {
      await setDoc(userRef, {
        displayName: displayName || additionalData.displayName || '',
        email: email || '',
        photoURL: photoURL || '',
        businessName: additionalData.businessName || '',
        businessType: additionalData.businessType || 'user',
        phone: additionalData.phone || '',
        address: additionalData.address || '',
        role: 'user', // Default role
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error('Error creating user document:', error)
    }
  }
}

export const authService = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await createUserDocument(userCredential.user)
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

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      await createUserDocument(userCredential.user)
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
