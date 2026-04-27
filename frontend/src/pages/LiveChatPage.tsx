import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Send, Loader, MapPin, Calendar, Clock, Sparkles, ChevronDown } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { GooglePlacesAutocomplete } from '../components/GooglePlacesAutocomplete'
import { CityData } from '../data/cities'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface BirthData {
  name: string
  day: number
  month: number
  year: number
  hour: number
  minute: number
  place: string
  latitude: number
  longitude: number
  timezone_offset: number
}

interface CityOption {
  name: string
  city: string
  country: string
  latitude: number
  longitude: number
  timezone: number
}

export default function LiveChatPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState<'form' | 'chat'>('form')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingKundli, setGeneratingKundli] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [birthData, setBirthData] = useState<BirthData>({
    name: '',
    day: 1,
    month: 1,
    year: 2000,
    hour: 12,
    minute: 0,
    place: 'New Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone_offset: 5.5,
  })

  const [kundliGenerated, setKundliGenerated] = useState(false)
  const [kundliData, setKundliData] = useState<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check if kundli data is passed via sessionStorage or URL parameter
  useEffect(() => {
    const source = searchParams.get('source')
    let kundliToLoad = null

    // Try to get kundli from sessionStorage first (from Results page)
    if (source === 'results') {
      const storedKundli = sessionStorage.getItem('kundli_data')
      if (storedKundli) {
        try {
          kundliToLoad = JSON.parse(storedKundli)
          sessionStorage.removeItem('kundli_data') // Clean up after retrieval
          console.log('[LiveChat] Kundli data retrieved from sessionStorage:', kundliToLoad)
        } catch (error) {
          console.error('[LiveChat] Failed to parse kundli from sessionStorage:', error)
          toast.error('Failed to load kundli data')
          return
        }
      }
    } else {
      // Try legacy URL parameter method for backward compatibility
      const kundliParam = searchParams.get('kundli')
      if (kundliParam) {
        try {
          kundliToLoad = JSON.parse(atob(kundliParam))
          console.log('[LiveChat] Kundli data received from URL:', kundliToLoad)
        } catch (error) {
          console.error('[LiveChat] Failed to decode kundli from URL:', error)
          toast.error('Failed to load kundli data from URL')
          return
        }
      }
    }

    if (kundliToLoad) {
      // Set kundli data and skip to chat
      setKundliData(kundliToLoad)
      setKundliGenerated(true)
      setStep('chat')

      // Extract birth data for display
      if (kundliToLoad.birth_data) {
        const bd = kundliToLoad.birth_data
        setBirthData(prev => ({
          ...prev,
          name: bd.name || prev.name,
          place: bd.place || prev.place,
          latitude: bd.latitude || prev.latitude,
          longitude: bd.longitude || prev.longitude,
          timezone_offset: bd.timezone_offset || prev.timezone_offset,
        }))
      }

      const welcomeMessage: Message = {
        role: 'assistant',
        content: `Namaste! 🙏 I've loaded your kundli data. I'm your personal Vedic astrology guide and I'm ready to answer any questions about your astrological profile. Ask me anything about your personality, career, relationships, or life path!`,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      toast.success('Kundli loaded successfully!')
    }
  }, [searchParams])

  const handlePlaceChange = (value: string) => {
    setBirthData(prev => ({ ...prev, place: value }))
  }

  const handlePlaceSelect = (place: CityData) => {
    setBirthData(prev => ({
      ...prev,
      place: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone_offset: place.timezone,
    }))
  }

  const handleGenerateKundli = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!birthData.name.trim()) {
      toast.error('Please enter your name')
      return
    }

    setGeneratingKundli(true)

    try {
      console.log('[LiveChat] Generating kundli with data:', birthData)
      const response = await api.generateLivechatKundli(birthData)
      console.log('[LiveChat] Kundli generated:', response.data)

      // Store kundli data for chat context
      const generatedKundliData = response.data
      const kundliId = generatedKundliData.kundli_id
      
      // Store in sessionStorage for the new chat page
      sessionStorage.setItem('kundli_data', JSON.stringify(generatedKundliData))
      
      toast.success('Kundli generated successfully! Redirecting to chat...')
      
      // Redirect to the new chat UI with the kundli ID
      setTimeout(() => {
        navigate(`/chat/${kundliId}`)
      }, 500)
    } catch (error: any) {
      console.error('[LiveChat] Failed to generate kundli:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to generate kundli'
      toast.error(errorMsg)
    } finally {
      setGeneratingKundli(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || !kundliGenerated || !kundliData) {
      return
    }

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      console.log('[LiveChat] Sending message:', inputValue)
      const response = await api.sendLivechatMessage(
        kundliData,
        inputValue,
        messages.map(m => ({ role: m.role, content: m.content }))
      )

      console.log('[LiveChat] Response received:', response.data)
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response || 'Unable to generate response',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('[LiveChat] Failed to send message:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to send message'
      toast.error(errorMsg)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  // Form Step
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-indigo-400" size={32} />
              <h1 className="text-4xl sm:text-5xl font-bold text-white">AstroChat</h1>
            </div>
            <p className="text-indigo-200 text-lg">Chat with your personal Vedic astrology guide</p>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-indigo-700">
            <h2 className="text-2xl font-bold text-white mb-6">Your Birth Details</h2>

            <form onSubmit={handleGenerateKundli} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">Full Name</label>
                <input
                  type="text"
                  value={birthData.name}
                  onChange={(e) => setBirthData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-700 border border-indigo-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  disabled={generatingKundli}
                />
              </div>

              {/* Date of Birth */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Day</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={birthData.day}
                    onChange={(e) => setBirthData(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-indigo-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    disabled={generatingKundli}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Month</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={birthData.month}
                    onChange={(e) => setBirthData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-indigo-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    disabled={generatingKundli}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Year</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={birthData.year}
                    onChange={(e) => setBirthData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-indigo-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    disabled={generatingKundli}
                  />
                </div>
              </div>

              {/* Time of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Hour</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={birthData.hour}
                    onChange={(e) => setBirthData(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-indigo-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    disabled={generatingKundli}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Minute</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={birthData.minute}
                    onChange={(e) => setBirthData(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-indigo-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    disabled={generatingKundli}
                  />
                </div>
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">Place of Birth</label>
                <div className="[&_input]:bg-gray-700 [&_input]:border-indigo-600 [&_input]:text-white [&_input]:placeholder-gray-400 [&_input]:focus:ring-indigo-500 [&_button]:bg-gray-700 [&_button]:text-white [&_button]:hover:bg-indigo-600">
                  <GooglePlacesAutocomplete
                    value={birthData.place}
                    onChange={handlePlaceChange}
                    onSelect={handlePlaceSelect}
                    placeholder="Search for a city, hospital, landmark..."
                    disabled={generatingKundli}
                  />
                </div>
                <p className="text-xs text-indigo-300 mt-2">
                  Timezone: UTC {birthData.timezone_offset > 0 ? '+' : ''}{birthData.timezone_offset}
                </p>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={generatingKundli || !birthData.name.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {generatingKundli ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Generating Kundli...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Kundli & Start Chat</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Chat Step
  return (
    <div className="fixed inset-0 flex bg-gray-900">
      {/* Left Panel - Kundli Info */}
      <div className="w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6 border-r border-indigo-800 overflow-y-auto hidden sm:flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Your Kundli</h2>

        <div className="space-y-6 flex-1">
          <div>
            <p className="text-indigo-200 text-sm mb-1">Name</p>
            <p className="text-lg font-semibold">{birthData.name}</p>
          </div>

          <div>
            <p className="text-indigo-200 text-sm mb-1">Birth Date</p>
            <p className="text-lg font-semibold">
              {birthData.day.toString().padStart(2, '0')}/{birthData.month.toString().padStart(2, '0')}/{birthData.year}
            </p>
          </div>

          <div>
            <p className="text-indigo-200 text-sm mb-1">Birth Time</p>
            <p className="text-lg font-semibold">
              {birthData.hour.toString().padStart(2, '0')}:{birthData.minute.toString().padStart(2, '0')}
            </p>
          </div>

          <div>
            <p className="text-indigo-200 text-sm mb-1">Birth Place</p>
            <p className="text-lg font-semibold">{birthData.place}</p>
          </div>

          <div className="pt-6 border-t border-indigo-700">
            <p className="text-indigo-200 text-sm mb-3">Quick Questions</p>
            <div className="space-y-2">
              {[
                'What are my key planetary positions?',
                'What does my chart say about my career?',
                'What are my strengths according to astrology?',
                'What challenges should I be aware of?',
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(question)}
                  className="w-full text-left text-sm p-2 rounded bg-indigo-800 hover:bg-indigo-700 transition text-indigo-100"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col bg-gray-800 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-300 text-lg mb-2">Start a conversation about your kundli</p>
                <p className="text-gray-400 text-sm">Ask questions about your astrological chart and get AI-powered insights</p>
              </div>
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-100 rounded-bl-none'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="text-sm space-y-2 whitespace-pre-wrap">
                    {message.content.split('\n').map((line, i) => {
                      const trimmed = line.trim()
                      if (!trimmed) return null
                      
                      if (trimmed.match(/^[A-Z][^:]*:$/)) {
                        return (
                          <div key={i} className="font-semibold text-indigo-200 mt-2 mb-1">
                            {trimmed}
                          </div>
                        )
                      }
                      
                      if (trimmed.startsWith('•') || trimmed.match(/^[-*]\s/)) {
                        return (
                          <div key={i} className="ml-4 text-sm">
                            {trimmed.replace(/^[-*•]\s*/, '• ')}
                          </div>
                        )
                      }
                      
                      return (
                        <div key={i} className="text-sm leading-relaxed">
                          {trimmed}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-indigo-700 bg-gray-800 p-4 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your kundli..."
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-700 border border-indigo-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600 transition"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2 flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
