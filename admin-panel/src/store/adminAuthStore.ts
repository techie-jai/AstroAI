import { create } from 'zustand'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, Auth, User as FirebaseUser } from 'firebase/auth'
import { adminApi } from '../services/adminApi'

interface AdminAuthState {
  user: FirebaseUser | null
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  token: string | null
  inactivityTimeout: ReturnType<typeof setTimeout> | null

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
  clearError: () => void
  resetInactivityTimer: () => void
}

const env = import.meta.env as any

// Get Firebase config from environment variables
const getFirebaseConfig = () => {
  const config = {
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  }
  
  console.log('Firebase Config:', {
    projectId: config.projectId ? '✓' : '✗',
    apiKey: config.apiKey ? '✓' : '✗',
    authDomain: config.authDomain ? '✓' : '✗',
    storageBucket: config.storageBucket ? '✓' : '✗',
  })
  
  return config
}

const firebaseConfig = getFirebaseConfig()

let auth: Auth | null = null

try {
  if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    console.log('✅ Firebase initialized successfully')
  } else {
    console.error('❌ Firebase config incomplete:', firebaseConfig)
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
}

const INACTIVITY_TIMEOUT = parseInt(env.VITE_ADMIN_INACTIVITY_TIMEOUT || '1800000')

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  isLoading: true,
  error: null,
  token: null,
  inactivityTimeout: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })

      if (!auth) throw new Error('Firebase not initialized')

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()

      adminApi.setToken(token)

      const verifyResponse = await adminApi.verifyToken()

      if (!verifyResponse.data.user.is_admin) {
        await signOut(auth)
        throw new Error('User does not have admin privileges')
      }

      set({
        user: userCredential.user,
        isAdmin: true,
        token,
        isLoading: false
      })

      get().resetInactivityTimer()
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false
      })
      throw error
    }
  },

  logout: async () => {
    try {
      if (auth) {
        await signOut(auth)
      }

      adminApi.clearToken()

      const { inactivityTimeout } = get()
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout)
      }

      set({
        user: null,
        isAdmin: false,
        token: null,
        inactivityTimeout: null
      })
    } catch (error: any) {
      set({ error: error.message || 'Logout failed' })
      throw error
    }
  },

  initializeAuth: async () => {
    try {
      if (!auth) {
        set({ isLoading: false, error: 'Firebase not initialized' })
        return
      }

      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          set({ isLoading: false, error: 'Authentication timeout' })
          resolve()
        }, 10000)

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          clearTimeout(timeout)

          if (user) {
            try {
              const token = await user.getIdToken()
              adminApi.setToken(token)

              const verifyResponse = await adminApi.verifyToken()

              if (verifyResponse.data.user.is_admin) {
                set({
                  user,
                  isAdmin: true,
                  token,
                  isLoading: false
                })
                get().resetInactivityTimer()
              } else {
                await signOut(auth!)
                set({
                  user: null,
                  isAdmin: false,
                  isLoading: false,
                  error: 'User does not have admin privileges'
                })
              }
            } catch (error: any) {
              set({
                isLoading: false,
                error: error.message || 'Authentication failed'
              })
            }
          } else {
            set({
              user: null,
              isAdmin: false,
              isLoading: false
            })
          }

          unsubscribe()
          resolve()
        })
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Authentication initialization failed'
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },

  resetInactivityTimer: () => {
    const { inactivityTimeout, logout } = get()

    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout)
    }

    const newTimeout = setTimeout(() => {
      logout()
    }, INACTIVITY_TIMEOUT)

    set({ inactivityTimeout: newTimeout })
  }
}))
