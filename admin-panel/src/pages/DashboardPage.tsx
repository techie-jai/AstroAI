import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminApi } from '../services/adminApi'
import { Analytics } from '../types/admin'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { LogOut, Users, BarChart3, Zap, Activity, TrendingUp, Settings, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserGrowth } from '../types/admin'
import { StatCard } from '../components/StatCard'
import { ChartCard } from '../components/ChartCard'
import { ActivityFeed } from '../components/ActivityFeed'
import { MetricsPanel } from '../components/MetricsPanel'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { logout, user } = useAdminAuthStore()
  const [analytics, setAnalytics] = useState<any>(null)
  const [userGrowth, setUserGrowth] = useState<any[]>([])
  const [usageData, setUsageData] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError('')
        
        console.log('[Dashboard] Fetching analytics data...')
        const [analyticsData, growthData, usageAnalytics] = await Promise.all([
          adminApi.getAnalyticsOverview(),
          adminApi.getUserGrowth(30),
          adminApi.getUsageAnalytics()
        ])
        
        console.log('[Dashboard] Analytics data received:', analyticsData)
        console.log('[Dashboard] Growth data received:', growthData)
        console.log('[Dashboard] Usage data received:', usageAnalytics)
        
        setAnalytics(analyticsData)
        setUserGrowth(growthData || [])
        setUsageData(usageAnalytics)
        
        // Generate recent activity from growth data
        if (growthData && growthData.length > 0) {
          const activities = growthData.slice(-5).reverse().map((item: any, idx: number) => ({
            id: String(idx),
            user: `User ${idx + 1}`,
            email: `user${idx + 1}@local.user`,
            action: 'Generated new kundli',
            timestamp: item.date
          }))
          setRecentActivity(activities)
        }
      } catch (err: any) {
        console.error('[Dashboard] Error fetching data:', err)
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

  // Recent activities from kundlis
  const recentActivities = userGrowth.length > 0 ? userGrowth.slice(-5).reverse().map((item, idx) => ({
    id: String(idx),
    user: `User ${idx + 1}`,
    email: `user${idx + 1}@example.com`,
    action: 'Generated new kundli',
    timestamp: item.date
  })) : []

  // System metrics (will be fetched from API in future)
  const systemMetrics = [
    { label: 'API Response', value: '145ms', unit: 'ms', icon: <Zap className="w-5 h-5" />, color: 'from-cyan-500/20 to-cyan-600/20' },
    { label: 'CPU Usage', value: '34', unit: '%', icon: <Activity className="w-5 h-5" />, color: 'from-purple-500/20 to-purple-600/20' },
    { label: 'Memory', value: '2.4', unit: 'GB', icon: <BarChart3 className="w-5 h-5" />, color: 'from-pink-500/20 to-pink-600/20' },
    { label: 'Uptime', value: '99.9', unit: '%', icon: <TrendingUp className="w-5 h-5" />, color: 'from-green-500/20 to-green-600/20' }
  ]

  // Generate mock kundli distribution data
  const kundliDistribution = [
    { name: 'D1 (Birth)', value: analytics?.totalKundlis ? Math.floor(analytics.totalKundlis * 0.4) : 0 },
    { name: 'D9 (Navamsa)', value: analytics?.totalKundlis ? Math.floor(analytics.totalKundlis * 0.25) : 0 },
    { name: 'D10 (Dasamsa)', value: analytics?.totalKundlis ? Math.floor(analytics.totalKundlis * 0.2) : 0 },
    { name: 'Others', value: analytics?.totalKundlis ? Math.floor(analytics.totalKundlis * 0.15) : 0 }
  ]

  const COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AstroAI Admin Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">Welcome back, {user?.email?.split('@')[0]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-600/50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {analytics && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Users" 
                value={analytics?.totalUsers || 0}
                icon={<Users className="w-12 h-12" />}
                trend={12}
                color="blue" 
              />
              <StatCard 
                title="Active Users (30d)" 
                value={analytics?.activeUsers || 0}
                icon={<Activity className="w-12 h-12" />}
                trend={8}
                color="green" 
              />
              <StatCard
                title="Total Kundlis"
                value={analytics?.totalKundlis || 0}
                icon={<BarChart3 className="w-12 h-12" />}
                trend={25}
                color="purple"
              />
              <StatCard
                title="Tokens Used"
                value={analytics?.totalTokensUsed || 0}
                icon={<Zap className="w-12 h-12" />}
                trend={15}
                color="orange"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* User Growth Chart */}
              <ChartCard title="User Growth" subtitle="Last 30 days" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowth}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="totalUsers" stroke="#06b6d4" strokeWidth={2} name="Total Users" dot={false} />
                    <Line type="monotone" dataKey="newUsers" stroke="#a855f7" strokeWidth={2} name="New Users" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Kundli Distribution */}
              <ChartCard title="Kundli Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={kundliDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {kundliDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* System Metrics */}
              <ChartCard title="System Health" className="lg:col-span-2">
                <MetricsPanel metrics={systemMetrics} />
              </ChartCard>

              {/* Quick Actions */}
              <ChartCard title="Quick Actions">
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/users')}
                    className="w-full text-left px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition border border-blue-500/30 text-sm font-medium"
                  >
                    👥 Manage Users
                  </button>
                  <button
                    onClick={() => navigate('/kundlis')}
                    className="w-full text-left px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition border border-purple-500/30 text-sm font-medium"
                  >
                    📊 View Kundlis
                  </button>
                  <button
                    onClick={() => navigate('/analytics')}
                    className="w-full text-left px-4 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition border border-green-500/30 text-sm font-medium"
                  >
                    📈 Analytics
                  </button>
                  <button
                    onClick={() => navigate('/system')}
                    className="w-full text-left px-4 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition border border-orange-500/30 text-sm font-medium"
                  >
                    ⚙️ System Status
                  </button>
                </div>
              </ChartCard>
            </div>

            {/* Recent Activity */}
            <ChartCard title="Recent Activity" subtitle="Latest user actions">
              <ActivityFeed activities={recentActivity} />
            </ChartCard>
          </>
        )}
      </div>
    </div>
  )
}
