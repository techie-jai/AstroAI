import React from 'react'
import { Sun, Moon, Heart, Bell, Calendar, Zap, Users, Sparkles, Target, Compass, TrendingUp, Shield } from 'lucide-react'

export function ExtendedFeatures() {
  const features = [
    {
      icon: Sun,
      title: 'AI Birth Chart',
      description: 'Deep natal chart analysis with AI-powered planetary interpretations',
    },
    {
      icon: Moon,
      title: 'Lunar Tracking',
      description: 'Follow moon phases and their impact on your emotions and energy',
    },
    {
      icon: Heart,
      title: 'Love Compatibility',
      description: 'Symmetry and composite chart analysis for romantic relationships',
    },
    {
      icon: Bell,
      title: 'Transit Alerts',
      description: 'Real-time notifications when major planetary transits affect your chart',
    },
    {
      icon: Calendar,
      title: 'Daily Guidance',
      description: 'Personalized daily, weekly, and monthly forecasts based on your chart',
    },
    {
      icon: Target,
      title: 'Career Insights',
      description: 'Discover ideal career paths and optimal timing for professional moves',
    },
    {
      icon: Users,
      title: 'Family Charts',
      description: 'Analyze family dynamics and generational patterns through astrology',
    },
    {
      icon: Compass,
      title: 'Instant Analysis',
      description: 'Get comprehensive chart analysis in seconds with our advanced AI engine',
    },
    {
      icon: TrendingUp,
      title: 'Instant Reports',
      description: 'Generate comprehensive PDF reports for any chart analysis instantly',
    },
    {
      icon: Sparkles,
      title: 'AI Astrologer',
      description: 'Chat with our AI astrologer for personalized guidance on any cosmic question',
    },
    {
      icon: Zap,
      title: 'Muhurta Finder',
      description: 'Find auspicious times for important events, ceremonies, and decisions',
    },
    {
      icon: Shield,
      title: 'Remedial Measures',
      description: 'Personalized gemstones, mantras, and rituals to balance your chart',
    },
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Complete Feature Set</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything for Your
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
              Cosmic Journey
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A comprehensive suite of AI-powered astrology tools at your fingertips
          </p>
        </div>

        {/* Features Grid - 4 columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
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
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
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
      </div>
    </section>
  )
}
