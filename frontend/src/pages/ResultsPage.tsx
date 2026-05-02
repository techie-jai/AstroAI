import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import apiClient from '../services/api'
import toast from 'react-hot-toast'
import { Sparkles, Download, Loader, MessageCircle, Calendar, Clock, MapPin, Star, Sun, ChevronDown, ChevronUp, Zap, Globe, ArrowRight } from 'lucide-react'
import { getDisplayableItems, extractPanchanga, extractAyanamsa, extractPlanets, formatKey } from '../utils/jyotishganitHelper'
import CacheManager from '../utils/cacheManager'

interface KundliData {
  kundli_id: string
  birth_data: {
    name: string
    place: string
    date: string
    time: string
    latitude: number
    longitude: number
    timezone_offset: number
  }
  horoscope_info: Record<string, any>
  charts?: Record<string, any>
}

function OrbitingPlanets() {
  const planets = [
    { name: "Sun", size: 20, orbit: 60, duration: 20, color: "from-yellow-400 to-orange-500" },
    { name: "Moon", size: 12, orbit: 90, duration: 15, color: "from-gray-300 to-gray-400" },
    { name: "Mars", size: 10, orbit: 120, duration: 25, color: "from-red-500 to-red-600" },
    { name: "Jupiter", size: 16, orbit: 150, duration: 35, color: "from-yellow-500 to-amber-600" },
    { name: "Saturn", size: 14, orbit: 180, duration: 45, color: "from-purple-400 to-purple-600" },
  ]
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 blur-2xl animate-pulse-glow" />
      <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center z-10 glow-purple"><Sparkles className="w-8 h-8 text-white" /></div>
      {planets.map((p, i) => (<div key={`orbit-${i}`} className="absolute rounded-full border border-purple-500/20" style={{ width: `${p.orbit * 2}px`, height: `${p.orbit * 2}px` }} />))}
      {planets.map((p, i) => (<div key={p.name} className="absolute animate-orbit" style={{ '--orbit-radius': `${p.orbit}px`, '--orbit-duration': `${p.duration}s`, animationDelay: `${i * -5}s` } as React.CSSProperties}><div className={`rounded-full bg-gradient-to-br ${p.color} shadow-lg`} style={{ width: `${p.size}px`, height: `${p.size}px` }} title={p.name} /></div>))}
    </div>
  )
}

function SectionCard({ title, icon: Icon, children, gradient = "from-purple-500/20 to-transparent", collapsible = false }: { title: string; icon: React.ElementType; children: React.ReactNode; gradient?: string; collapsible?: boolean }) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="cosmic-card rounded-2xl overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <div className={`flex items-center justify-between p-5 ${collapsible ? 'cursor-pointer hover:bg-purple-500/5' : ''}`} onClick={() => collapsible && setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center"><Icon className="w-5 h-5 text-purple-400" /></div><h2 className="text-xl font-bold text-foreground">{title}</h2></div>
        {collapsible && (isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />)}
      </div>
      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

function DataItem({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className="relative pl-3 border-l-2 border-purple-500/30"><p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p><p className={`font-semibold ${accent ? 'text-cyan-400' : 'text-foreground'}`}>{value}</p></div>
}

function PlanetCard({ planet }: { planet: any }) {
  const planetColors: Record<string, string> = {
    "Sun": "bg-gradient-to-br from-yellow-400 to-orange-500",
    "Moon": "bg-gradient-to-br from-gray-300 to-gray-400",
    "Mars": "bg-gradient-to-br from-red-500 to-red-600",
    "Mercury": "bg-gradient-to-br from-green-400 to-green-600",
    "Jupiter": "bg-gradient-to-br from-yellow-500 to-amber-600",
    "Venus": "bg-gradient-to-br from-pink-400 to-pink-600",
    "Saturn": "bg-gradient-to-br from-purple-400 to-purple-600",
    "Rahu": "bg-gradient-to-br from-blue-500 to-cyan-600",
    "Ketu": "bg-gradient-to-br from-slate-600 to-slate-800",
  }
  
  return (
    <div className="group cosmic-card rounded-xl p-4 hover:bg-purple-500/10 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative"><div className={`w-12 h-12 rounded-full ${planetColors[planet.name] || 'bg-gradient-to-br from-purple-400 to-purple-600'} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}><span className="text-xs font-bold text-white">{planet.name.slice(0, 2)}</span></div><div className={`absolute inset-0 rounded-full ${planetColors[planet.name] || 'bg-gradient-to-br from-purple-400 to-purple-600'} opacity-0 group-hover:opacity-50 blur-xl transition-opacity`} /></div>
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-purple-300 group-hover:text-purple-200 transition-colors">{planet.name}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Sign:</span><span className="ml-2 text-foreground">{planet.sign}</span></div>
            <div><span className="text-muted-foreground">House:</span><span className="ml-2 text-cyan-400">{planet.house}</span></div>
            <div className="col-span-2"><span className="text-muted-foreground">Nakshatra:</span><span className="ml-2 text-foreground">{planet.nakshatra}</span></div>
          </div>
        </div>
        <div className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs font-mono text-purple-300">{planet.degree?.toFixed(1) || 'N/A'}°</div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const { kundliId } = useParams()
  const navigate = useNavigate()
  const [kundli, setKundli] = useState<KundliData | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const fetchKundli = async () => {
      try {
        if (!kundliId) {
          toast.error('Kundli ID not found')
          return
        }
        
        // Reset state IMMEDIATELY when kundliId changes
        console.log('[RESULTS] ===== NEW KUNDLI FETCH =====')
        console.log('[RESULTS] kundliId changed:', kundliId)
        console.log('[RESULTS] Previous kundli state:', kundli?.birth_data?.name || 'null')
        
        setLoading(true)
        setKundli(null)  // Clear immediately
        setAnalysis(null)
        
        // Use CacheManager to clear all caches
        console.log('[RESULTS] Clearing all caches...')
        CacheManager.clearAllCaches()
        
        // Small delay to ensure state is cleared
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log('[RESULTS] Fetching kundli with ID:', kundliId)
        const response = await api.getKundli(kundliId)
        
        console.log('[RESULTS] ===== API RESPONSE RECEIVED =====')
        console.log('[RESULTS] Birth data name:', response.data.birth_data.name)
        console.log('[RESULTS] Birth data place:', response.data.birth_data.place)
        console.log('[RESULTS] Birth data date:', response.data.birth_data.date)
        console.log('[RESULTS] Birth data time:', response.data.birth_data.time)
        console.log('[RESULTS] Kundli ID from response:', response.data.kundli_id)
        console.log('[RESULTS] horoscope_info keys count:', Object.keys(response.data.horoscope_info || {}).length)
        
        // Verify we got the right data
        if (response.data.kundli_id !== kundliId) {
          console.warn('[RESULTS] WARNING: Response kundli_id does not match requested kundli_id!')
          console.warn('[RESULTS] Requested:', kundliId)
          console.warn('[RESULTS] Received:', response.data.kundli_id)
        }
        
        // Deep clone to ensure no reference issues
        const freshData = JSON.parse(JSON.stringify(response.data))
        console.log('[RESULTS] Deep cloned data, setting state...')
        setKundli(freshData)
        
        // Note: Don't store in localStorage - rely on backend index instead
        // The backend now serves data from the local file index
        console.log('[RESULTS] Kundli data available from backend API')
        
        console.log('[RESULTS] Kundli state updated successfully')
        console.log('[RESULTS] ===== FETCH COMPLETE =====')
      } catch (error) {
        toast.error('Failed to load kundli data')
        console.error('[RESULTS] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchKundli()
  }, [kundliId])

  const handleAnalyze = async () => {
    if (!kundliId) {
      toast.error('Kundli ID not found')
      console.error('[RESULTS] handleAnalyze: kundliId is missing')
      return
    }

    setAnalyzing(true)
    let retries = 0
    const maxRetries = 2
    
    const attemptAnalysis = async (): Promise<void> => {
      try {
        console.log('[RESULTS] Generating analysis for kundliId:', kundliId, `(attempt ${retries + 1})`)
        const response = await api.generateAnalysis(kundliId, 'comprehensive')
        console.log('[RESULTS] Analysis generated successfully')
        setAnalysis(response.data.analysis_text || 'Analysis generated successfully')
        toast.success('Analysis generated successfully')
        
        window.dispatchEvent(new CustomEvent('analysisGenerated', { detail: { kundliId } }))
      } catch (error: any) {
        console.error('[RESULTS] Failed to generate analysis:', error)
        
        // Retry on timeout errors
        if ((error.code === 'ECONNABORTED' || error.message?.includes('timeout')) && retries < maxRetries) {
          retries++
          console.log(`[RESULTS] Timeout detected, retrying (${retries}/${maxRetries})...`)
          toast.loading(`Analysis is taking longer than expected. Retrying... (${retries}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
          return attemptAnalysis()
        }
        
        toast.error('Failed to generate analysis. Please try again.')
      } finally {
        setAnalyzing(false)
      }
    }
    
    await attemptAnalysis()
  }

  const handleDownloadPDF = async () => {
    if (!kundliId) {
      toast.error('Kundli ID not found')
      return
    }

    setDownloading(true)
    try {
      const response = await apiClient.get(`/analysis/download/${kundliId}`, {
        responseType: 'blob'
      })

      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${kundli?.birth_data.name || 'Analysis'}_AI_Analysis.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('PDF downloaded successfully')
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Analysis PDF not found. Please generate the analysis first.')
      } else {
        toast.error('Failed to download PDF')
      }
      console.error(error)
    } finally {
      setDownloading(false)
    }
  }

  const handleOpenChat = () => {
    if (!kundliId) {
      toast.error('Kundli ID not found')
      console.error('[RESULTS] handleOpenChat: kundliId is missing')
      return
    }

    if (!kundli) {
      toast.error('Kundli data not found')
      console.error('[RESULTS] handleOpenChat: kundli data is missing')
      return
    }

    try {
      console.log('[RESULTS] Opening chat for kundliId:', kundliId)
      // Store kundli data in sessionStorage for the chat page
      sessionStorage.setItem('kundli_data', JSON.stringify(kundli))
      // Navigate to the chat page with the kundli ID
      navigate(`/chat/${kundliId}`)
      toast.success('Opening chat...')
    } catch (error) {
      console.error('[RESULTS] Failed to open chat:', error)
      toast.error('Failed to open chat')
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
        <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading kundli data...</p>
        </div>
      </div>
    )
  }

  if (!kundli) {
    return (
      <div className="relative min-h-screen bg-slate-950 py-12 overflow-hidden">
        <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cosmic-card rounded-2xl p-8 text-center">
            <p className="text-slate-300">Kundli data not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div key={kundliId} className="relative space-y-8 min-h-screen bg-slate-950 pb-8 overflow-hidden">
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">{[...Array(30)].map((_, i) => (<div key={i} className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-twinkle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${2 + Math.random() * 3}s` }} />))}</div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float"><Star className="w-6 h-6 text-white fill-white" /></div>
              <div><h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">Kundli Results</h1><p className="text-muted-foreground">Birth Chart Analysis for <span className="text-cyan-400">{kundli.birth_data.name}</span></p></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownloadPDF} disabled={downloading} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"><Download className="w-4 h-4" />{downloading ? 'Downloading...' : 'Download PDF'}</button>
            <Link to={`/chat/${kundliId}`}><button className="border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"><MessageCircle className="w-4 h-4" />Chat with AI</button></Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 cosmic-card rounded-2xl overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" /><OrbitingPlanets /><div className="absolute bottom-4 left-4 right-4 text-center"><p className="text-sm text-muted-foreground">Interactive Planetary Visualization</p></div></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionCard title="Birth Information" icon={Calendar} gradient="from-cyan-500/50 to-purple-500/30">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataItem label="Name" value={kundli.birth_data.name} />
            <DataItem label="Place of Birth" value={kundli.birth_data.place} />
            <DataItem label="Date" value={kundli.birth_data.date} />
            <DataItem label="Time" value={kundli.birth_data.time} accent />
            <DataItem label="Latitude" value={kundli.birth_data.latitude.toFixed(4)} />
            <DataItem label="Longitude" value={kundli.birth_data.longitude.toFixed(4)} />
          </div>
        </SectionCard>

        <SectionCard title="Panchanga (Astrological Calendar)" icon={Calendar} gradient="from-purple-500/50 to-pink-500/30">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{(() => {
            const panchanga = extractPanchanga(kundli.horoscope_info)
            return Object.entries(panchanga).map(([key, value]) => (<div key={key} className="cosmic-card rounded-xl p-4 text-center hover:bg-purple-500/10 transition-colors"><p className="text-xs text-purple-400 uppercase tracking-wider mb-1">{formatKey(key)}</p><p className="font-semibold text-foreground">{value}</p></div>))
          })()}</div>
        </SectionCard>

        <SectionCard title="Ayanamsa (Precession Correction)" icon={Globe} gradient="from-pink-500/50 to-purple-500/30">
          <div className="grid md:grid-cols-2 gap-6">{(() => {
            const ayanamsa = extractAyanamsa(kundli.horoscope_info)
            return Object.entries(ayanamsa).map(([key, value]) => (<DataItem key={key} label={formatKey(key)} value={value.toString()} accent={key === 'value'} />))
          })()}</div>
        </SectionCard>

        <SectionCard title="Houses and Planetary Positions" icon={Sun} gradient="from-yellow-500/50 to-orange-500/30" collapsible>
          <div className="grid md:grid-cols-2 gap-4">{(() => {
            const planets = extractPlanets(kundli.horoscope_info)
            return planets.map((p) => (<PlanetCard key={p.name} planet={p} />))
          })()}</div>
        </SectionCard>

        <SectionCard title="Additional Astrological Data" icon={Sparkles} gradient="from-cyan-500/50 to-blue-500/30" collapsible>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{getDisplayableItems(kundli.horoscope_info, 12).map(([key, value]) => (<div key={key} className="cosmic-card rounded-xl p-4 hover:bg-purple-500/10 transition-colors"><DataItem label={formatKey(key)} value={value.toString()} /></div>))}</div>
        </SectionCard>

        <div className="cosmic-card rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
          <div className="p-6 bg-gradient-to-r from-purple-900/40 to-cyan-900/20">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center glow-purple animate-pulse-glow"><Sparkles className="w-7 h-7 text-white" /></div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold gradient-text-purple mb-2">AI Astrological Analysis</h3>
                <p className="text-muted-foreground mb-4">Get a comprehensive AI-powered analysis of your kundli using advanced algorithms that cross-reference Palmistry, Numerology, and Astrology for accurate predictions.</p>
                <button onClick={handleAnalyze} disabled={analyzing} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2 glow-purple text-lg"><Sparkles className="w-5 h-5" />{analyzing ? 'Analyzing...' : 'Generate AI Analysis'}<ArrowRight className="w-4 h-4 ml-2" /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="cosmic-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4"><Download className="w-6 h-6 text-green-400" /><h3 className="text-xl font-bold text-foreground">Download Results</h3></div>
            <p className="text-muted-foreground mb-4">Download a professional PDF report of your complete kundli analysis.</p>
            <button onClick={handleDownloadPDF} disabled={downloading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"><Download className="w-4 h-4" />{downloading ? 'Downloading...' : 'Download PDF Report'}</button>
          </div>
          <div className="cosmic-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4"><MessageCircle className="w-6 h-6 text-purple-400" /><h3 className="text-xl font-bold text-foreground">Chat About Kundli</h3></div>
            <p className="text-muted-foreground mb-4">Ask questions about your kundli and get personalized AI-powered insights.</p>
            <Link to={`/chat/${kundliId}`}><button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4" />Start Chat Session</button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
