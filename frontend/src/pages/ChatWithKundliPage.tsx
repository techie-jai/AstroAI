import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Loader, Sparkles, ChevronUp, ArrowLeft, Calendar, Clock, MapPin, Star, MessageCircle, Zap, Plus } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

// Helper function to parse markdown formatting
const parseMarkdown = (text: string) => {
  const parts: (string | { type: 'bold' | 'italic' | 'code'; content: string })[] = []
  let currentIndex = 0

  // Pattern to match **bold**, *italic*, and `code`
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/g
  let match

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index))
    }

    // Add the formatted part
    if (match[1]) {
      parts.push({ type: 'bold', content: match[1] })
    } else if (match[2]) {
      parts.push({ type: 'italic', content: match[2] })
    } else if (match[3]) {
      parts.push({ type: 'code', content: match[3] })
    }

    currentIndex = pattern.lastIndex
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex))
  }

  return parts
}

// Component to render parsed markdown
const MarkdownText = ({ text }: { text: string }): JSX.Element => {
  const parts = parseMarkdown(text)

  return (
    <>
      {parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <span key={idx}>{part}</span>
        }
        if (part.type === 'bold') {
          return (
            <span key={idx} className="font-bold text-white">
              {part.content}
            </span>
          )
        }
        if (part.type === 'italic') {
          return (
            <span key={idx} className="italic text-slate-200">
              {part.content}
            </span>
          )
        }
        if (part.type === 'code') {
          return (
            <code key={idx} className="bg-slate-700/50 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">
              {part.content}
            </code>
          )
        }
        return null
      })}
    </>
  )
}

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
            onClick={() => navigate('/generate')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            Generate New Kundli
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Left Panel - Sidebar */}
      <div className="w-72 border-r border-slate-700/50 bg-slate-900/30 backdrop-blur-sm flex flex-col">
        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg transition-all duration-200 text-sm font-semibold text-white shadow-lg shadow-green-500/20"
          >
            <Sparkles size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Kundli Info Section */}
        <div className="px-4 py-3 border-b border-slate-700/50">
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Your Kundli</h2>
          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Name</p>
                <p className="text-slate-100 font-medium">{kundli.birth_data.name}</p>
              </div>
            </div>

            {/* Birth Date */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Birth Date</p>
                <p className="text-slate-100 font-medium">{kundli.birth_data.date}</p>
              </div>
            </div>

            {/* Birth Time */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Birth Time</p>
                <p className="text-cyan-400 font-medium">{kundli.birth_data.time}</p>
              </div>
            </div>

            {/* Birth Place */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Birth Place</p>
                <p className="text-slate-100 font-medium">{kundli.birth_data.place}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Chats */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MessageCircle className="w-3 h-3" />
            Previous Chats
          </h3>
          <div className="space-y-2">
            {previousChats.map((chat) => (
              <button
                key={chat.kundli_id}
                onClick={() => handleSelectChat(chat.kundli_id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                  kundliId === chat.kundli_id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 border-l-2 border-purple-500 glow-purple'
                    : 'hover:bg-purple-500/10 border-l-2 border-transparent'
                }`}
              >
                <p className="font-medium text-slate-100 text-sm">{chat.kundli_name}</p>
                <p className="text-xs text-slate-400">{new Date(chat.last_message_time).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-t border-slate-700/50">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick Questions
          </h3>
          <div className="space-y-2">
            {[
              'What are my key personality traits?',
              'What career path suits me best?',
              'How is my love life this year?',
              'What are my lucky numbers?',
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInputValue(question)}
                className="w-full text-left p-2.5 text-sm text-slate-400 hover:text-slate-100 hover:bg-purple-500/10 rounded-lg transition-all duration-200 truncate border border-transparent hover:border-purple-500/20"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* New Kundli Button */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={() => navigate('/generate')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-all duration-200 text-sm text-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Kundli</span>
          </button>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Cosmic Gradient Background */}
        <div className="absolute inset-0 cosmic-gradient-bg opacity-10 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center gap-3 p-4 border-b border-slate-700/50 backdrop-blur-sm">
          <ChevronUp className="w-5 h-5 text-slate-400" />
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          >
            <Sparkles className="text-purple-400" size={20} />
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kendraa.ai</h1>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-slate-400">AI Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-slate-300 text-lg mb-2">Start a conversation about your kundli</p>
                <p className="text-slate-400 text-sm">Ask questions about your astrological chart and get AI-powered insights</p>
              </div>
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                message.role === 'user' ? 'ml-auto' : ''
              }`}
            >
              <div
                className={`p-5 rounded-2xl transition-all ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                    : 'cosmic-card'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kendraa AI</span>
                    <span className="text-xs text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">Triple-verified</span>
                  </div>
                )}
                <p className="text-slate-100 leading-relaxed text-sm">
                  <MarkdownText text={message.content} />
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="max-w-3xl animate-in fade-in">
              <div className="cosmic-card p-5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="relative p-4 border-t border-slate-700/50 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your cosmic journey..."
                disabled={loading}
                className="w-full bg-slate-800/50 border border-purple-500/30 focus:border-purple-500/50 pr-12 h-12 text-base rounded-full text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50"
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
            </div>
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 glow-purple h-12 w-12 rounded-full flex items-center justify-center text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
