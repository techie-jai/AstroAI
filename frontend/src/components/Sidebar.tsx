import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LayoutDashboard, BookOpen, Sparkles, MessageCircle, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/kundli', label: 'Kundli', icon: BookOpen },
    { path: '/analysis', label: 'Analysis', icon: Sparkles },
    { path: '/livechat', label: 'Chat', icon: MessageCircle },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 text-white transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-700">
          {isOpen && <span className="font-bold text-xl">AstroAI</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-indigo-800 rounded-lg transition"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-2 py-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isLoggingOut
                ? 'bg-red-900 text-red-100 opacity-50 cursor-not-allowed'
                : 'text-red-100 hover:bg-red-900'
            }`}
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
