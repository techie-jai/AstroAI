import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { adminApi } from '../services/adminApi'
import { User } from '../types/admin'
import { Search, Trash2, Lock, RotateCcw, LogOut, ChevronLeft, Mail, Calendar, Zap, BookOpen, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ChartCard } from '../components/ChartCard'

export default function UsersPage() {
  const navigate = useNavigate()
  const { logout } = useAdminAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'kundlis'>('created')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await adminApi.getUsers(100, 0, search)
      setUsers(response.data.users)
    } catch (err: any) {
      setError(err.message || 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlockUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to block this user?')) return
    try {
      await adminApi.blockUser(userId, true)
      fetchUsers()
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to block user'))
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure? This will delete all user data.')) return
    try {
      await adminApi.deleteUser(userId)
      fetchUsers()
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to delete user'))
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      await adminApi.resetPassword(userId)
      alert('Password reset initiated')
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to reset password'))
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.displayName || '').localeCompare(b.displayName || '')
      case 'kundlis':
        return (b.kundliCount || 0) - (a.kundliCount || 0)
      case 'created':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const activeUsers = users.filter(u => !u.isBlocked).length
  const blockedUsers = users.filter(u => u.isBlocked).length
  const totalTokens = users.reduce((sum, u) => sum + (u.tokenUsage?.total || 0), 0)

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
                User Management
              </h1>
              <p className="text-sm text-slate-400 mt-1">Manage all registered users</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-slate-400 text-sm font-medium mb-2">Total Users</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-slate-400 text-sm font-medium mb-2">Active Users</p>
            <p className="text-3xl font-bold text-white">{activeUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-slate-400 text-sm font-medium mb-2">Blocked Users</p>
            <p className="text-3xl font-bold text-white">{blockedUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-slate-400 text-sm font-medium mb-2">Total Tokens</p>
            <p className="text-3xl font-bold text-white">{totalTokens.toLocaleString()}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <ChartCard title="Search & Filter Users" className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition border border-cyan-500/30 font-medium"
            >
              Search
            </button>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex gap-2">
            {(['name', 'created', 'kundlis'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                  sortBy === option
                    ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                    : 'bg-slate-700/30 text-slate-400 border border-slate-600/30 hover:border-slate-500/50'
                }`}
              >
                Sort by {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </ChartCard>

        {/* Users Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading users...</p>
          </div>
        ) : sortedUsers.length === 0 ? (
          <ChartCard title="No Users Found">
            <div className="text-center py-8">
              <p className="text-slate-400">No users match your search criteria</p>
            </div>
          </ChartCard>
        ) : (
          <ChartCard title={`Users (${sortedUsers.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Kundlis</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Tokens</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {sortedUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                            {(user.displayName || 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{user.displayName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          {user.kundliCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Zap className="w-4 h-4 text-orange-400" />
                          {(user.tokenUsage?.total || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isBlocked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDetailModal(true)
                            }}
                            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-sm border border-blue-500/30"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleBlockUser(user.uid)}
                            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition border border-yellow-500/30"
                            title="Block user"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.uid)}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition border border-purple-500/30"
                            title="Reset password"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.uid)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition border border-red-500/30"
                            title="Delete user"
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
        {showDetailModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full border border-slate-700/50 max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl">
                      {(selectedUser.displayName || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedUser.displayName}</h2>
                      <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Status</p>
                    <p className="text-white font-semibold">{selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
                  </div>
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Kundlis Generated</p>
                    <p className="text-white font-semibold">{selectedUser.kundliCount || 0}</p>
                  </div>
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Tokens Used</p>
                    <p className="text-white font-semibold">{(selectedUser.tokenUsage?.total || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Member Since</p>
                    <p className="text-white font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-4 mb-6">
                  <p className="text-slate-400 text-sm mb-2">User ID</p>
                  <p className="text-slate-300 font-mono text-xs break-all">{selectedUser.uid}</p>
                </div>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition border border-cyan-500/30 font-medium"
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
