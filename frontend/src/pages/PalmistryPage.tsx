import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hand, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { api } from '../services/api'
import PalmistryUpload from '../components/palmistry/PalmistryUpload'
import PalmistryScanningLoader from '../components/palmistry/PalmistryScanningLoader'
import PalmistryResults from '../components/palmistry/PalmistryResults'
import toast from 'react-hot-toast'

export type PalmistryState = 'upload' | 'scanning' | 'results'

export interface PalmLine {
  name: string
  description: string
  meaning: string
  strength: 'strong' | 'moderate' | 'faint'
}

export interface PalmMount {
  name: string
  planet: string
  description: string
  prominence: 'prominent' | 'normal' | 'flat'
}

export interface PalmistryData {
  palmistry_id: string
  handedness: 'left' | 'right'
  hand_type: string
  elemental_type: string
  palm_shape: string
  finger_length: string
  major_lines: Record<string, PalmLine>
  mounts: Record<string, PalmMount>
  overall_reading: string
  life_areas: {
    love: { title: string; description: string; score: number }
    career: { title: string; description: string; score: number }
    health: { title: string; description: string; score: number }
    wealth: { title: string; description: string; score: number }
  }
  created_at: string
  metadata?: Record<string, any>
}

export default function PalmistryPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [state, setState] = useState<PalmistryState>('upload')
  const [palmistryReadings, setPalmistryReadings] = useState<PalmistryData[]>([])
  const [selectedPalmistryId, setSelectedPalmistryId] = useState<string | null>(null)
  const [currentPalmistryData, setCurrentPalmistryData] = useState<PalmistryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    fetchPalmistryReadings()
  }, [])

  const fetchPalmistryReadings = async () => {
    try {
      setLoading(true)
      const response = await api.getPalmistryList()
      setPalmistryReadings(response.data.readings || [])
      if (response.data.readings && response.data.readings.length > 0) {
        setSelectedPalmistryId(response.data.readings[0].palmistry_id)
        loadPalmistryReading(response.data.readings[0].palmistry_id)
      }
    } catch (error) {
      console.error('Error fetching palmistry readings:', error)
      toast.error('Failed to load palmistry readings')
    } finally {
      setLoading(false)
    }
  }

  const loadPalmistryReading = async (palmistryId: string) => {
    try {
      const response = await api.getPalmistryReading(palmistryId)
      setCurrentPalmistryData(response.data)
      setState('results')
    } catch (error) {
      console.error('Error loading palmistry reading:', error)
      toast.error('Failed to load palmistry reading')
    }
  }

  const handleImageUpload = async (leftHandImage: string, rightHandImage: string, handedness: 'left' | 'right') => {
    try {
      setState('scanning')
      const response = await api.analyzePalmistry({
        left_hand_image: leftHandImage,
        right_hand_image: rightHandImage,
        handedness: handedness,
      })
      
      setCurrentPalmistryData(response.data)
      setPalmistryReadings([response.data, ...palmistryReadings])
      setSelectedPalmistryId(response.data.palmistry_id)
      setState('results')
      toast.success('Palm analysis complete!')
    } catch (error) {
      console.error('Error analyzing palmistry:', error)
      toast.error('Failed to analyze palm. Please try again.')
      setState('upload')
    }
  }

  const handleSelectReading = (palmistryId: string) => {
    setSelectedPalmistryId(palmistryId)
    loadPalmistryReading(palmistryId)
    setDropdownOpen(false)
  }

  const handleNewReading = () => {
    setState('upload')
    setCurrentPalmistryData(null)
  }

  if (loading && state === 'upload') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin-slow w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 mb-4 mx-auto"></div>
          <p className="text-slate-300">Loading palmistry readings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      {state === 'results' && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-700/50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hand className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Your Palm Reading</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Palmistry Selector Dropdown */}
              {palmistryReadings.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:bg-slate-700/80 transition text-slate-200"
                  >
                    <span className="text-sm">
                      {palmistryReadings.find(r => r.palmistry_id === selectedPalmistryId)?.created_at 
                        ? new Date(palmistryReadings.find(r => r.palmistry_id === selectedPalmistryId)?.created_at || '').toLocaleDateString()
                        : 'Select Reading'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700/50 rounded-lg shadow-lg z-10">
                      {palmistryReadings.map((reading) => (
                        <button
                          key={reading.palmistry_id}
                          onClick={() => handleSelectReading(reading.palmistry_id)}
                          className={`w-full text-left px-4 py-3 border-b border-slate-700/30 last:border-b-0 transition ${
                            selectedPalmistryId === reading.palmistry_id
                              ? 'bg-purple-600/20 text-purple-300'
                              : 'hover:bg-slate-700/50 text-slate-300'
                          }`}
                        >
                          <div className="font-medium">{new Date(reading.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-400 mt-1">{reading.hand_type}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={handleNewReading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition font-medium text-sm"
              >
                New Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {state === 'upload' && <PalmistryUpload onImageUpload={handleImageUpload} />}
        {state === 'scanning' && <PalmistryScanningLoader />}
        {state === 'results' && currentPalmistryData && (
          <PalmistryResults data={currentPalmistryData} onNewReading={handleNewReading} />
        )}
      </div>
    </div>
  )
}
