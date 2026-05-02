import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, MapPin, Clock, BookOpen } from 'lucide-react'
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

export default function KundliPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        setLoading(true)
        const response = await api.getUserCalculations()
        setCalculations(response.data.calculations || [])
      } catch (error) {
        console.error('Failed to fetch calculations:', error)
        toast.error('Failed to load kundlis')
      } finally {
        setLoading(false)
      }
    }

    fetchCalculations()
  }, [])

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    if (typeof date === 'string') return date.split('T')[0]
    if (date.toDate) return date.toDate().toLocaleDateString()
    return 'N/A'
  }

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground uppercase tracking-wider">Your Collection</span>
            </div>
            <h1 className="text-4xl font-bold gradient-text">Your Kundlis</h1>
            <p className="text-muted-foreground mt-2">View and manage your generated kundlis</p>
          </div>
          <Link
            to="/generate"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-lg transition glow-purple"
          >
            <Plus size={20} />
            <span>Generate New</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary"></div>
          </div>
        ) : calculations.length === 0 ? (
          <div className="cosmic-card p-12 text-center">
            <p className="text-muted-foreground mb-6">No kundlis generated yet</p>
            <Link
              to="/generate"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Generate Your First Kundli
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculations.map((calc) => {
              const birthData = calc.birth_data
              const kundliId = calc.kundli_id
              const generatedAt = calc.generation_date
              
              // Extract date and time from birth_data
              const birthDate = birthData ? `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}` : 'N/A'
              const birthTime = birthData ? `${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}` : 'N/A'
              const birthPlace = birthData?.place_name || 'N/A'
              const personName = birthData?.name || 'Kundli'
              
              return (
                <div key={calc.calculation_id} className="cosmic-card overflow-hidden group hover:border-primary/50 transition-all">
                  {/* Gradient Header */}
                  <div className="h-16 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30" />
                    <div className="relative z-10 p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white truncate">{personName}</h3>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Calendar size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Date</p>
                        <p className="font-semibold text-foreground">{birthDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Time</p>
                        <p className="font-semibold text-foreground">{birthTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin size={16} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Place</p>
                        <p className="font-semibold text-foreground truncate">{birthPlace}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-4">
                        Generated: {formatDate(generatedAt)}
                      </p>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/results/${kundliId}`}
                          className="flex-1 text-center bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-4 rounded transition"
                        >
                          View
                        </Link>
                        <Link
                          to={`/chat/${kundliId}`}
                          className="flex-1 text-center bg-accent/20 hover:bg-accent/30 text-accent font-semibold py-2 px-4 rounded transition"
                        >
                          Chat
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
