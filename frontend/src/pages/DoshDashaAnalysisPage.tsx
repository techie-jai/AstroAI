import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../services/api'
import { AlertCircle, Loader, ChevronDown, Calendar, TrendingDown, ChevronUp, CheckCircle, Activity, AlertTriangle, Info, Shield, Sparkles } from 'lucide-react'

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

  useEffect(() => {
    console.log('[DOSHA] Component mounted, calling fetchKundlis')
    fetchKundlis()
  }, [])

  useEffect(() => {
    if (selectedKundliId) {
      console.log('[DOSHA] Selected kundli changed, fetching analysis:', selectedKundliId)
      fetchAnalysis(selectedKundliId)
    }
  }, [selectedKundliId])

  const fetchKundlis = async () => {
    try {
      setKundlisLoading(true)
      console.log('[DOSHA] Fetching kundlis...')
      const response = await api.getUserCalculations()
      console.log('[DOSHA] Kundlis response:', response.data)
      
      let kundliList: any[] = []
      if (response.data) {
        if (Array.isArray(response.data)) {
          kundliList = response.data
        } else if (response.data.calculations && Array.isArray(response.data.calculations)) {
          kundliList = response.data.calculations
        } else if (typeof response.data === 'object') {
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
        console.warn('[DOSHA] No kundlis found')
        setKundlis([])
      }
    } catch (error) {
      console.error('[DOSHA] Error fetching kundlis:', error)
      toast.error('Failed to load kundlis')
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
      setAnalysis(response.data)
      toast.success('Analysis loaded successfully')
    } catch (error: any) {
      console.error('[DOSHA] Error fetching analysis:', error)
      console.error('[DOSHA] Error details:', error.response?.data || error.message)
      toast.error(`Failed to analyze kundli: ${error.response?.data?.detail || error.message}`)
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

  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float opacity-30"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: `${60 + i * 10}px`,
            height: `${60 + i * 10}px`,
            background: `radial-gradient(circle, ${
              i % 2 === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(6, 182, 212, 0.2)'
            }, transparent)`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${5 + i}s`,
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <FloatingOrbs />
      <div className="relative p-8 z-10">
        <div className="max-w-6xl mx-auto">
            {kundlisLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-300 text-lg">Loading kundlis...</p>
                <p className="text-slate-500 text-sm mt-4">Check browser console for details</p>
              </div>
            </div>
          )}

          {!kundlisLoading && kundlis.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">No Kundlis Found</h2>
                <p className="text-slate-400 mb-6">Generate a kundli first to analyze doshas and dashas.</p>
                <p className="text-slate-500 text-sm mb-6">If you have kundlis, check the browser console for errors.</p>
                <button
                  onClick={() => navigate('/generate')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-2 px-6 rounded-lg transition shadow-lg shadow-purple-500/30"
                >
                  Generate Kundli
                </button>
              </div>
            </div>
          )}

          {!kundlisLoading && kundlis.length > 0 && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">Dosha & Dasha Analysis</h1>
                  <p className="text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Comprehensive astrological analysis of your kundli
                  </p>
                </div>
              </div>

              {/* Kundli Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Select Kundli</label>
                <div className="relative max-w-md">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-secondary/50 border-purple-500/30 focus:border-purple-500/50 text-slate-100 font-semibold py-3 px-4 rounded-lg border flex items-center justify-between hover:bg-secondary/70 transition"
                  >
                    <span>
                      {selectedKundliId
                        ? kundlis.find((k) => k.id === selectedKundliId)?.name
                        : 'Select a kundli'}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform text-slate-400 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/50 rounded-lg shadow-lg z-10">
                      {kundlis.map((kundli) => (
                        <button
                          key={kundli.id}
                          onClick={() => {
                            setSelectedKundliId(kundli.id)
                            setDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-purple-500/20 transition ${
                            selectedKundliId === kundli.id ? 'bg-purple-500/30 text-purple-300' : 'text-slate-300'
                          }`}
                        >
                          <div className="font-semibold">{kundli.name}</div>
                          <div className="text-sm text-slate-500">{formatDate(kundli.birthDate)}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="cosmic-card rounded-2xl p-8 text-center">
                  <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">Analyzing kundli...</p>
                </div>
              )}

              {/* Analysis Results */}
              {analysis && !loading && (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Doshas', value: analysis.summary.total_doshas, color: 'from-purple-500 to-pink-500', icon: Activity },
                      { label: 'Severe', value: analysis.summary.severe_count, color: 'from-red-500 to-orange-500', icon: AlertTriangle },
                      { label: 'Moderate', value: analysis.summary.moderate_count, color: 'from-amber-500 to-yellow-500', icon: Info },
                      { label: 'Mild', value: analysis.summary.mild_count, color: 'from-green-500 to-emerald-500', icon: Shield },
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        className="cosmic-card rounded-xl p-6 text-center group hover:scale-[1.02] transition-all duration-300"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mx-auto mb-3 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-4xl font-bold text-slate-100 group-hover:gradient-text-purple transition-all">{stat.value}</p>
                        <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Current Planetary Periods */}
                  {analysis.active_dashas && (
                    <div className="cosmic-card rounded-2xl overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-400" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-100">Current Planetary Periods (Dashas)</h2>
                        </div>
                        <div className="space-y-8">
                          {/* Mahadasha */}
                          {analysis.active_dashas.current_mahadasha && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                                    <span className="text-xs font-bold text-white">Ma</span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-300 text-glow-purple">Mahadasha: {analysis.active_dashas.current_mahadasha.planet}</h4>
                                    <p className="text-sm text-slate-400">{formatDateRange(analysis.active_dashas.current_mahadasha.start_date, analysis.active_dashas.current_mahadasha.end_date)}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-slate-400">Ends in</p>
                                  <p className="text-sm font-medium text-cyan-400">{formatCountdown(analysis.active_dashas.current_mahadasha.days_remaining)}</p>
                                </div>
                              </div>
                              <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                  style={{ width: `${analysis.active_dashas.current_mahadasha.progress_percent}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-400">{analysis.active_dashas.current_mahadasha.progress_percent.toFixed(1)}% complete</p>
                            </div>
                          )}

                          {/* Antardasha */}
                          {analysis.active_dashas.current_antardasha && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
                                    <span className="text-xs font-bold text-white">An</span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-300">Antardasha: {analysis.active_dashas.current_antardasha.planet}</h4>
                                    <p className="text-sm text-slate-400">{formatDateRange(analysis.active_dashas.current_antardasha.start_date, analysis.active_dashas.current_antardasha.end_date)}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-slate-400">Ends in</p>
                                  <p className="text-sm font-medium text-cyan-400">{formatCountdown(analysis.active_dashas.current_antardasha.days_remaining)}</p>
                                </div>
                              </div>
                              <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                  style={{ width: `${analysis.active_dashas.current_antardasha.progress_percent}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-400">{analysis.active_dashas.current_antardasha.progress_percent.toFixed(1)}% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Major Doshas */}
                  <div className="cosmic-card rounded-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-pink-500 to-red-500" />
                    <div className="p-6 cursor-pointer hover:bg-purple-500/5 transition-colors" onClick={() => toggleSection('doshas')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-red-500/20 border border-pink-500/30 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-pink-400" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-100">Major Doshas</h2>
                        </div>
                        {expandedSections.doshas ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
                      </div>
                    </div>
                    {expandedSections.doshas && (
                      <div className="px-6 pb-6 space-y-4">
                        {analysis.major_doshas.map((dosha, i) => {
                          const isPresent = dosha.is_present !== undefined ? dosha.is_present : dosha.detected
                          const isCancelled = dosha.is_cancelled || false
                          console.log(`[DOSHA] ${dosha.name}: isPresent=${isPresent}, isCancelled=${isCancelled}`)
                          
                          return (
                            <div
                              key={dosha.name}
                              className={`p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                                isPresent && !isCancelled
                                  ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30'
                                  : isCancelled
                                  ? 'bg-gradient-to-r from-emerald-500/20 via-green-500/15 to-teal-500/20 border-emerald-400/60 shadow-lg shadow-emerald-500/30'
                                  : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                              }`}
                              style={{ animationDelay: `${i * 0.1}s` }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    isPresent && !isCancelled
                                      ? 'bg-red-500/20 border border-red-500/30'
                                      : isCancelled
                                      ? 'bg-emerald-500/30 border-2 border-emerald-400/80 shadow-lg shadow-emerald-500/40'
                                      : 'bg-green-500/20 border border-green-500/30'
                                  }`}>
                                    {isPresent && !isCancelled ? (
                                      <AlertTriangle className="w-6 h-6 text-red-400" />
                                    ) : isCancelled ? (
                                      <CheckCircle className="w-6 h-6 text-emerald-300 animate-pulse" />
                                    ) : (
                                      <Shield className="w-6 h-6 text-green-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className={`font-bold ${isCancelled ? 'text-emerald-300 text-lg' : 'text-pink-300'}`}>{dosha.name}</h4>
                                    <p className={`text-sm ${isCancelled ? 'text-emerald-200/80' : 'text-slate-400'}`}>{dosha.description}</p>
                                  </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                                  isPresent && !isCancelled
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : isCancelled
                                    ? 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400/80 shadow-lg shadow-emerald-500/40 animate-pulse'
                                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}>
                                  {isCancelled ? '✨ Cancelled' : isPresent ? 'Present' : 'Not Present'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoshDashaAnalysisPage
