import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminApi } from '../services/adminApi'
import { LogOut, ChevronLeft, AlertCircle, CheckCircle, Activity, Database, Server, Zap, Clock, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ChartCard } from '../components/ChartCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function SystemPage() {
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

  // Mock system metrics data
  const systemMetrics = [
    { time: '00:00', cpu: 34, memory: 62, disk: 45 },
    { time: '04:00', cpu: 28, memory: 58, disk: 45 },
    { time: '08:00', cpu: 52, memory: 72, disk: 46 },
    { time: '12:00', cpu: 78, memory: 85, disk: 48 },
    { time: '16:00', cpu: 82, memory: 88, disk: 50 },
    { time: '20:00', cpu: 65, memory: 78, disk: 49 },
    { time: '23:00', cpu: 42, memory: 68, disk: 49 }
  ]

  const services = [
    { name: 'Backend API', status: 'healthy', uptime: '99.9%', responseTime: '145ms', lastCheck: '2 mins ago' },
    { name: 'Database', status: 'healthy', uptime: '99.95%', responseTime: '12ms', lastCheck: '1 min ago' },
    { name: 'Cache Server', status: 'healthy', uptime: '99.8%', responseTime: '5ms', lastCheck: '3 mins ago' },
    { name: 'File Storage', status: 'healthy', uptime: '99.7%', responseTime: '234ms', lastCheck: '5 mins ago' },
    { name: 'Email Service', status: 'warning', uptime: '98.5%', responseTime: '1200ms', lastCheck: '10 mins ago' }
  ]

  const recentLogs = [
    { timestamp: '2024-04-13 14:32:15', level: 'INFO', message: 'User login successful', service: 'auth' },
    { timestamp: '2024-04-13 14:31:42', level: 'INFO', message: 'Kundli generated successfully', service: 'api' },
    { timestamp: '2024-04-13 14:30:18', level: 'WARNING', message: 'High memory usage detected', service: 'system' },
    { timestamp: '2024-04-13 14:29:55', level: 'INFO', message: 'Database backup completed', service: 'db' },
    { timestamp: '2024-04-13 14:28:30', level: 'ERROR', message: 'Failed to send email notification', service: 'email' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading system status...</p>
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
                System Status
              </h1>
              <p className="text-sm text-slate-400 mt-1">Monitor system health and performance</p>
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
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Overall Status</p>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">Healthy</p>
            <p className="text-green-400 text-sm mt-2">All systems operational</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Uptime</p>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">99.9%</p>
            <p className="text-blue-400 text-sm mt-2">Last 30 days</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Avg Response</p>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">145ms</p>
            <p className="text-purple-400 text-sm mt-2">API latency</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Active Requests</p>
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white">342</p>
            <p className="text-orange-400 text-sm mt-2">per minute</p>
          </div>
        </div>

        {/* System Metrics Chart */}
        <ChartCard title="System Performance" subtitle="Last 24 hours" className="mb-8">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={systemMetrics}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={2} name="CPU %" dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={2} name="Memory %" dot={false} />
              <Line type="monotone" dataKey="disk" stroke="#ec4899" strokeWidth={2} name="Disk %" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Services Status */}
        <ChartCard title="Service Status" className="mb-8">
          <div className="space-y-3">
            {services.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg border border-slate-600/30 hover:bg-slate-700/40 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${service.status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <div>
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-slate-400 text-sm">Response: {service.responseTime} • Uptime: {service.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === 'healthy'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {service.status === 'healthy' ? '✓ Healthy' : '⚠ Warning'}
                  </span>
                  <p className="text-slate-500 text-xs mt-1">{service.lastCheck}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Logs */}
        <ChartCard title="Recent System Logs">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg border border-slate-600/30 hover:bg-slate-700/40 transition">
                <div className="flex-shrink-0 mt-1">
                  {log.level === 'ERROR' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  {log.level === 'WARNING' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                  {log.level === 'INFO' && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                      log.level === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-xs text-slate-500">[{log.service}]</span>
                  </div>
                  <p className="text-sm text-slate-300">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
