import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { Download, MessageCircle, Loader, Sparkles, Eye, Calendar, Clock, MapPin, Zap, BookOpen, Wand2 } from 'lucide-react'

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

// Rotating Planets Component (copied from ResultsPage)
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

export default function KundliCompletionPage() {
  const { kundliId } = useParams()
  const navigate = useNavigate()
  const [kundli, setKundli] = useState<KundliData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const fetchKundli = async () => {
      try {
        if (!kundliId) {
          toast.error('Kundli ID not found')
          return
        }

        console.log('[COMPLETION] Fetching kundli with ID:', kundliId)
        const response = await api.getKundli(kundliId)
        
        const freshData = JSON.parse(JSON.stringify(response.data))
        setKundli(freshData)
        
        // Note: Don't store in localStorage - rely on backend index instead
        // The backend now serves data from the local file index
        console.log('[COMPLETION] Kundli data available from backend API')
        
        console.log('[COMPLETION] Kundli loaded successfully')
      } catch (error) {
        toast.error('Failed to load kundli data')
        console.error('[COMPLETION] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchKundli()
  }, [kundliId])

  const handleDownload = async () => {
    if (!kundliId) {
      toast.error('Kundli ID not found')
      return
    }

    setDownloading(true)
    try {
      const response = await api.downloadKundliZip(kundliId)
      
      const blob = new Blob([response.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${kundli?.birth_data.name || 'Kundli'}_Complete.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Kundli downloaded successfully!')
    } catch (error: any) {
      console.error('[COMPLETION] Download error:', error)
      toast.error('Failed to download kundli')
    } finally {
      setDownloading(false)
    }
  }

  const handleViewResults = () => {
    if (!kundliId) {
      toast.error('Kundli ID not found')
      return
    }

    try {
      navigate(`/results/${kundliId}`)
      toast.success('Loading results...')
    } catch (error) {
      console.error('[COMPLETION] Navigation error:', error)
      toast.error('Failed to open results')
    }
  }

  const handleChatWithAI = () => {
    if (!kundliId) {
      toast.error('Kundli ID not found')
      return
    }

    try {
      if (kundli) {
        sessionStorage.setItem('kundli_data', JSON.stringify(kundli))
      }
      navigate(`/chat/${kundliId}`)
      toast.success('Opening chat...')
    } catch (error) {
      console.error('[COMPLETION] Navigation error:', error)
      toast.error('Failed to open chat')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 cosmic-gradient-bg opacity-10 pointer-events-none" />
        <div className="relative z-10 text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading your cosmic kundli...</p>
        </div>
      </div>
    )
  }

  if (!kundli) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 relative overflow-hidden">
        <div className="absolute inset-0 cosmic-gradient-bg opacity-10 pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="cosmic-card p-8 rounded-2xl border border-purple-500/20 text-center">
            <p className="text-slate-300">Kundli data not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 relative overflow-hidden">
      {/* Cosmic gradient background */}
      <div className="absolute inset-0 cosmic-gradient-bg opacity-10 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center animate-float">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kundli Generated!</h1>
          </div>
          <p className="text-slate-300 text-lg">
            Your personalized kundli for <span className="font-bold text-cyan-400">{kundli.birth_data.name}</span> is ready
          </p>
        </div>

        {/* Rotating Planets Visualization */}
        <OrbitingPlanets />

        {/* Birth Details Card */}
        <div className="cosmic-card p-8 rounded-2xl border border-purple-500/20 mb-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Your Birth Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date of Birth */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Date of Birth</p>
                <p className="text-slate-100 font-medium">{kundli.birth_data.date}</p>
              </div>
            </div>

            {/* Time of Birth */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Time of Birth</p>
                <p className="text-slate-100 font-medium">{kundli.birth_data.time}</p>
              </div>
            </div>

            {/* Place of Birth */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Place of Birth</p>
                <p className="text-slate-100 font-medium">{kundli.birth_data.place}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="cosmic-card p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-cyan-400 mb-1">Complete Analysis</p>
                <p className="text-sm text-slate-300">Includes all divisional charts (D1, D7, D9, D10) and detailed astrological insights</p>
              </div>
            </div>
          </div>

          <div className="cosmic-card p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-purple-400 mb-1">AI-Powered Insights</p>
                <p className="text-sm text-slate-300">Chat with our AI astrologer to get personalized guidance and predictions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleViewResults}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg glow-cyan"
          >
            <Eye className="w-5 h-5" />
            <span>View Complete Results</span>
          </button>

          <button
            onClick={handleChatWithAI}
            disabled={downloading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg glow-purple disabled:glow-none"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat with AI Astrologer</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            {downloading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Kundli (ZIP)</span>
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            ✨ Your kundli is now ready for exploration. Start with viewing the complete results or chat with our AI for personalized insights.
          </p>
        </div>
      </div>
    </div>
  )
}
