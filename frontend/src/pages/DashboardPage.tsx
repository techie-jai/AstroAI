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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const latestKundli = calculations.length > 0 ? calculations[0] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.displayName || user?.email}!</h1>
          <p className="text-gray-600 mt-2">Your personalized astrological dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Kundlis</p>
                <p className="text-3xl font-bold text-gray-900">{calculations.length}</p>
              </div>
              <TrendingUp className="text-indigo-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Latest Kundli</p>
                <p className="text-xl font-bold text-gray-900">{latestKundli?.name || 'None'}</p>
              </div>
              <Star className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">With Analysis</p>
                <p className="text-3xl font-bold text-gray-900">{calculations.filter(c => c.has_analysis).length}</p>
              </div>
              <Zap className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Subscription</p>
                <p className="text-2xl font-bold text-indigo-600">Free</p>
              </div>
              <Clock className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generator & Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generate Kundli Card */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate New Kundli</h2>
              
              <form onSubmit={handleGenerateKundli} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
                    <GooglePlacesAutocomplete
                      value={formData.place_name}
                      onChange={handlePlaceChange}
                      onSelect={selectPlace}
                      placeholder="Search for a city, hospital, landmark..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Powered by Google Maps. Search for exact locations to get high-precision coordinates.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        step="0.0001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        step="0.0001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone Offset (UTC)</label>
                    <input
                      type="number"
                      name="timezone_offset"
                      value={formData.timezone_offset}
                      onChange={handleChange}
                      step="0.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                      <input
                        type="number"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        min="1"
                        max="12"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                      <input
                        type="number"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        min="1"
                        max="31"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hour (24h)</label>
                      <input
                        type="number"
                        name="hour"
                        value={formData.hour}
                        onChange={handleChange}
                        min="0"
                        max="23"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
                      <input
                        type="number"
                        name="minute"
                        value={formData.minute}
                        onChange={handleChange}
                        min="0"
                        max="59"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <span>Generate Kundli</span>
                    )}
                  </button>
                </form>
            </div>

            {/* Insights Section */}
            {latestKundli && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Astrological Insights</h2>
                  <button
                    onClick={handleRefreshInsights}
                    disabled={loadingInsights}
                    className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:bg-gray-400"
                  >
                    <RefreshCw size={16} className={loadingInsights ? 'animate-spin' : ''} />
                    <span className="text-sm">Refresh</span>
                  </button>
                </div>

                {loadingInsights ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <AlertCircle className="mx-auto mb-4 text-orange-500" size={48} />
                    <p className="text-gray-600 mb-6">
                      {latestKundli?.has_analysis 
                        ? 'No insights generated yet. Generate insights from your analysis.' 
                        : 'Generate an analysis first to get insights about your kundli.'}
                    </p>
                    {latestKundli?.has_analysis ? (
                      <button
                        onClick={handleRefreshInsights}
                        disabled={loadingInsights}
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
                      >
                        {loadingInsights ? 'Generating...' : 'Generate Insights'}
                      </button>
                    ) : (
                      <Link
                        to="/analysis"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
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
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/livechat"
                  className="block w-full text-center bg-indigo-700 hover:bg-indigo-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Live Chat
                </Link>
                {latestKundli && (
                  <>
                    <Link
                      to={`/chat/${latestKundli.kundli_id}`}
                      className="block w-full text-center bg-indigo-700 hover:bg-indigo-800 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Chat with AI
                    </Link>
                    <Link
                      to="/analysis"
                      className="block w-full text-center bg-indigo-700 hover:bg-indigo-800 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      View Analysis
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Features</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span>Accurate Vedic calculations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span>AI-powered insights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span>Chat with your kundli</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">✓</span>
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
