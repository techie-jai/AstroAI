import { useState } from "react"
import { Link } from "react-router-dom"
import { TrendingUp, Star, Zap, Clock, Check, MessageCircle, Sparkles, BarChart3, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/authStore"

const stats = [
  { label: "Total Kundlis", value: "12", icon: TrendingUp, gradient: "from-purple-500 to-pink-500" },
  { label: "Latest Kundli", value: "Neha Verma", icon: Star, gradient: "from-amber-500 to-orange-500" },
  { label: "With Analysis", value: "3", icon: Zap, gradient: "from-cyan-500 to-blue-500" },
  { label: "Subscription", value: "Free", icon: Clock, gradient: "from-green-500 to-emerald-500" },
]

const features = [
  { text: "Accurate Vedic calculations" },
  { text: "AI-powered insights" },
  { text: "Chat with your kundli" },
  { text: "Download PDF reports" },
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `rgba(${i % 2 === 0 ? '139, 92, 246' : '6, 182, 212'}, 0.3)`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    name: "",
    placeOfBirth: "",
    latitude: "0",
    longitude: "0",
    timezoneOffset: "5.5",
    year: "2026",
    month: "1",
    day: "1",
    hour: "12",
    minute: "0",
  })

  const displayName = user?.displayName || "User"

  return (
    <div className="relative space-y-8 min-h-screen">
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <FloatingParticles />

      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">
              Welcome, {displayName}!
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-amber-400" />
              Your personalized astrological dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="cosmic-card rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground group-hover:gradient-text-purple transition-all">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className={`h-0.5 mt-4 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-full`} />
          </div>
        ))}
      </div>

      <div className="relative grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="cosmic-card rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Generate New Kundli</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-secondary/50 border-border focus:border-purple-500/50 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place" className="text-foreground font-medium">Place of Birth</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="place"
                      placeholder="Search for a city, hospital, landmark..."
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                      className="bg-secondary/50 border-border pl-10 focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground/70">
                    Powered by Google Maps. Search for exact locations to get high-precision coordinates.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-foreground font-medium">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-foreground font-medium">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-foreground font-medium">Timezone Offset (UTC)</Label>
                  <Input
                    id="timezone"
                    type="number"
                    step="0.5"
                    value={formData.timezoneOffset}
                    onChange={(e) => setFormData({ ...formData, timezoneOffset: e.target.value })}
                    className="bg-secondary/50 border-border focus:border-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-foreground font-medium">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-foreground font-medium">Month</Label>
                    <Input
                      id="month"
                      type="number"
                      min="1"
                      max="12"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="day" className="text-foreground font-medium">Day</Label>
                    <Input
                      id="day"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hour" className="text-foreground font-medium">Hour</Label>
                    <Input
                      id="hour"
                      type="number"
                      min="0"
                      max="23"
                      value={formData.hour}
                      onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minute" className="text-foreground font-medium">Minute</Label>
                    <Input
                      id="minute"
                      type="number"
                      min="0"
                      max="59"
                      value={formData.minute}
                      onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 glow-purple h-12 text-lg font-semibold transition-all duration-300 hover:scale-[1.02]">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Kundli
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="cosmic-card rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/chat">
                  <Button variant="outline" className="w-full justify-start gap-3 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <MessageCircle className="w-4 h-4 text-purple-400" />
                    </div>
                    Live Chat
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button variant="outline" className="w-full justify-start gap-3 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    Chat with AI
                  </Button>
                </Link>
                <Link to="/analysis">
                  <Button variant="outline" className="w-full justify-start gap-3 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 hover:border-pink-400/50 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                      <BarChart3 className="w-4 h-4 text-pink-400" />
                    </div>
                    View Analysis
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="cosmic-card rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-400" />
                Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li 
                    key={feature.text} 
                    className="flex items-center gap-3 text-sm text-muted-foreground group hover:text-foreground transition-colors"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-6 h-6 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="cosmic-card rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/30">
            <div className="p-5 relative">
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-purple-500/20 blur-2xl" />
              <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-cyan-500/20 blur-xl" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Upgrade</span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">Unlock Pro Features</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get unlimited AI analyses, detailed PDF reports, and priority support.
                </p>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
