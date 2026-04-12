import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import apiClient from '../services/api'
import toast from 'react-hot-toast'
import { Sparkles, Download, Loader, MessageCircle } from 'lucide-react'
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
    try {
      console.log('[RESULTS] Generating analysis for kundliId:', kundliId)
      const response = await api.generateAnalysis(kundliId, 'comprehensive')
      console.log('[RESULTS] Analysis generated successfully')
      setAnalysis(response.data.analysis_text || 'Analysis generated successfully')
      toast.success('Analysis generated successfully')
    } catch (error) {
      console.error('[RESULTS] Failed to generate analysis:', error)
      toast.error('Failed to generate analysis')
    } finally {
      setAnalyzing(false)
    }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading kundli data...</p>
        </div>
      </div>
    )
  }

  if (!kundli) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Kundli data not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div key={kundliId} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kundli Results</h1>
        <p className="text-gray-600 mb-8">Birth Chart Analysis for {kundli.birth_data.name}</p>

        {/* Birth Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Birth Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg text-gray-900">{kundli.birth_data.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Place of Birth</p>
              <p className="text-lg text-gray-900">{kundli.birth_data.place}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-lg text-gray-900">{kundli.birth_data.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-lg text-gray-900">{kundli.birth_data.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Latitude</p>
              <p className="text-lg text-gray-900">{kundli.birth_data.latitude.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Longitude</p>
              <p className="text-lg text-gray-900">{kundli.birth_data.longitude.toFixed(4)}</p>
            </div>
          </div>
        </div>

        {/* Panchanga Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Panchanga (Astrological Calendar)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {(() => {
              const panchanga = extractPanchanga(kundli.horoscope_info)
              return Object.entries(panchanga).map(([key, value]) => (
                <div key={key} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{formatKey(key)}</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{value}</p>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Ayanamsa Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ayanamsa (Precession Correction)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              const ayanamsa = extractAyanamsa(kundli.horoscope_info)
              return Object.entries(ayanamsa).map(([key, value]) => (
                <div key={key} className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-gray-500">{formatKey(key)}</p>
                  <p className="text-lg text-gray-900 font-semibold">{value}</p>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Houses and Planets Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Houses and Planetary Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              const planets = extractPlanets(kundli.horoscope_info)
              return planets.map((planet) => (
                <div key={planet.name} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-semibold text-blue-600">{planet.name}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-gray-700"><span className="font-medium">Sign:</span> {planet.sign}</p>
                    <p className="text-gray-700"><span className="font-medium">House:</span> {planet.house}</p>
                    <p className="text-gray-700"><span className="font-medium">Nakshatra:</span> {planet.nakshatra}</p>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>

        {/* Additional Astrological Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Astrological Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getDisplayableItems(kundli.horoscope_info, 12).map(([key, value]) => (
              <div key={key} className="border-l-4 border-indigo-500 pl-4">
                <p className="text-sm font-medium text-gray-500">{formatKey(key)}</p>
                <p className="text-lg text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Sparkles className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">AI Astrological Analysis</h2>
          </div>

          {!analysis ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Get a comprehensive AI-powered analysis of your kundli using Google Gemini API.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8">
              <div className="prose prose-sm max-w-none">
                {analysis.split('\n').map((line, idx) => {
                  const trimmed = line.trim()
                  
                  // Empty lines
                  if (!trimmed) {
                    return <div key={idx} className="h-2" />
                  }
                  
                  // Section headings (all caps or quoted)
                  if (trimmed.match(/^[A-Z\s\.]+$/) && trimmed.length > 5 || 
                      (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-indigo-700 mt-6 mb-3 border-b-2 border-indigo-200 pb-2">
                        {trimmed.replace(/^"|"$/g, '')}
                      </h3>
                    )
                  }
                  
                  // Numbered points
                  if (trimmed.match(/^\d+[\.\)]\s+/)) {
                    return (
                      <div key={idx} className="ml-4 mb-3 text-gray-700">
                        <p className="text-base leading-relaxed">{trimmed}</p>
                      </div>
                    )
                  }
                  
                  // Regular paragraphs
                  return (
                    <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                      {trimmed}
                    </p>
                  )
                })}
              </div>
              <button
                onClick={() => setAnalysis(null)}
                className="mt-8 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Generate New Analysis
              </button>
            </div>
          )}
        </div>

        {/* Download & Chat Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Download className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Download Results & Chat</h2>
          </div>
          {analysis ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Your AI analysis has been generated. Download the professional PDF report or chat about your kundli.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
                >
                  {downloading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download PDF Report</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleOpenChat}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat About Kundli</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Generate an AI analysis first to download the professional PDF report or chat about your kundli.
              </p>
              <p className="text-sm text-gray-500">
                Your kundli data has been generated and saved. You can access it through your calculation history.
              </p>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <button
                  onClick={handleOpenChat}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat About Kundli</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
