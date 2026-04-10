import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, Loader, ArrowLeft } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface KundliInfo {
  name: string
  birth_date: string
  birth_time: string
  place: string
}

interface Calculation {
  calculation_id: string
  kundli_id: string
  name: string
  birth_date: string
}

export default function ChatPage() {
  const { kundliId } = useParams<{ kundliId: string }>()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [kundliInfo, setKundliInfo] = useState<any>(null)
  const [calculations, setCalculations] = useState<any[]>([])
  const [loadingKundli, setLoadingKundli] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [kundliData, setKundliData] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize - fetch calculations if no kundliId, or fetch kundli info if kundliId provided
  useEffect(() => {
    const init = async () => {
      try {
        if (!kundliId) {
          // No kundliId - fetch available kundlis
          const response = await api.getUserCalculations()
          const calcs = response.data.calculations || []
          setCalculations(calcs)
          if (calcs.length === 0) {
            setError('No kundlis found. Please generate a kundli first.')
          } else {
            setError('Select a kundli to start chatting.')
          }
        } else {
          // Has kundliId - fetch kundli info
          const response = await api.getKundli(kundliId)
          const fullKundliData = response.data
          setKundliData(fullKundliData) // Store full kundli data for chat
          const birthData = fullKundliData.birth_data || {}
          setKundliInfo({
            name: birthData.name || 'Unknown',
            birth_date: birthData.date || `${birthData.year || 'N/A'}-${birthData.month || 'N/A'}-${birthData.day || 'N/A'}`,
            birth_time: birthData.time || `${birthData.hour || 'N/A'}:${birthData.minute || 'N/A'}`,
            place: birthData.place || 'Unknown',
          })
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || err.message || 'Failed to load data'
        setError(errorMsg)
      } finally {
        setLoadingKundli(false)
      }
    }
    
    init()
  }, [kundliId])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || !kundliData) {
      console.log('[ChatPage] Cannot send message - inputValue or kundliData missing')
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
      console.log('[ChatPage] Sending message:', inputValue)
      const response = await api.sendLivechatMessage(
        kundliData,
        inputValue,
        messages.map(m => ({ role: m.role, content: m.content }))
      )

      console.log('[ChatPage] Response received:', response.data)
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response || 'Unable to generate response',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('[ChatPage] Failed to send message:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to send message'
      toast.error(errorMsg)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loadingKundli) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #4f46e5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#4b5563' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // No kundliId - show selection screen
  if (!kundliId) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '448px', width: '100%' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Select a Kundli</h2>
          <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '24px' }}>{error || 'Choose a kundli to chat about'}</p>
          
          {calculations.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '256px', overflowY: 'auto' }}>
                {calculations.map((calc) => (
                  <button
                    key={calc.kundli_id}
                    onClick={() => navigate(`/chat/${calc.kundli_id}`)}
                    style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '8px', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0e7ff')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#eef2ff')}
                  >
                    <p style={{ fontWeight: '600', color: '#312e81', fontSize: '14px' }}>{calc.name}</p>
                    <p style={{ fontSize: '12px', color: '#4f46e5' }}>{calc.birth_date}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => navigate('/dashboard')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !kundliInfo) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', padding: '32px', maxWidth: '448px', width: '100%', textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '16px', fontWeight: '600' }}>Error Loading Kundli</p>
          <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full h-full bg-gray-50">
      {/* Left Panel - Kundli Info */}
      <div className="w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6 border-r border-indigo-800 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Kundli Info</h2>
        
        {kundliInfo && (
          <div className="space-y-6">
            <div>
              <p className="text-indigo-200 text-sm mb-1">Name</p>
              <p className="text-lg font-semibold">{kundliInfo.name}</p>
            </div>
            
            <div>
              <p className="text-indigo-200 text-sm mb-1">Birth Date</p>
              <p className="text-lg font-semibold">{kundliInfo.birth_date}</p>
            </div>
            
            <div>
              <p className="text-indigo-200 text-sm mb-1">Birth Time</p>
              <p className="text-lg font-semibold">{kundliInfo.birth_time}</p>
            </div>
            
            <div>
              <p className="text-indigo-200 text-sm mb-1">Birth Place</p>
              <p className="text-lg font-semibold">{kundliInfo.place}</p>
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
                    onClick={() => {
                      setInputValue(question)
                    }}
                    className="w-full text-left text-sm p-2 rounded bg-indigo-800 hover:bg-indigo-700 transition text-indigo-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-2">Start a conversation about your kundli</p>
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
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
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
        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your kundli..."
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
