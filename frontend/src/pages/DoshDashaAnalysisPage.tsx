import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import { AlertCircle, Loader, ChevronDown, Calendar, TrendingDown, ChevronUp, CheckCircle } from 'lucide-react'

interface Kundli {
  id: string
  name: string
  birthDate: string
  birthData: Record<string, any>
}

interface CurrentDashaData {
  planet: string
  start_date: string
  end_date: string
  duration_years: number
  progress_percent: number
  days_remaining: number
  pratyantardasha?: CurrentDashaData | null
}

interface DashaAlerts {
  is_maraka_dasha: boolean
  is_dusthana_dasha: boolean
  is_rahu_ketu_dasha: boolean
  alert_description: string
}

interface DoshaAnalysis {
  kundli_id: string
  analysis_date: string
  birth_data: Record<string, any>
  major_doshas: Array<{
    name: string
    is_present: boolean
    is_cancelled: boolean
    severity: string
    description: string
    cancellation_reasons: string[]
    remedies: string[]
    detected?: boolean
  }>
  planetary_avasthas: Array<{
    planet: string
    avastha_type: string
    severity: string
    description: string
  }>
  dusthana_afflictions: Array<{
    house: number
    planets: string[]
    severity: string
    description: string
  }>
  d_chart_afflictions: Array<{
    chart_type: string
    affliction_type: string
    severity: string
    description: string
    planets: string[]
  }>
  current_mahadasha: CurrentDashaData | null
  current_antardasha: CurrentDashaData | null
  active_dashas: {
    current_mahadasha: CurrentDashaData | null
    current_antardasha: CurrentDashaData | null
    dasha_alerts: DashaAlerts
  }
  negative_periods: Array<{
    type: string
    start_date: string
    end_date: string
    days_remaining: number
    severity: string
    description: string
  }>
  summary: {
    total_doshas: number
    severe_count: number
    moderate_count: number
    mild_count: number
    active_negative_periods: number
  }
}

const DoshDashaAnalysisPage: React.FC = () => {
  const navigate = useNavigate()
  const [kundlis, setKundlis] = useState<Kundli[]>([])
  const [selectedKundliId, setSelectedKundliId] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DoshaAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [kundlisLoading, setKundlisLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    doshas: true,
    dasha: true,
    periods: true,
    avasthas: false,
    afflictions: false,
  })

  // Fetch user's kundlis on mount
  useEffect(() => {
    fetchKundlis()
  }, [])

  // Fetch analysis when kundli is selected
  useEffect(() => {
    if (selectedKundliId) {
      fetchAnalysis(selectedKundliId)
    }
  }, [selectedKundliId])

  const fetchKundlis = async () => {
    try {
      setKundlisLoading(true)
      
      console.log('[DOSHA] Fetching kundlis from backend (local directory)...')
      
      // Fetch from backend API which reads from local directory
      const response = await api.getUserCalculations()
      
      console.log('[DOSHA] Backend response:', response.data)
      
      // Handle different response formats
      let kundliList: any[] = []
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          kundliList = response.data
        } else if (response.data.calculations && Array.isArray(response.data.calculations)) {
          kundliList = response.data.calculations
        } else if (typeof response.data === 'object') {
          // If it's a single object, wrap it in array
          kundliList = [response.data]
        }
      }
      
      console.log('[DOSHA] Kundli list:', kundliList)
      
      if (kundliList.length > 0) {
        const formattedKundlis = kundliList.map((calc: any) => ({
          id: calc.kundli_id || calc.id || calc.calculation_id,
          name: calc.birth_data?.name || calc.name || 'Unknown',
          birthDate: calc.generated_at || calc.generation_date || calc.created_at || '',
          birthData: calc.birth_data || {},
        }))
        
        console.log('[DOSHA] Formatted kundlis:', formattedKundlis)
        setKundlis(formattedKundlis)
        
        if (formattedKundlis.length > 0) {
          setSelectedKundliId(formattedKundlis[0].id)
        }
      } else {
        console.warn('[DOSHA] No kundlis returned from backend')
        setKundlis([])
      }
    } catch (error) {
      console.error('[DOSHA] Error fetching kundlis:', error)
      toast.error('Failed to load kundlis from local directory')
      setKundlis([])
    } finally {
      setKundlisLoading(false)
    }
  }

  const fetchAnalysis = async (kundliId: string) => {
    try {
      setLoading(true)
      console.log('[DOSHA] Fetching analysis for kundli:', kundliId)
      const response = await api.analyzeDoshaAndDasha(kundliId)
      console.log('[DOSHA] Analysis response:', response.data)
      
      // Debug: Check if active_dashas exists
      if (response.data.active_dashas) {
        console.log('[DOSHA] active_dashas found:', response.data.active_dashas)
      } else {
        console.warn('[DOSHA] active_dashas NOT found in response')
      }
      
      setAnalysis(response.data)
    } catch (error) {
      console.error('Error fetching analysis:', error)
      toast.error('Failed to analyze kundli')
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getSeverityColor = (severity: string, isCancelled: boolean = false) => {
    if (isCancelled) {
      return 'text-green-600 bg-green-50 border-green-200'
    }
    switch (severity) {
      case 'severe':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'moderate':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'mild':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityBadgeColor = (severity: string, isCancelled: boolean = false) => {
    if (isCancelled) {
      return 'bg-green-100 text-green-800'
    }
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800'
      case 'moderate':
        return 'bg-orange-100 text-orange-800'
      case 'mild':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const startMonth = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const endMonth = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      return `${startMonth} - ${endMonth}`
    } catch {
      return `${startDate} - ${endDate}`
    }
  }

  const formatCountdown = (daysRemaining: number) => {
    if (daysRemaining <= 0) return 'Ended'
    
    const years = Math.floor(daysRemaining / 365)
    const remainingDays = daysRemaining % 365
    const months = Math.floor(remainingDays / 30)
    const days = remainingDays % 30
    
    const parts = []
    if (years > 0) parts.push(`${years} Year${years > 1 ? 's' : ''}`)
    if (months > 0) parts.push(`${months} Month${months > 1 ? 's' : ''}`)
    if (days > 0) parts.push(`${days} Day${days > 1 ? 's' : ''}`)
    
    if (parts.length === 0) return 'Less than 1 day'
    return parts.join(', ')
  }

  const getAlertColor = (alerts: DashaAlerts) => {
    if (alerts.is_maraka_dasha) {
      return 'bg-red-50 border-red-200 text-red-800'
    } else if (alerts.is_dusthana_dasha || alerts.is_rahu_ketu_dasha) {
      return 'bg-orange-50 border-orange-200 text-orange-800'
    } else {
      return 'bg-green-50 border-green-200 text-green-800'
    }
  }

  const getAlertIcon = (alerts: DashaAlerts) => {
    if (alerts.is_maraka_dasha || alerts.is_dusthana_dasha || alerts.is_rahu_ketu_dasha) {
      return <AlertCircle className="w-5 h-5" />
    } else {
      return <CheckCircle className="w-5 h-5" />
    }
  }

  if (kundlisLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading kundlis...</p>
        </div>
      </div>
    )
  }

  if (kundlis.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Kundlis Found</h2>
            <p className="text-gray-600 mb-6">Generate a kundli first to analyze doshas and dashas.</p>
            <button
              onClick={() => navigate('/generate')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Generate Kundli
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dosha & Dasha Analysis</h1>
          <p className="text-indigo-200">Comprehensive astrological analysis of your kundli</p>
        </div>

        {/* Kundli Selector */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-3">Select Kundli</label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span>
                {selectedKundliId
                  ? kundlis.find((k) => k.id === selectedKundliId)?.name
                  : 'Select a kundli'}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {kundlis.map((kundli) => (
                  <button
                    key={kundli.id}
                    onClick={() => {
                      setSelectedKundliId(kundli.id)
                      setDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition ${
                      selectedKundliId === kundli.id ? 'bg-indigo-100 text-indigo-900' : 'text-gray-800'
                    }`}
                  >
                    <div className="font-semibold">{kundli.name}</div>
                    <div className="text-sm text-gray-500">{formatDate(kundli.birthDate)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-700 text-lg">Analyzing kundli...</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !loading && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-indigo-600">
                  {analysis.summary.total_doshas}
                </div>
                <div className="text-gray-600 text-sm mt-2">Total Doshas</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-red-600">
                  {analysis.summary.severe_count}
                </div>
                <div className="text-gray-600 text-sm mt-2">Severe</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-orange-600">
                  {analysis.summary.moderate_count}
                </div>
                <div className="text-gray-600 text-sm mt-2">Moderate</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-yellow-600">
                  {analysis.summary.mild_count}
                </div>
                <div className="text-gray-600 text-sm mt-2">Mild</div>
              </div>
            </div>

            {/* Active Alerts */}
            {analysis.summary.active_negative_periods > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-2">Active Negative Periods</h3>
                    <p className="text-red-700">
                      {analysis.summary.active_negative_periods} challenging period(s) detected
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Dasha */}
            {analysis.current_mahadasha && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                  Current Dasha Period
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mahadasha */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Mahadasha</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Planet:</span>
                        <span className="font-semibold text-gray-800 ml-2">
                          {analysis.current_mahadasha.planet}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-800 ml-2">
                          {analysis.current_mahadasha.duration_years.toFixed(1)} years
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-semibold text-gray-800 ml-2">
                          {analysis.current_mahadasha.progress_percent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{
                              width: `${analysis.current_mahadasha.progress_percent}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Ends: {formatDate(analysis.current_mahadasha.end_date)}
                      </div>
                    </div>
                  </div>

                  {/* Antardasha */}
                  {analysis.current_antardasha && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Antardasha</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Planet:</span>
                          <span className="font-semibold text-gray-800 ml-2">
                            {analysis.current_antardasha.planet}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold text-gray-800 ml-2">
                            {analysis.current_antardasha.duration_years.toFixed(1)} years
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-semibold text-gray-800 ml-2">
                            {analysis.current_antardasha.progress_percent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${analysis.current_antardasha.progress_percent}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Ends: {formatDate(analysis.current_antardasha.end_date)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Planetary Periods (Dashas) */}
            {analysis.active_dashas && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dasha Cards */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                    Current Planetary Periods
                  </h2>

                  {/* Mahadasha Card */}
                  {analysis.active_dashas.current_mahadasha && (
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-indigo-900 mb-4">Mahadasha</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-700 font-semibold">{analysis.active_dashas.current_mahadasha.planet}</span>
                          <span className="text-sm text-indigo-600">{formatDateRange(analysis.active_dashas.current_mahadasha.start_date, analysis.active_dashas.current_mahadasha.end_date)}</span>
                        </div>
                        <div className="w-full bg-indigo-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all"
                            style={{
                              width: `${analysis.active_dashas.current_mahadasha.progress_percent}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-indigo-700">{analysis.active_dashas.current_mahadasha.progress_percent.toFixed(1)}% complete</span>
                          <span className="text-indigo-600 font-semibold">Ends in {formatCountdown(analysis.active_dashas.current_mahadasha.days_remaining)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Antardasha Card */}
                  {analysis.active_dashas.current_antardasha && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 ml-4">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">Antardasha</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700 font-semibold">{analysis.active_dashas.current_antardasha.planet}</span>
                          <span className="text-sm text-purple-600">{formatDateRange(analysis.active_dashas.current_antardasha.start_date, analysis.active_dashas.current_antardasha.end_date)}</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                            style={{
                              width: `${analysis.active_dashas.current_antardasha.progress_percent}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-700">{analysis.active_dashas.current_antardasha.progress_percent.toFixed(1)}% complete</span>
                          <span className="text-purple-600 font-semibold">Ends in {formatCountdown(analysis.active_dashas.current_antardasha.days_remaining)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pratyantardasha Card */}
                  {analysis.active_dashas.current_antardasha?.pratyantardasha && (
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-6 ml-8">
                      <h3 className="text-lg font-bold text-pink-900 mb-4">Pratyantardasha</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-pink-700 font-semibold">{analysis.active_dashas.current_antardasha.pratyantardasha.planet}</span>
                          <span className="text-sm text-pink-600">{formatDateRange(analysis.active_dashas.current_antardasha.pratyantardasha.start_date, analysis.active_dashas.current_antardasha.pratyantardasha.end_date)}</span>
                        </div>
                        <div className="w-full bg-pink-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all"
                            style={{
                              width: `${analysis.active_dashas.current_antardasha.pratyantardasha.progress_percent}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-pink-700">{analysis.active_dashas.current_antardasha.pratyantardasha.progress_percent.toFixed(1)}% complete</span>
                          <span className="text-pink-600 font-semibold">Ends in {formatCountdown(analysis.active_dashas.current_antardasha.pratyantardasha.days_remaining)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dasha Alerts */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3 text-orange-600" />
                    Dasha Alerts
                  </h2>

                  <div className={`border-2 rounded-lg p-6 ${getAlertColor(analysis.active_dashas.dasha_alerts)}`}>
                    <div className="flex items-start gap-3">
                      {getAlertIcon(analysis.active_dashas.dasha_alerts)}
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-2">{analysis.active_dashas.dasha_alerts.alert_description}</p>
                        
                        {/* Alert Details */}
                        <div className="mt-4 space-y-2 text-sm">
                          {analysis.active_dashas.dasha_alerts.is_maraka_dasha && (
                            <div className="bg-red-100 bg-opacity-50 rounded p-3">
                              <p className="font-semibold text-red-900 mb-1">Maraka Period (2nd/7th House Lord)</p>
                              <p className="text-red-800">This period is ruled by the lord of the 2nd or 7th house. Exercise caution regarding health, relationships, and travel. Consider protective remedies.</p>
                            </div>
                          )}
                          
                          {analysis.active_dashas.dasha_alerts.is_dusthana_dasha && (
                            <div className="bg-orange-100 bg-opacity-50 rounded p-3">
                              <p className="font-semibold text-orange-900 mb-1">Dusthana Period (6th/8th/12th House Lord)</p>
                              <p className="text-orange-800">This period is ruled by the lord of a dusthana (difficult) house. Be cautious with finances, health, and be aware of potential obstacles. Stay vigilant.</p>
                            </div>
                          )}
                          
                          {analysis.active_dashas.dasha_alerts.is_rahu_ketu_dasha && (
                            <div className="bg-orange-100 bg-opacity-50 rounded p-3">
                              <p className="font-semibold text-orange-900 mb-1">Shadow Planet Period (Rahu/Ketu)</p>
                              <p className="text-orange-800">You are in a Rahu or Ketu Mahadasha. Expect illusions, sudden changes, and transformations. Focus on spiritual grounding and meditation. Avoid major decisions without careful consideration.</p>
                            </div>
                          )}
                          
                          {!analysis.active_dashas.dasha_alerts.is_maraka_dasha && 
                           !analysis.active_dashas.dasha_alerts.is_dusthana_dasha && 
                           !analysis.active_dashas.dasha_alerts.is_rahu_ketu_dasha && (
                            <div className="bg-green-100 bg-opacity-50 rounded p-3">
                              <p className="font-semibold text-green-900 mb-1">Supportive Period</p>
                              <p className="text-green-800">You are running a generally supportive or neutral planetary period. This is a favorable time for growth, new initiatives, and positive endeavors. Make the most of this period.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Major Doshas */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection('doshas')}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
              >
                <h2 className="text-2xl font-bold text-gray-800">Major Doshas</h2>
                {expandedSections.doshas ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              {expandedSections.doshas && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
                  {analysis.major_doshas.map((dosha, idx) => {
                    const isPresent = dosha.is_present !== undefined ? dosha.is_present : dosha.detected
                    const isCancelled = dosha.is_cancelled || false
                    
                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 ${getSeverityColor(dosha.severity, isCancelled)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{dosha.name}</h3>
                            
                            {/* Cancellation Message */}
                            {isPresent && isCancelled && (
                              <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-300">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-bold text-green-800 text-sm">Good News: This Dosha is cancelled out in your chart due to the following reasons:</p>
                                    <ul className="mt-2 text-sm text-green-700 space-y-1">
                                      {dosha.cancellation_reasons.map((reason, i) => (
                                        <li key={i} className="flex items-start">
                                          <span className="mr-2">•</span>
                                          <span>{reason}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <p className="text-sm mt-2 opacity-90">{dosha.description}</p>
                            {isPresent && !isCancelled && dosha.remedies.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-semibold mb-2">Remedies:</p>
                                <ul className="text-sm space-y-1">
                                  {dosha.remedies.slice(0, 3).map((remedy, i) => (
                                    <li key={i} className="flex items-start">
                                      <span className="mr-2">•</span>
                                      <span>{remedy}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 flex-shrink-0 ${getSeverityBadgeColor(dosha.severity, isCancelled)}`}>
                            {isCancelled ? 'CANCELLED' : (isPresent ? dosha.severity.toUpperCase() : 'NOT PRESENT')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Negative Periods */}
            {analysis.negative_periods.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('periods')}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
                >
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <TrendingDown className="w-6 h-6 mr-3 text-red-600" />
                    Active Negative Periods
                  </h2>
                  {expandedSections.periods ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
                {expandedSections.periods && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
                  {analysis.negative_periods.map((period, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 ${getSeverityColor(period.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg capitalize">
                            {period.type.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm mt-2 opacity-90">{period.description}</p>
                          <div className="mt-3 text-sm space-y-1">
                            <div>
                              <span className="font-semibold">Ends:</span>
                              <span className="ml-2">{formatDate(period.end_date)}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Days Remaining:</span>
                              <span className="ml-2">{period.days_remaining}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${getSeverityBadgeColor(period.severity)}`}>
                          {period.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoshDashaAnalysisPage
