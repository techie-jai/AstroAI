import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminApi } from '../services/adminApi'
import { Analytics } from '../types/admin'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { LogOut, Users, BarChart3, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserGrowth } from '../types/admin'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAdminAuthStore()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [analyticsData, growthData] = await Promise.all([
          adminApi.getAnalyticsOverview(),
          adminApi.getUserGrowth(30)
        ])
        setAnalytics(analyticsData)
        setUserGrowth(growthData)
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AstroAI Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Users (30d)</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.activeUsers}</p>
                  </div>
                  <Users className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Kundlis</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalKundlis}</p>
                  </div>
                  <BarChart3 className="w-12 h-12 text-purple-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tokens Used</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalTokensUsed}</p>
                  </div>
                  <Zap className="w-12 h-12 text-yellow-500 opacity-20" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth (30 Days)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalUsers" stroke="#3b82f6" name="Total Users" />
                    <Line type="monotone" dataKey="newUsers" stroke="#10b981" name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/users')}
                    className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => navigate('/kundlis')}
                    className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition"
                  >
                    View Kundlis
                  </button>
                  <button
                    onClick={() => navigate('/analytics')}
                    className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition"
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => navigate('/system')}
                    className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition"
                  >
                    System Status
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
