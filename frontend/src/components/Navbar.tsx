import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user } = useAuthStore()

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg h-16 flex items-center px-6">
      <div className="flex-1 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="text-2xl">✨</div>
          <span className="font-bold text-xl">AstroAI</span>
        </Link>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-indigo-100">{user?.email}</span>
        </div>
      </div>
    </nav>
  )
}
