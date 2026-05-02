import React from 'react'
import { Settings, Mail, User, Shield, Bell, CreditCard, LogOut, Sparkles, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const settingsSections = [
  { title: "Notifications", description: "Manage your email and push notifications", icon: Bell, color: "from-cyan-500 to-blue-500" },
  { title: "Privacy & Security", description: "Update your password and security settings", icon: Shield, color: "from-green-500 to-emerald-500" },
  { title: "Subscription", description: "Manage your subscription and billing", icon: CreditCard, color: "from-amber-500 to-orange-500" },
]

export default function SettingsPage() {
  const { user, logout } = useAuthStore()

  return (
    <div className="relative space-y-8 w-full">
      {/* Floating Particles */}
      <div className="floating-particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Settings</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Manage your account preferences
            </p>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="cosmic-card rounded-2xl overflow-hidden mt-8">
          <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Account Information</h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 group hover:border-purple-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="text-foreground font-medium">{user?.email || "user@example.com"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 group hover:border-purple-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Display Name</p>
                  <p className="text-foreground font-medium">{user?.displayName || "User"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4 mt-8">
          {settingsSections.map((section, i) => {
            const Icon = section.icon
            return (
              <div key={section.title} className="cosmic-card rounded-xl p-5 group hover:scale-[1.01] transition-all duration-300 cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-purple-300 transition-colors">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Danger Zone */}
        <div className="cosmic-card rounded-2xl overflow-hidden border-red-500/20 mt-8">
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <div className="p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button className="border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 px-4 py-2 rounded-lg transition">
              Delete Account
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <button
            onClick={logout}
            className="w-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 gap-2 h-12 text-base rounded-lg transition flex items-center justify-center text-foreground font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
