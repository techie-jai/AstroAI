import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminApi } from '../services/adminApi'
import { LogOut, ChevronLeft, TrendingUp, Users, Zap, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { ChartCard } from '../components/ChartCard'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const { logout } = useAdminAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Mock data for analytics
  const userAcquisitionData = [
    { day: 'Mon', organic: 120, referral: 80, paid: 60 },
    { day: 'Tue', organic: 150, referral: 95, paid: 75 },
    { day: 'Wed', organic: 180, referral: 110, paid: 90 },
    { day: 'Thu', organic: 200, referral: 130, paid: 110 },
    { day: 'Fri', organic: 220, referral: 150, paid: 130 },
    { day: 'Sat', organic: 190, referral: 120, paid: 100 },
    { day: 'Sun', organic: 160, referral: 100, paid: 80 }
  ]

  const kundliGenerationData = [
    { name: 'D1 (Birth)', value: 45, color: '#06b6d4' },
    { name: 'D9 (Navamsa)', value: 25, color: '#a855f7' },
    { name: 'D10 (Dasamsa)', value: 20, color: '#ec4899' },
    { name: 'D27 (Naksatra)', value: 10, color: '#f59e0b' }
  ]

  const usageHeatmapData = [
    { hour: '00:00', users: 45 },
    { hour: '04:00', users: 30 },
    { hour: '08:00', users: 120 },
    { hour: '12:00', users: 280 },
    { hour: '16:00', users: 350 },
    { hour: '20:00', users: 290 },
    { hour: '23:00', users: 100 }
  ]

  const topUsersData = [
    { name: 'John Doe', kundlis: 45, tokens: 12500 },
    { name: 'Jane Smith', kundlis: 38, tokens: 10200 },
    { name: 'Mike Johnson', kundlis: 32, tokens: 8900 },
    { name: 'Sarah Williams', kundlis: 28, tokens: 7600 },
    { name: 'Tom Brown', kundlis: 24, tokens: 6400 }
  ]

  const COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#f59e0b']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Analytics & Insights
              </h1>
              <p className="text-sm text-slate-400 mt-1">Detailed usage patterns and trends</p>
            </div>
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
        {/* User Acquisition Funnel */}
        <ChartCard title="User Acquisition Sources" subtitle="Weekly breakdown by source" className="mb-8">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={userAcquisitionData}>
              <defs>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="organic" stackId="1" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOrganic)" name="Organic" />
              <Area type="monotone" dataKey="referral" stackId="1" stroke="#a855f7" fillOpacity={1} fill="url(#colorReferral)" name="Referral" />
              <Area type="monotone" dataKey="paid" stackId="1" stroke="#ec4899" fillOpacity={1} fill="url(#colorPaid)" name="Paid" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Kundli Generation Distribution */}
          <ChartCard title="Kundli Generation by Type">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={kundliGenerationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {kundliGenerationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {kundliGenerationData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Usage Heatmap */}
          <ChartCard title="Peak Usage Hours">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageHeatmapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                <Bar dataKey="users" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Top Users Leaderboard */}
        <ChartCard title="Top Users Leaderboard" className="mb-8">
          <div className="space-y-3">
            {topUsersData.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg hover:bg-slate-700/40 transition border border-slate-600/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <BookOpen className="w-3 h-3" />
                      {user.kundlis} kundlis
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold flex items-center gap-1">
                    <Zap className="w-4 h-4 text-orange-400" />
                    {user.tokens.toLocaleString()}
                  </p>
                  <p className="text-slate-400 text-sm">tokens</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChartCard title="Avg. Kundlis/User">
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-cyan-400">3.2</p>
              <p className="text-slate-400 text-sm mt-2">per active user</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12% from last month</span>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Avg. Session Duration">
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-purple-400">18m 45s</p>
              <p className="text-slate-400 text-sm mt-2">per session</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+8% from last month</span>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Conversion Rate">
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-pink-400">24.5%</p>
              <p className="text-slate-400 text-sm mt-2">signup to kundli</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+5% from last month</span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

function BookOpen(props: any) {
  return <Users {...props} />
}
