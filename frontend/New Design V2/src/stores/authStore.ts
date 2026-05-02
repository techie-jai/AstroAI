import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mock user for development/testing
const mockUser = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'Lemniscate Lab',
  photoURL: null,
  emailVerified: true,
}

interface MockUser {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  emailVerified: boolean
}

interface AuthState {
  user: MockUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: MockUser | null) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Start with mock user authenticated for development
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      error: null,

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null })
          // Mock sign in - just set the mock user
          await new Promise(resolve => setTimeout(resolve, 500))
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
          set({ error: errorMessage, isLoading: false })
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true })
          await new Promise(resolve => setTimeout(resolve, 300))
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign out'
          set({ error: errorMessage, isLoading: false })
        }
      },

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false 
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

// Initialize auth state listener (no-op for mock)
export const initAuthListener = () => {
  // Mock auth is already initialized with user
}
