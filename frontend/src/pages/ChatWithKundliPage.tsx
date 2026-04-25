import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Loader, Sparkles, ChevronDown, ArrowLeft } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  kundli_id: string
  kundli_name: string
  last_message_time: string
  message_count: number
}

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

export default function ChatWithKundliPage() {
  const { kundliId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [kundli, setKundli] = useState<KundliData | null>(null)
  const [showKundliInfo, setShowKundliInfo] = useState(true)
  const [userKundlis, setUserKundlis] = useState<any[]>([])
  const [previousChats, setPreviousChats] = useState<ChatSession[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const loadKundli = async () => {
      try {
        if (!kundliId) {
          toast.error('Kundli ID not found')
          return
        }

        console.log('[CHAT] Loading kundli with ID:', kundliId)
        console.log('[CHAT] Current kundli state:', kundli?.birth_data?.name || 'null')

        // Always fetch fresh data from API to ensure we have the correct kundli
        // This prevents stale sessionStorage data from being used
        console.log('[CHAT] Fetching fresh kundli data from API...')
        const response = await api.getKundli(kundliId)
        const freshData = JSON.parse(JSON.stringify(response.data))
        
        console.log('[CHAT] API Response - Birth data name:', freshData.birth_data?.name)
        console.log('[CHAT] API Response - Kundli ID:', freshData.kundli_id)
        console.log('[CHAT] API Response - Horoscope info keys:', Object.keys(freshData.horoscope_info || {}).length)
        
        setKundli(freshData)
        console.log('[CHAT] Kundli loaded from API and state updated')

        // Also try to get from sessionStorage as a fallback for performance
        // but don't use it if we already have fresh data
        const storedKundli = sessionStorage.getItem('kundli_data')
        if (storedKundli) {
          try {
            console.log('[CHAT] Clearing stale sessionStorage data...')
            sessionStorage.removeItem('kundli_data')
          } catch (error) {
            console.error('[CHAT] Failed to clear sessionStorage:', error)
          }
        }

        // Load persistent chat history
        console.log('[CHAT] Loading persistent chat history...')
        try {
          const historyResponse = await api.loadChatHistory(kundliId)
          if (historyResponse.data.messages && historyResponse.data.messages.length > 0) {
            console.log('[CHAT] Loaded', historyResponse.data.messages.length, 'messages from persistent storage')
            const loadedMessages: Message[] = historyResponse.data.messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp)
            }))
            setMessages(loadedMessages)
          } else {
            // No previous messages, send welcome message
            console.log('[CHAT] No previous messages found, showing welcome message')
            const welcomeMessage: Message = {
              role: 'assistant',
              content: `Namaste! 🙏 I'm your personal Vedic astrology guide. I've loaded your kundli and I'm ready to answer any questions about your astrological profile. Ask me anything about your personality, career, relationships, or life path!`,
              timestamp: new Date(),
            }
            setMessages([welcomeMessage])
          }
        } catch (error: any) {
          console.warn('[CHAT] Could not load chat history, showing welcome message:', error.message)
          // Graceful fallback: show welcome message if history loading fails
          const welcomeMessage: Message = {
            role: 'assistant',
            content: `Namaste! 🙏 I'm your personal Vedic astrology guide. I've loaded your kundli and I'm ready to answer any questions about your astrological profile. Ask me anything about your personality, career, relationships, or life path!`,
            timestamp: new Date(),
          }
          setMessages([welcomeMessage])
        }
      } catch (error: any) {
        console.error('[CHAT] Error loading kundli:', error)
        console.error('[CHAT] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        toast.error(`Failed to load kundli data: ${error.response?.data?.detail || error.message}`)
      } finally {
        setPageLoading(false)
      }
    }

    loadKundli()
  }, [kundliId])

  // Load user's kundlis and previous chats
  useEffect(() => {
    const loadUserKundlis = async () => {
      try {
        const response = await api.getUserCalculations()
        if (response.data && response.data.calculations) {
          setUserKundlis(response.data.calculations)
          
          // Build previous chats list from kundlis that have chat history
          const chats: ChatSession[] = response.data.calculations.map((k: any) => ({
            kundli_id: k.kundli_id,
            kundli_name: k.birth_data?.name || 'Unnamed Kundli',
            last_message_time: k.generation_date || new Date().toISOString(),
            message_count: 0
          }))
          setPreviousChats(chats)
          console.log('[CHAT] Loaded previous chats:', chats)
        }
      } catch (error) {
        console.warn('[CHAT] Failed to load user kundlis:', error)
      }
    }
    
    loadUserKundlis()
  }, [])

  const handleNewChat = () => {
    navigate('/generate')
  }

  const handleSelectChat = (selectedKundliId: string) => {
    console.log('[CHAT] Selecting chat:', selectedKundliId, 'Current:', kundliId)
    if (selectedKundliId && selectedKundliId !== kundliId) {
      console.log('[CHAT] Navigating to chat:', `/chat/${selectedKundliId}`)
      navigate(`/chat/${selectedKundliId}`)
    } else if (!selectedKundliId) {
      console.error('[CHAT] ERROR: selectedKundliId is empty or undefined')
      toast.error('Invalid kundli ID')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || !kundli) {
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
      console.log('[CHAT] Sending message:', inputValue)
      
      // Note: Backend unified_chat_endpoint saves both user and assistant messages
      // No need to save them again here to avoid duplicates
      
      const response = await api.sendKundliChatMessage(
        kundli,
        inputValue,
        messages.map(m => ({ role: m.role, content: m.content }))
      )

      console.log('[CHAT] Response received:', response.data)
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response || 'Unable to generate response',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('[CHAT] Failed to send message:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to send message'
      toast.error(errorMsg)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-indigo-200">Loading your kundli chat...</p>
        </div>
      </div>
    )
  }

  if (!kundli) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-indigo-200 mb-4">Kundli data not found</p>
          <button
            onClick={() => navigate('/generator')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            Generate New Kundli
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex bg-gray-900">
      {/* Left Panel - Kundli Info */}
      <div className={`${showKundliInfo ? 'w-64' : 'w-0'} bg-gradient-to-b from-indigo-900 to-purple-900 text-white transition-all duration-300 overflow-hidden border-r border-indigo-800 flex flex-col`}>
        <div className="p-4 border-b border-indigo-700">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg transition text-sm font-semibold text-white"
          >
            <Sparkles size={16} />
            <span>New Chat</span>
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Your Kundli</h2>

          <div className="space-y-6">
            <div>
              <p className="text-indigo-200 text-sm mb-1">Name</p>
              <p className="text-lg font-semibold">{kundli.birth_data.name}</p>
            </div>

            <div>
              <p className="text-indigo-200 text-sm mb-1">Birth Date</p>
              <p className="text-lg font-semibold">{kundli.birth_data.date}</p>
            </div>

            <div>
              <p className="text-indigo-200 text-sm mb-1">Birth Time</p>
              <p className="text-lg font-semibold">{kundli.birth_data.time}</p>
            </div>

            <div>
              <p className="text-indigo-200 text-sm mb-1">Birth Place</p>
              <p className="text-lg font-semibold">{kundli.birth_data.place}</p>
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

            {previousChats.length > 1 && (
              <div className="pt-6 border-t border-indigo-700">
                <p className="text-indigo-200 text-sm mb-3">Previous Chats</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {previousChats.map((chat) => (
                    <button
                      key={chat.kundli_id}
                      onClick={() => handleSelectChat(chat.kundli_id)}
                      className={`w-full text-left text-sm p-2 rounded transition ${
                        kundliId === chat.kundli_id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-800 hover:bg-indigo-700 text-indigo-100'
                      }`}
                    >
                      <p className="font-medium truncate">{chat.kundli_name}</p>
                      <p className="text-xs opacity-75">
                        {new Date(chat.last_message_time).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-indigo-700">
          <button
            onClick={() => navigate('/generator')}
            className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg transition text-sm"
          >
            <ArrowLeft size={16} />
            <span>New Kundli</span>
          </button>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col bg-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 border-b border-indigo-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowKundliInfo(!showKundliInfo)}
              className="p-2 hover:bg-gray-800 rounded-lg transition lg:hidden"
            >
              <ChevronDown size={20} className={`text-indigo-400 transition-transform ${showKundliInfo ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-400" size={24} />
              <h1 className="text-xl font-bold text-white">AstroChat</h1>
            </div>
          </div>
        </div>

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
