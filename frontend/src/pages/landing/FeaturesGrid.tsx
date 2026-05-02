import React from 'react'
import { Sun, Moon, Heart, Bell, Calendar, Zap, Users, Sparkles } from 'lucide-react'

export function FeaturesGrid() {
  const features = [
    {
      icon: Sun,
      title: 'AI Birth Chart Reading',
      description: 'Deep dive into your natal chart with AI-powered interpretations that reveal your personality, strengths, and life purpose.',
    },
    {
      icon: Bell,
      title: 'Real-time Transit Alerts',
      description: 'Get notified about significant planetary transits affecting your chart. Never miss important cosmic events.',
    },
    {
      icon: Heart,
      title: 'Compatibility Insights',
      description: 'Discover the cosmic chemistry between you and your partner. Detailed synastry and composite chart analysis.',
    },
    {
      icon: Calendar,
      title: 'Daily Horoscopes',
      description: 'Personalized daily guidance based on your unique chart. Tailored predictions for each day of the week.',
    },
  ]

  return (
    <section id="features" className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need for
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
              Cosmic Clarity
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Harness the power of AI to unlock the secrets written in the stars
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-full rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                  {/* Glow background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 group-hover:border-indigo-500/60 transition-all">
                        <Icon className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Social Proof */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-indigo-500/60 to-purple-500/60"
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-400">
                <span className="text-white font-semibold">10,000+</span> charts analyzed daily
              </p>
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="text-slate-400">
                <span className="text-white font-semibold">98%</span> accuracy in predictions
              </p>
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="text-slate-400">
                <span className="text-white font-semibold">24/7</span> AI astrologer support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
