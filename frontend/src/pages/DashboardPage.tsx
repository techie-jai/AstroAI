import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, Zap, Clock, TrendingUp, Sparkles, AlertCircle, Calendar, RefreshCw, Check, MessageCircle, BarChart3, Search, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'
import InsightCard from '../components/InsightCard'
import toast from 'react-hot-toast'
import { searchCities, CityData } from '../data/cities'
import { GooglePlacesAutocomplete } from '../components/GooglePlacesAutocomplete'

interface Calculation {
  calculation_id: string
  kundli_id: string
  name: string
  birth_date: string
  generation_date: any
  has_analysis: boolean
}

interface DashboardInsights {
  important_aspects: string
  good_times: string
  challenges: string
  interesting_facts: string
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [insights, setInsights] = useState<DashboardInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingInsights, setLoadingInsights] = useState(false)
  
  const [isGenerating, setIsGenerating] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    place_name: '',
    latitude: 0,
    longitude: 0,
    timezone_offset: 5.5,
    year: new Date().getFullYear(),
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Try to fetch from backend first
      try {
        const response = await api.getUserCalculations()
        const rawCalcs = response.data.calculations || []
        // Map backend response to Calculation interface
        const calcs: Calculation[] = rawCalcs.map((calc: any) => ({
          calculation_id: calc.calculation_id,
          kundli_id: calc.kundli_id,
          name: calc.birth_data?.name || 'Unknown',
          birth_date: calc.birth_data ? `${calc.birth_data.year}-${String(calc.birth_data.month).padStart(2, '0')}-${String(calc.birth_data.day).padStart(2, '0')}` : 'N/A',
          generation_date: calc.generation_date,
          has_analysis: calc.has_analysis || false
        }))
        setCalculations(calcs)

        if (calcs.length > 0) {
          await fetchInsights(calcs[0].kundli_id)
        }
      } catch (backendError) {
        console.error('[DASHBOARD] Backend fetch failed:', backendError)
        setCalculations([])
        toast.error('Failed to load kundlis from backend')
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleAnalysisGenerated = (event: Event) => {
      console.log('[DASHBOARD] Analysis generated event received, refreshing data...')
      fetchData()
    }

    window.addEventListener('analysisGenerated', handleAnalysisGenerated)
    return () => window.removeEventListener('analysisGenerated', handleAnalysisGenerated)
  }, [])


  const fetchInsights = async (kundliId: string, forceRefresh = false) => {
    try {
      setLoadingInsights(true)
      const response = await api.getDashboardInsights(kundliId, forceRefresh)
      setInsights(response.data)
      if (forceRefresh) {
        toast.success('Insights refreshed successfully')
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      if (forceRefresh) {
        toast.error('Failed to refresh insights')
      }
    } finally {
      setLoadingInsights(false)
    }
  }

  const handleRefreshInsights = () => {
    if (calculations.length > 0) {
      fetchInsights(calculations[0].kundli_id, true)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    if (typeof date === 'string') return date.split('T')[0]
    if (date.toDate) return date.toDate().toLocaleDateString()
    return 'N/A'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name !== 'place_name') {
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(Number(value)) ? value : Number(value)
      }))
    }
  }

  const handlePlaceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      place_name: value
    }))
  }

  const selectPlace = (place: CityData) => {
    setFormData(prev => ({
      ...prev,
      place_name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone_offset: place.timezone
    }))
  }

  const handleGenerateKundli = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const response = await api.generateKundli(formData)
      toast.success('Kundli generated successfully!')
      navigate(`/results/${response.data.kundli_id}`)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.error || error?.message || 'Failed to generate kundli'
      toast.error(errorMessage)
      console.error('Kundli generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary"></div>
      </div>
    )
  }

  const latestKundli = calculations.length > 0 ? calculations[0] : null

  // Helper function to get gradient class for stat icons
  const getStatGradient = (index: number) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-amber-500 to-orange-500',
      'from-cyan-500 to-blue-500',
      'from-green-500 to-emerald-500'
    ]
    return gradients[index] || gradients[0]
  }

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
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

      <div className="relative">
        {/* Welcome Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">
              Welcome, {user?.displayName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-amber-400" />
              Your personalized astrological dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Kundlis', value: calculations.length.toString(), icon: TrendingUp },
          { label: 'Latest Kundli', value: latestKundli?.name || 'None', icon: Star },
          { label: 'With Analysis', value: calculations.filter(c => c.has_analysis).length.toString(), icon: Zap },
          { label: 'Subscription', value: 'Free', icon: Clock }
        ].map((stat, index) => (
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatGradient(index)} flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className={`h-0.5 mt-4 bg-gradient-to-r ${getStatGradient(index)} opacity-0 group-hover:opacity-100 transition-opacity rounded-full`} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="relative grid lg:grid-cols-3 gap-6">
        {/* Left Column - Generator Form */}
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

              <form onSubmit={handleGenerateKundli} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-foreground font-medium text-sm">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-foreground font-medium text-sm">Place of Birth</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <div className="pl-10">
                      <GooglePlacesAutocomplete
                        value={formData.place_name}
                        onChange={handlePlaceChange}
                        onSelect={selectPlace}
                        placeholder="Search for a city, hospital, landmark..."
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/70">
                    Powered by Google Maps. Search for exact locations to get high-precision coordinates.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-foreground font-medium text-sm">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      step="0.0001"
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground font-medium text-sm">Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      step="0.0001"
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground font-medium text-sm">Timezone Offset (UTC)</label>
                  <input
                    type="number"
                    name="timezone_offset"
                    value={formData.timezone_offset}
                    onChange={handleChange}
                    step="0.5"
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-foreground font-medium text-sm">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground font-medium text-sm">Month</label>
                    <input
                      type="number"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                      min="1"
                      max="12"
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground font-medium text-sm">Day</label>
                    <input
                      type="number"
                      name="day"
                      value={formData.day}
                      onChange={handleChange}
                      min="1"
                      max="31"
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-foreground font-medium text-sm">Hour (24h)</label>
                    <input
                      type="number"
                      name="hour"
                      value={formData.hour}
                      onChange={handleChange}
                      min="0"
                      max="23"
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground font-medium text-sm">Minute</label>
                    <input
                      type="number"
                      name="minute"
                      value={formData.minute}
                      onChange={handleChange}
                      min="0"
                      max="59"
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 glow-purple hover:scale-[1.02]"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin-slow w-5 h-5 rounded-full border-2 border-white/30 border-t-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Kundli</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Features */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="cosmic-card rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/livechat">
                  <button className="w-full justify-start gap-3 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all group rounded-lg px-4 py-2.5 flex items-center text-foreground font-medium">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <MessageCircle className="w-4 h-4 text-purple-400" />
                    </div>
                    Live Chat
                  </button>
                </Link>
                {latestKundli && (
                  <>
                    <Link to={`/chat/${latestKundli.kundli_id}`}>
                      <button className="w-full justify-start gap-3 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all group rounded-lg px-4 py-2.5 flex items-center text-foreground font-medium">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                        </div>
                        Chat with AI
                      </button>
                    </Link>
                    <Link to="/analysis">
                      <button className="w-full justify-start gap-3 border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 hover:border-pink-400/50 transition-all group rounded-lg px-4 py-2.5 flex items-center text-foreground font-medium">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                          <BarChart3 className="w-4 h-4 text-pink-400" />
                        </div>
                        View Analysis
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="cosmic-card rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-400" />
                Features
              </h3>
              <ul className="space-y-3">
                {[
                  'Accurate Vedic calculations',
                  'AI-powered insights',
                  'Chat with your kundli',
                  'Download PDF reports'
                ].map((feature, index) => (
                  <li 
                    key={feature} 
                    className="flex items-center gap-3 text-sm text-muted-foreground group hover:text-foreground transition-colors"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-6 h-6 rounded-md bg-green-500/20 border border-green-500/30 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Upgrade Card */}
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
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02]">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Astrological Insights Section */}
      {latestKundli && (
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Astrological Insights</h2>
            </div>
            <button
              onClick={handleRefreshInsights}
              disabled={loadingInsights}
              className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={loadingInsights ? 'animate-spin' : ''} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          {loadingInsights ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin-slow w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary"></div>
            </div>
          ) : insights ? (
            <div className="space-y-4">
              <InsightCard
                title="Important Aspects"
                description={insights.important_aspects}
                icon={Sparkles}
                color="indigo"
              />
              <InsightCard
                title="Good Times Ahead"
                description={insights.good_times}
                icon={Calendar}
                color="green"
              />
              <InsightCard
                title="Challenges & Cautions"
                description={insights.challenges}
                icon={AlertCircle}
                color="orange"
              />
              <InsightCard
                title="Interesting Facts"
                description={insights.interesting_facts}
                icon={Star}
                color="purple"
              />
            </div>
          ) : (
            <div className="cosmic-card p-8 text-center rounded-2xl">
              <AlertCircle className="mx-auto mb-4 text-orange-500" size={48} />
              <p className="text-muted-foreground mb-6">
                {latestKundli?.has_analysis 
                  ? 'No insights generated yet. Generate insights from your analysis.' 
                  : 'Generate an analysis first to get insights about your kundli.'}
              </p>
              {latestKundli?.has_analysis ? (
                <button
                  onClick={handleRefreshInsights}
                  disabled={loadingInsights}
                  className="inline-block bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  {loadingInsights ? 'Generating...' : 'Generate Insights'}
                </button>
              ) : (
                <Link
                  to="/analysis"
                  className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Go to Analysis
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
