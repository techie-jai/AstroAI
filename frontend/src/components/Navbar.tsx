import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl">✨</div>
            <span className="font-bold text-xl">AstroAI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="hover:text-indigo-200 transition">
              Dashboard
            </Link>
            <Link to="/generate" className="hover:text-indigo-200 transition">
              Generate
            </Link>
            <Link to="/history" className="hover:text-indigo-200 transition">
              History
            </Link>
            <Link to="/settings" className="hover:text-indigo-200 transition">
              Settings
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 hover:bg-indigo-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/generate"
              className="block px-4 py-2 hover:bg-indigo-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Generate
            </Link>
            <Link
              to="/history"
              className="block px-4 py-2 hover:bg-indigo-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 hover:bg-indigo-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
