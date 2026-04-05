import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">AI Analysis</h1>
          <p className="text-gray-600 mt-2">View and download your generated analyses</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : calculations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-6">No analyses available yet</p>
            <Link
              to="/generate"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Generate Your First Kundli
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {calculations.map((calc) => {
              const birthData = calc.birth_data
              const kundliId = calc.result_summary?.kundli_id || calc.kundli_id
              const generatedAt = calc.result_summary?.generated_at || calc.created_at
              const name = birthData?.name || 'Kundli'
              const birthDate = birthData ? `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}` : 'N/A'
              const place = birthData?.place_name || 'N/A'
              
              return (
                <div key={calc.calculation_id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="text-indigo-600" size={24} />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                          <p className="text-sm text-gray-500">
                            {birthDate} • {place}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 ml-9">
                        Generated: {formatDate(generatedAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/results/${kundliId}`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDownloadAnalysis(kundliId, name)}
                        disabled={downloading === kundliId}
                        className={`flex items-center space-x-2 px-4 py-2 rounded transition font-semibold ${
                          downloading === kundliId
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <Download size={18} />
                        <span>{downloading === kundliId ? 'Downloading...' : 'Download'}</span>
                      </button>
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
