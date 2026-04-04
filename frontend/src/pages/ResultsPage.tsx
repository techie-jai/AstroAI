import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import apiClient from '../services/api'
import toast from 'react-hot-toast'
import { Sparkles, Download, Loader } from 'lucide-react'

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
        const response = await api.getKundli(kundliId)
        setKundli(response.data)
      } catch (error) {
        toast.error('Failed to load kundli data')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchKundli()
  }, [kundliId])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const response = await api.generateAnalysis(kundliId || '', 'comprehensive')
      setAnalysis(response.data.analysis_text || 'Analysis generated successfully')
      toast.success('Analysis generated successfully')
    } catch (error) {
      toast.error('Failed to generate analysis')
      console.error(error)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
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

        {/* Astrological Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Astrological Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(kundli.horoscope_info).slice(0, 12).map(([key, value]) => (
              <div key={key} className="border-l-4 border-indigo-500 pl-4">
                <p className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-lg text-gray-900">{String(value)}</p>
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
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
              <button
                onClick={() => setAnalysis(null)}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Generate New Analysis
              </button>
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Download className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Download Results</h2>
          </div>
          {analysis ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Your AI analysis has been generated. Download the professional PDF report below.
              </p>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
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
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Generate an AI analysis first to download the professional PDF report.
              </p>
              <p className="text-sm text-gray-500">
                Your kundli data has been generated and saved. You can access it through your calculation history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
