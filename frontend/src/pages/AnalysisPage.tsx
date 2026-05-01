import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download, Eye, Sparkles, Star, Zap } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

interface BirthData {
  name: string
  place_name: string
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

interface Calculation {
  calculation_id: string
  kundli_id: string
  birth_data?: BirthData
  generation_date?: string
  result_summary?: {
    kundli_id: string
    generated_at: string
  }
  created_at?: string
}

export default function AnalysisPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        setLoading(true)
        const response = await api.getUserCalculations()
        setCalculations(response.data.calculations || [])
      } catch (error) {
        console.error('Failed to fetch calculations:', error)
        toast.error('Failed to load analyses')
      } finally {
        setLoading(false)
      }
    }

    fetchCalculations()
  }, [])

  const handleDownloadAnalysis = async (kundliId: string, name: string) => {
    try {
      setDownloading(kundliId)
      const response = await api.downloadAnalysis(kundliId)
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${name}_AI_Analysis.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Analysis downloaded successfully')
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Analysis not found. Please generate analysis first.')
      } else {
        toast.error('Failed to download analysis')
      }
      console.error('Download error:', error)
    } finally {
      setDownloading(null)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    if (typeof date === 'string') return date.split('T')[0]
    if (date.toDate) return date.toDate().toLocaleDateString()
    return 'N/A'
  }

  return (
    <div className="relative space-y-8 w-full">
      {/* Floating Particles Background */}
      <div className="floating-particles">
        <div className="particle" />
        <div className="particle" />
        <div className="particle" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">AI Analysis</h1>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            View and download your generated analyses
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary"></div>
          </div>
        ) : calculations.length === 0 ? (
          <div className="cosmic-card p-12 text-center">
            <p className="text-muted-foreground mb-6">No analyses available yet</p>
            <Link
              to="/generate"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Generate Your First Kundli
            </Link>
          </div>
        ) : (
          <div className="cosmic-card rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
            <div className="divide-y divide-border/30">
              {calculations.map((calc, index) => {
                const birthData = calc.birth_data
                const kundliId = calc.kundli_id
                const generatedAt = calc.generation_date
                const name = birthData?.name || 'Kundli'
                const birthDate = birthData ? `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}` : 'N/A'
                const place = birthData?.place_name || 'N/A'
                
                return (
                  <div key={calc.calculation_id} className="group flex items-center justify-between p-5 hover:bg-purple-500/5 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center group-hover:border-purple-400/50 transition-all duration-300">
                          <FileText className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-purple-300 transition-colors">{name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {birthDate} <span className="w-1 h-1 rounded-full bg-muted-foreground/50" /> {place}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground/60">Generated: {formatDate(generatedAt)}</span>
                          <span className="flex items-center gap-1 text-xs text-cyan-400">
                            <Star className="w-3 h-3 fill-current" />Analysis ready
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link to={`/results/${kundliId}`}>
                        <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 gap-2 font-medium transition-all duration-300 hover:scale-105 text-white px-4 py-2 rounded-lg flex items-center">
                          <Eye className="w-4 h-4" />View
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDownloadAnalysis(kundliId, name)}
                        disabled={downloading === kundliId}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 gap-2 font-medium transition-all duration-300 hover:scale-105 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <Download className="w-4 h-4" />
                        <span>{downloading === kundliId ? 'Downloading...' : 'Download'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}
