import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Zap, Clock, TrendingUp, Sparkles, AlertCircle, Calendar, RefreshCw } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'
import InsightCard from '../components/InsightCard'
import toast from 'react-hot-toast'

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
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [insights, setInsights] = useState<DashboardInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.getUserCalculations()
        const calcs = response.data.calculations || []
        setCalculations(calcs)

        if (calcs.length > 0) {
          await fetchInsights(calcs[0].kundli_id)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchInsights = async (kundliId: string, forceRefresh = false) => {
    try {
      setLoadingInsights(true)
      const response = await api.getDashboardInsights(kundliId, forceRefresh)
      setInsights(response.data)
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
          {/* Left Column - Insights */}
          <div className="lg:col-span-2 space-y-6">
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
                    <p className="text-gray-600 mb-4">No insights generated yet</p>
                    <button
                      onClick={handleRefreshInsights}
                      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Generate Insights
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Start */}
            {calculations.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
                <p className="text-gray-600 mb-6">
                  Generate your personalized kundli (birth chart) to receive AI-powered astrological insights and analysis.
                </p>
                <Link
                  to="/generate"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Generate Your First Kundli
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Recent & Actions */}
          <div className="space-y-6">
            {/* Recent Calculations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Kundlis</h2>
              {calculations.length === 0 ? (
                <p className="text-gray-600 text-sm">No kundlis yet</p>
              ) : (
                <div className="space-y-3">
                  {calculations.slice(0, 5).map((calc) => (
                    <Link
                      key={calc.calculation_id}
                      to={`/results/${calc.kundli_id}`}
                      className="block p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition border border-gray-200 hover:border-indigo-300"
                    >
                      <p className="font-semibold text-gray-900 text-sm">{calc.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(calc.generation_date)}</p>
                    </Link>
                  ))}
                </div>
              )}
              {calculations.length > 0 && (
                <Link
                  to="/kundli"
                  className="block mt-4 text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 py-2 rounded-lg hover:bg-indigo-50 transition"
                >
                  View All
                </Link>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/generate"
                  className="block w-full text-center bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-50 transition"
                >
                  Generate Kundli
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
