import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, initAuthListener } from '@/stores/authStore'

// Layouts
import AppLayout from '@/components/layouts/AppLayout'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import KundliPage from '@/pages/KundliPage'
import AnalysisPage from '@/pages/AnalysisPage'
import DoshaAnalysisPage from '@/pages/DoshaAnalysisPage'
import KundliMatchingPage from '@/pages/KundliMatchingPage'
import ChatPage from '@/pages/ChatPage'
import SettingsPage from '@/pages/SettingsPage'
import ResultsPage from '@/pages/ResultsPage'

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin-slow w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  useEffect(() => {
    initAuthListener()
  }, [])

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes with app layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kundli"
        element={
          <ProtectedRoute>
            <AppLayout>
              <KundliPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AnalysisPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dosha-analysis"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DoshaAnalysisPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kundli-matching"
        element={
          <ProtectedRoute>
            <AppLayout>
              <KundliMatchingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ChatPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResultsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
