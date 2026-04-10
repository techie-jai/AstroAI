import React, { useState } from 'react'
import { MessageCircle, Send, X, Copy, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../services/api'

interface BotShareModalProps {
  isOpen: boolean
  onClose: () => void
  kundliData: any
  birthData: any
}

export default function BotShareModal({ isOpen, onClose, kundliData, birthData }: BotShareModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [chatId, setChatId] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'telegram'>('whatsapp')

  if (!isOpen) return null

  const handleSendWhatsApp = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number')
      return
    }

    setLoading(true)
    try {
      await api.sendKundliWhatsApp(phoneNumber, kundliData, birthData)
      toast.success('Kundli sent via WhatsApp!')
      setPhoneNumber('')
      onClose()
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to send WhatsApp message'
      toast.error(errorMsg)
      console.error('WhatsApp send error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendTelegram = async () => {
    if (!chatId.trim()) {
      toast.error('Please enter a Telegram chat ID')
      return
    }

    setLoading(true)
    try {
      await api.sendKundliTelegram(chatId, kundliData, birthData)
      toast.success('Kundli sent via Telegram!')
      setChatId('')
      onClose()
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to send Telegram message'
      toast.error(errorMsg)
      console.error('Telegram send error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenWhatsAppBot = () => {
    const whatsappUrl = 'https://wa.me/?text=Hi%20AstroAI'
    window.open(whatsappUrl, '_blank')
  }

  const handleOpenTelegramBot = () => {
    const telegramUrl = 'https://t.me/astroai_bot?start=kundli'
    window.open(telegramUrl, '_blank')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Share to Bot</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'whatsapp'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            WhatsApp
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'telegram'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Telegram
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'whatsapp' ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Send your kundli to WhatsApp and chat with our AI astrology bot!
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">
                    <strong>How it works:</strong> Enter your WhatsApp phone number (with country code) and we'll send your kundli details. You can then chat with the bot about your astrological profile.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Example: +91 for India, +1 for USA</p>
              </div>

              <button
                onClick={handleSendWhatsApp}
                disabled={loading || !phoneNumber.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send via WhatsApp
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={handleOpenWhatsAppBot}
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open WhatsApp Bot
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Send your kundli to Telegram and chat with our AI astrology bot!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>How it works:</strong> Enter your Telegram chat ID or search for @astroai_bot directly. You can then chat with the bot about your astrological profile.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram Chat ID
                </label>
                <input
                  type="text"
                  placeholder="Your Telegram chat ID"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can find your chat ID by messaging @userinfobot on Telegram
                </p>
              </div>

              <button
                onClick={handleSendTelegram}
                disabled={loading || !chatId.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send via Telegram
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={handleOpenTelegramBot}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Telegram Bot
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full text-gray-700 hover:text-gray-900 font-medium py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
