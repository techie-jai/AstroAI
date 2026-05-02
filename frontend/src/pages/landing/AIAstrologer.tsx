import React from 'react'
import { MessageCircle, Send, CheckCircle2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function AIAstrologer() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleStartChatting = () => {
    if (user) {
      navigate('/livechat')
    } else {
      navigate('/login')
    }
  }

  const messages = [
    {
      type: 'user',
      text: 'What does my Saturn return mean for my career?',
    },
    {
      type: 'bot',
      text: 'Based on your chart, Saturn is transiting your 10th house of career. This is a powerful time for professional restructuring and long-term success. You may face challenges that ultimately strengthen your foundation.',
    },
    {
      type: 'user',
      text: 'When is the best time to start my new business?',
    },
    {
      type: 'bot',
      text: 'Looking at your transits, Jupiter will enter your 10th house in March, bringing expansion opportunities. Combined with a favorable Moon phase, late March to early April would be auspicious for launching your venture.',
    },
  ]

  const benefits = [
    '24/7 availability for cosmic guidance',
    'Personalized answers based on your birth chart',
    'Deep knowledge of Vedic and Western astrology',
    'Transit interpretations and timing advice',
    'Relationship and compatibility insights',
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 mb-6">
            <MessageCircle className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">AI-Powered Guidance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Talk to Your
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
              Personal Astrologer
            </span>
          </h2>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Chat Preview */}
          <div className="animate-slide-up">
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 overflow-hidden backdrop-blur-sm" style={{ boxShadow: '0 0 40px rgba(99, 102, 241, 0.15)' }}>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-slate-700/50 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Kendra AI</p>
                  <p className="text-xs text-slate-400">Online • Ready to guide</p>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-slate-950/50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none'
                          : 'bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-700/50 bg-slate-950/50 p-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Ask about your chart, transits, compatibility..."
                  className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full p-2 transition-all">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-8">
              <p className="text-indigo-400 font-semibold text-sm mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI-Powered Guidance
              </p>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Our AI astrologer is trained on thousands of years of astrological wisdom, combined with your unique birth chart.
              </h3>
              <p className="text-lg text-slate-400 mb-8">
                Get instant, personalized guidance on any question about your cosmic journey. From career timing to relationship compatibility, our AI has the answers.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-slide-up"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStartChatting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 sm:py-4 rounded-lg transition-all glow-button flex items-center justify-center gap-2"
            >
              Start Chatting Now
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
