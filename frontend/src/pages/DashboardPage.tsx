import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, Zap, Clock, TrendingUp, Sparkles, AlertCircle, Calendar, RefreshCw } from 'lucide-react'
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

  return (
    <div className="relative w-full">
      {/* Floating Particles Background */}
      <div className="floating-particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Welcome back</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text">Welcome, {user?.displayName || user?.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground mt-2">Your personalized astrological dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Kundlis</p>
                <p className="text-3xl font-bold text-foreground glow-text mt-1">{calculations.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Latest Kundli</p>
                <p className="text-lg font-bold text-foreground mt-1 truncate">{latestKundli?.name || 'None'}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">With Analysis</p>
                <p className="text-3xl font-bold text-foreground glow-text mt-1">{calculations.filter(c => c.has_analysis).length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Subscription</p>
                <p className="text-2xl font-bold text-primary mt-1">Free</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator & Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generate Kundli Card */}
            <div className="cosmic-card p-8">
              <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full mb-6"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Generate New Kundli</h2>
              </div>
              
              <form onSubmit={handleGenerateKundli} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Place of Birth</label>
                    <GooglePlacesAutocomplete
                      value={formData.place_name}
                      onChange={handlePlaceChange}
                      onSelect={selectPlace}
                      placeholder="Search for a city, hospital, landmark..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">Powered by Google Maps. Search for exact locations to get high-precision coordinates.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Latitude</label>
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        step="0.0001"
                        className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Longitude</label>
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        step="0.0001"
                        className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Timezone Offset (UTC)</label>
                    <input
                      type="number"
                      name="timezone_offset"
                      value={formData.timezone_offset}
                      onChange={handleChange}
                      step="0.5"
                      className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Month</label>
                      <input
                        type="number"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        min="1"
                        max="12"
                        className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Day</label>
                      <input
                        type="number"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        min="1"
                        max="31"
                        className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Hour (24h)</label>
                      <input
                        type="number"
                        name="hour"
                        value={formData.hour}
                        onChange={handleChange}
                        min="0"
                        max="23"
                        className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Minute</label>
                      <input
                        type="number"
                        name="minute"
                        value={formData.minute}
                        onChange={handleChange}
                        min="0"
                        max="59"
                        className="w-full px-4 py-2 bg-input-bg border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 glow-purple"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin-slow w-5 h-5 rounded-full border-2 border-white/30 border-t-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Kundli</span>
                      </>
                    )}
                  </button>
                </form>
            </div>

            {/* Insights Section */}
            {latestKundli && (
              <div>
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
                  <div className="cosmic-card p-8 text-center">
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

          {/* Right Column - Quick Actions & Features */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="cosmic-card p-6 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full mb-6"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
              </div>
              <div className="space-y-2">
                <Link
                  to="/livechat"
                  className="block w-full text-center bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-4 rounded-lg transition"
                >
                  Live Chat
                </Link>
                {latestKundli && (
                  <>
                    <Link
                      to={`/chat/${latestKundli.kundli_id}`}
                      className="block w-full text-center bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Chat with AI
                    </Link>
                    <Link
                      to="/analysis"
                      className="block w-full text-center bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-4 rounded-lg transition"
                    >
                      View Analysis
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="cosmic-card p-6">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-6"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Features</h2>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Accurate Vedic calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>AI-powered insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Chat with your kundli</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Download PDF reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
