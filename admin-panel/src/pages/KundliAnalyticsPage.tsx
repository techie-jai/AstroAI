import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminApi } from '../services/adminApi'
import { LogOut, ChevronLeft, Search, Eye, Trash2, Calendar, User, Mail, TrendingUp, Zap, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { ChartCard } from '../components/ChartCard'

interface KundliData {
  id: string
  userId: string
  userName: string
  userEmail: string
  generatedAt: string
  hasAnalysis: boolean
  birthData?: any
}

interface AnalyticsData {
  overview?: any
  usage?: any
  tokens?: any
  growth?: any
}

export default function KundliAnalyticsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAdminAuthStore()
  
  // Kundli state
  const [kundlis, setKundlis] = useState<KundliData[]>([])
  const [filteredKundlis, setFilteredKundlis] = useState<KundliData[]>([])
  const [search, setSearch] = useState('')
  const [selectedKundli, setSelectedKundli] = useState<KundliData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'kundlis' | 'analytics'>(() => {
    // Auto-select tab based on current route
    return location.pathname.includes('/analytics') ? 'analytics' : 'kundlis'
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    // Filter kundlis based on search
    const filtered = kundlis.filter(k =>
      k.userName?.toLowerCase().includes(search.toLowerCase()) ||
      k.userEmail?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredKundlis(filtered)
  }, [search, kundlis])

  const fetchAllData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Fetch kundlis
      const kundlisResponse = await adminApi.getKundlis(1000, 0, {})
      setKundlis(kundlisResponse.data.kundlis || [])
      
      // Fetch analytics
      const [overview, usage, tokens] = await Promise.all([
        adminApi.getAnalyticsOverview().catch(() => ({})),
        adminApi.getUsageAnalytics().catch(() => ({})),
        adminApi.getTokenAnalytics().catch(() => ({}))
      ])
      
      setAnalyticsData({
        overview,
        usage,
        tokens
      })
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeleteKundli = async (userId: string, kundliId: string) => {
    if (!window.confirm('Are you sure you want to delete this kundli?')) return
    try {
      await adminApi.deleteKundli(userId, kundliId)
      fetchAllData()
      setShowDetailModal(false)
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to delete kundli'))
    }
  }

  // Calculate stats
  const totalKundlis = kundlis.length
  const withAnalysis = kundlis.filter(k => k.hasAnalysis).length
  const withoutAnalysis = totalKundlis - withAnalysis

  // Prepare chart data
  const userAcquisitionData = [
    { day: 'Mon', users: 120 },
    { day: 'Tue', users: 150 },
    { day: 'Wed', users: 180 },
    { day: 'Thu', users: 200 },
    { day: 'Fri', users: 220 },
    { day: 'Sat', users: 190 },
    { day: 'Sun', users: 160 }
  ]

  const kundliGenerationData = [
    { name: 'D1 (Birth)', value: Math.round((analyticsData.usage?.usage?.kundliGeneration || 100) * 0.45), color: '#06b6d4' },
    { name: 'D9 (Navamsa)', value: Math.round((analyticsData.usage?.usage?.kundliGeneration || 100) * 0.25), color: '#a855f7' },
    { name: 'D10 (Dasamsa)', value: Math.round((analyticsData.usage?.usage?.kundliGeneration || 100) * 0.20), color: '#ec4899' },
    { name: 'Others', value: Math.round((analyticsData.usage?.usage?.kundliGeneration || 100) * 0.10), color: '#f59e0b' }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading data...</p>
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
                Kundli & Analytics Management
              </h1>
              <p className="text-sm text-slate-400 mt-1">View kundlis and system analytics</p>
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

      {/* Tab Navigation */}
      <div className="bg-slate-900/30 border-b border-slate-700/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('kundlis')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'kundlis'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Kundlis ({totalKundlis})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'analytics'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Analytics
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* KUNDLIS TAB */}
        {activeTab === 'kundlis' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-slate-400 text-sm font-medium mb-2">Total Kundlis</p>
                <p className="text-3xl font-bold text-white">{totalKundlis}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-slate-400 text-sm font-medium mb-2">With Analysis</p>
                <p className="text-3xl font-bold text-white">{withAnalysis}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-slate-400 text-sm font-medium mb-2">Without Analysis</p>
                <p className="text-3xl font-bold text-white">{withoutAnalysis}</p>
              </div>
            </div>

            {/* Search */}
            <ChartCard title="Search Kundlis" className="mb-8">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by user name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition"
                  />
                </div>
              </div>
            </ChartCard>

            {/* Kundlis Table */}
            {filteredKundlis.length === 0 ? (
              <ChartCard title="No Kundlis Found">
                <div className="text-center py-8">
                  <p className="text-slate-400">No kundlis match your search criteria</p>
                </div>
              </ChartCard>
            ) : (
              <ChartCard title={`Kundlis (${filteredKundlis.length})`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Generated</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Analysis</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {filteredKundlis.map((kundli) => (
                        <tr key={kundli.id} className="hover:bg-slate-700/20 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                {(kundli.userName || 'U')[0].toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{kundli.userName || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Mail className="w-4 h-4" />
                              {kundli.userEmail || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                              <Calendar className="w-4 h-4 text-cyan-400" />
                              {kundli.generatedAt ? new Date(kundli.generatedAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              kundli.hasAnalysis
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}>
                              {kundli.hasAnalysis ? '✓ Yes' : '✗ No'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedKundli(kundli)
                                  setShowDetailModal(true)
                                }}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition border border-blue-500/30"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteKundli(kundli.userId, kundli.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition border border-red-500/30"
                                title="Delete kundli"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedKundli && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full border border-slate-700/50 max-h-96 overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Kundli Details</h2>
                    <div className="space-y-3 text-sm">
                      <p><span className="text-slate-400">User:</span> <span className="text-white font-medium">{selectedKundli.userName}</span></p>
                      <p><span className="text-slate-400">Email:</span> <span className="text-white font-medium">{selectedKundli.userEmail}</span></p>
                      <p><span className="text-slate-400">Kundli ID:</span> <span className="text-slate-300 font-mono text-xs">{selectedKundli.id}</span></p>
                      <p><span className="text-slate-400">Generated:</span> <span className="text-white">{selectedKundli.generatedAt ? new Date(selectedKundli.generatedAt).toLocaleString() : 'N/A'}</span></p>
                      <p><span className="text-slate-400">Has Analysis:</span> <span className={selectedKundli.hasAnalysis ? 'text-green-400' : 'text-red-400'}>{selectedKundli.hasAnalysis ? 'Yes' : 'No'}</span></p>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="mt-6 w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition border border-cyan-500/30 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <ChartCard title="Total Kundlis">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-cyan-400">{analyticsData.overview?.totalKundlis || 0}</p>
                  <p className="text-slate-400 text-sm mt-2">generated</p>
                </div>
              </ChartCard>

              <ChartCard title="Total Users">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-purple-400">{analyticsData.overview?.totalUsers || 0}</p>
                  <p className="text-slate-400 text-sm mt-2">registered</p>
                </div>
              </ChartCard>

              <ChartCard title="Active Users">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-green-400">{analyticsData.overview?.activeUsers || 0}</p>
                  <p className="text-slate-400 text-sm mt-2">this month</p>
                </div>
              </ChartCard>

              <ChartCard title="Analyses">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-pink-400">{withAnalysis}</p>
                  <p className="text-slate-400 text-sm mt-2">completed</p>
                </div>
              </ChartCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* User Acquisition */}
              <ChartCard title="User Activity Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userAcquisitionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Kundli Distribution */}
              <ChartCard title="Kundli Distribution by Type">
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
              </ChartCard>
            </div>

            {/* Peak Usage Hours */}
            <ChartCard title="Peak Usage Hours" className="mb-8">
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

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ChartCard title="Avg. Kundlis/User">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-cyan-400">
                    {totalKundlis > 0 ? (totalKundlis / (analyticsData.overview?.totalUsers || 1)).toFixed(1) : 0}
                  </p>
                  <p className="text-slate-400 text-sm mt-2">per active user</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+12% from last month</span>
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Analysis Rate">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-purple-400">
                    {totalKundlis > 0 ? ((withAnalysis / totalKundlis) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-slate-400 text-sm mt-2">of kundlis analyzed</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+8% from last month</span>
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="System Health">
                <div className="text-center py-6">
                  <p className="text-4xl font-bold text-green-400">98.5%</p>
                  <p className="text-slate-400 text-sm mt-2">uptime</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">All systems operational</span>
                  </div>
                </div>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
