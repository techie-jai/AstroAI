import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminApi } from '../services/adminApi'
import { LogOut, ChevronLeft, Search, Eye, Trash2, Download, Calendar, User, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ChartCard } from '../components/ChartCard'

export default function KundlisPage() {
  const navigate = useNavigate()
  const { logout } = useAdminAuthStore()
  const [kundlis, setKundlis] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedKundli, setSelectedKundli] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchKundlis()
  }, [])

  const fetchKundlis = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.getKundlis(100, 0, {})
      setKundlis(response.data.kundlis || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load kundlis')
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
      fetchKundlis()
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to delete kundli'))
    }
  }

  const filteredKundlis = kundlis.filter(k =>
    k.userName?.toLowerCase().includes(search.toLowerCase()) ||
    k.userEmail?.toLowerCase().includes(search.toLowerCase())
  )

  const totalKundlis = kundlis.length
  const withAnalysis = kundlis.filter(k => k.hasAnalysis).length
  const withoutAnalysis = totalKundlis - withAnalysis

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
                Kundli Management
              </h1>
              <p className="text-sm text-slate-400 mt-1">View and manage all generated kundlis</p>
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
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

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
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading kundlis...</p>
          </div>
        ) : filteredKundlis.length === 0 ? (
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
      </div>
    </div>
  )
}
