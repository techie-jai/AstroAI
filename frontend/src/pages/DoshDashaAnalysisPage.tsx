import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import { AlertCircle, Loader, ChevronDown, Calendar, TrendingDown, ChevronUp } from 'lucide-react'

interface Kundli {
  id: string
  name: string
  birthDate: string
  birthData: Record<string, any>
}

interface DoshaAnalysis {
  kundli_id: string
  analysis_date: string
  birth_data: Record<string, any>
  major_doshas: Array<{
    name: string
    detected: boolean
    severity: string
    description: string
    remedies: string[]
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
  current_mahadasha: {
    planet: string
    start_date: string
    end_date: string
    duration_years: number
    progress_percent: number
    days_remaining: number
  } | null
  current_antardasha: {
    planet: string
    start_date: string
    end_date: string
    duration_years: number
    progress_percent: number
    days_remaining: number
  } | null
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
      const response = await api.analyzeDoshaAndDasha(kundliId)
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

  const getSeverityColor = (severity: string) => {
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

  const getSeverityBadgeColor = (severity: string) => {
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
                  {analysis.major_doshas.map((dosha, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-4 ${getSeverityColor(dosha.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{dosha.name}</h3>
                        <p className="text-sm mt-2 opacity-90">{dosha.description}</p>
                        {dosha.detected && dosha.remedies.length > 0 && (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${getSeverityBadgeColor(dosha.severity)}`}>
                        {dosha.detected ? dosha.severity.toUpperCase() : 'NOT PRESENT'}
                      </span>
                    </div>
                  </div>
                  ))}
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
