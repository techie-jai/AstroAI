import { create } from 'zustand'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

interface User {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
}

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  initializeAuth: () => void
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<string | null>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken()
          localStorage.setItem('firebaseToken', token)
          console.log('[AUTH] Token refreshed on auth state change')
          
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            },
            loading: false,
          })
        } catch (error) {
          console.error('[AUTH] Failed to get token on auth state change:', error)
          set({ loading: false })
        }
      } else {
        localStorage.removeItem('firebaseToken')
        set({ user: null, loading: false })
      }
    })
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null })
      console.log('[AUTH] Starting Google sign-in...')
      
      const result = await signInWithPopup(auth, googleProvider)
      console.log('[AUTH] Google sign-in successful, getting token...')
      
      const token = await result.user.getIdToken()
      console.log('[AUTH] Token obtained:', token.substring(0, 50) + '...')
      
      localStorage.setItem('firebaseToken', token)
      console.log('[AUTH] Token stored in localStorage')
      
      set({
        user: {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        },
      })
      
      console.log('[AUTH] Login complete, user set in store')
    } catch (error) {
      const errorMsg = (error as Error).message
      console.error('[AUTH] Login failed:', errorMsg)
      set({ error: errorMsg })
      throw error
    }
  },

  logout: async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('firebaseToken')
      set({ user: null })
      console.log('[AUTH] Logout complete')
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  refreshToken: async () => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error('[AUTH] No current user to refresh token')
        return null
      }
      
      const token = await currentUser.getIdToken(true)
      localStorage.setItem('firebaseToken', token)
      console.log('[AUTH] Token refreshed successfully')
      return token
    } catch (error) {
      console.error('[AUTH] Failed to refresh token:', error)
      return null
    }
  },
}))
