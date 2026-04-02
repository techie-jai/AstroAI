import { create } from 'zustand'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  initializeAuth: () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          },
          loading: false,
        })
      } else {
        set({ user: null, loading: false })
      }
    })
  },

  loginWithGoogle: async () => {
    try {
      set({ error: null })
      const result = await signInWithPopup(auth, googleProvider)
      set({
        user: {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        },
      })
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null })
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },
}))
