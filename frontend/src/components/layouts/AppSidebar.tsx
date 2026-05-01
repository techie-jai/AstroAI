import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Sparkles } from 'lucide-react'
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Heart,
  MessageCircle,
  Settings,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'

interface AppSidebarProps {
  onClose?: () => void
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/kundli', icon: BookOpen, label: 'Kundli' },
  { path: '/analysis', icon: Sparkles, label: 'Analysis' },
  { path: '/dosha-analysis', icon: Target, label: 'Dosha Analysis' },
  { path: '/kundli-matching', icon: Heart, label: 'Kundli Matching' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function AppSidebar({ onClose }: AppSidebarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">Kendraa.ai</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-white glow-purple"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border/50 space-y-3">
        {user && (
          <div className="px-3 py-2 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="text-sm font-medium text-foreground truncate">
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
