"use client"

import { Settings, Mail, User, Shield, Bell, CreditCard, LogOut, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const settingsSections = [
  {
    title: "Notifications",
    description: "Manage your email and push notifications",
    icon: Bell,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Privacy & Security",
    description: "Update your password and security settings",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Subscription",
    description: "Manage your subscription and billing",
    icon: CreditCard,
    color: "from-amber-500 to-orange-500",
  },
]

export default function SettingsPage() {
  return (
    <div className="relative space-y-8 max-w-3xl min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 cosmic-gradient-bg opacity-15 pointer-events-none" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(6, 182, 212, 0.5)',
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${5 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">Settings</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Manage your account preferences
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="relative cosmic-card rounded-2xl overflow-hidden">
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
                <p className="text-foreground font-medium">lemniscatetools@gmail.com</p>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                Edit
              </Button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 group hover:border-purple-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Display Name</p>
                <p className="text-foreground font-medium">Lemniscate Lab</p>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Settings */}
      <div className="relative space-y-4">
        {settingsSections.map((section, index) => (
          <div
            key={section.title}
            className="cosmic-card rounded-xl p-5 group hover:scale-[1.01] transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-purple-300 transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="relative cosmic-card rounded-2xl overflow-hidden border-red-500/20">
        <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        <div className="p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">
            Delete Account
          </Button>
        </div>
      </div>

      {/* Logout button */}
      <div className="relative">
        <Button variant="outline" className="w-full border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 gap-2 h-12 text-base">
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
