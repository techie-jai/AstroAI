import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Loader } from 'lucide-react'
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
  place: string
}

export default function ChatPage() {
  const { kundliId } = useParams<{ kundliId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [kundliInfo, setKundliInfo] = useState<KundliInfo | null>(null)
  const [loadingKundli, setLoadingKundli] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchKundliInfo = async () => {
      try {
        setLoadingKundli(true)
        const response = await api.getKundli(kundliId!)
        setKundliInfo({
          name: response.data.birth_data?.name || 'Unknown',
          birth_date: `${response.data.birth_data?.year}-${response.data.birth_data?.month}-${response.data.birth_data?.day}`,
          place: response.data.birth_data?.place || 'Unknown',
        })
      } catch (error) {
        console.error('Failed to fetch kundli info:', error)
        toast.error('Failed to load kundli information')
      } finally {
        setLoadingKundli(false)
      }
    }

    if (kundliId) {
      fetchKundliInfo()
    }
  }, [kundliId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim() || !kundliId) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await api.sendChatMessage(
        kundliId,
        inputValue,
        messages.map(m => ({ role: m.role, content: m.content }))
      )

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response || 'Unable to generate response',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  if (loadingKundli) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-gray-50">
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
