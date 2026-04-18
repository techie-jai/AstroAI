import { create } from 'zustand'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut } from 'firebase/auth'
import { api } from '../services/api'

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

// Helper function to detect if browser is a secure/compliant browser
const isSecureBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase()
  
  // List of known insecure/non-compliant in-app browsers
  const insecureBrowsers = [
    'fban', // Facebook app
    'fbav', // Facebook app
    'messenger', // Facebook Messenger
    'instagram', // Instagram app
    'whatsapp', // WhatsApp
    'line', // LINE app
    'telegram', // Telegram
    'viber', // Viber
    'snapchat', // Snapchat
    'tiktok', // TikTok
  ]
  
  return !insecureBrowsers.some(browser => ua.includes(browser))
}

// Helper function to get appropriate OAuth method
const getOAuthMethod = (): 'popup' | 'redirect' => {
  return isSecureBrowser() ? 'popup' : 'redirect'
}

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
  initializeAuth: () => (() => void) | undefined
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<string | null>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initializeAuth: () => {
    console.log('[AUTH] Initializing auth...')
    console.log('[AUTH] Browser type:', isSecureBrowser() ? 'Secure' : 'In-app (non-compliant)')
    
    // Check if token exists in localStorage (for new tabs/windows)
    const existingToken = localStorage.getItem('firebaseToken')
    if (existingToken) {
      console.log('[AUTH] Found existing token in localStorage, waiting for auth state...')
    }
    
    // Handle redirect result from OAuth flow
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('[AUTH] Redirect result received, user logged in')
          result.user.getIdToken().then((token) => {
            localStorage.setItem('firebaseToken', token)
            console.log('[AUTH] Token stored from redirect result')
          })
        }
      })
      .catch((error) => {
        console.error('[AUTH] Error getting redirect result:', error)
      })
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AUTH] Auth state changed, firebaseUser:', firebaseUser?.email || 'null')
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
        console.log('[AUTH] No user, clearing auth state')
        localStorage.removeItem('firebaseToken')
        set({ user: null, loading: false })
      }
    })
    
    // Return unsubscribe function for cleanup (though we keep it active for app lifetime)
    return unsubscribe
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null })
      console.log('[AUTH] Starting Google sign-in...')
      
      const oauthMethod = getOAuthMethod()
      console.log('[AUTH] Using OAuth method:', oauthMethod)
      
      let result
      if (oauthMethod === 'popup') {
        result = await signInWithPopup(auth, googleProvider)
      } else {
        await signInWithRedirect(auth, googleProvider)
        console.log('[AUTH] Redirecting to Google OAuth...')
        return
      }
      
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
      
      console.log('[AUTH] Creating user profile in Firestore...')
      try {
        await api.createProfile(token, result.user.displayName || undefined)
        console.log('[AUTH] User profile created in Firestore')
      } catch (profileError) {
        console.warn('[AUTH] Failed to create profile, but login continues:', profileError)
      }
      
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
