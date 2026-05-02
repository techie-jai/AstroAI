import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GeneratorPage from './pages/GeneratorPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import KundliPage from './pages/KundliPage'
import AnalysisPage from './pages/AnalysisPage'
import ChatPage from './pages/ChatPage'
import LiveChatPage from './pages/LiveChatPage'
import KundliCompletionPage from './pages/KundliCompletionPage'
import ChatWithKundliPage from './pages/ChatWithKundliPage'
import DoshDashaAnalysisPage from './pages/DoshDashaAnalysisPage'
import KundliMatchingPage from './pages/KundliMatchingPage'
import KundliMatchingResultsPage from './pages/KundliMatchingResultsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  const { user, loading, initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin-slow w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary mb-4"></div>
          <p className="text-foreground text-lg">Loading Kendraa.ai...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <Layout>
                <GeneratorPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:kundliId"
          element={
            <ProtectedRoute>
              <Layout>
                <ResultsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/completion/:kundliId"
          element={
            <ProtectedRoute>
              <Layout>
                <KundliCompletionPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kundli"
          element={
            <ProtectedRoute>
              <Layout>
                <KundliPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Layout>
                <AnalysisPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:kundliId"
          element={
            <ProtectedRoute>
              <ChatWithKundliPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <GeneratorPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/livechat"
          element={
            <ProtectedRoute>
              <LiveChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <HistoryPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosh-dasha-analysis"
          element={
            <ProtectedRoute>
              <Layout>
                <DoshDashaAnalysisPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kundli-matching"
          element={
            <ProtectedRoute>
              <Layout>
                <KundliMatchingPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kundli-matching/results/:matchId"
          element={
            <ProtectedRoute>
              <Layout>
                <KundliMatchingResultsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
