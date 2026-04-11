import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { Download, MessageCircle, Loader, Sparkles } from 'lucide-react'

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your kundli...</p>
        </div>
      </div>
    )
  }

  if (!kundli) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Kundli data not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-indigo-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Kundli Generated!</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Your personalized kundli for <span className="font-semibold">{kundli.birth_data.name}</span> is ready
            </p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 mb-8 border border-indigo-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                <p className="font-semibold text-gray-900">{kundli.birth_data.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time of Birth</p>
                <p className="font-semibold text-gray-900">{kundli.birth_data.time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-1">Place of Birth</p>
                <p className="font-semibold text-gray-900">{kundli.birth_data.place}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-3 text-lg"
            >
              {downloading ? (
                <>
                  <Loader size={24} className="animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download size={24} />
                  <span>Download Kundli</span>
                </>
              )}
            </button>

            <button
              onClick={handleChatWithAI}
              disabled={downloading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-3 text-lg"
            >
              <MessageCircle size={24} />
              <span>Chat with AI</span>
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Your kundli includes all divisional charts (D1, D7, D9, D10) and detailed astrological analysis
          </p>
        </div>
      </div>
    </div>
  )
}
